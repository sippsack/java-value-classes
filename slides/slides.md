---
theme: none
title: Valhalla Now – Value Classes in Java
author: Falk Sippach
canvasWidth: 960
aspectRatio: 16/9
colorSchema: light
mdc: true
transition: none
fonts:
  sans: Rajdhani
  mono: Fira Code
  provider: none
layout: cover
image: /valhalla/viking-helmet.svg
duration: 40min
---

# Value Classes

Java bereitet sich auf KI-Workloads vor

::author::

**Falk Sippach**

<span class="sub">embarc · @sippsack</span>

::date::

<div class="conference-line">
  <span>BaselOne · 15.10.2026</span>
  <img src="/baselone/logo.png" alt="BaselOne" />
</div>

<!--
Herzlich willkommen zur BaselOne! Ich möchte heute zeigen, wie Java mit Value Classes
fachlich präzise Datentypen und eine effizientere Laufzeitrepräsentation zusammenbringen
will. Unser Beispiel sind Farben: klein genug zum Verstehen, aber reich genug für die
spannenden Fragen. Was bedeutet Identität? Was kann die JVM weglassen? Und wo bleiben
Grenzen? Den Bezug zu KI schlagen wir über Datenmengen, Speicherverkehr und numerische
Typen – nicht über das Versprechen, dass ein neues Schlüsselwort alles schneller macht.

Regie: etwa 20 Sekunden. Das Wikinger-Motiv stammt aus der früheren Präsentation.
-->

---
layout: sponsors
---

<!--
Bevor wir einsteigen: Vielen Dank an die Sponsoren und Partner, die die BaselOne
möglich machen. Hier seht ihr die offizielle Sponsorenübersicht der Konferenz.

Regie: etwa fünf Sekunden. Originalvorlage: input/BaselOne26.pptx.
-->

---
layout: bio
hide: true
---

<!--
Ich bin Falk Sippach, Softwarearchitekt, Berater und Trainer bei embarc. Meine
Schwerpunkte sind Architekturberatung und Java-Technologien. Mir ist wichtig,
Sprachfeatures nicht nur syntaktisch anzuschauen, sondern ihren Nutzen für ein
verständliches Modell und für den Betrieb einer Anwendung einzuordnen.

Regie: Diese Folie ist vorerst ausgeblendet. Bei Bedarf hide: true entfernen.
-->

---
layout: community
---

<!--
Auch außerhalb von Konferenzen gibt es viele Möglichkeiten, gemeinsam an Java-Themen
dranzubleiben. Hier stehen die JUG Darmstadt und Cyberland mit ihren Community-Formaten.
Die Links könnt ihr euch später in den Folien anschauen. Jetzt geht es aber um die
Frage, die uns bei Valhalla schon ziemlich lange begleitet.

Regie: höchstens 20 Sekunden. Community-Termin stammt aus der Vorlage; vorab prüfen.
-->

---
layout: opening
---

# Valhalla, when?

<div class="opening-answer"><span v-click class="opening-now">Valhalla, now!</span><span v-click class="opening-soon">(or at least very soon)</span></div>

<figure class="opening-brian">
  <img src="/valhalla/brian-goetz.jpg" alt="Brian Goetz, Java Language Architect bei Oracle" />
  <figcaption>Brian Goetz · Java Language Architect</figcaption>
</figure>

<!--
„Valhalla, when?“ Wer die Entwicklung von Java verfolgt, hat diese Frage vermutlich
schon öfter gehört. Brian Goetz, rechts im Bild, ist als Java Language Architect einer
der prägenden Köpfe dieser Entwicklung. [Klick] Heute können wir endlich sagen:
„Valhalla, now!“ [Klick] Oder zumindest: sehr bald. Ausprobieren lässt sich das Modell
bereits mit Early-Access-Builds. Für JDK 28 ist das Preview vorgesehen. Das heißt noch
nicht, dass Valhalla fertig wäre oder das Feature schon final ist. Schauen wir kurz
darauf, warum dieser Weg so lange war.

Regie: etwa 30 Sekunden. Kein wörtliches Zitat oder persönliche Zusage von Brian.
Fotoquelle: Devoxx-Sprecherprofil von Brian Goetz:
https://www.devoxx.com/speaker/brian-goetz
Direkte Bild-URL:
https://devoxxian-image-thumbnails.s3-eu-west-1.amazonaws.com/profile-1e5ab216-7bb8-4c24-a898-ef1e729e790d.jpg
-->

---
---

# Project Valhalla: ein langer Anlauf

<div class="history">
  <div v-click><strong>2014</strong><section><b>Projektstart</b><span>Klassenabstraktion und primitiveähnliche Effizienz zusammenbringen.</span></section></div>
  <div v-click><strong>2017</strong><section><b>Minimal Value Types</b><span>Früher JVM-Prototyp: identitätslose Daten praktisch erproben.</span></section></div>
  <div v-click><strong>2018–2019</strong><section><b>L-World</b><span>Value-Typen enger in das bestehende Referenzmodell integrieren.</span></section></div>
  <div v-click><strong>2025</strong><section><b>JEP-401-Early-Access</b><span>Value Classes und Objects mit einem vollständigen EA-Build testen.</span></section></div>
  <div v-click><strong>2026</strong><section><b>Integration ins reguläre JDK</b><span>JEP 401 und 539 sind für JDK 28 integriert.</span></section></div>
  <div v-click><strong>März 2027</strong><section><b>JDK 28: Preview geplant</b><span>Erster Schritt – weitere Valhalla-Bausteine folgen separat.</span></section></div>
</div>

<div class="source"><a href="https://openjdk.org/projects/valhalla/legacy">OpenJDK: historische Meilensteine</a> · <a href="https://openjdk.org/projects/valhalla/">Aktueller Stand</a></div>

