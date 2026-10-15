/*
 * Quelle des Pixel/Rgb-Modells:
 * Arno Haase: "Ist Java noch zeitgemäß? Eine Einordnung", Java Magazin 6.2025.
 * Hier als Value Records umgesetzt.
 *
 * Start: java --enable-preview --source 28 demo/PixelDemo.java
 *
 * Die Gegenueberstellung "96 vs. 12 Byte" illustriert Objektgraph vs. Nutzdaten.
 * Ein konkretes Speicherlayout oder Flattening wird dadurch nicht garantiert.
 */
void main() {
    var red = new Rgb((byte) 255, (byte) 0, (byte) 0);
    var opaqueRed = new ColorWithAlpha(red, (byte) 255);
    var pixel = new Pixel(new Position(10, 20), opaqueRed);

    IO.println("Pixel: " + pixel);
    IO.println("Position: x=" + pixel.pos().x() + ", y=" + pixel.pos().y());
    IO.println("Farbe: r=" + Byte.toUnsignedInt(pixel.color().rgb().r())
            + ", g=" + Byte.toUnsignedInt(pixel.color().rgb().g())
            + ", b=" + Byte.toUnsignedInt(pixel.color().rgb().b())
            + ", alpha=" + Byte.toUnsignedInt(pixel.color().alpha()));

    var moved = new Pixel(new Position(pixel.pos().x() + 1, pixel.pos().y()), pixel.color());
    var translucent = new Pixel(moved.pos(), new ColorWithAlpha(moved.color().rgb(), (byte) 128));

    IO.println("Verschoben: " + moved);
    IO.println("Mit halber Deckkraft: " + translucent);
    IO.println("Original bleibt unveraendert: " + pixel);
}

value record Pixel(Position pos, ColorWithAlpha color) {}

value record Position(int x, int y) {}

value record ColorWithAlpha(Rgb rgb, byte alpha) {}

value record Rgb(byte r, byte g, byte b) {}
