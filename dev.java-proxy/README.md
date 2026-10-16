# dev.java-Proxy auf Cloudflare Workers

Serverless-HTTP-Proxy für die Java-Sandbox in den GitHub-Pages-Folien.
Der Worker hat kein JDK: Er leitet Code an feste dev.java-/Java-Almanac-Endpunkte weiter
und liefert dieselbe JSON-Antwortform wie die lokale Java-Brücke.
Die Provider-Anbindung wird mit `slides/sandbox/external.mjs` und
`slides/sandbox/devjava.mjs` geteilt. `POST /run` akzeptiert `code`, optional
`provider` (eine der beiden unterstützten Seiten-URLs) und `preview` (Boolean).
Ohne Anbieter bleibt dev.java der Standard für ältere Clients. dev.java erzwingt
Preview; `preview: false` liefert dort explizit HTTP 400. Java Almanac 28 unterstützt
beide Einstellungen und führt in `main` eingebettete Snippets aus.

Produktionsendpunkt:
**https://java-value-classes-devjava-proxy.falk-2c1.workers.dev/run**

## Registrierung und Deployment

1. Ein kostenloses Konto auf https://dash.cloudflare.com/sign-up anlegen und die
   E-Mail-Adresse bestätigen. Unter Workers & Pages den Workers-Free-Tarif
   verwenden und gegebenenfalls eine `workers.dev`-Subdomain einrichten.
   Keine eigene Domain und kein DNS-Umzug erforderlich.
2. Mit Node.js ab 22.12 im Repository ausführen:

   ```sh
   cd dev.java-proxy
   npm ci
   npm run login
   ```

   Wrangler öffnet eine OAuth-Anmeldung im Browser. Zugriff dort bestätigen.
   Hierfür ist kein manuell angelegter API-Key nötig. Zugangsdaten niemals
   ins Repository oder in einen Chat kopieren.
3. Prüfen und deployen:

   ```sh
   npm test
   npm run check
   npm run deploy
   ```

   Bei mehreren Cloudflare-Konten das gewünschte Konto über
   `CLOUDFLARE_ACCOUNT_ID` auswählen. Wrangler gibt die öffentliche
   `https://java-value-classes-devjava-proxy.<subdomain>.workers.dev`-URL aus.
4. Die URL mit `/run` als GitHub-Repository-Variable setzen und neu deployen:

   ```sh
   gh variable set JAVA_SANDBOX_PROXY_URL \
     --repo sippsack/java-value-classes \
     --body 'https://java-value-classes-devjava-proxy.<subdomain>.workers.dev/run'
   gh workflow run slides-experimental-pages.yml \
     --repo sippsack/java-value-classes --ref experimental/java-sandbox
   ```

   Die Variable ist nicht geheim. Sie wird beim Pages-Build als
   `VITE_JAVA_SANDBOX_PROXY_URL` in den Client eingebettet.

## Alternative: API-Token für automatisierte Deployments

Unter Cloudflare **My Profile → API Tokens → Create Token** die Vorlage
**Edit Cloudflare Workers** verwenden und auf das gewünschte Konto begrenzen.
Für dieses reine `workers.dev`-Deployment ist kein Zugriff auf DNS-Zonen nötig.
Den Token in der lokalen Prozessumgebung als `CLOUDFLARE_API_TOKEN` bereitstellen,
die Account-ID als `CLOUDFLARE_ACCOUNT_ID`. In CI den Token als Secret hinterlegen,
nicht als öffentliche Variable. Niemals den Global API Key verwenden.
Ein automatischer Worker-Deploy-Workflow ist nicht erforderlich; Wrangler kann
auch lokal deployen.

## Optionale Git-Anbindung in Cloudflare

Bei Workers Builds das Repository und den Branch `experimental/java-sandbox`
wählen. Die Worker-Dateien müssen zuvor nach GitHub gepusht worden sein.
Als Root-Verzeichnis das Repository-Hauptverzeichnis beibehalten, da der Worker
auch die gemeinsame Provider-Anbindung unter `slides/sandbox/` importiert.

- Build command: `npm --prefix dev.java-proxy ci`
- Deploy command: `npm --prefix dev.java-proxy run deploy`
- Worker name: `java-value-classes-devjava-proxy`

Ein bloßes `npx wrangler deploy` im Repository-Hauptverzeichnis findet die
Konfiguration nicht und meldet fehlende statische Dateien. Alternativ zuerst in
`dev.java-proxy` wechseln. Wenn ein beim Onboarding ausgegebener Dashboard-Link
nicht funktioniert, über die Dashboard-Startseite und Workers & Pages navigieren.

## Grenzen und Betrieb

- `ALLOWED_ORIGINS` in `wrangler.jsonc` erlaubt ausschließlich
  `https://www.sippsack.de` und `https://sippsack.github.io`.
  Andere Origins müssen explizit ergänzt und neu deployed werden.
- Nur `POST /run`, maximal 32 KiB JSON, 20 Sekunden Provider-Timeout und maximal
  256 KiB Provider-Antwort. Code wird nur beim Run-Klick übertragen.
- Cloudflare-Rate-Limit-Bindings: zehn Requests pro Minute und IP sowie insgesamt
  60 pro Minute, jeweils pro Cloudflare-Standort. Die Limits sind approximativ,
  kein globaler harter Kostenschutz. Die Namespace-IDs 40101 und 40102 im Konto
  für diesen Worker reservieren oder auf unbenutzte IDs ändern.
- CORS ist keine Authentifizierung. Fremde HTTP-Clients können Origins fälschen.
  Für stärkeren öffentlichen Missbrauchsschutz sind zusätzliche Maßnahmen wie
  Turnstile oder eine echte Zugangskontrolle nötig. Keine geheimen Schlüssel in
  die öffentlich ausgelieferten Folien schreiben.
- Der Worker loggt weder Code noch die Provider-Antwort. Cloudflare und Oracle
  verarbeiten den übertragenen Code. Keine vertraulichen Daten ausführen.
- Workers Free hat derzeit 100.000 Requests pro Tag und 10 ms CPU-Zeit pro Aufruf;
  Netzwerkwartezeit zählt nicht zur CPU-Zeit. Im Free-Tarif bleiben und Kontingente
  im Dashboard beobachten; keine unbegrenzte Verfügbarkeit zugesichert.
- Die dev.java-Schnittstelle ist kein zugesicherter öffentlicher API-Vertrag.
  Nutzungserlaubnis und Bedingungen vor dauerhafter öffentlicher Freigabe klären.
  Valhalla-Unterstützung und JDK-Version bestimmt Oracle/dev.java.

## Lokale Entwicklung

`npm run dev` startet Workers lokal. Für Browserzugriffe lokaler Folien nur in
einer lokalen Konfiguration die passende Origin ergänzen. Die Produktion sollte
weiter auf die beiden veröffentlichten Origins beschränkt bleiben.
