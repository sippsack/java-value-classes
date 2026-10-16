# Folien und Demos zum Vortrag 

## Value Classes - Java bereitet sich auf KI-Workloads vor (Falk Sippach)

Java verdankt seine Stärke seit jeher einem statischen, starken Typsystem. Doch die alte Trennung zwischen primitiven und Referenztypen ist bis heute eine Sollbruchstelle der Sprache: primitive Typen sind schnell und kompakt, integrieren sich aber nur schlecht mit Generics, Collections, Streams und modernen Sprachmitteln. Klassen sind ausdrucksstark, kosten aber oft unnötig Speicher, Indirektion und Performance. Mit Value Classes will Project Valhalla diese Kluft schließen. Sie erlauben Datentypen ohne eigene Identität, die sich fachlich wie Klassen modellieren lassen, zur Laufzeit aber deutlich näher an primitiven Typen liegen. Das verspricht kompaktere Datenstrukturen, weniger Objekt-Overhead, bessere Datenlokalität und damit genau die Eigenschaften, die auch für numerische und KI-nahe Workloads immer wichtiger werden. Denn wer mit Embeddings, Vektoren, Matrizen oder großen Mengen kleiner, unveränderlicher Datenstrukturen arbeitet, profitiert besonders von effizientem Speicherlayout und geringerer Indirektion. Gleichzeitig werden fachliche Typen wieder attraktiver: präzise, unveränderbar und trotzdem performant. Der Vortrag zeigt, wohin sich Java mit Value Classes, null-restricted / nullable types und einem vereinheitlichten Typmodell entwickelt und warum das gerade für die Zukunft von Java im Umfeld von AI, Data Processing und High-Performance wichtig wird.

## Inhalte des Repos

Die Folien sind online unter **https://www.sippsack.de/java-value-classes/** erreichbar.
GitHub Actions baut und veröffentlicht sie automatisch bei Änderungen an `slides/`
auf `main`. Eine Veröffentlichung lässt sich auch manuell über die Action
„Publish slides to GitHub Pages“ starten.

## Experimentelle Java-Sandbox

Die Action „Publish experimental slides to GitHub Pages“ veröffentlicht bei
Änderungen an `slides/` auf `experimental` (beziehungsweise dem app-präfixierten
Branch `sippsack-experimental`) den experimentellen Foliensatz unter
**https://www.sippsack.de/java-value-classes/experimental/** und die separate
Java-Sandbox unter
**https://www.sippsack.de/java-value-classes/experimental/sandbox/**.
Hauptfolien aus `main` und `published/`-Versionen werden im selben Deployment
mitgebaut und bleiben erhalten. Sobald die Workflow- und Build-Skript-Änderungen
auch in `main` übernommen sind, bleibt die Experimental-Version auch nach späteren
Main-/Tag-Deployments verfügbar, solange ihr Branch existiert. Bis dahin kann ein
Deployment mit dem alten Main-Workflow das Experimental-Verzeichnis entfernen. Der
Tag-Versionsname `experimental` ist deshalb reserviert.

Für die externe Java-Ausführung in Pages unter **Settings → Secrets and variables
→ Actions → Variables** die Repository-Variable `JAVA_SANDBOX_PROXY_URL` auf die
öffentliche HTTPS-URL des separat gehosteten Proxys einschließlich `/run` setzen.
Danach erneut deployen. Ohne Proxy-URL ist die Folie sichtbar, aber externe
Ausführung deaktiviert. Die Action hostet keinen Java-/Proxy-Server.
Konfiguration und Betriebsgrenzen stehen in `slides/README.md`.

Falls die Pages-Umgebung nur Deployments von `main` erlaubt, unter **Settings →
Environments → github-pages** auch den Experimental-Branch zulassen.
Für automatische Deployments müssen die Änderungen auf GitHub gepusht sein.

## Veröffentlichte Versionen

Der zusätzliche Workflow „Publish tagged slides to GitHub Pages“ reagiert auf
das Erstellen oder Aktualisieren von Tags mit dem Präfix `published/`.
Build und Deployment laufen nur, wenn sich dabei Dateien unter `slides/`
ändern. Bei einem verschobenen Tag wird der bisherige Tag-Stand mit dem neuen
verglichen; bei einem neuen Tag dessen Commit mit seinem ersten Elterncommit
(beim ersten Commit mit einem leeren Verzeichnisbaum).
Da GitHub für Tag-Pushes keine Pfadfilter unterstützt, startet dafür lediglich
ein Prüfjob; bei unveränderten Folien wird die Veröffentlichung übersprungen.
Manuelle Workflow-Starts bleiben unabhängig vom Änderungsfilter möglich.
Der Teil nach dem Präfix wird zum URL-Verzeichnis, zum Beispiel:

```sh
git tag published/2026-10-15-baselone
git push origin published/2026-10-15-baselone
```

Diese Version erscheint unter
**https://www.sippsack.de/java-value-classes/2026-10-15-baselone/**.
Versionsnamen dürfen Buchstaben, Ziffern, Punkte, Bindestriche und Unterstriche
enthalten und müssen mit einem Buchstaben oder einer Ziffer beginnen.

Beide Workflows bauen die aktuelle `main`-Version im Hauptverzeichnis und alle
vorhandenen `published/`-Tags in separaten Unterverzeichnissen. Dadurch entfernt
ein neues Pages-Deployment keine älteren Versionen. Jede Tag-Version wird aus
dem jeweiligen Git-Stand einschließlich dessen Lockfile und Bildern gebaut.
Ein gelöschtes Tag verschwindet bei der nächsten Veröffentlichung auch von der Website.

Bereits bestehende Tags werden beim nächsten Deployment mit veröffentlicht.
Für Tags, deren Git-Stand den neuen Workflow noch nicht enthält, den Workflow
manuell auf `main` starten; ein Tag-Push kann nur Workflows auslösen, die im
getaggten Stand vorhanden sind.

* Folien: [slidev](https://sli.dev/)
* Demos: Ordner demo/src