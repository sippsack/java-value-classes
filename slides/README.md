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

## Lokale Java-Sandbox

`sandbox.md` ist eine separate Demo-Folie; der Hauptvortrag bleibt unverändert.
Nach `npm ci` starten:

```sh
npm run sandbox
```

Beim Start des Dev-Servers werden lokale JDKs ab Java 17 mit `jdk.jshell`
gesucht: SDKMAN, die üblichen macOS-/Linux-/Windows-Java-Verzeichnisse,
Homebrew sowie `JAVA_HOME`, `JAVA_SANDBOX_HOME` und `java` aus `PATH`.
Es erfolgt keine Volltextsuche über die Festplatte. Symlinks werden aufgelöst,
doppelte Installationen zusammengefasst und Versionen numerisch absteigend
sortiert. **Das höchste gefundene JDK ist vorausgewählt**; über die Auswahlliste
kann jederzeit auf eine andere Installation gewechselt werden.

Die erkannten absoluten JDK-Home-Pfade werden automatisch in der Git-ignorierten
Datei `slides/.env.local` unter `JAVA_SANDBOX_JDKS` gespeichert. Bestehende andere
Einstellungen bleiben erhalten. Zusätzliche Installationen außerhalb der
Standardverzeichnisse können dort eingetragen werden (`.env.example` als Vorlage):

```dotenv
JAVA_SANDBOX_JDKS='["/absoluter/pfad/zum/jdk","/weiteres/jdk"]'
```

Den absoluten JDK-Home-Pfad angeben, nicht dessen `bin`-Verzeichnis; kein `~`
verwenden. Die lokale Datei ist von Git ausgeschlossen. Danach den Server neu
starten. `JAVA_SANDBOX_HOME` bleibt als zusätzlicher Suchpfad unterstützt,
erzwingt aber nicht mehr die Vorauswahl: Diese folgt immer der höchsten Version.
Nicht mehr vorhandene oder ungeeignete Installationen werden aus der Liste
entfernt. Die Pfade werden nur an den lokalen Browser ausgeliefert, nicht in
den statischen Build eingebettet. Die JDK-Suche und das Schreiben der Datei
finden nur im Dev-Server statt, nicht im Pages-Build.

Die Brücke benötigt ein
vollständiges JDK ab 17 mit `jdk.jshell`; das vorbereitete Value-Class-Beispiel
braucht zusätzlich einen passenden Valhalla-/Preview-Build. Ein reguläres älteres
JDK kann gewöhnliche Java-Snippets ausführen, meldet bei `value class` aber
Compilerfehler. Die tatsächlich verwendete JDK-Version steht nach dem Run oben
in der Ausgabezeile. **--enable-preview** ist standardmäßig angehakt; Abschalten
wirkt sowohl auf den JShell-Compiler als auch auf die Ausführungs-JVM.

Links Code bearbeiten, mit **Run** oder **Strg/⌘ + Enter** ausführen, rechts Ausgabe
und Compilerdiagnosen lesen. Beim Beispiel zuerst mit `value` ausführen und dann
`value` entfernen: Der Vergleich wechselt von `true` zu `false`.
Der kompakte **Run**-Button wird von den Buttons **0, 1, 2, …** gefolgt.
**0** stellt immer den Ausgangscode wieder her; weitere Buttons laden die
jeweiligen vorbereiteten Zwischenstände. Wechsel überschreiben lokale Änderungen
im Editor bewusst mit dem vorbereiteten Code, führen ihn aber nicht automatisch
aus. Die Demo-Folie enthält drei solche Zwischenstände. Pro Folie konfigurieren:

```vue
<JavaSandbox
  initial-code="System.out.println(0);"
  :checkpoints="['System.out.println(1);', 'System.out.println(2);']"
/>
```

Ohne Props bleibt das Rgb-Beispiel der Ausgangscode. Ein Overlay zum Übernehmen
anderer Folien-Codeblöcke gehört noch nicht zum Funktionsumfang.