<!--
[Klick] Valhalla startet 2014 mit dem Ziel, das Klassenmodell besser an moderne
Hardware anzupassen. [Klick] 2017 werden mit Minimal Value Types frühe JVM-Prototypen
erprobt. [Klick] Ab 2018 wird L-World öffentlich vorgestellt; 2019 folgt ein weiterer
Prototyp. Dabei geht es um die Integration von Values in das bestehende Referenzmodell.
Das ist mehr als eine Umbenennung: Kompatibilität, Konstruktion und Laufzeitdarstellung
müssen zusammenpassen. [Klick] 2025 gibt es einen EA-Build, der JEP 401 vollständig
implementiert. [Klick] 2026 werden JEP 401 und der Initialisierungsunterbau aus JEP 539
ins reguläre JDK integriert. [Klick] Für März 2027 ist das Preview in JDK 28 vorgesehen.
Nach über zwölf Jahren kommt also ein erster großer Baustein an – nicht das gesamte Projekt.

Regie: 60–75 Sekunden; ein Klick pro Meilenstein. Datierung nach OpenJDK Legacy
(MVT 2017, L-World-Vortrag Juli 2018/Prototyp 2019), Inside Java Oktober 2025
und OpenJDK-Projektmeldung August 2026. Die geprüfte Nicolai-Fassung vom 19.08.2026
enthält keinen datierten Zeitstrahl; daher keine historische Übersicht ihm zuschreiben.
Quelle für EA: https://inside.java/2025/10/27/try-jep-401-value-classes/
-->

---
---

# Unser Weg durch Valhalla

<TalkAgenda />

<!--
Wir gehen in fünf Schritten vor. Mit Hello Value Class lernen wir Syntax,
Erzeugung und die wichtigsten Regeln kennen. Danach klären wir am Farbmodell,
was Identität für veränderliche Objekte bedeutet und wie sich Value Objects unterscheiden. Im Kernteil
geht es um die Freiheit der JVM: Flattening, Scalarization und ihre Grenzen.
Anschließend schlagen wir die Brücke zu KI und fachlichen Datentypen. Zum Schluss
ordnen wir den JDK-Stand ein und schauen auf den Einstieg und die nächsten Schritte.

Regie: etwa 20 Sekunden; nur diese Gesamtübersicht vollständig vorstellen.
Die Kapiteltrenner später jeweils in einem Satz überleiten.
-->

---
src: ./pages/value-classes.md
---

---
layout: download
---

<!--
Die Folien könnt ihr später als PDF nachlesen. Die Links zu JEPs und vertiefenden
Artikeln findet ihr ebenfalls im Foliensatz. Für das Experimentieren mit den
Beispielen braucht ihr einen passenden JDK-28-Early-Access-Build mit aktiviertem Preview.

Regie: nur kurz zeigen. Download-Seite vor Veröffentlichung auf diesen Vortrag prüfen.
-->

---
layout: default
---

# GitHub-Repo zum Vortrag

<div class="card" style="margin:24px 0 32px">
  <a href="https://github.com/sippsack/java-value-classes" target="_blank" rel="noopener noreferrer">github.com/sippsack/java-value-classes</a>
</div>

- [sli.dev](https://sli.dev/) Folien im Ordner [slides](https://github.com/sippsack/java-value-classes/tree/main/slides)
  - Live unter [https://sippsack.github.io/java-value-classes/](https://sippsack.github.io/java-value-classes/)
- Demos im Ordner [demo/src](https://github.com/sippsack/java-value-classes/tree/main/demo/src)

---
layout: full-image
image: /embarc/s7-1--3x0.png
hide: true
---

<!--
Falls ihr uns noch nicht kennt: embarc beschäftigt sich mit Softwarearchitektur,
Beratung und Weiterbildung. Für diesen Vortrag ist mir vor allem die Verbindung
zwischen gutem Datenmodell und der technischen Ausführung wichtig.

Regie: optionale Rahmenfolie, bei knapper Zeit ohne Pause weitergehen.
-->

---
layout: spicker
hide: true
---

<!--
Zum Nachlesen außerhalb dieses Java-Themas gibt es unsere kostenlosen Architektur-
Spicker. Sie fassen einzelne Architekturthemen kompakt zusammen. Den Download-Link
findet ihr hier; das ist Zusatzmaterial und kein weiterer technischer Teil des Vortrags.

Regie: höchstens zehn Sekunden oder überspringen.
-->

---
layout: spicker
---

<!--
Noch ein kostenloser Lesetipp: Unsere Architektur-Spicker fassen
Softwarearchitektur-Wissen kompakt zusammen. Unter embarc.de/architektur-spicker
findet ihr die Ausgaben zum kostenlosen Download.

Regie: vor der Danke-Folie, großformatiges Bild aus input/spicker-folie.jpg.
Der Link unter „Kostenloser Download“ ist anklickbar.
-->

---
layout: thanks
---

<!--
Vielen Dank! Wenn ihr nur einen Gedanken mitnehmt: Value Classes sind zunächst eine
präzisere semantische Aussage. Ohne benötigte Identität bekommt die JVM mehr Freiheit,
unsere Daten effizient darzustellen. Ob daraus ein Vorteil entsteht, prüfen wir am
konkreten Workload. Ich freue mich auf eure Fragen – zu den Beispielen, zu den
Optimierungsgrenzen oder zu möglichen Einsatzstellen in euren Anwendungen.
Über den QR-Code könnt ihr mir Feedback zum Vortrag geben. Vielen Dank dafür!

Regie: Feedback-QR-Code mit Pfeil auf der Danke-/Fragenfolie.
Ziel etwa 38 Minuten Vortrag insgesamt, zwei Minuten Puffer im 40-Minuten-Slot.
-->
