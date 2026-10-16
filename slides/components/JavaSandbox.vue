<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { parseProviders } from '../sandbox/providers'

const defaultCode = `value class Rgb {
    final int red;
    Rgb(int red) { this.red = red; }
}

var a = new Rgb(255);
var b = new Rgb(255);
System.out.println("Gleiche Werte: " + (a == b));
`
const props = withDefaults(defineProps<{ initialCode?: string; checkpoints?: string[] }>(), {
  initialCode: defaultCode,
  checkpoints: () => [],
})
const code = ref(props.initialCode)
const checkpoint = ref(0)
const output = ref('Bereit. Ziel wählen und Run drücken.')
const runtime = ref('')
const running = ref(false)
const failed = ref(false)
const loading = ref(import.meta.env.DEV)
const preview = ref(true)
const jdks = ref<{ home: string; version: string }[]>([])
const providers = parseProviders(import.meta.env.VITE_JAVA_SANDBOX_PROVIDERS)
const target = ref(import.meta.env.DEV ? '' : providers[0]?.url || '')
const provider = computed(() => providers.find(entry => entry.url === target.value))
const external = computed(() => Boolean(provider.value))
const proxyUrl = computed(() => import.meta.env.DEV
  ? '/__java-sandbox/external'
  : provider.value?.proxyUrl || import.meta.env.VITE_JAVA_SANDBOX_PROXY_URL || '')
const fixedPreview = computed(() => provider.value?.url === 'https://dev.java/playground/')
const canRun = computed(() => !loading.value && !running.value && Boolean(target.value)
  && (!external.value || Boolean(proxyUrl.value)))
const localHeaders = { 'Content-Type': 'application/json', 'X-Java-Sandbox': '1' }

watch(target, () => {
  runtime.value = ''
  if (fixedPreview.value) preview.value = true
})

function checkout(index: number) {
  checkpoint.value = index
  code.value = index === 0 ? props.initialCode : props.checkpoints[index - 1]
  output.value = index === 0 ? 'Ausgangscode wiederhergestellt.' : `Zwischenstand ${index} geladen.`
  failed.value = false
}

