# Folien und Demos zum Vortrag 

## Value Classes - Java bereitet sich auf KI-Workloads vor (Falk Sippach)

Java verdankt seine Stärke seit jeher einem statischen, starken Typsystem. Doch die alte Trennung zwischen primitiven und Referenztypen ist bis heute eine Sollbruchstelle der Sprache: primitive Typen sind schnell und kompakt, integrieren sich aber nur schlecht mit Generics, Collections, Streams und modernen Sprachmitteln. Klassen sind ausdrucksstark, kosten aber oft unnötig Speicher, Indirektion und Performance. Mit Value Classes will Project Valhalla diese Kluft schließen. Sie erlauben Datentypen ohne eigene Identität, die sich fachlich wie Klassen modellieren lassen, zur Laufzeit aber deutlich näher an primitiven Typen liegen. Das verspricht kompaktere Datenstrukturen, weniger Objekt-Overhead, bessere Datenlokalität und damit genau die Eigenschaften, die auch für numerische und KI-nahe Workloads immer wichtiger werden. Denn wer mit Embeddings, Vektoren, Matrizen oder großen Mengen kleiner, unveränderlicher Datenstrukturen arbeitet, profitiert besonders von effizientem Speicherlayout und geringerer Indirektion. Gleichzeitig werden fachliche Typen wieder attraktiver: präzise, unveränderbar und trotzdem performant. Der Vortrag zeigt, wohin sich Java mit Value Classes, null-restricted / nullable types und einem vereinheitlichten Typmodell entwickelt und warum das gerade für die Zukunft von Java im Umfeld von AI, Data Processing und High-Performance wichtig wird.

## Inhalte des Repos

Die Folien sind online unter **https://www.sippsack.de/java-value-classes/** erreichbar.
GitHub Actions baut und veröffentlicht sie automatisch bei Änderungen an `slides/`
auf `main`. Eine Veröffentlichung lässt sich auch manuell über die Action
„Publish slides to GitHub Pages“ starten.

## Veröffentlichte Versionen

Der zusätzliche Workflow „Publish tagged slides to GitHub Pages“ reagiert auf
das Erstellen oder Aktualisieren von Tags mit dem Präfix `published/`.
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