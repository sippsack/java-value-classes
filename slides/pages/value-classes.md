# Unser Weg durch Valhalla

<TalkAgenda :current="1" />

<!--
Hello Value Class: Wir starten mit Deklaration, Erzeugung und den wichtigsten
Klassenregeln. Vergleiche und die Bedeutung von Identität kommen danach bewusst
in ein eigenes Kapitel.

Regie: etwa fünf Sekunden, Agenda nicht erneut vorlesen.
-->

---

# Hello Value Record

````md magic-move {at:1}
```java
record Rgb(byte r, byte g, byte b) {}

var red = new Rgb((byte) 255, (byte) 0, (byte) 0);
int channel = Byte.toUnsignedInt(red.r()); // 255
```

```java
value record Rgb(byte r, byte g, byte b) {}

var red = new Rgb((byte) 255, (byte) 0, (byte) 0);
int channel = Byte.toUnsignedInt(red.r()); // 255
```
````

<div class="color-strip"><i style="background:#ff0000"></i><i style="background:#00ff00"></i><i style="background:#0000ff"></i></div>

<div v-click="2" class="small">Konstruktor, Accessors und Record-Methoden bleiben vertraut.<br>Neu: <strong>keine Objektidentität</strong>, unveränderliche Feldbelegung.</div>

<!--
Unser roter Faden ist eine Farbe mit drei Kanälen. Zunächst sehen wir einen
gewöhnlichen Record, erzeugt ganz normal mit new. [Klick] Vor record schieben
wir value ein. Damit wird daraus ein Value Record. [Klick] Konstruktor, Accessors,
equals, hashCode und toString liefert weiterhin der Record. Value ergänzt die
Semantik ohne Objektidentität. Was das beim Vergleichen bedeutet, vertiefen wir im
zweiten Kapitel. Zunächst schauen wir nur auf Modellierung und Verwendung.
Java-Bytes sind vorzeichenbehaftet; das Bitmuster ff stellt hier den Kanalwert 255
dar. Byte.toUnsignedInt übersetzt es für Ausgabe und Berechnungen.

Regie: Erster Klick fügt value animiert ein; zweiter Klick blendet den Text unten ein.
Das byte-Bitmuster 0xff steht hier für Kanalwert 255.
Ein gewöhnlicher Record ohne value hat dagegen weiterhin Identität; das kommt
bewusst erst im Vergleichskapitel.
-->

---

# Value Classes: Klassen bleiben Klassen

<div class="grid-2 value-capabilities">
<div>

```java
interface HasRed { int red(); }
value class Red implements HasRed {
    private byte r;
    Red(byte r) { this.r = r; }
    public int red() {
        int channel = Byte.toUnsignedInt(r);
        return channel;
    }
}
var color = new Red((byte) 255);
color = new Red((byte) 128);
```

</div>
<div class="capability-summary">
  <section><b>Klassenmittel bleiben</b><span>Konstruktoren, Methoden, Kapselung, Interfaces.</span></section>
  <section><b>Eigene Instanzfelder: final</b><span>Primitive und Referenztypen erlaubt.</span></section>
  <section><b>Variable ≠ Value Object</b><span>Die Variable darf einen anderen Wert erhalten.</span></section>
  <section><b>Konkrete Klasse: final</b><span>Oberklasse: Object oder abstract value class.</span></section>
</div>
</div>

<!--
Value nimmt uns nicht die Ausdrucksmittel einer Klasse. Links sehen wir ein
eigenes Interface und eine konkrete Value Class.
Red kapselt nur den Rotkanal und hat ein privates Feld, einen Konstruktor und eine
eigene Methode. Die Instanzfelder
sind implizit final; ihre Typen dürfen auch Referenztypen sein. Die lokale Variable
channel ist eine ganz normale Variable. Auch statische Felder dürfen sich ändern;
die Einschränkung betrifft die Instanzfelder. Das zeigen wir nicht zusätzlich im Code.
Auch color unten darf auf einen anderen Wert gesetzt werden: Wir ändern die
Variable, nicht das zuvor erzeugte Value Object. Vererbung bleibt möglich, aber
nicht beliebig: Eine konkrete Value Class ist implizit final. Ihre Oberklasse
muss Object oder eine abstrakte Value Class sein, keine Identity Class. Eine
abstrakte Value Class ist dagegen erweiterbar; ihre Unterklassen dürfen sowohl
Value Classes als auch Identity Classes sein. Der Zusatz value ist dort also
eine Zusage der Value-Kompatibilität, keine Pflicht für alle Unterklassen.

Regie: etwa 60 Sekunden; vereinfachter Rotkanal statt der vollständigen Rgb-Klasse.
Die unteren Anweisungen stehen in einer main-Methode.
Die Klasse generiert nicht die Record-Methoden; fachliches equals/hashCode bei
einer produktiven Umsetzung ergänzen. Quelle: JEP 401, Value classes and subclassing.
Vertiefung nur bei Bedarf: Die ausgeblendete Reserve „Value Class ≠ Record“
zeigt zusätzlich gepackte Darstellung und die Abgrenzung zu generierten Record-Methoden.
-->

---

# Unveränderlich - aber Shallow Immutable

<div class="code-sm">

```java
value record NamedColor(Rgb rgb, List<String> names) {
    NamedColor {
        names = List.copyOf(names);
    }
}

var names = new ArrayList<>(List.of("Rot", "Rouge"));
var red = new NamedColor(
    new Rgb((byte) 255, (byte) 0, (byte) 0), names);

names.add("Rosso"); // red.names() bleibt unverändert
red.names().add("Rojo"); // UnsupportedOperationException
```

</div>

<div v-click class="small">Finale Feldreferenz ≠ unveränderlicher Inhalt.<br>Hier schützt <code>List.copyOf</code> die Liste; <code>String</code> ist selbst immutable.</div>

<!--
Für diese Variante hat NamedColor einen Rgb-Wert und eine Liste von Namen.
Rgb ist unser Value Record mit drei primitiven Farbkanälen.
Value macht die Instanzfelder final, nicht automatisch deren referenzierte Inhalte.
Ohne die Kopie im Konstruktor würden wir dieselbe veränderliche Liste wie der
Aufrufer behalten. Deshalb sichern wir sie im kompakten Record-Konstruktor mit
List.copyOf ab. Eine spätere Änderung an names verändert unsere gespeicherte Liste
nicht. Auch über den Accessor lässt sie sich nicht verändern: Der letzte Aufruf
wirft eine UnsupportedOperationException. [Klick] Das ist eine bewusste
Modellierungsentscheidung, keine automatisch tiefe Unveränderlichkeit durch value.
List.copyOf kopiert keine Elemente. Hier sind aber alle Elemente Strings und
damit bereits unveränderlich. Bei veränderlichen Elementen müssten wir auch deren
Zustand berücksichtigen.

Regie: Alternative NamedColor-Definition nur für diese Folie; später wieder Rgb und String.
List.copyOf liefert eine unveränderbare Liste und kann eine bereits geeignete
unveränderbare Liste wiederverwenden. Null-Liste und Null-Elemente werden abgelehnt.
List.of(existingList) wäre eine verschachtelte Liste, keine defensive List<String>-Kopie.
Letzte Zeile ist ein bewusstes Negativbeispiel; java.util-Imports vorausgesetzt.
-->

---

# Erst initialisieren. Dann sichtbar werden.

<div class="code-sm">

```java
value class Label {
    private final String name;

    Label(String name) {
        this.name = name;
        super();
        System.out.println(this);
    }

    public String toString() { return "Label[" + name + "]"; }
}
```

</div>

<div class="small">Felder initialisieren, bevor die Instanz sichtbar wird.<br>JEP 513 + 539 liefern den Unterbau.</div>

<!--
Bei einer gewöhnlichen Klasse könnte toString vor der Feldzuweisung noch null
beobachten, selbst wenn das Feld final ist. Der Gegenbeispiel-Code liegt
in der Reserve, muss aber nicht gezeigt werden. Hier ist die sichere Reihenfolge:
Zuerst initialisieren wir name,
dann kommt super, anschließend verwenden wir die fertige Instanz. Flexible Constructor
Bodies aus JEP 513 erlauben solche Anweisungen vor super bereits seit Java 25.
Das bedeutet nicht, dass wir dort beliebig mit this arbeiten dürfen: Eigene Felder
initialisieren ist etwas anderes, als eine benutzbare Instanz weiterzureichen.
JEP 539 verankert strikte Feldinitialisierung auf JVM-Ebene. JEP 401 baut darauf auf.
Die drei JEPs gehören also zusammen, obwohl sie unterschiedliche Schichten betreffen
und nicht alle gleichzeitig oder im gleichen Reifegrad erscheinen.

Regie: JEP 513 seit Java 25 final; JEP 539 ein Preview-VM-Feature.
Vor super ist this eingeschränkt: eigene Felder initialisieren ist erlaubt,
eine benutzbare Instanz lesen/weiterreichen nicht.
-->

---

# Unser Weg durch Valhalla

<TalkAgenda :current="2" />

<!--
Jetzt geht es um Identität: Warum müssen zwei heute gleiche veränderliche Objekte
unterscheidbar bleiben? Und wie unterscheiden sich Value Objects beim Vergleichen
und bei Operationen, die eine Identität voraussetzen?

Regie: etwa fünf Sekunden.
-->

---

# Das Gleiche ist nicht dasselbe

<div class="grid-2">
<IdentitySketch kind="twins" />
<div>

## Gleich aussehen …

Zwillinge können sich gleichen.

## … ist nicht dieselbe Person.

Anna bleibt Anna. Bea bleibt Bea.

<div v-click class="card yellow small mt-4"><strong>Identität:</strong> Welches Objekt?<br><strong>Gleichheit:</strong> Nach welchen Kriterien gleich?</div>

</div>
</div>

<div class="source">Quelle: <a href="https://www.spiegel.de/kultur/zwiebelfisch/zwiebelfisch-abc-dasselbe-das-gleiche-a-311593.html" target="_blank" rel="noopener noreferrer">SPIEGEL · Zwiebelfisch-ABC: „dasselbe / das Gleiche“</a></div>