Der Vite-Dev-Server stellt eine lokale HTTP-Brücke bereit
(`vite.config.ts`, `sandbox/server.mjs`). Pro Run startet sie eine eigene JVM
mit `sandbox/SnippetRunner.java` und der JShell-API. Es handelt sich um Java-Snippets,
nicht um JShell-Kommandos wie `/list`; zwischen Runs bleiben keine Variablen erhalten.
Nach zehn Sekunden wird der Prozess hart beendet. Anfrage und Ausgabe sind begrenzt.
Für die lokale Ausführung gibt es keine zusätzlichen Java-Bibliotheken oder
externen Ausführungsdienste.

**Keine Sicherheits-Sandbox:** Snippets laufen mit den Rechten des lokalen
Benutzers, einschließlich Datei- und Netzwerkzugriff. Ausschließlich eigenen,
vertrauenswürdigen Code ausführen. Nur über `127.0.0.1`/`localhost` nutzen,
nicht per Tunnel, Proxy oder im Netzwerk freigeben. Die Brücke prüft Host,
Origin und einen eigenen Request-Header und erlaubt kein CORS.
### Mehrere externe Sandboxen mit demselben Editor

GitHub Pages und `slidev build` enthalten kein Java-Backend. Dort wird der externe
Ausführungsmodus gewählt: Editor, Run und Ausgabe bleiben identisch. Im lokalen
Betrieb enthält dieselbe Zielauswahl lokale JDKs und externe Anbieter.
Code und letzte Ausgabe bleiben beim Wechsel erhalten. Erst **Run** sendet Code
an das ausgewählte Ziel. Compiler- oder JVM-Fehler lösen keine automatische
Weiterleitung an Dritte aus. Das PDF enthält keine Live-Ausführung.

dev.java erlaubt derzeit keine direkten Cross-Origin-Browseraufrufe seiner
Ausführungs-API. Daher gibt es einen separat betreibbaren Node-Proxy
(`sandbox/proxy.mjs`), der ausschließlich an die festgelegten Anbieter-Endpunkte
weiterleitet; er benötigt selbst kein JDK und keine zusätzlichen npm-Pakete.
Die Cloudflare-Variante liegt in `../dev.java-proxy/`. Lokal lässt er sich so ausprobieren:

Im Slidev-Dev-Server werden externe Aufrufe automatisch über die geschützte
gleichursprüngliche Route `/__java-sandbox/external` weitergeleitet. Das funktioniert
sowohl mit `localhost` als auch mit `127.0.0.1`; ein zusätzlicher Proxy-Prozess und
eine Proxy-URL sind dafür nicht nötig. Die konfigurierte Proxy-URL gilt nur für
den statischen Build. Der folgende eigenständige Node-Proxy ist optional, etwa
zum Testen statischer Builds:

```sh
cd slides
JAVA_SANDBOX_ALLOWED_ORIGINS=http://127.0.0.1:3047 npm run sandbox:proxy
```

Der Proxy lauscht standardmäßig auf `127.0.0.1:3049`, Endpunkt `/run`.
`PORT` und `HOST` sind konfigurierbar. `JAVA_SANDBOX_ALLOWED_ORIGINS` ist
verpflichtend: eine kommaseparierte Liste konkreter Origins, ohne Pfad oder
abschließenden Slash. Für GitHub Pages etwa `https://www.sippsack.de`.
Der Proxy liest diese Werte aus seiner Prozessumgebung, nicht aus Vites Env-Dateien.

In `slides/.env.local` die öffentliche Proxy-URL konfigurieren:

```dotenv
VITE_JAVA_SANDBOX_PROXY_URL=http://127.0.0.1:3049/run
VITE_JAVA_SANDBOX_PROVIDERS='[{"label":"dev.java","url":"https://dev.java/playground/"},{"label":"Java Almanac 28","url":"https://javaalmanac.io/jdk/28/"}]'
```

