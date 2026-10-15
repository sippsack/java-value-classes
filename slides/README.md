# Valhalla Now

Slidev-Folien mit eigenem Git-Repository in diesem Verzeichnis.

## Starten

Voraussetzung: Node.js 20 ab 20.19 oder Node.js ab 22.12.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run export
```

Der Build liegt in `dist/`, der PDF-Export in `valhalla-now.pdf`.

### Fehler „Cannot find native binding“

Rolldown benötigt ein natives Paket passend zur Architektur des verwendeten
Node.js. Nach einem Wechsel zwischen ARM64 und x64 (Rosetta) die Abhängigkeiten
im selben Terminal neu installieren, in dem Slidev gestartet wird:

```sh
node -p 'process.version + " / " + process.arch'
npm ci --include=optional
npm run dev
```

Dabei eine der oben genannten Node-Versionen verwenden. Das Lockfile enthält
beide macOS-Architekturen und muss nicht gelöscht werden.

## Vortrag

Nach Titel, Sponsoren und Community blendet „Valhalla, when?“ mit je einem
Klick zuerst „Valhalla, now!“ und anschließend direkt daneben den kleineren
Zusatz „(or at least very soon)“ ein. Unten rechts steht Brian Goetz;
die Fotoquelle steht in den Sprechernotizen der Folie.
Danach folgt eine Projektgeschichte mit sechs einzeln eingeblendeten Meilensteinen:
2014, Minimal Value Types 2017, L-World 2018–2019, EA 2025, Integration 2026,
geplantes Preview 2027. Historische Daten stammen aus den
[OpenJDK-Legacy-Quellen](https://openjdk.org/projects/valhalla/legacy),
nicht aus einer nachgebauten Vortragstimeline.
Der sichtbare Foliensatz umfasst 41 Folien einschließlich Agenda, Sponsoren und
Kontakt. Ziel sind etwa 38 Minuten Vortrag mit zwei Minuten Puffer innerhalb
eines 40-Minuten-Slots. Ausformulierter deutscher Sprechtext und Regiehinweise
stehen in den Slidev-Sprechernotizen und in `../sprechtext-value-classes.md`.
Die Vorstellung ist mit `hide: true` ausgeblendet, bleibt aber samt Notizen erhalten.
Die offizielle Sponsorenübersicht aus `../input/BaselOne26.pptx` steht an zweiter
Stelle. Die letzte Folie wirbt für die kostenlosen Architektur-Spicker.

Nach der Geschichte steht die Gesamt-Agenda. Direkt danach und vor jedem weiteren
Kapitel wiederholt sie sich mit hervorgehobenem aktuellem
Punkt: Hello Value Class, Werte statt Identität, Optimierungen der JVM,
Nutzen für KI und Fachmodelle, Status und Ausblick. `components/TalkAgenda.vue`
hält alle Varianten synchron. Duke zeigt dazu groß einen Schutzschild, eine
Farbpalette, einen Speicherbaustein, einen KI-Chip oder einen Wegweiser.
„Präzise Typen. Kompakte Daten.“ steht im Fazit direkt vor „Drei Dinge zum Mitnehmen“.
Die Agenda-Einschübe nur kurz überleiten. Zeitbudget: Auftakt 4, Hello 6,
Identität 9, JVM 11, Nutzen 4, Status/Abschluss 4 Minuten; insgesamt 38 plus 2 Puffer.

Rgb und NamedColor bilden den roten Faden für Identität, Gleichheit,
Flattening und Scalarization. Kapitel 1 beginnt konkret mit Deklaration,
Erzeugung, Klassenmitteln, flacher Unveränderlichkeit und sicherer Konstruktion.
Kapitel 2 behandelt ausschließlich Identität, Veränderbarkeit, Vergleiche und
identitätssensitive Operationen, nicht erneut die Syntaxregeln. Pixel, Position,
ColorWithAlpha und Rgb erweitern im JVM-Kapitel
das Beispiel: alternative Record-Deklarationen stehen nebeneinander, gefolgt von
einem Speicherbild mit vier separaten Identity Objects gegenüber idealisiert
verschachtelten Value-Nutzdaten. Unter expliziten klassischen HotSpot-Annahmen
sind es 88 Bytes Objektgraph (ohne äußere Referenz, ohne Sharing) gegenüber
12 Bytes reinem Nutzdatenminimum – kein garantierter Preview-Speicherbedarf.
Die Speicherbilder stehen nur im JVM-Kapitel und werden nicht vorab vorweggenommen.
Die ausführbaren Vergleichsdemos liegen in
`../demo/`; die dort angegebenen Startbefehle gelten vom Projektwurzelverzeichnis.
Code mit Compilerfehlern und Zukunftssyntax ist ausdrücklich als solcher markiert.
Die Identitätsherleitung greift Folien 65–68 aus `../input/Java-Value-Objects-neu.pptx`
auf: Zwillingsanalogie, zwei Referenzen auf dasselbe Rgb versus zwei gleiche Objekte,
Nutzen und Kosten von Identität. Die vorherige „Wert oder Ding?“-Folie ist darin
aufgegangen. Identität wird nicht mit festen Adressen und Ähnlichkeit nicht mit
einem automatisch passenden `equals`-Vertrag gleichgesetzt. Folie 64 der alten Datei
ist eine ausgeblendete leere Zwischenfolie und wird nicht übernommen.
Die zentrale Mutability-Motivation steht dort plakativ, ohne Identität pauschal
auf diesen einzigen Einsatzzweck zu reduzieren. Die kompakte
Klassenübersicht mit einem vereinfachten Rotkanal zeigt Methoden, Konstruktoren, Interfaces, Felder,
neu zuweisbare Variablen und die Vererbung über abstrakte Value Classes.
Eine ausgeblendete Reservefolie vergleicht zusätzlich Rgb als Identity Object
(20 Bytes einschließlich Arrayreferenz unter expliziten klassischen HotSpot-Annahmen)
mit dem idealisierten flachen Nutzdatenminimum von 3 Bytes. Letzteres ist keine
Speicherlayoutgarantie für das nullable Preview; Nullstatus und Padding sind separat
zu berücksichtigen.

Titel, Vorstellung, Java Community, PDF-Download, embarc-Ganzseitenmotiv,
Architektur-Spicker und Danke/Kontakt bleiben als Rahmenfolien erhalten.
15 Detailfolien im Fachteil sowie Vorstellung, embarc-Ganzseitenmotiv und
eine ältere Platzierung der Architektur-Spicker sind mit `hide: true` ausgeblendet. Dazu gehören zusätzliche
Gleichheitsfälle, die Rgb-Bytegrafik, die Begriffs-Zusammenfassung, Erasure,
Streams und Warm-up. Ihr Sprechtext bleibt vollständig erhalten und steht im
Anhang der Leseversion. Zum Einblenden gezielt `hide: true` entfernen; der
Hauptablauf verzichtet auf diese Wiederholungen und Vertiefungen.
Layouts, Schriften, Farben und allgemeine Rahmenfolien stammen aus
`2026-10-Pattern Matching + DOP/slides`.
Die Titelfolie nennt BaselOne, 15.10.2026, mit Konferenzlogo.
Der Community-Termin wurde unverändert aus dem Referenzvortrag übernommen.
Layout- und Performanceaussagen sind keine Garantien; JEP- und EA-Stand vor
dem Vortrag aktualisieren. Ein erneuter Export ersetzt das vorhandene PDF.

## Bilder

- `public/embarc/spicker-folie.jpg`: vom Nutzer geliefertes großformatiges
  Spicker-Motiv aus `../input/`, mit anklickbarem Download-Link auf der letzten Folie.
- `public/baselone/feedback-code.png`: vom Nutzer gelieferter Feedback-QR-Code
  aus `../input/`, auf der Danke-/Fragenfolie mit Beschriftung und Pfeil.
- `public/valhalla/flattening-scalarization-original.png` und
  `public/valhalla/flattening-inlining-original.png`: Originalfolien 70 und 73 aus
  `../input/Java-Value-Objects-neu.pptx`, direkt nach der JVM-Kapitelagenda.
  Die historische Wortwahl „Inlining“ meint hier eingebettete Felder (Flattening),
  nicht Methoden-Inlining und nicht Scalarization; die Notizen grenzen das ab.
- `public/baselone/sponsor-assets/`: Originalmedien aus `../input/BaselOne26.pptx`
  sowie `logo-1.png` bis `logo-17.png` mit entferntem äußerem Weißraum.
  `layouts/sponsors.vue` zentriert alle Logos proportional in einheitlichen weißen
  Kästen mit Innenabstand. Auch BaselTech wird vollständig gezeigt; fehlerhafte
  Ausschnitte und Positionierungen aus der PowerPoint werden nicht übernommen.
- `public/valhalla/duke.png`: vom Nutzer bereitgestellter Duke ohne Füße.
  Die Gegenstände in `components/ChapterIcon.vue` sind eigene SVG-Zeichnungen;
  Duke wird unverändert daneben beziehungsweise am Rand des Gegenstands platziert.
- `public/valhalla/brian-goetz.jpg`: Porträt aus dem
  [Devoxx-Sprecherprofil von Brian Goetz](https://www.devoxx.com/speaker/brian-goetz),
  Bild-URL: https://devoxxian-image-thumbnails.s3-eu-west-1.amazonaws.com/profile-1e5ab216-7bb8-4c24-a898-ef1e729e790d.jpg.
  Devoxx ist die Fundstelle; eine freie Nachnutzungslizenz ist dort nicht ausgewiesen.
  Für eine öffentliche Weiterverbreitung des Foliensatzes die Bildrechte klären.
- `public/baselone/logo.png`: offizielles Logo von
  https://baselone.org/wp-content/uploads/2023/08/BaselOne-Logo-OJ.png,
  verlinkt in den Organisationsmetadaten von https://baselone.org/.
- `public/embarc/`: Bilder der übernommenen Rahmenfolien aus dem Referenzvortrag.
- `public/valhalla/viking-helmet.svg`: direkt aus
  `../input/Java-Value-Objects-neu.pptx` extrahiert
  (`ppt/media/image28.svg`, verwendet auf Folie 13).
- Weitere Motive des alten Vortrags stehen in `../images/` zur Verfügung.
  Benötigte Bilder nach `public/` kopieren, damit der Foliensatz eigenständig bleibt.

Die verwendeten Bilder und Schriften liegen lokal; es gibt keine Abhängigkeit
vom Verzeichnis des Referenzvortrags.