<!--
Die Syntax kennen wir. Was geben wir mit value eigentlich auf? Machen wir den
Unterschied greifbar: Zwillinge können sich
zum Verwechseln ähnlich sehen. Trotzdem sind Anna und Bea zwei verschiedene
Personen. [Klick] Identität fragt: Welches konkrete Objekt ist es? Gleichheit fragt:
Nach welchen Kriterien betrachten wir zwei Dinge als gleich? Bei Java legt das
der equals-Vertrag der Klasse fest. Die Analogie heißt also nicht, dass ein
Personen-equals nur das Aussehen vergleichen sollte. Bei unserem Rgb-Record ist
der Vertrag dagegen klar: Die drei Kanalwerte werden verglichen. Wie unterscheiden
sich nun zwei gleiche Objekte von zwei Referenzen auf dasselbe Objekt?

Regie: etwa 35 Sekunden. Herleitung nach Folien 65–66 des alten Vortrags.
Folie 64 ist dort nur eine ausgeblendete, leere Zwischenfolie mit „aus Chat-GPT“.
Nicht die alte Verkürzung „Zwillinge sind equals“ übernehmen.
Sprachliche Einordnung: SPIEGEL, Zwiebelfisch-ABC „dasselbe / das Gleiche“:
https://www.spiegel.de/kultur/zwiebelfisch/zwiebelfisch-abc-dasselbe-das-gleiche-a-311593.html .
-->

---

# Identität: dasselbe oder nur gleich?

<div class="small"><code>record Rgb(byte r, byte g, byte b) {}</code> – ein gewöhnlicher Record mit Identität</div>

<IdentitySketch kind="references" class="identity-reference-sketch" />

<div v-click class="identity-comparisons">
  <div><code>c1 == c2</code><strong>true</strong><span>dasselbe Objekt</span></div>
  <div><code>c1 == c3</code><strong>false</strong><span>zwei Objekte</span></div>
  <div><code>c1.equals(c3)</code><strong>true</strong><span>gleiche Kanalwerte</span></div>
</div>


<!--
c1 referenziert ein gewöhnliches Rgb-Objekt. Mit c2 gleich c1 kopieren wir nur die
Referenz, nicht das Objekt. Beide Variablen referenzieren deshalb dasselbe Objekt A.
c3 entsteht dagegen durch ein weiteres new mit denselben Kanälen und referenziert
Objekt B. [Klick] c1 und c2 sind mit dem doppelten Gleichheitsoperator gleich,
c1 und c3 nicht. Das generierte Record-equals liefert für c1 und c3 trotzdem true.
Es gibt also zwei unterschiedliche Beziehungen: gemeinsame Objektidentität und
gleicher Inhalt. Das Bild zeigt bewusst keine festen Adressen und auch keine
Zusicherung „diese Variable liegt auf dem Stack“. Der Garbage Collector kann
Objekte bewegen, ohne ihre Identität zu ändern.

Regie: etwa 40 Sekunden. Überträgt das Point-Speicherbild von alter Folie 67 auf Rgb.
Rückblick auf den gewöhnlichen Record, nicht auf unsere Value-Variante.
Die abgekürzten new-Ausdrücke stehen jeweils für dieselben drei Kanalwerte;
in ausführbarem Code 255 als byte casten.
-->

---
hide: true
---
# Identität: nützlich – aber nicht kostenlos

```java
class Window { int color = 0xff0000; }

var first = new Window();
var alias = first;
var second = new Window(); // zunächst derselbe Zustand
first.color = 0x0000ff;

alias.color;  // blau: dasselbe Objekt
second.color; // rot: anderes Objekt
```

<div v-click class="takeaway identity-message">Veränderlicher Zustand braucht ein „welches Objekt?“.<br>Austauschbare, unveränderliche Werte nicht.</div>

<!--
Warum gibt es Identität überhaupt? Bei einem Fenster ist wichtig, welches Fenster
wir verändern. Mehrere Referenzen können denselben veränderlichen Zustand beobachten;
für Synchronisation steht ein Monitor zur Verfügung. Das ist sinnvoll, aber nicht
für jeden Datentyp nötig. Eine RGB-Farbe wird durch ihre Kanäle beschrieben.
Separate kleine Objekte können dabei Header, Referenzen und indirekte Zugriffe
verursachen. [Klick] Veränderlicher Zustand braucht ein „welches Objekt?“. Zwei
Objekte können jetzt den gleichen Zustand haben und nach einer Änderung auseinanderlaufen.
Austauschbare, unveränderliche Werte brauchen diese Unterscheidung nicht. Das ist
die zentrale Motivation – aber „Identität brauchen wir nur für Änderungen“ wäre
zu absolut. Auch ein unveränderliches Objekt kann bewusst als Identitätstoken oder
Lock dienen. Wenn wir die Identität nicht brauchen, möchten wir der JVM erlauben,
die zusätzliche Darstellung zu vermeiden. Unveränderlichkeit allein nimmt sie
einem gewöhnlichen Record noch nicht. Ein veränderliches Fenster zeigt den Unterschied:
alias sieht die Änderung an first, second nicht. Trotz zunächst gleichem Zustand
dürfen wir diese beiden Fenster nicht zusammenlegen. Bei unseren unveränderlichen
RGB-Werten fällt genau diese Anforderung weg.

Regie: etwa 35 Sekunden. Nutzen/Kosten nach alter Folie 68, ohne garantierte
Heap-Allokationen zu behaupten. Identität verlangt nicht Veränderbarkeit; sie
ist auch bei unveränderlichen Objekten möglich. Diese drei Folien ersetzen die
bisherige einminütige „Wert oder Ding?“-Folie, nicht zusätzlich ausführlich erklären.
-->

---

# Gleiche Kanäle: zwei Vergleichsmodelle

<div class="grid-2 code-sm">
<div>

## Identity Record

```java
record Rgb(byte r, byte g, byte b) {}
// Zwei separat erzeugte rote Farben:
a == b;      // false
a.equals(b); // true
```

</div>
<div>

## Value Record

```java
value record Rgb(
    byte r, byte g, byte b) {}
// Dieselben Kanalwerte:
a == b;      // true
a.equals(b); // true
```

</div>
</div>

<div class="small mt-4">Bei Identity Objects prüft <code>==</code> die Identität.<br>Bei Value Objects: gleiche Klasse und rekursiv ununterscheidbare Feldwerte.</div>

<!--
Wir stellen jetzt beide Varianten direkt gegenüber. Vor record kommt value. Das ist kein Hinweis
„bitte optimieren“, sondern eine Änderung der Bedeutung. Diese Objekte haben keine
eigene Identität mehr. Wir erzeugen in beiden Varianten zweimal dieselben drei Kanäle.
Nun liefert auch der doppelte Gleichheitsoperator true. Die Value Objects sind
bezüglich ihrer Klasse und ihrer Feldwerte ununterscheidbar. Zwei new-Ausdrücke
garantieren deshalb nicht mehr zwei unterscheidbare Instanzen. Auf welche Weise die
JVM diese Werte anschließend speichert, ist eine zweite, getrennte Frage.

Regie: Beide Deklarationen sind alternative Fassungen, nicht gemeinsam kompilieren.
Keine Identität: dieselbe Klasse und ununterscheidbare Feldwerte.
-->

---

# NamedColor: equals ist nicht gleich ==

<div class="small"><code>value record NamedColor(Rgb rgb, String name) {}</code></div>

```java
var a = new NamedColor(
    new Rgb((byte) 255, (byte) 0, (byte) 0), new String("Rot"));

var b = new NamedColor(
    new Rgb((byte) 255, (byte) 0, (byte) 0), new String("Rot"));
```

<div v-click>

```java
a.equals(b); // true: generiertes Record-equals
a == b;      // false: unterschiedliche String-Identitäten
```

</div>

<div class="small mt-4"><code>equals</code>: Textinhalt · rekursives <code>==</code>: String-Identität</div>

<!--
NamedColor enthält einen Rgb-Wert und einen String mit Identität. Wir erzeugen bewusst zwei neue
Strings mit identischem Inhalt. Das wäre im Anwendungscode unnötig, zeigt hier aber
die Grenze sehr schön. [Klick] Das generierte Record-equals vergleicht die Komponenten
über ihre Wertgleichheit; die Namen haben denselben Text, also true. Der doppelte
Gleichheitsoperator endet bei den Strings dagegen an deren Identität. Die ist
unterschiedlich, also false. Identitätslosigkeit bedeutet deshalb nicht automatisch
tiefe fachliche Gleichheit. Für fachliche Vergleiche bleiben wir bei equals und
definieren dessen Vertrag passend zum Modell. Mit demselben String-Literal „Rot“
wären die beiden Namen dagegen dieselbe String-Referenz und auch der doppelte
Gleichheitsoperator wäre true. Eine eigene Folie dafür ist nicht nötig.

Regie: new String bewusst als Lehrmittel.
Referenzfelder: rekursives ==. Bei Identity Objects endet es bei der Identität.
Primitive Gleitkomma-Bitmuster wären ein weiteres Detail; nicht vertiefen.
-->

---

# Die Grenze heißt Identität

```java
var color = new Rgb((byte) 255, (byte) 0, (byte) 0);

synchronized (color) {}     // Compilerfehler

Object lock = color;
synchronized (lock) {}      // Fehler zur Laufzeit
```

<div v-click>

```java
new WeakReference<>(color); // ebenfalls nicht unterstützt
```

</div>


<!--
Wer Identität aufgibt, gibt auch Operationen auf, die diese Identität benötigen.
Ein Value Object kann kein Monitor für synchronized sein. Wenn der konkrete Typ
bekannt ist, erkennt der Compiler den Fehler. Über eine Object-Variable verschwindet
nur die statische Typinformation; das Objekt bekommt dadurch keine Identität zurück.
Der zweite Versuch scheitert deshalb zur Laufzeit. [Klick] Auch schwache Referenzen
auf solche Objekte werden nicht unterstützt. Bei einer Migration müssen wir also
über die Klassendeklaration hinaus nachsehen: Wer synchronisiert darauf, wer verwendet
WeakHashMap, und welche Annahmen treffen Bibliothekskonsumenten?

