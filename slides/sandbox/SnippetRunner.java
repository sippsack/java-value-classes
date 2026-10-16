import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import jdk.jshell.JShell;
import jdk.jshell.Snippet;

class SnippetRunner {
    private static final int OUTPUT_LIMIT = 60_000;

    public static void main(String[] args) throws Exception {
        var code = new String(System.in.readAllBytes(), StandardCharsets.UTF_8);
        var response = System.out;
        var buffer = new ByteArrayOutputStream();
        var limited = new java.io.OutputStream() {
            private boolean truncated;

            @Override
            public void write(int value) {
                if (buffer.size() < OUTPUT_LIMIT) {
                    buffer.write(value);
                } else if (!truncated) {
                    truncated = true;
                    buffer.writeBytes("\n[Ausgabe nach 60 KB abgeschnitten]\n".getBytes(StandardCharsets.UTF_8));
                }
            }
        };
        var console = new PrintStream(limited, true, StandardCharsets.UTF_8);
        System.setOut(console);
        System.setErr(console);
        System.setIn(java.io.InputStream.nullInputStream());
        boolean success = true;

        // The local engine keeps all user threads in this disposable, time-limited JVM.
        try (var shell = JShell.builder()
                .executionEngine("local")
                .out(console)
                .err(console)
                .compilerOptions("--enable-preview", "--source", String.valueOf(Runtime.version().feature()))
                .build()) {
            var remaining = code;
            while (!remaining.isBlank()) {
                var completion = shell.sourceCodeAnalysis().analyzeCompletion(remaining);
                if (!completion.completeness().isComplete()) {
                    console.println("Unvollständiges Java-Snippet.");
                    success = false;
                    break;
                }
                boolean failed = false;
                for (var event : shell.eval(completion.source())) {
                    shell.diagnostics(event.snippet()).forEach(diagnostic ->
                        console.println((diagnostic.isError() ? "Fehler: " : "Hinweis: ")
                            + diagnostic.getMessage(Locale.GERMAN)));
                    if (event.status() == Snippet.Status.REJECTED
                            || event.status() == Snippet.Status.RECOVERABLE_NOT_DEFINED
                            || event.exception() != null) {
                        failed = true;
                    }
                    if (event.exception() != null) {
                        console.println(event.exception());
                    } else if (event.value() != null && !event.value().isEmpty()) {
                        console.println("=> " + event.value());
                    }
                }
                if (failed) {
                    success = false;
                    break;
                }
                remaining = completion.remaining();
            }
        }
        console.flush();
        response.println("{\"ok\":" + success
            + ",\"runtime\":" + json(System.getProperty("java.runtime.version"))
            + ",\"output\":" + json(buffer.toString(StandardCharsets.UTF_8)) + "}");
        // Snippets may leave non-daemon threads running.
        System.exit(0);
    }

    private static String json(String text) {
        var result = new StringBuilder("\"");
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            switch (c) {
                case '"' -> result.append("\\\"");
                case '\\' -> result.append("\\\\");
                case '\n' -> result.append("\\n");
                case '\r' -> result.append("\\r");
                case '\t' -> result.append("\\t");
                default -> {
                    if (c < 32) result.append(String.format("\\u%04x", (int) c));
                    else result.append(c);
                }
            }
        }
        return result.append('"').toString();
    }
}
