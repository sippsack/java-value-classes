<script setup lang="ts">
import { ref } from 'vue'

const initialCode = `value class Rgb {
    final int red;
    Rgb(int red) { this.red = red; }
}

var a = new Rgb(255);
var b = new Rgb(255);
System.out.println("Gleiche Werte: " + (a == b));
`
const code = ref(initialCode)
const output = ref(import.meta.env.DEV
  ? 'Bereit. Run startet eine frische lokale JShell mit Preview-Features.'
  : 'Externer Modus. Run sendet den Code über den konfigurierten Proxy an dev.java.')
const runtime = ref('')
const running = ref(false)
const failed = ref(false)
const available = import.meta.env.DEV
const external = ref(!available)
const playgroundUrl = 'https://dev.java/playground/'
const proxyUrl = (import.meta.env.VITE_JAVA_SANDBOX_PROXY_URL || '').trim()

function reset() {
  code.value = initialCode
  output.value = 'Beispiel zurückgesetzt.'
  failed.value = false
}

async function run() {
  if (running.value) return
  if (external.value && !proxyUrl) {
    failed.value = true
    output.value = 'Kein dev.java-Proxy konfiguriert. VITE_JAVA_SANDBOX_PROXY_URL beim Build setzen.'
    return
  }
  running.value = true
  failed.value = false
  output.value = external.value ? 'Code wird über den Proxy bei dev.java ausgeführt …' : 'Lokale JVM startet …'
  try {
    const response = await fetch(external.value ? proxyUrl : '/__java-sandbox/run', {
      method: 'POST',
      headers: external.value
        ? { 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json', 'X-Java-Sandbox': '1' },
      body: JSON.stringify({ code: code.value }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error(external.value ? 'Der Proxy liefert keine JSON-Antwort. Konfiguration prüfen.' : 'Java-Brücke nicht erreichbar. Bitte mit npm run sandbox starten.')
    }
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`)
    runtime.value = result.runtime
    output.value = result.output || '(Keine Ausgabe)'
    failed.value = !result.ok
  }
  catch (error) {
    failed.value = true
    output.value = error instanceof Error ? error.message : String(error)
  }
  finally {
    running.value = false
  }
}
</script>

<template>
  <div class="java-sandbox" @keydown.stop @keyup.stop @click.stop>
    <div class="sandbox-toolbar">
      <button :disabled="running || (external && !proxyUrl)" @click="run">▶ Run</button>
      <button :disabled="running" @click="reset">Zurücksetzen</button>
      <button v-if="available" :disabled="running" @click="external = !external; runtime = ''">
        {{ external ? 'Zur lokalen JVM' : 'dev.java-Fallback' }}
      </button>
      <span>{{ external ? 'dev.java · Externes JDK' : runtime ? `Lokales JDK ${runtime} · Preview` : '.env.local → JAVA_HOME → PATH' }}</span>
    </div>
    <div class="sandbox-panes">
      <textarea
        v-model="code"
        aria-label="Java-Code"
        spellcheck="false"
        autocapitalize="off"
        :disabled="running"
        @keydown.ctrl.enter.prevent="run"
        @keydown.meta.enter.prevent="run"
      />
      <pre role="status" aria-live="polite" :class="{ failed }">{{ output }}</pre>
    </div>
    <p v-if="external" class="sandbox-hint">
      Run sendet deinen Code über den Proxy an Oracle/dev.java. Internet erforderlich, Valhalla nicht garantiert.
      <template v-if="!proxyUrl">Noch kein Proxy konfiguriert.</template>
      <a :href="playgroundUrl" target="_blank" rel="noopener noreferrer">dev.java öffnen ↗</a>
    </p>
    <p v-else class="sandbox-hint">
      Strg/⌘ + Enter: Run · Entferne „value“ und vergleiche erneut. Nur eigenen, vertrauenswürdigen Code ausführen.
    </p>
  </div>
</template>

<style scoped>
.java-sandbox { font-size: 17px; }
.sandbox-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.sandbox-toolbar button { border: 1px solid #999; border-radius: 4px; padding: 5px 14px; }
.sandbox-toolbar button:disabled { opacity: 0.5; }
.sandbox-toolbar span { margin-left: auto; font-size: 15px; }
.sandbox-panes { display: grid; grid-template-columns: 3fr 2fr; gap: 14px; }
.sandbox-panes textarea, .sandbox-panes pre {
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  margin: 0;
  padding: 14px;
  border: 1px solid #bbb;
  border-radius: 6px;
  font: 16px/1.5 'Fira Code', monospace;
  tab-size: 4;
}
.sandbox-panes textarea { background: #f8f8f8; color: #222; resize: none; }
.sandbox-panes pre { overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; background: #18212b; color: #e7edf4; }
.sandbox-panes pre.failed { border: 2px solid #cc3434; color: #ffb7b7; }
.sandbox-hint { font-size: 15px; margin-top: 10px; }
</style>