Regie: Negative Codebeispiele, absichtlich nicht gemeinsam ausführbar.
Eine Object-Variable gibt einem Value Object keine Identität zurück.
Die genaue Runtime-Ausnahme ist Preview-API und kann sich ändern.
-->

---

# Unser Weg durch Valhalla

<TalkAgenda :current="3" />

<!--
Die semantischen Voraussetzungen stehen. Jetzt kommt der Laufzeitteil: Welche
Freiheit gewinnt die JVM daraus, und warum sind Flattening und Scalarization
weder dasselbe noch automatisch für jeden Wert garantiert?

Regie: etwa fünf Sekunden.
-->

---
layout: full-image
sidebar: false
image: /valhalla/flattening-scalarization-original.png
title: "Flattening und Scalarization – Walze und Bausteine"
---

<!--
Diese Grafik aus meinem früheren Vortrag trennt die beiden Ideen: Links die Walze
für Flattening. Die Daten liegen kompakter beieinander, zum Beispiel in einem
Array. Rechts die Bausteine für Scalarization. Beim Rechnen braucht die JVM nicht
unbedingt das ganze zusammengesetzte Objekt, sondern nur seine einzelnen Feldwerte.
Zuerst betrachten wir die kompakte Speicherung, danach das Rechnen mit einzelnen Werten.

Regie: Originalfolie 70 aus input/Java-Value-Objects-neu.pptx, als Bild übernommen.
Bildanalogie, keine Garantie für konkretes Layout oder eine bestimmte Optimierung.
Etwa 20 Sekunden, aus dem bisherigen JVM-Zeitbudget.
-->

---
layout: full-image
sidebar: false
image: /valhalla/flattening-inlining-original.png
title: "Flattening und Inlining – Dichte und Indirektion"
---

<!--
Die zweite Grafik aus meinem alten Vortrag macht die Speicheridee konkreter:
Im Array können die Koordinaten der Punkte direkt hintereinander liegen, statt
über einzelne Referenzen erreichbar zu sein. In einem zusammengesetzten Rechteck
können die Koordinaten der beiden Punkte direkt im umgebenden Objekt liegen.
Die alte Folie nennt das zweite Beispiel Inlining. Gemeint ist hier das Einbetten
von Feldwerten ins Speicherlayout, nicht das Inlining von Methoden. Beide Fälle
bezeichnen wir im weiteren Vortrag als Flattening: weniger Umwege, kompaktere Daten.
Scalarization ist davon getrennt: die einzelnen Werte im Rechenpfad verwenden.

Regie: Originalfolie 73 aus input/Java-Value-Objects-neu.pptx.
Historische Wortwahl Inlining ausdrücklich einordnen, nicht als Synonym für
Scalarization präsentieren. Schema zeigt Potenzial, kein garantiertes Preview-Layout.
Etwa 30 Sekunden; folgende Speicherbilder entsprechend knapp erläutern.
-->

---

# Flattening: Nutzdaten statt Umweg

```java
Rgb[] pixels = new Rgb[1_000_000];
```

<div class="grid-2 mt-5">
<div>

## Referenzdarstellung

<div class="memory-row"><span>ref</span><span>ref</span><span>ref</span></div>
<div class="center small">↓　　　 ↓　　　 ↓</div>
<div class="memory-row objects"><span>Header<br>r g b</span><span>Header<br>r g b</span><span>Header<br>r g b</span></div>

</div>
<div v-click>

## Mögliche flache Darstellung

<div class="memory-row flat"><span>r g b<br>+ null?</span><span>r g b<br>+ null?</span><span>r g b<br>+ null?</span></div>
<p class="small mt-4">Weniger separate Objekte,<br>weniger Indirektion, bessere Lokalität.</p>

</div>
</div>

<!--
Stellen wir uns eine Million Farben vor. In der klassischen Referenzdarstellung
enthält das Array Referenzen auf separate kleine Objekte. Zu den drei Kanalbytes
kommen dabei Header, Ausrichtung und die indirekten Speicherzugriffe. [Klick]
Eine flache Darstellung kann die Nutzdaten direkt in den Einträgen unterbringen.
Dann entfallen viele separate Objekte und Wege durch den Speicher. Das verbessert
potenziell die Datenlokalität. Die Zeichnung ist aber kein exaktes Speicherlayout:
Nullstatus, Padding und Grenzen des jeweiligen Builds kommen noch dazu. Das Array
selbst bleibt außerdem ein Objekt mit Identität.

Regie: Schematisch, nicht maßstäblich: Encoding/Padding hängen vom Build ab.
Das Array selbst ist weiterhin ein Objekt mit Identität.
-->

---

# Vom Rgb zum Pixel: vier Typen, ein Modell

<div class="grid-2 code-sm">
<div>

## Identity Records

```java
record Pixel(Position pos,
    ColorWithAlpha color) {}
record Position(int x, int y) {}
record ColorWithAlpha(
    Rgb rgb, byte alpha) {}
record Rgb(
    byte r, byte g, byte b) {}
```

</div>
<div>

## Value Records

```java
value record Pixel(Position pos,
    ColorWithAlpha color) {}
value record Position(int x, int y) {}
value record ColorWithAlpha(
    Rgb rgb, byte alpha) {}
value record Rgb(
    byte r, byte g, byte b) {}
```

</div>
</div>

<div class="code-sm">

```java
var pixel = new Pixel(new Position(10, 20),
    new ColorWithAlpha(new Rgb((byte) 255, (byte) 0, (byte) 0), (byte) 255));
```

</div>

<div class="source" style="left: auto; right: 57px; text-align: right;">Beispiel nach Arno Haase: „Ist Java noch zeitgemäß? Eine Einordnung“<br><a href="https://entwickler.de/magazine-ebooks/java-magazin/java-magazin-62025" target="_blank" rel="noopener noreferrer">Java Magazin 6.2025</a></div>

<!--
Vergrößern wir unser Beispiel wie im alten Vortrag. Ein Pixel hat eine Position
und eine Farbe mit Alpha. Die Farbe enthält wiederum unser Rgb. Links sind das
vier gewöhnliche Records mit Identität, rechts vier Value Records. Die Erzeugung
sieht in beiden Varianten genau gleich aus: Wir kombinieren Konstruktoraufrufe.
Hier ist wichtig, dass wir alle vier Typen umstellen, auch Position. Ein einzelnes
value am äußeren Pixel würde die Identität der enthaltenen Objekte nicht entfernen.
Zwei vollständig neu erzeugte Pixel mit gleichen Komponenten sind links equals,
aber nicht doppelt gleich. Rechts sind bei diesen ausschließlich primitiven,
rekursiv eingebetteten Komponenten beide Vergleiche true. Das ist zunächst eine
Aussage über Semantik. Die mögliche Darstellung im Speicher betrachten wir als Nächstes.

Regie: etwa 40 Sekunden; zwei alternative Programme, nicht gemeinsam kompilieren.
Position ist hier bewusst ein Value Record, kein gemischtes Identity-Beispiel.
Diese Folie gehört zum JVM-Kapitel: hier das Modell, direkt danach das Speicherbild.
Quelle des Modells: Arno Haase, „Ist Java noch zeitgemäß? Eine Einordnung“,
Java Magazin 6.2025, nach der Quellenangabe auf Folie 60 des alten Vortrags.
Ausgabe: https://entwickler.de/magazine-ebooks/java-magazin/java-magazin-62025 .
-->

---

# Pixel: Objektgraph oder kompakte Werte?

<PixelMemory />

<div class="pixel-layout-assumptions">Links: Header 12 B · Referenz 4 B · Ausrichtung 8 B · kein Sharing · ohne äußere Referenz.</div>
<div class="pixel-layout-assumptions"><strong>Rechts: keine Layoutgarantie.</strong> Nullstatus, Padding und Atomarität begrenzen das Flattening.</div>

<!--
Links sehen wir den gewöhnlichen Objektgraphen: Pixel referenziert Position und
ColorWithAlpha, und diese wiederum Rgb. Unter unseren ausdrücklich gewählten
HotSpot-Annahmen brauchen Pixel, Position und ColorWithAlpha jeweils vierundzwanzig
Bytes, Rgb sechzehn Bytes. Zusammen sind das achtundachtzig Bytes, ohne äußere
Referenz und ohne gemeinsam genutzte Objekte. Rechts sind dieselben fachlichen
Daten idealisiert ineinandergelegt: zwei ints für die Position, drei Bytes Rgb
und ein Byte Alpha, zusammen zwölf Bytes Nutzdaten. Das zeigt das Potenzial,
nicht das garantierte Layout im Preview. Nullable verschachtelte Werte und die
atomare Behandlung des gesamten Pixels stellen zusätzliche Anforderungen.
Die fehlende Identität erklärt, warum die JVM die Darstellung ändern darf.
Nun trennen wir diese Speicherdarstellung von der Zerlegung im optimierten Rechenpfad.

Regie: etwa 35 Sekunden. Eigene Zeichnung nach dem vom Nutzer gelieferten
Pixel-Schaubild; dortige 96-Byte-Rechnung nicht übernehmen. Hier Header 12 Bytes
und Padding je Gesamtobjekt separat: 24 + 24 + 24 + 16 = 88, Nutzdaten 8 + 3 + 1 = 12.
Keine Messung oder garantierte Flattening-Rate. Die äußere Referenz wird anders als
auf der späteren Rgb-Array-Folie nicht gezählt; diesen Bezugsrahmen ausdrücklich nennen.
Bei knapper Zeit die Zahlen nicht einzeln vorlesen; Layoutdetails kommen im JVM-Kapitel.
-->

---

# Scalarization: nur die Feldwerte

<div class="grid-2 code-sm">
<div>

## Unser Java-Code

