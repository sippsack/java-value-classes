# Folien und Demos zum Vortrag 

## Value Classes - Java bereitet sich auf KI-Workloads vor (Falk Sippach)

Java verdankt seine Stärke seit jeher einem statischen, starken Typsystem. Doch die alte Trennung zwischen primitiven und Referenztypen ist bis heute eine Sollbruchstelle der Sprache: primitive Typen sind schnell und kompakt, integrieren sich aber nur schlecht mit Generics, Collections, Streams und modernen Sprachmitteln. Klassen sind ausdrucksstark, kosten aber oft unnötig Speicher, Indirektion und Performance. Mit Value Classes will Project Valhalla diese Kluft schließen. Sie erlauben Datentypen ohne eigene Identität, die sich fachlich wie Klassen modellieren lassen, zur Laufzeit aber deutlich näher an primitiven Typen liegen. Das verspricht kompaktere Datenstrukturen, weniger Objekt-Overhead, bessere Datenlokalität und damit genau die Eigenschaften, die auch für numerische und KI-nahe Workloads immer wichtiger werden. Denn wer mit Embeddings, Vektoren, Matrizen oder großen Mengen kleiner, unveränderlicher Datenstrukturen arbeitet, profitiert besonders von effizientem Speicherlayout und geringerer Indirektion. Gleichzeitig werden fachliche Typen wieder attraktiver: präzise, unveränderbar und trotzdem performant. Der Vortrag zeigt, wohin sich Java mit Value Classes, null-restricted / nullable types und einem vereinheitlichten Typmodell entwickelt und warum das gerade für die Zukunft von Java im Umfeld von AI, Data Processing und High-Performance wichtig wird.

## Inhalte des Repos

Die Folien sind online unter **https://www.sippsack.de/java-value-classes/** erreichbar.
GitHub Actions baut und veröffentlicht sie automatisch bei Änderungen an `slides/`
auf `main`. Eine Veröffentlichung lässt sich auch manuell über die Action
„Publish slides to GitHub Pages“ starten.

## Experimentelle Branches auf GitHub Pages

Die Action „Publish experimental slides to GitHub Pages“ baut und veröffentlicht
bei **jedem Push auf einen Branch mit dem Präfix `experimental/`**, unabhängig von
den geänderten Dateien. Sie lässt sich auch manuell auf einem solchen Branch
starten. Der Teil hinter `experimental/` bestimmt den URL-Pfad:

| Branch | Veröffentlichung |
| --- | --- |
| `experimental/java-sandbox` | https://sippsack.github.io/java-value-classes/experimental/java-sandbox/ |
| `experimental/neue-demo` | https://sippsack.github.io/java-value-classes/experimental/neue-demo/ |

Die separate Java-Sandbox (`slides/sandbox.md`) wird, sofern im jeweiligen Branch
vorhanden, zusätzlich unter `sandbox/` veröffentlicht:
**https://sippsack.github.io/java-value-classes/experimental/java-sandbox/sandbox/**.
Der Remote-Branch für diese Demo heißt `experimental/java-sandbox` (zuvor
`sippsack-java-sandbox`).

Jedes Deployment baut die Hauptfolien aus `main`, alle `published/`-Tags und
**alle vorhandenen `experimental/`-Branches** aus ihrem jeweiligen Git-Stand samt
Lockfile. Damit überschreibt ein Experiment nicht die anderen Veröffentlichungen.
Gelöschte Experimental-Branches verschwinden beim nächsten Deployment.
Branch-Pfadsegmente dürfen Buchstaben, Ziffern, Punkte, Bindestriche und
Unterstriche enthalten und müssen mit einem Buchstaben oder einer Ziffer beginnen.
Weitere Schrägstriche werden als Unterverzeichnisse übernommen; Konflikte mit
vorhandenen Build-Dateien oder `sandbox/` brechen den Build explizit ab.
Der Tag-Versionsname `experimental` ist für dieses Verzeichnis reserviert.

Die Workflow-Dateien müssen im gepushten Experimental-Branch vorhanden sein.
Damit auch Main-/Tag-Deployments die Experimente erhalten, müssen die Workflow-
und Build-Skript-Änderungen zusätzlich in `main` übernommen werden. Bis dahin
kann ein Deployment mit dem alten Main-Workflow die Experimental-Verzeichnisse
entfernen. Alle Veröffentlichungen verwenden dieselbe Pages-Deployment-Warteschlange.

Für die externe Java-Ausführung in Pages unter **Settings → Secrets and variables
→ Actions → Variables** die Repository-Variable `JAVA_SANDBOX_PROXY_URL` auf die
öffentliche HTTPS-URL des separat gehosteten Proxys einschließlich `/run` setzen.
Danach erneut deployen. Ohne Proxy-URL ist die Folie sichtbar, aber externe
Ausführung deaktiviert. Die Action hostet keinen Java-/Proxy-Server.
Konfiguration und Betriebsgrenzen stehen in `slides/README.md`.

Im Proxy muss als erlaubter Origin `https://sippsack.github.io` eingetragen sein
(bei Nutzung einer eigenen Domain zusätzlich deren Origin).
Falls die Pages-Umgebung nur Deployments von `main` erlaubt, unter **Settings →
Environments → github-pages** auch die Experimental-Branches zulassen. Bei
Environment-Branchregeln mit eingeschränktem Glob-Verhalten für `/` gegebenenfalls
weitere Regeln für tiefer verschachtelte Branches ergänzen.
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