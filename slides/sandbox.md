---
theme: none
layout: default
title: Lokale Java-Sandbox
canvasWidth: 960
aspectRatio: 16/9
fonts:
  sans: Rajdhani
  mono: Fira Code
  provider: none
sidebar: false
---

# Value Classes live ausprobieren

<JavaSandbox :checkpoints="[
  'class Rgb { final int red; Rgb(int red) { this.red = red; } }\nvar a = new Rgb(255);\nvar b = new Rgb(255);\nSystem.out.println(a == b);',
  'value class Rgb { final int red; Rgb(int red) { this.red = red; } }\nvar a = new Rgb(255);\nvar b = new Rgb(255);\nSystem.out.println(a == b);',
  'System.out.println(System.getProperty(&quot;java.version&quot;));'
]" />

<!--
Start mit npm run sandbox im Verzeichnis slides/.
Die JVM läuft lokal, nicht im Browser. JAVA_HOME wählt das JDK.
Im statischen Build läuft Run über den konfigurierten Proxy bei dev.java.
Dabei wird Code an den Anbieter gesendet; dessen JDK unterstützt Valhalla nicht garantiert.
Zuerst mit value ausführen, dann value entfernen: true wird zu false.
Jeder Run startet ohne Zustand aus dem vorherigen Run.
-->