```java
Rgb color = new Rgb(
    (byte) 255, (byte) 0, (byte) 0);

int red = Byte.toUnsignedInt(color.r());
```

</div>
<div v-click>

## Sinngemäß optimiert

```java
byte r = (byte) 255;

int red = Byte.toUnsignedInt(r);
```

</div>
</div>

<div v-click class="takeaway">Für diese Rechnung reicht der Rotkanal.<br>Ein Rgb-Objekt muss dafür nicht entstehen.</div>

<!--
Links erzeugen wir im Java-Code eine Farbe und lesen danach nur ihren Rotkanal.
[Klick] Für diese Rechnung benötigt die JVM eigentlich nur den einzelnen Wert r.
Sie kann das Objekt in seine Feldwerte zerlegen. Die ungenutzten Kanäle können
hier sogar ganz wegfallen. Rechts steht vereinfacht, womit die Rechnung auskommt;
das ist kein tatsächlicher Maschinencode. [Klick] Wir modellieren weiterhin ein
Rgb-Objekt, aber zur Ausführung muss dafür kein zusammenhängendes Rgb-Objekt im
Speicher entstehen. Das ist Scalarization: mit einzelnen Werten statt mit einem
Objekt rechnen.

Regie: Scalarization zerlegt ein Objekt in skalare Feldwerte. Ungenutzte Felder zu
entfernen und die konstante Rechnung weiter zu falten sind zusätzliche Optimierungen.
Feldwerte können beispielsweise in Registern liegen; kein Versprechen bestimmter Register.
Nicht mit „das Objekt wird auf den Stack verschoben“ gleichsetzen.
Escape Analysis kann schon heute auch Identity-Objekt-Allokationen entfernen.
Je nach Calling Convention kann Scalarization auch Parameter und Rückgaben betreffen.
Wenn eine Grenze eine Objektdarstellung verlangt, kann die JVM den Wert materialisieren.
new bedeutet nicht zwingend Heap-Allokation; der Interpreter kann trotzdem allozieren.
Diese Details nur bei Nachfragen, nicht alle im Hauptvortrag.
-->

---

# Was kostet null?

```java
Rgb color = null;
Rgb[] colors = new Rgb[10];

System.out.println(colors[0]); // null
```

<div v-click class="card yellow mt-4">

Ein Encoding muss alle RGB-Werte **und zusätzlich null** darstellen.

</div>

<div v-click class="small mt-4">Null-Marker, Padding, reservierte Bitmuster …<br>Die konkrete Speicherung entscheidet die JVM.</div>

<!--
Ein Value-Class-Typ ist zunächst weiterhin nullable. Diese Variable darf null sein,
und ein frisch erzeugtes Array enthält zunächst null-Einträge. Drei Bytes bieten
genau die Bitmuster für unsere drei Farbkanäle. [Klick] Wenn alle Kombinationen
gültig sind, brauchen wir zusätzlich eine Möglichkeit, null darzustellen. [Klick]
Das kann zusätzliche Markierungen oder ein anderes Encoding bedeuten; die konkrete
Entscheidung trifft die JVM. Nullbarkeit ist hier also eine sehr praktische
Layoutfrage. Value Classes beseitigen null nicht automatisch und führen mit diesem
ersten Schritt auch keine allgemeine Non-null-Sprache ein.

Regie: Nicht in eine allgemeine Null-Safety-Diskussion abbiegen.
Das ist eine Layoutfrage, kein Versprechen eines neuen non-null Java.
-->

---

# Und was kostet Atomarität?

```java
value record Vector2(double x, double y) {}

class Particle {
    Vector2 velocity;
}
```

<div class="grid-2 mt-4">
<div class="card pink">Thread A schreibt<br><code>(1.0, 2.0)</code></div>
<div class="card yellow">Thread B darf keinen<br>zerrissenen Mischwert lesen.</div>
</div>

<div v-click class="small mt-4">Aktuelles Flattening ist durch atomare Encodings begrenzt.<br>Kein pauschales „alle Value-Arrays werden flach“.</div>

<!--
Eine weitere Grenze ist die atomare Behandlung des gesamten Werts. Unsere
Geschwindigkeit besteht aus zwei doubles. Bei einer klassischen Referenz wird die
Referenz als Ganzes ausgetauscht. Ein Leser darf nicht einfach die erste Komponente
des einen und die zweite des anderen Werts zusammengesetzt bekommen. Wenn wir beide
Komponenten direkt ins umgebende Objekt legen, muss die Laufzeit diese Eigenschaft
weiter erhalten. [Klick] Deshalb begrenzen atomare Encodings das aktuelle Flattening.
Das ist übrigens keine Zusage für Thread-Sicherheit: Ohne passende Synchronisation
fehlen weiterhin Sichtbarkeitsgarantien und ein korrekter Umgang mit konkurrierenden Änderungen.

Regie: Referenz-Austausch ist atomar, damit aber weder volatile-Sichtbarkeit
noch Thread-Sicherheit des Gesamtprogramms zugesagt.
Ein volatiles Feld kann Sichtbarkeit beeinflussen, löst aber nicht jede Layoutfrage.
-->

---

# Kompakter ≠ in jedem Fall schneller

<div class="grid-2">
<div class="card yellow">

## Kleiner Datenbestand

Dekodieren kann zusätzliche<br>Rechenarbeit bedeuten.

</div>
<div class="card teal">

## Großer Datenbestand

Weniger Pointer Chasing,<br>bessere Cache-Nutzung.

</div>
</div>

<div class="small mt-4">JMH: Warm-up, Forks und Ergebnisse konsumieren.<br>JFR: Allokationen und GC beobachten.</div>

<!--
Selbst ein kleineres Layout ist nicht in jeder Situation schneller. Bei einem
kleinen Datenbestand, der ohnehin in den Cache passt, kann zusätzliches Dekodieren
mehr kosten, als eingespart wird. Bei großen Datenbeständen kann weniger Pointer
Chasing dagegen entscheidend sein. [Klick] Darum betrachten wir Speicherbedarf,
Allokationsrate und Durchsatz getrennt. Eine Anwendung kann bei einem dieser Ziele
gewinnen und bei einem anderen kaum profitieren. Die Vorführungen von Paumard und
Forax machen solche Zielkonflikte anschaulich; ihre Messwerte sind aber keine
universellen Faktoren für unsere Anwendung oder einen anderen JDK-Build.

Vertiefung bei Bedarf: Speicherbedarf, Allokationsrate und Durchsatz sind getrennte
Messgrößen. Interpreter und C1 können anfangs Objekte erzeugen, die C2 später
scalarisiert. Erasure kann an Object-Grenzen Materialisierung erfordern; Inlining
kann diese Grenze wieder beseitigen. Das gilt auch für Streams und ist kein
pauschales Argument gegen Abstraktionen.

Regie: Quelle: Paumard/Forax-Video, Messungen im konkreten Build.
Keine Zahlen oder universellen Umschlagpunkte aus der Demo übertragen.
-->

---

# Unser Weg durch Valhalla

<TalkAgenda :current="4" />

<!--
Mit diesen Möglichkeiten und Grenzen im Kopf kommen wir zum Nutzen: Warum sind
Value Classes für numerische und KI-nahe Daten interessant, und was gewinnen
ganz gewöhnliche fachliche Modelle dadurch?

Regie: etwa fünf Sekunden.
-->

---

# Java im KI-Zeitalter: Was fehlt noch?

<div class="ai-challenges">
  <div class="ai-challenge">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="10" width="48" height="44" rx="5" />
      <path d="M8 25h48M24 25v29M40 25v29M8 40h48" />
    </svg>
    <div><h2>Viele Daten, wenig Overhead</h2><p>Kompakte Typen, bessere Lokalität</p><strong>Valhalla → Value Classes</strong></div>
  </div>
  <div class="ai-challenge">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M5 21h17v22H5M42 21h17v22H42M22 27h20M22 37h20M28 19l-8 13 8 13M36 19l8 13-8 13" />
    </svg>
    <div><h2>Native Bibliotheken anbinden</h2><p>Funktionen und Speicher erreichen</p><strong>Panama → FFM API · jextract</strong></div>
  </div>
  <div class="ai-challenge">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="5" y="6" width="12" height="12" rx="2" /><rect x="26" y="6" width="12" height="12" rx="2" /><rect x="47" y="6" width="12" height="12" rx="2" />
      <path d="M11 25v13m21-13v13m21-13v13M6 33l5 5 5-5M27 33l5 5 5-5M48 33l5 5 5-5" />
      <rect x="5" y="46" width="12" height="12" rx="2" /><rect x="26" y="46" width="12" height="12" rx="2" /><rect x="47" y="46" width="12" height="12" rx="2" />
    </svg>
    <div><h2>Mehr rechnen pro CPU-Takt</h2><p>Viele Zahlen gleichzeitig verarbeiten</p><strong>Vector API → SIMD</strong></div>
  </div>
  <div class="ai-challenge">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="15" y="15" width="34" height="34" rx="4" />
      <path d="M23 4v11M32 4v11M41 4v11M23 49v11M32 49v11M41 49v11M4 23h11M4 32h11M4 41h11M49 23h11M49 32h11M49 41h11M25 25h14v14H25z" />
    </svg>
    <div><h2>GPUs aus Java nutzen</h2><p>Java-Code analysieren und übertragen</p><strong>Babylon → Code Reflection · HAT</strong></div>
  </div>
</div>

<div class="ai-challenges-status">Bausteine mit unterschiedlicher Reife: FFM final · Vector API Inkubator · Valhalla Preview-Ziel · Babylon/HAT experimentell</div>

