void main() {
    var red = new Rgb((byte) 255, (byte) 0, (byte) 0);
    var anotherRed = new Rgb((byte) 255, (byte) 0, (byte) 0);

    IO.println("Rgb:");
    IO.println("  ==     : " + (red == anotherRed));
    IO.println("  equals : " + red.equals(anotherRed));

    var first = new NamedColor(red, "Rot");
    var second = new NamedColor(anotherRed, "Rot");

    IO.println("NamedColor mit gleichem String-Literal:");
    IO.println("  ==     : " + (first == second));
    IO.println("  equals : " + first.equals(second));

    var third = new NamedColor(red, new String("Rot"));
    var fourth = new NamedColor(anotherRed, new String("Rot"));

    IO.println("NamedColor mit verschiedenen String-Instanzen:");
    IO.println("  ==     : " + (third == fourth));
    IO.println("  equals : " + third.equals(fourth));
}

record Rgb(byte r, byte g, byte b) {}

record NamedColor(Rgb rgb, String name) {}