Ohne `VITE_JAVA_SANDBOX_PROVIDERS` werden genau diese beiden Anbieter angeboten.
Reihenfolge und Auswahl sind über das JSON-Array konfigurierbar; optional kann
jeder Eintrag eine eigene `proxyUrl` erhalten, ansonsten gilt die gemeinsame
Proxy-URL. Die Seiten-URL in `url` ist die Anbieterkennung, nicht der API-Endpunkt.
Beliebige URLs werden vom Proxy bewusst nicht aufgerufen. Neue Anbieter brauchen
einen expliziten Adapter; dadurch bleibt der Proxy kein offener URL-Forwarder.
Im statischen Build ist der erste konfigurierte Anbieter vorausgewählt.
Für CI kann `VITE_JAVA_SANDBOX_PROVIDERS` als Build-Umgebungsvariable gesetzt werden.

dev.java hat Preview fest aktiviert: Dort ist die Checkbox angehakt und
deaktiviert, mit entsprechendem Hinweis. Java Almanac 28 unterstützt beide
Einstellungen. Dort werden Snippets in `Sandbox.main` eingebettet und
einzeilige Imports vorangestellt. Ausdrücke brauchen `System.out.println`;
vollständige Quelldateien, Pakete, JShell-Kommandos und beliebige Top-Level-
Deklarationen werden nicht als JShell-Eingabe interpretiert. Klassen im Beispiel
werden lokale Klassen in `main`. Compilerdiagnosen beziehen sich auf die erzeugte
Quelldatei, nicht exakt auf die Editorzeilen.

Slidev danach neu starten. Für Pages muss hier eine öffentlich erreichbare
**HTTPS**-URL stehen, nicht localhost. Alternativ den Wert als Build-Umgebungsvariable
setzen. Die URL wird beim Build in den Client eingebettet; keine Zugangsdaten
hineinschreiben. Ohne Konfiguration bleibt Run im externen Modus deaktiviert und
ein Link zum eigenständigen Playground verfügbar.

Der Proxy begrenzt Anfragen auf 32 KiB, erlaubt nur eine gleichzeitige Ausführung
und bricht den Aufruf nach 20 Sekunden ab. CORS ist keine Authentifizierung:
Vor einer öffentlichen Bereitstellung müssen beim Hosting zusätzlich
Missbrauchsschutz, Rate-Limits und gegebenenfalls Zugangskontrolle vorgesehen
werden. Keine Code-Inhalte werden vom Proxy geloggt. Die dev.java-API wird vom
öffentlichen Playground genutzt, ist aber kein zugesicherter stabiler API-Vertrag.
Ihre Verfügbarkeit, Nutzungsbedingungen und Eignung für den geplanten öffentlichen
Betrieb müssen vor dem Deployment geklärt werden.

**Run im externen Modus überträgt deinen eingegebenen Code an den Proxy und
den ausgewählten Anbieter (Oracle/dev.java oder Java Almanac).** Das JDK des Anbieters wird verwendet, nicht das lokal
konfigurierte JDK; Valhalla-Unterstützung ist nicht garantiert. Netzwerk-,
Provider- und Formatfehler werden im Ausgabefeld angezeigt.

Die Integrationschecks laufen mit dem jeweils ausgewählten JDK:

```sh
npm run test:sandbox
```

Die graue Seitenleiste aus der PowerPoint-Vorlage wird über `global-top.vue`
auf Inhaltsfolien eingeblendet, auch im PDF. Ihr senkrechter Titel kommt aus
`title` im Frontmatter von `slides.md`; die Nummer folgt der sichtbaren
Slidev-Folienreihenfolge.
Auf der ersten Folie ist sie automatisch ausgeblendet. Großformatige Bildfolien
und Folien mit nicht weißem Hintergrund sind im jeweiligen Frontmatter mit
`sidebar: false` markiert. Diese Markierung auch für neue entsprechende Folien setzen.

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
Abstract und persönliche Vorstellung sind mit `hide: true` ausgeblendet.
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