<!--
KI aus Java heißt nicht nur, ein Sprachmodell über HTTP aufzurufen. Beim Training
und beim Ausführen von Modellen geht es auch um große Datenmengen und Rechenleistung.
Vier Herausforderungen passen dazu: Erstens sollen präzise Datentypen nicht
unnötig Speicherverkehr erzeugen. Hier setzt Valhalla an. Zweitens wollen wir
leistungsfähige native Bibliotheken und deren Speicher nutzen. Dafür liefert
Panama die Foreign Function and Memory API und jextract für Bindings aus C-Headern.
Drittens soll eine CPU-Instruktion mehrere Zahlen verarbeiten können: SIMD über
die Vector API. Viertens wollen wir geeignete Berechnungen auf GPUs ausführen.
Babylon entwickelt Code Reflection als Grundlage, Java-Code zu analysieren und
in andere Programmiermodelle zu übertragen. HAT erprobt darauf heterogene
Beschleunigung. Diese Projekte ergänzen sich; Value Classes allein erledigen
weder Vektorisierung noch GPU-Offloading. Unser Fokus ist jetzt der erste Baustein.

Regie: Eigene Einordnung des dritten Punkts „Model training and deployment“ im
vom Nutzer gelieferten Oracle-Screenshot, keine Nachbildung der Originalfolie.
Etwa 45 Sekunden innerhalb des bisherigen KI-Kapitelbudgets.
FFM seit JDK 22 final (JEP 454); jextract ist ein separates Werkzeug.
Die Vector API stammt aus dem Panama-Umfeld und ist weiterhin als Inkubator einzuordnen.
Babylon/Code Reflection und HAT (Heterogeneous Accelerator Toolkit) sind
experimentelle Entwicklung, keine Zusage automatischer GPU-Ausführung im Standard-JDK.
Valhalla: geplantes JDK-28-Preview, keine Layout- oder Beschleunigungsgarantie.
Quellen: https://openjdk.org/projects/panama/ ,
https://openjdk.org/jeps/454 , https://openjdk.org/projects/babylon/ .
-->

---

# Warum passt das zu KI-Workloads?

```java
value record BFloat16(short bits) {}
value record Vector2(float x, float y) {}
```

<div class="grid-2 mt-4">
<div class="card teal">Fachliche Typen statt<br>unbeschrifteter Bitmuster</div>
<div class="card yellow">Viele kleine Werte:<br>Speicherverkehr wird relevant</div>
</div>

<div class="small mt-5">Bessere Typabstraktion – kein automatisches SIMD oder GPU.</div>

<!--
Damit zurück zum Titel. KI-nahe Anwendungen bewegen sehr viele numerische Werte:
Vektorkomponenten, Gewichte oder kompakte Zahlenformate. Ein eigener Typ kann sagen,
wie ein Bitmuster zu interpretieren ist, statt überall bloße shorts herumzureichen.
BFloat16 ist hier allerdings nur ein Wrapper um Bits, noch keine fertige
Rechenimplementierung. Value Classes machen solche Bibliotheksabstraktionen attraktiver,
wenn die JVM sie günstig darstellen kann. Sie bringen aber weder automatisch
SIMD noch GPU-Beschleunigung. Und ein float-Array ist heute schon kompakt. Der
Gewinn liegt nicht darin, primitive Arrays nachträglich effizient zu machen, sondern
zwischen reinen Bits und großen Objektgraphen bessere Modellierungsoptionen zu bekommen.

Regie: BFloat16 hier nur Bit-Wrapper, keine vollständige Rechenimplementierung.
Value Classes eröffnen Bibliotheken Typabstraktion für solche Formate.
Auch Vector2 passt nicht automatisch in jedes aktuelle atomare nullable Encoding.
Weder Operator Overloading noch neue primitive Formate behaupten.
-->

---

# Fachliche Typen werden attraktiver

```java
value record CustomerId(long value) {}
value record OrderId(long value) {}

void loadCustomer(CustomerId id) { /* ... */ }

loadCustomer(new CustomerId(42)); // passt
loadCustomer(new OrderId(42));    // Compilerfehler
```


<!--
Das ist auch ohne KI interessant. Kundennummern und Bestellnummern können technisch
beide longs sein, sind fachlich aber nicht austauschbar. Eigene Typen lassen den
Compiler eine Verwechslung erkennen. Hier passt CustomerId, OrderId dagegen nicht.
Wenn die Sorge um kleine Wrapper-Objekte bisher zu unpräzisen APIs geführt
hat, werden solche Typen mit Value Classes attraktiver. Das ist keine Garantie,
dass jeder 64-Bit-Wrapper überall flach gespeichert wird. Es ist ein Grund, zuerst
das passende fachliche Modell zu wählen und seine realen Kosten anschließend
zu untersuchen, statt pauschal Objektkosten zu vermuten.

Regie: Negative letzte Zeile absichtlich.
Auch außerhalb von KI relevant. Kein garantiertes Flattening des 64-Bit-Wrappers.
-->

---

# Unser Weg durch Valhalla

<TalkAgenda :current="5" />

<!--
Zum Schluss trennen wir den konkret nutzbaren Einstieg von der langfristigen
Valhalla-Richtung: Welche JEPs gehören dazu, was kommt im Preview an und welche
Entscheidungsregel nehmen wir für eigene Klassen mit?

Regie: etwa fünf Sekunden.
-->

---

# Was bringt welcher JEP?

<div class="grid-2 jep-overview">
<div>

## Jetzt relevant

