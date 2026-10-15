# Folien und Demos zum Vortrag 

## Value Classes - Java bereitet sich auf KI-Workloads vor (Falk Sippach)

Java verdankt seine Stärke seit jeher einem statischen, starken Typsystem. Doch die alte Trennung zwischen primitiven und Referenztypen ist bis heute eine Sollbruchstelle der Sprache: primitive Typen sind schnell und kompakt, integrieren sich aber nur schlecht mit Generics, Collections, Streams und modernen Sprachmitteln. Klassen sind ausdrucksstark, kosten aber oft unnötig Speicher, Indirektion und Performance. Mit Value Classes will Project Valhalla diese Kluft schließen. Sie erlauben Datentypen ohne eigene Identität, die sich fachlich wie Klassen modellieren lassen, zur Laufzeit aber deutlich näher an primitiven Typen liegen. Das verspricht kompaktere Datenstrukturen, weniger Objekt-Overhead, bessere Datenlokalität und damit genau die Eigenschaften, die auch für numerische und KI-nahe Workloads immer wichtiger werden. Denn wer mit Embeddings, Vektoren, Matrizen oder großen Mengen kleiner, unveränderlicher Datenstrukturen arbeitet, profitiert besonders von effizientem Speicherlayout und geringerer Indirektion. Gleichzeitig werden fachliche Typen wieder attraktiver: präzise, unveränderbar und trotzdem performant. Der Vortrag zeigt, wohin sich Java mit Value Classes, null-restricted / nullable types und einem vereinheitlichten Typmodell entwickelt und warum das gerade für die Zukunft von Java im Umfeld von AI, Data Processing und High-Performance wichtig wird.

## Inhalte des Repos
* Folien: [slidev](https://sli.dev/)
* Demos: Ordner demo/src