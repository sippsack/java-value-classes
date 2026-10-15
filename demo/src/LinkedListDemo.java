import java.util.Objects;

// Start: java --enable-preview --source 28 demo/src/LinkedListDemo.java
void main() {
    LinkedList<String> empty = new Empty<>();
    var languages = empty.prepend("Java").prepend("Scala").prepend("Kotlin");

    IO.println("Leere Liste: " + empty.size() + " Elemente");
    IO.println("Sprachen: " + languages.size() + " Elemente");
    IO.println("Urspruengliche Liste bleibt leer: " + empty.size() + " Elemente");

    LinkedList<String> remaining = languages;
    while (remaining instanceof Element<String>(var head, var tail)) {
        IO.println("  " + head);
        remaining = tail;
    }
}

// Summentyp: Eine Liste ist entweder leer oder ein Element mit einer Restliste.
sealed interface LinkedList<T> permits Empty, Element {
    default LinkedList<T> prepend(T value) {
        return new Element<>(value, this);
    }

    default int size() {
        return switch (this) {
            case Empty<T> empty -> 0;
            case Element<T>(var head, var tail) -> 1 + tail.size();
        };
    }
}

final value class Empty<T> implements LinkedList<T> {}

// Produkttyp: Kopf und Restliste bilden zusammen ein Element.
value record Element<T>(T head, LinkedList<T> tail) implements LinkedList<T> {
    Element {
        Objects.requireNonNull(tail);
    }
}
