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

<JavaSandbox />

<!--
Start mit npm run sandbox im Verzeichnis slides/.
Die JVM läuft lokal, nicht im Browser. JAVA_HOME wählt das JDK.
Im statischen Build läuft Run über den konfigurierten Proxy bei dev.java.
Dabei wird Code an den Anbieter gesendet; dessen JDK unterstützt Valhalla nicht garantiert.
Zuerst mit value ausführen, dann value entfernen: true wird zu false.
Jeder Run startet ohne Zustand aus dem vorherigen Run.
-->