onMounted(async () => {
  if (!import.meta.env.DEV) return
  try {
    const response = await fetch('/__java-sandbox/jdks', {
      method: 'POST', headers: localHeaders, body: '{}',
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`)
    jdks.value = data.jdks
    target.value = data.defaultHome || providers[0]?.url || ''
    if (!jdks.value.length) output.value = 'Keine geeigneten lokalen JDKs gefunden. Externes Ziel wählen.'
  }
  catch (error) {
    failed.value = true
    output.value = `JDK-Erkennung fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`
    target.value = providers[0]?.url || ''
  }
  finally { loading.value = false }
})

async function run() {
  if (!canRun.value) return
  running.value = true
  failed.value = false
  output.value = external.value ? `Ausführung bei ${provider.value?.label} …` : 'Lokale JVM startet …'
  try {
    const response = await fetch(external.value ? proxyUrl.value : '/__java-sandbox/run', {
      method: 'POST',
      headers: external.value && !import.meta.env.DEV ? { 'Content-Type': 'application/json' } : localHeaders,
      body: JSON.stringify({
        code: code.value, preview: preview.value,
        ...(external.value ? { provider: provider.value?.url } : { jdk: target.value }),
      }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Die Ausführungsbrücke liefert keine JSON-Antwort. Konfiguration prüfen.')
    }
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`)
    runtime.value = result.runtime
    output.value = result.output || '(Keine Ausgabe)'
    failed.value = !result.ok
  }
  catch (error) {
    failed.value = true
    output.value = error instanceof TypeError
      ? 'Ausführungsdienst nicht erreichbar. Proxy-URL, Server und Origin-Freigabe (CORS) prüfen.'
      : error instanceof Error ? error.message : String(error)
  }
  finally { running.value = false }
}
</script>

<template>
  <div class="java-sandbox" @keydown.stop @keyup.stop @click.stop>
    <div class="sandbox-toolbar">
      <button class="sandbox-run" :disabled="!canRun" @click="run">▶ Run</button>
      <div class="sandbox-checkpoints" role="group" aria-label="Vorbereitete Zwischenstände">
        <button
          v-for="index in checkpoints.length + 1"
          :key="index"
          :disabled="running"
          :aria-pressed="checkpoint === index - 1"
          :title="index === 1 ? '0: Ausgangscode zurücksetzen' : `Zwischenstand ${index - 1} laden`"
          @click="checkout(index - 1)"
        >{{ index - 1 }}</button>
      </div>
      <select v-model="target" aria-label="Java-Ausführungsziel" :disabled="loading || running">
        <option v-if="loading" value="">JDKs werden erkannt …</option>
        <optgroup v-if="jdks.length" label="Lokale JDKs">
          <option v-for="jdk in jdks" :key="jdk.home" :value="jdk.home">JDK {{ jdk.version }} · {{ jdk.home }}</option>
        </optgroup>
        <optgroup v-if="providers.length" label="Externe Sandboxen">
          <option v-for="entry in providers" :key="entry.url" :value="entry.url">{{ entry.label }}</option>
        </optgroup>
      </select>
      <label :title="fixedPreview ? 'dev.java aktiviert Preview fest.' : 'Preview-Features aktivieren'">
        <input v-model="preview" type="checkbox" :disabled="running || fixedPreview" />
        --enable-preview
      </label>
    </div>
    <div class="sandbox-panes">
      <textarea
        v-model="code" aria-label="Java-Code" spellcheck="false" autocapitalize="off"
        :disabled="running"
        @keydown.ctrl.enter.prevent="run"
        @keydown.meta.enter.prevent="run"
      />
      <pre role="status" aria-live="polite" :class="{ failed }">{{ output }}</pre>
    </div>
    <p class="sandbox-hint">
      <template v-if="external">
        Run sendet Code an {{ provider?.label }} über den Proxy.
        <template v-if="!proxyUrl">Kein Proxy konfiguriert.</template>
        <template v-if="fixedPreview">Preview beim Anbieter fest aktiviert.</template>
        <a :href="provider?.url" target="_blank" rel="noopener noreferrer">Anbieter öffnen ↗</a>
      </template>
      <template v-else>Strg/⌘ + Enter: Run · Nur vertrauenswürdigen Code ausführen.</template>
      <span v-if="runtime"> · {{ runtime }}</span>
    </p>
  </div>
</template>

<style scoped>
.java-sandbox { font-size: 17px; }
.sandbox-toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.sandbox-toolbar button { border: 1px solid #999; border-radius: 4px; padding: 3px 8px; font-size: 14px; }
.sandbox-toolbar button:disabled { opacity: 0.5; }
.sandbox-checkpoints { display: flex; gap: 3px; }
.sandbox-checkpoints button[aria-pressed="true"] { background: #18212b; color: white; }
.sandbox-toolbar select { flex: 1; min-width: 0; max-width: 460px; font-size: 14px; border: 1px solid #999; border-radius: 4px; padding: 3px; }
.sandbox-toolbar label { display: flex; align-items: center; gap: 4px; white-space: nowrap; font-size: 14px; }
.sandbox-panes { display: grid; grid-template-columns: 3fr 2fr; gap: 14px; }
.sandbox-panes textarea, .sandbox-panes pre {
  box-sizing: border-box; width: 100%; height: 300px; margin: 0; padding: 14px;
  border: 1px solid #bbb; border-radius: 6px; font: 16px/1.5 'Fira Code', monospace; tab-size: 4;
}
.sandbox-panes textarea { background: #f8f8f8; color: #222; resize: none; }
.sandbox-panes pre { overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; background: #18212b; color: #e7edf4; }
.sandbox-panes pre.failed { border: 2px solid #cc3434; color: #ffb7b7; }
.sandbox-hint { font-size: 14px; margin-top: 10px; }
</style>