| JEP | Rolle | Einordnung |
|---|---|---|
| [401](https://openjdk.org/jeps/401) | Value Classes und Objects | Preview in JDK 28 |
| [539](https://openjdk.org/jeps/539) | Strict Field Initialization in der JVM | Preview-Unterbau |

</div>
<div>

## Bereits ausgelieferte Vorarbeiten

| JEP | Infrastruktur / Migration | Java |
|---|---|---|
| [181](https://openjdk.org/jeps/181) | Nest-Based Access Control | 11 |
| [309](https://openjdk.org/jeps/309) | Dynamic Class-File Constants | 11 |
| [334](https://openjdk.org/jeps/334) | JVM Constants API | 12 |
| [371](https://openjdk.org/jeps/371) | Hidden Classes | 15 |
| [390](https://openjdk.org/jeps/390) | Warnings for Value-Based Classes | 16 |
| [513](https://openjdk.org/jeps/513) | Flexible Constructor Bodies | 25 |

</div>
</div>

<div class="small mt-4">JDK 28 geplant für März 2027 · Preview ≠ finales Sprachfeature.<br>Vorarbeiten: gemeinsame Infrastruktur; JEP 390 bereitet die Migration vor.</div>

<!--
Ordnen wir die drei JEPs noch einmal ein. JEP 401 definiert die Value Classes
und Value Objects, die wir ausprobiert haben. JEP 539 liefert auf JVM-Ebene
die strikte Feldinitialisierung als Preview-Unterbau. JEP 513 mit flexiblen
Konstruktoren ist dagegen bereits seit Java 25 final. Die vier Demos lassen
sich direkt als Java-Dateien starten, die Value-Variante mit dem passenden
JDK-28-Early-Access-Build und aktiviertem Preview. Der geplante Release im März
2027 ist eine Feedbackphase, kein finales Versprechen. Vor dem produktiven
Einsatz gehören deshalb Buildstand, Einschränkungen und Migrationsfolgen geprüft.

Rechts stehen die bereits ausgelieferten Vorarbeiten aus meinem früheren Vortrag.
JEP 181 führte mit Java 11 Nestmates ein: zusammengehörige Klassen können direkt
auf ihre privaten Member zugreifen. JEP 309, ebenfalls Java 11, ergänzt dynamisch
aufgelöste Class-File-Konstanten. JEP 334 liefert seit Java 12 die API für nominale
Beschreibungen solcher Konstanten. JEP 371 bringt seit Java 15 Hidden Classes für
zur Laufzeit generierte Implementierungsdetails. Das sind allgemeine JVM- und
Bibliotheksbausteine, keine jeweils exklusiven oder zwingenden Value-Class-Voraussetzungen.
JEP 390 ist die direkte Migrationsvorbereitung seit Java 16: Wrapper werden als
value-based gekennzeichnet, ihre Konstruktoren zur Entfernung abgekündigt und
Synchronisation auf value-based Instanzen diagnostiziert. Value-based bedeutet
damals noch nicht identitätslos; gerade die spätere Migration wird vorbereitet.
Es gibt dadurch insbesondere keine allgemeine Compilerwarnung bei jedem ==.

Regie: Vorarbeiten aus Folie 27 des alten PowerPoints, die Details dort aus Folien 28–32.
Nur kurz als Entwicklungslinie nennen, nicht fünf zusätzliche JEP-Vorträge halten.
Befehl vom Projektwurzelverzeichnis:
java --enable-preview --source 28 demo/ValueObjects.java
Vortrag unmittelbar vor Durchführung auf JEP-/EA-Stand prüfen.
Optional kurze Live-Demo aus den zwei vorhandenen Dateien statt Code abtippen.
-->

---

# Bekannte Klassen werden Value Classes

```java
Integer a = 1996, b = 1996;
System.out.println(a == b); // true im beschriebenen Preview

var day = LocalDate.of(2026, 10, 15);
System.out.println(day == day.plusDays(1).minusDays(1)); // true
```

<div class="small mt-5">Im Preview unter anderem Wrapper, Optional und java.time-Typen.<br>String bleibt Identity Class. Preview-Aktivierung beeinflusst das Verhalten.</div>

<!--
Die Änderung betrifft nicht nur unsere eigenen Klassen. Im beschriebenen Preview
werden auch bekannte value-based Bibliotheksklassen zu Value Classes, darunter
Wrapper und viele java.time-Typen. Bei Integer verwenden wir hier bewusst einen
Wert außerhalb des üblichen kleinen Cachebereichs. Der Vergleich ist im Preview
trotzdem true. Auch das neu berechnete Datum ist vom ursprünglichen Wert nicht
unterscheidbar. Daraus machen wir aber keine neue Empfehlung, fachlich mit dem
doppelten Gleichheitsoperator zu vergleichen. equals bleibt die richtige API.
String wird nicht zur Value Class; unser NamedColor-Beispiel bleibt also wichtig.

Regie: Vorführung mit dem benutzten Build prüfen.
Nicht damit werben, == künftig generell für Bibliotheksklassen zu verwenden.
Neukompilieren von Konsumenten kann zusätzliche Optimierungen ermöglichen.
-->

---

# Was noch nicht dazugehört

<div class="grid-3 future-topics">
  <div class="card yellow small">
    <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 12L5 32l15 20M44 12l15 20-15 20" /><rect x="26" y="22" width="12" height="20" rx="2" /></svg>
    <strong>Spezialisierte<br>Generics</strong>
  </div>
  <div class="card small">
    <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="10" width="48" height="44" rx="5" /><circle cx="32" cy="32" r="12" /><path d="M21 43l22-22" /></svg>
    <strong>Weitere Null-/Default-<br>und Layoutmodelle</strong>
  </div>
  <div class="card teal small">
    <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="20" width="18" height="24" rx="3" /><rect x="42" y="20" width="18" height="24" rx="3" /><path d="M22 27h20m-6-6 6 6-6 6M42 37H22m6-6-6 6 6 6" /></svg>
    <strong>Primitive-Class-<br>Exploration</strong>
  </div>
</div>

<div class="future-jeps">
  <a href="https://openjdk.org/jeps/8303099">Draft: Null-Restricted and Nullable Types</a>
  <a href="https://openjdk.org/jeps/8316779">Draft: Null-Restricted Value Class Types</a>
  <a href="https://openjdk.org/jeps/218">JEP 218: Generics over Primitive Types</a>
</div>

<div class="future-sources">Außerdem: <a href="https://openjdk.org/jeps/402">JEP 402 · Enhanced Primitive Boxing</a> · <a href="https://openjdk.org/projects/valhalla/">Valhalla-Roadmap</a> · <a href="https://openjdk.org/jeps/">JEP-Index</a></div>
<div class="future-caveat">Entwürfe und langfristige Ziele – nicht Lieferumfang von JEP 401.</div>

<!--
Valhalla ist größer als dieses erste Preview. Direkte primitive Typargumente wie
List von int gehören nicht zum gezeigten JEP-401-Code. Auch die Ausrufezeichen-
Schreibweise stammt aus einem früher diskutierten Entwurf und ist keine zugesagte
künftige Syntax. Weitere Arbeiten betreffen spezialisierte Generics, den Umgang
mit Null- und Defaultwerten sowie die Annäherung primitiver Typen und Klassen.
Wir sollten deshalb die langfristige Richtung vom konkret ausgelieferten Schritt
trennen. Für unsere heutige Entscheidung brauchen wir keine Vorhersage der späteren
Syntax: Identitätslose Objekte sind bereits ein eigenständiger, nützlicher Baustein.

Regie: Keine ausführliche Historie.
Vereinheitlichtes Typmodell als Richtung, nicht als abgeschlossene Änderung in 28.
Die verlinkten Drafts heißen vollständig „Null-Restricted and Nullable Types
(Preview)“ (8303099) und „Null-Restricted Value Class Types (Preview)“ (8316779).
Die siebenstelligen Nummern sind Draft-/Issue-Kennungen, keine zugeteilten JEP-Nummern.
„Preview“ im Entwurfstitel ist keine Zusage einer bereits ausgelieferten Preview.
JEP 218 „Generics over Primitive Types“ hat den Status Candidate, ohne Zielrelease.
Es beschreibt Spezialisierung und ist ein älterer Entwurf, keine aktuelle Syntaxzusage.
JEP 402 „Enhanced Primitive Boxing (Preview)“ ist ein weiterer Draft:
primitive Typen als Typargumente über Boxing sind von echter Generics-Spezialisierung
zu unterscheiden. Der aktuelle Projektüberblick ist für die Einordnung hilfreicher
als einzelne ältere Entwürfe: https://openjdk.org/projects/valhalla/ .
Dort außerdem Array Enhancements und Parametric JVM als weitere Arbeitsfelder.
Vertiefung: https://openjdk.org/projects/valhalla/design-notes/parametric-vm/parametric-vm
und aktuelle Diskussionen unter https://mail.openjdk.org/pipermail/valhalla-dev/ .
Allgemeiner JEP-Index: https://openjdk.org/jeps/ . Stand: 15.10.2026.
-->

---

# Präzise Typen. Kompakte Daten.

<div class="grid-2">
<div class="card yellow">

## Was wir modellieren wollen

Farben, Messwerte, Beträge,<br>Vektorkomponenten …

</div>
<div class="card">

## Was die Hardware bewegt

Bytes, Cache Lines,<br>Referenzen und Nutzdaten

</div>
</div>

<div v-click class="takeaway">Muss gute Modellierung unnötigen Overhead kosten?</div>

<!--
Zum Fazit zurück zur Leitfrage: Java gibt uns ein starkes Typsystem. Wir können
Farben, Messwerte oder Beträge mit eigenen Namen und Regeln ausdrücken. Die Hardware
sieht dagegen Bytes und Speicherzugriffe. Eine Referenz zu verfolgen kann teurer
sein als die Rechnung mit den eigentlichen Daten. Bei vielen kleinen Objekten wird
dieser Unterschied relevant. [Klick] Müssen wir für eine gute Modellierung unnötigen
Overhead bezahlen? Valhalla gibt der JVM mehr Möglichkeiten, diesen Zielkonflikt
zu entschärfen. KI erhöht heute den Druck durch große Datenmengen; sie war aber
nicht der historische Anlass für das Projekt.

Regie: kurze Schlussklammer zum Abstract, danach die drei konkreten Erkenntnisse.
Starkes statisches Typsystem, primitive Effizienz versus Klassen.
AI ist ein Anwendungsdruck, nicht der historische Entstehungsgrund von Valhalla.
-->

---

# Drei Dinge zum Mitnehmen

<div class="conclusion-points">
  <div v-click class="conclusion-point">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="9" y="14" width="46" height="36" rx="5" />
      <circle cx="24" cy="27" r="5" />
      <path d="M17 41c0-8 14-8 14 0M38 25h10M38 33h10M38 41h6M8 56L56 8" />
    </svg>
    <div><strong>Value Classes geben Identität auf</strong><br>– nicht das Klassenmodell.</div>
  </div>
  <div v-click class="conclusion-point">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="5" y="8" width="16" height="16" rx="3" />
      <rect x="21" y="8" width="16" height="16" rx="3" />
      <rect x="37" y="8" width="16" height="16" rx="3" />
      <path d="M29 29v9M29 38L12 49M29 38l17 11" />
      <rect x="5" y="49" width="14" height="10" rx="2" />
      <rect x="39" y="49" width="14" height="10" rx="2" />
    </svg>
    <div><strong>Flattening und Scalarization</strong><br>sind unterschiedliche Freiheiten der JVM.</div>
  </div>
  <div v-click class="conclusion-point">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M9 49a25 25 0 1 1 46 0M32 11v7M14 20l5 5M50 20l-5 5M7 36h7M50 36h7M32 39l12-14" />
      <circle cx="32" cy="39" r="4" />
      <path d="M19 54h26" />
    </svg>
    <div><strong>Bessere Datenmodelle können effizient werden.</strong><br>Messen bleibt nötig.</div>
  </div>
</div>


<!--
[Klick] Erstens: Value Classes geben Identität auf, nicht das Klassenmodell. Wir
behalten fachliche Namen, Methoden, Kapselung und die Einbindung in bestehende APIs.
[Klick] Zweitens: Flattening und Scalarization sind unterschiedliche Freiheiten
der JVM. Eine kompakte Speicherung und ein zerlegter Rechenpfad sind nicht dasselbe.
[Klick] Drittens: Bessere Datenmodelle können effizient werden, aber wir müssen
am konkreten Workload messen. Genau darin liegt der Bezug zum Abstract: Für große
numerische Datenmengen und KI-nahe Bibliotheken sind diese Freiheiten besonders
spannend. Ihr Nutzen endet aber keineswegs bei KI.

Regie: einzige Schlusszusammenfassung. Schlussklammer zum Abstract, dann Fragen/Kontakt.
Ziel 38 Minuten plus zwei Minuten Puffer.
-->

---

# Quellen und Vertiefung

<div class="small">

- [JEP 401: Value Objects](https://openjdk.org/jeps/401)
- [JEP 539: Strict Field Initialization](https://openjdk.org/jeps/539)
- [JEP 513: Flexible Constructor Bodies](https://openjdk.org/jeps/513)
- [OpenJDK: Value Objects – Performance und Grenzen](https://openjdk.org/projects/valhalla/value-objects)
- [Dan Smith: Try Out JEP 401](https://inside.java/2025/10/27/try-jep-401-value-classes/)
- [Johan Sjölén: Value Classes Still Need Compiler Sympathy](https://johan-sjolen.github.io/post/compiler-sympathy/compiler-sympathy/)
- [Cay Horstmann: Project Valhalla](https://horstmann.com/presentations/2025/jcon-valhalla/)
- [Nicolai Parlog: Valhalla, Now!](https://nipafx.dev/talk-java-valhalla/)
- [José Paumard / Rémi Forax: Devoxx Belgium 2026](https://www.youtube.com/watch?v=vLDbzmiT7Xs)

</div>

<!--
Hier findet ihr die offiziellen JEPs und die Quellen zum Weiterarbeiten. Für die
präzise Semantik sind die OpenJDK-Dokumente der Ausgangspunkt. Für Performance-
Grenzen und anschauliche Experimente lohnen sich außerdem die verlinkten Artikel
und Vorträge. Die Namen und Entwürfe haben sich über die Jahre verändert; achtet
beim Nachlesen deshalb immer auf das Datum und den verwendeten Build.

Regie: Links nicht einzeln vorlesen; höchstens zehn Sekunden.
Aus Quellen Ideen und Einordnung, kein Nachbau ihrer Vorträge.
Quellstand vor dem Vortrag prüfen. Die vorbereiteten Rahmenfolien folgen.
-->

---
hide: true
---
# Zwei Welten seit Java 1.0

```java
int[] packedColors = ...;
Rgb[] colors = ...;
```

| Primitive Typen | Klassen |
|---|---|
| Kompakte Nutzdaten | Fachliche Namen und Kapselung |
| Keine Objektidentität | Methoden und Interfaces |
| Keine direkten Typargumente: `List<int>` | Generics, Collections, Streams |

<div v-click class="takeaway">Valhalla: weniger Kompromisse zwischen beiden Welten.</div>

<!--
Wir haben seit Java 1.0 zwei Welten. Links lassen sich Farbkanäle in primitive Daten
packen: kompakt, aber die Bedeutung der einzelnen Bits müssen wir selbst verwalten.
Rechts steht ein eigener Rgb-Typ: verständlicher, mit Methoden und sauberem API.
Ein int kann allerdings nicht direkt als Typargument in List stehen; dafür brauchen
wir bislang einen Wrapper. Klassen passen gut in Generics und Streams, können aber
zusätzliche Objekte und Indirektionen bedeuten. [Klick] Valhalla soll diese Kluft
schrittweise kleiner machen, ohne das bestehende Java-Modell einfach wegzuwerfen.

Regie: Primitive Arrays können natürlich in generischen APIs als Ganzes verwendet werden.
Gemeint sind primitive Elemente als direkte Typargumente.
-->

---
hide: true
---
# Value Class ≠ Record

<div class="grid-2 code-sm">
<div>

## Class: Darstellung kapseln

```java
value class PackedRgb {
    private int bits;

    PackedRgb(int r, int g, int b) {
        if ((r | g | b) < 0
                || (r | g | b) > 255)
            throw new
            IllegalArgumentException();
        this.bits = r << 16 | g << 8 | b;
    }

    int red() {
        return bits >>> 16;
    }
}
```

</div>
<div>

## Record: Daten transparent

```java
value record Rgb(
    byte r,
    byte g,
    byte b
) {}
```

<div class="small">Record liefert unter anderem<br><code>equals</code>, <code>hashCode</code>, <code>toString</code>.</div>

<div class="small mt-4">Value liefert die Semantik<br><strong>ohne Objektidentität</strong>.</div>

</div>
</div>

<!--
Value und Record beantworten unterschiedliche Fragen. Links kapseln wir die Darstellung:
Die drei Kanäle liegen zusammen in einem int. Der Konstruktor prüft den Wertebereich,
der Zugriff auf Rot extrahiert die oberen acht Nutzbits. Das private Feld ist bei
dieser Value Class implizit final. Rechts entscheidet sich der Record dagegen für
transparente Komponenten und erzeugt unter anderem equals, hashCode und toString.
Value liefert das nicht automatisch. Es liefert in beiden Varianten die Aussage:
keine Objektidentität. Wir können also identitätslose Typen mit gekapselter oder mit
transparenter Darstellung modellieren.

Regie: Konkrete Value Classes implizit final, Instanzfelder implizit final.
Eine Value Class ist keine automatische Record-Generierung.
Die Validierung ist absichtlich klein; jeder Kanal muss zwischen 0 und 255 liegen.
-->

---
hide: true
---
# Referenzen gehören weiter dazu

```java
value record Rgb(byte r, byte g, byte b) {}

value record NamedColor(Rgb rgb, String name) {}
```

<div class="grid-2 mt-6">
<div class="card teal">

**`rgb`**

Referenz auf ein Value Object

</div>
<div class="card yellow">

**`name`**

Referenz auf ein Identity Object

</div>
</div>


<!--
Bisher bestanden unsere Farben nur aus primitiven Feldern. Jetzt geben wir einer Farbe
einen Namen. NamedColor enthält ein Rgb und einen String. Beide Felder haben
Referenztypen, aber sie zeigen auf unterschiedliche Arten von Objekten: Rgb ist
identitätslos, String hat weiterhin Identität. Eine Value Class muss also keineswegs
nur primitive Felder enthalten. Wichtig ist die Sprache: Wir ersetzen nicht Referenztypen
durch Value-Typen. Value-Class-Typen sind ebenfalls Referenztypen. Eine Referenz im
Java-Code legt aber noch nicht fest, ob die Maschine später tatsächlich einem Zeiger folgt.

Regie: Referenz ist ein Sprachkonzept, nicht zwingend ein Maschinenzeiger.
String bleibt Identity Class. Nicht von „Value versus Referenztyp“ sprechen:
Value-Class-Typen sind ebenfalls Referenztypen.
-->

---
hide: true
---
# Gleiches Literal, gleicher Zustand

```java
var a = new NamedColor(
    new Rgb((byte) 255, (byte) 0, (byte) 0), "Rot");

var b = new NamedColor(
    new Rgb((byte) 255, (byte) 0, (byte) 0), "Rot");
```

<div v-click>

```java
a.equals(b); // true
a == b;      // true
```

</div>

<div v-click class="takeaway">Rgb wird rekursiv verglichen.<br>Beide Namen referenzieren dasselbe String-Literal.</div>

<!--
Wir erzeugen zwei benannte Farben. Die inneren RGB-Werte haben dieselben Kanäle.
Für den Namen verwenden wir zweimal dasselbe String-Literal. Was erwarten wir
diesmal? [Klick] Beide Vergleiche liefern true. [Klick] Beim doppelten Gleichheitsoperator
wird der Zustand der Value Objects rekursiv verglichen. Beim inneren Rgb bedeutet
das den Vergleich der Kanäle. Beim String treffen wir auf ein Identity Object –
hier referenzieren beide Felder tatsächlich dasselbe Literal. Dass wir zweimal
new NamedColor schreiben, macht diese Zustände nicht unterscheidbar.

Regie: Zwei separat geschriebene new-Ausdrücke erzwingen hier keine
unterscheidbaren Value Objects.
-->

---
hide: true
---
# Konstruktion zählt zur Unveränderlichkeit

<div class="code-sm">

```java
class Label {
    private final String name;

    Label(String name) {
        super();
        System.out.println(this); // name ist noch null!
        this.name = name;
    }

    public String toString() { return "Label[" + name + "]"; }
}
```

</div>

<div v-click class="takeaway">Selbst ein final-Feld kann vor der Zuweisung beobachtet werden.</div>

<!--
Selbst ein final-Feld löst noch nicht alle Fragen der Unveränderlichkeit. In dieser
gewöhnlichen Klasse wird zuerst super aufgerufen. Danach geben wir this aus, bevor
name zugewiesen ist. println ruft indirekt toString auf, und diese Methode liest
bereits das Feld. [Klick] Sichtbar wird also zunächst null, später der endgültige Name.
Die Feldbelegung war vorübergehend beobachtbar unvollständig. Für identitätslose
Objekte wollen wir solche Zwischenzustände nicht als benutzbare Werte nach außen
geben. Darum gehört eine strengere Konstruktion zum Fundament von Value Classes.

Regie: Der indirekte Zugriff über toString ist das Entscheidende.
Nicht als sicheres Programmiermuster empfehlen.
-->

---
hide: true
---
# Semantik schafft Freiheit

<div class="grid-2">
<div class="card pink">

## Identity Object

JVM muss beweisen,<br>dass Identität nicht beobachtet wird.

</div>
<div class="card teal">

## Value Object

Identität ist bereits<br>semantisch ausgeschlossen.

</div>
</div>

<div v-click class="takeaway">Flattening und Scalarization werden möglich.<br>Nicht automatisch garantiert.</div>

<!--
Warum haben wir so ausführlich über Semantik gesprochen, obwohl der Titel auch
Performance verspricht? Weil genau diese Semantik der JVM Freiheit gibt. Schon heute
kann der JIT gewöhnliche Objekte optimieren, wenn er beweist, dass ihre Identität
nicht beobachtet wird. Bei einem Value Object schließt bereits das Sprachmodell
Identität aus. [Klick] Das erleichtert andere Darstellungen. Zwei wichtige Begriffe
sind Flattening und Scalarization. Beide sind Möglichkeiten, keine Zusagen für jedes
Feld, jedes Array und jede Ausführung. Wir schauen sie deshalb getrennt an.

Regie: Escape Analysis kann schon heute Identity-Objekt-Allokationen entfernen.
Value Classes machen solche Optimierungen auch über geeignete Grenzen leichter.
-->

---
hide: true
---
# Rgb: drei Bytes – wie viel Speicher?

<RgbMemory />

<div class="small mt-4">Links: klassisches HotSpot-Beispiel mit 4-Byte-Referenzen, 12-Byte-Header und 8-Byte-Ausrichtung. Gemeinsamen Array-Header nicht mitgezählt.</div>

<div class="small mt-3"><strong>Rechts: Nutzdatenminimum, keine Preview-Layoutgarantie.</strong><br>Nullstatus, Padding und JVM-Konfiguration können zusätzlichen Platz benötigen.</div>

<!--
Machen wir den Unterschied einmal in Bytes sichtbar. Unsere drei Farbkanäle
enthalten zusammen genau drei Bytes Nutzdaten. Links nehmen wir ein klassisches
HotSpot-Layout an: vier Bytes für eine komprimierte Referenz im Array, zwölf Bytes
Objekt-Header und drei Bytes Kanäle. Durch die Ausrichtung auf acht Bytes wird das
separate Objekt sechzehn Bytes groß. Mit dem Referenzeintrag sind das zwanzig Bytes
pro Farbe, ohne den gemeinsamen Array-Header. Rechts sehen wir den idealisierten
flachen Eintrag: nur r, g und b, also drei Bytes, ohne separate Referenz und ohne
eigenen Objekt-Header. Diese drei Bytes sind das Nutzdatenminimum, keine Zusage
für das tatsächliche nullable Layout. Nullstatus, Padding und die JVM-Konfiguration
können zusätzlichen Platz benötigen. Die Ersparnis ist also ein Potenzial, kein
hier gemessener Faktor.

Regie: etwa 40 Sekunden innerhalb des Flattening-Abschnitts. Nicht 20 gegenüber
3 Bytes als universelle JVM-Messung oder garantierten Speed-up darstellen.
Andere Headerkonfigurationen, etwa Compact Object Headers, verändern die linke Rechnung.
-->

---
hide: true
---
# Verschachtelt heißt nicht komplett flach

```java
value record NamedColor(Rgb rgb, String name) {}
NamedColor[] palette = ...;
```

<div class="memory-row flat mt-6"><span>rgb-Daten / Nullstatus</span><span>String-Referenz</span><span>Nullstatus / Padding</span></div>
<div class="center mt-3">↓</div>
<div class="card yellow center">String „Rot“ – weiterhin ein separates Identity Object</div>


<!--
Was passiert mit unserer benannten Farbe? Selbst wenn die JVM NamedColor und das
enthaltene Rgb günstig ablegt, wird nicht automatisch der gesamte Objektgraph flach.
Der Name ist weiterhin eine Referenz auf einen String mit Identität. Dieser String
bleibt ein separates Objekt und könnte von vielen Farben gemeinsam genutzt werden.
Zusätzlich müssen sowohl ein fehlender Arrayeintrag als auch ein fehlendes inneres
Rgb darstellbar bleiben. Das ist deshalb nur eine schematische Möglichkeit, kein
Versprechen für das erste Preview. Verschachtelte Value Objects sind keine pauschale
Aufforderung, alle erreichbaren Daten hineinzukopieren.

Regie: Nicht behaupten, NamedColor müsse im ersten Preview flach sein.
Rgb ist ebenfalls nullable, zusätzlich zur Nullbarkeit des gesamten Eintrags.
-->

---
hide: true
---
# Viele neue Werte – viele Allokationen?

```java
static Rgb rotate(Rgb c) {
    return new Rgb(c.g(), c.b(), c.r());
}

Rgb color = input;
for (int i = 0; i < iterations; i++) {
    color = rotate(color);
}
return color;
```

<div v-click class="takeaway">Neue Werte im Sprachmodell.<br>Heap-Allokationen im optimierten Code? Nicht zwingend.</div>

<!--
Diese Schleife sieht nach vielen neuen Objekten aus: Bei jedem Durchlauf wird eine
neue Farbe erzeugt. [Klick] Das Sprachmodell beschreibt tatsächlich immer neue Werte.
Daraus folgt aber nicht, dass im heißen Pfad jedes Mal ein Heap-Objekt entstehen
muss. Der JIT kann die Komponenten direkt weiterreichen. Gleichzeitig ist dieses
Beispiel ausdrücklich kein brauchbarer Benchmark: Nach drei Rotationen sind die
Kanäle wieder an ihrer Ausgangsposition. Ein Compiler könnte die Arbeit weitergehend
vereinfachen. Für belastbare Messungen brauchen wir realistische Datenabhängigkeiten
und müssen sicherstellen, dass Ergebnisse tatsächlich verwendet werden.

Regie: Didaktik, KEIN Benchmark: Die Rotation ist periodisch und der JIT
könnte die gesamte Schleife vereinfachen. Das ausdrücklich sagen.
Für einen Benchmark Datenabhängigkeit und Konsum prüfen, JMH verwenden.
-->

---
hide: true
---
# Drei Begriffe, drei Fragen

| Begriff | Frage |
|---|---|
| **Flattening** | Wo liegen die Daten in Feldern/Arrays? |
| **Scalarization** | Muss der JIT den Wert als Ganzes behandeln? |
| **Allocation Elimination** | Braucht es diese Heap-Allokation überhaupt? |


<!--
Diese drei Begriffe sollten wir nicht durcheinanderwerfen. Flattening fragt nach
dem Speicherlayout von Feldern und Arrays: Liegen Nutzdaten direkt dort oder hinter
einer Referenz? Scalarization fragt, ob der optimierte Code einen Wert als einzelne
Komponenten behandeln kann. Allocation Elimination fragt schließlich, ob eine
bestimmte Heap-Allokation überhaupt nötig ist. Die Optimierungen können zusammenspielen,
sind aber nicht synonym. [Klick] Ein großer Value kann im Rechenpfad scalarisiert
werden, obwohl ein Array desselben Typs weiterhin Referenzen enthält. Ein nicht
flaches Array beweist daher nicht, dass Value Classes nichts bringen.

Regie: Typische Verwechslung auflösen.
Scalarization kann Allocation Elimination ermöglichen, Begriffe sind nicht synonym.
-->

---
hide: true
---
# Wenn der konkrete Typ verschwindet

```java
interface Transform<T> {
    T apply(T input);
}

// Nach Erasure: Object apply(Object input)
```

<div class="flow mt-5"><span>Rgb-Komponenten</span><b>→</b><span>Object-Grenze</span><b>→</b><span>Materialisierung?</span></div>

<div v-click class="takeaway">Inlining kann die Grenze beseitigen.<br>Polymorphie kann sie sichtbar lassen.</div>

<!--
Bisher kannte der Compiler unseren konkreten Farbtyp. Eine generische Schnittstelle
verliert nach Erasure jedoch zunächst diese Information: Zur Laufzeit steht hier
eine Object-Signatur. Wenn Komponenten einzeln vorliegen, kann für so eine Grenze
wieder eine Objektdarstellung gebraucht werden. Das Fragezeichen ist wichtig.
[Klick] Wird der Aufruf inlined und der konkrete Typ sichtbar, kann die Grenze
wieder verschwinden. Bei vielen unterschiedlichen Implementierungen am selben
Aufrufpunkt gelingt das schwieriger. Compiler Sympathy heißt hier nicht, Abstraktion
grundsätzlich zu meiden, sondern ihre Kosten an den tatsächlich heißen Stellen zu verstehen.

Regie: Eine Object-Signatur erzwingt nicht in jedem Fall eine Allokation:
Sharpening und Inlining können helfen. Bei megamorphen Calls schwieriger.
-->

---
hide: true
---
# Streams behalten die Semantik

```java
Rgb[] colors = ...;

Rgb[] swapped = Arrays.stream(colors)
    .map(c -> new Rgb(c.b(), c.g(), c.r()))
    .toArray(Rgb[]::new);
```

<div v-click class="card yellow mt-4">

Value Objects bleiben Value Objects.<br>
Generische Übergänge können aber Optimierungsspielraum kosten.

</div>

<div class="small mt-4">Compiler Sympathy: Typinformationen sichtbar halten – und messen.</div>

<!--
Unser Farbtausch lässt sich weiterhin ganz normal als Stream ausdrücken.
Value Objects verlieren in der Pipeline weder ihre Bedeutung noch ihre
Unveränderlichkeit. [Klick] Generische Übergänge können allerdings Optimierungen
erschweren, wenn die nötigen Typinformationen nicht sichtbar bleiben. Das ist kein
pauschales Urteil über Streams. Je nach Inlining und Profil kann die JVM sehr
unterschiedliche Ergebnisse erzeugen. Außerdem erzeugt dieser Algorithmus absichtlich
ein neues Ergebnisarray; „ohne jede Allokation“ ist hier schon deshalb das falsche
Ziel. Wir messen die konkrete Pipeline statt aus der Schreibweise auf ihre Kosten
zu schließen.

Regie: Kein pauschales „Streams sind langsam“.
Array-Ausgabe ist absichtlich Teil des Algorithmus, kein Claim allocation-free.
-->

---
hide: true
---
# Warm-up gehört zur Geschichte

<div class="flow"><span>Interpreter</span><b>→</b><span>C1</span><b>→</b><span>C2</span></div>

<div class="grid-2 mt-6">
<div class="card pink">Startphase:<br>Allokationen können auftreten.</div>
<div class="card teal">Heißer Pfad:<br>Scalarization kann sie vermeiden.</div>
</div>

<div class="small mt-5">JMH: Warm-up und Forks · JFR: Allokationen und GC<br>Resultate konsumieren. Wegoptimierte Arbeit nicht als Speed-up verkaufen.</div>

<!--
Die Laufzeit eines Java-Programms ist nicht über seine gesamte Lebensdauer gleich.
Am Anfang können Interpreter und weniger stark optimierter Code Objekte anlegen,
die ein später kompilierter heißer Pfad nicht mehr benötigt. Eine kurze Messung
direkt nach dem Start erzählt deshalb eine andere Geschichte als eine Messung
im eingeschwungenen Zustand. Für Mikrobenchmarks hilft JMH mit Warm-up und Forks.
Mit JFR schauen wir auf Allokationen und GC im realistischen Ablauf. Vor allem
prüfen wir, ob die berechneten Ergebnisse gebraucht werden – wegoptimierte Arbeit
ist kein erfolgreicher Anwendungsspeed-up.

Regie: Keine selbst erfundenen Benchmarkzahlen.
Auch heute kann Escape Analysis normale Objekte optimieren.
-->

---
hide: true
---
# Wann ist value die richtige Entscheidung?

<div class="grid-3">
<div class="card teal">

## Zustand

Die eigene<br>Feldbelegung<br>ist unveränderlich.

</div>
<div class="card yellow">

## Austauschbar

Gleiche Feldwerte<br>dürfen ununterscheidbar sein.

</div>
<div class="card">

## Keine Identität

Kein Lock,<br>kein Identity-Lebenszyklus,<br>keine Weak Reference.

</div>
</div>

<div v-click class="takeaway">Semantik zuerst. Performance danach nachweisen.</div>

<!--
Wann setzen wir value ein? Erstens muss die eigene Feldbelegung unveränderlich
sein. Zweitens müssen Objekte mit gleichen Feldwerten austauschbar sein dürfen.
Drittens darf keine benötigte Identität verloren gehen: kein Monitor, keine
schwache Referenz und kein Lebenszyklus, bei dem gerade diese Instanz zählt.
Das sind Fragen an unser Modell und an seine Konsumenten. [Klick] Die Reihenfolge
lautet deshalb: Semantik zuerst, Performance danach nachweisen. Nicht jeden Record
blind umstellen. Entitäten und gemeinsam veränderliche Objekte haben weiterhin
gute Gründe für Identität; eine Farbe braucht sie meist nicht.

Regie: Kein blindes Ersetzen aller Records.
Identity ist für Entitäten und gemeinsam mutable Objekte weiterhin wichtig.
-->
