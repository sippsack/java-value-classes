<script setup lang="ts">
defineProps<{ kind: 'twins' | 'references' }>()
</script>

<template>
  <svg v-if="kind === 'twins'" class="identity-twins" viewBox="0 0 360 245" role="img" aria-label="Zwei gleich aussehende Personen, Anna und Bea, mit verschiedenen Identitäten">
    <defs>
      <g id="identity-person">
        <path d="M-49 119v-45c0-44 98-44 98 0v45" fill="#edafad" stroke="#343434" stroke-width="5" />
        <circle cy="12" r="37" fill="#f8eaae" stroke="#343434" stroke-width="5" />
        <path d="M-36 2c0-48 72-48 72 0-18-2-35-10-45-21C-16-7-26 0-36 2Z" fill="#343434" />
        <circle cx="-12" cy="14" r="3" fill="#343434" />
        <circle cx="12" cy="14" r="3" fill="#343434" />
        <path d="M-10 29q10 8 20 0" fill="none" stroke="#343434" stroke-width="3" />
      </g>
    </defs>
    <use href="#identity-person" x="89" y="54" />
    <use href="#identity-person" x="271" y="54" />
    <g text-anchor="middle" font-family="Rajdhani, sans-serif" font-size="27" font-weight="700" fill="#343434">
      <text x="89" y="216">Anna</text>
      <text x="271" y="216">Bea</text>
      <text x="180" y="103" style="font-size: 42px">≠</text>
    </g>
  </svg>
  <svg v-else class="identity-references" viewBox="0 0 840 205" role="img" aria-label="c1 und c2 referenzieren dasselbe Rgb-Objekt A; c3 referenziert Objekt B mit gleichen Kanalwerten">
    <defs>
      <marker id="identity-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0 0 8 4 0 8Z" fill="#343434" />
      </marker>
    </defs>
    <g fill="#f4f4f4" stroke="#343434" stroke-width="2">
      <rect x="2" y="38" width="200" height="51" rx="5" />
      <rect x="2" y="107" width="200" height="51" rx="5" />
      <rect x="433" y="79" width="210" height="51" rx="5" />
      <rect x="242" y="38" width="165" height="132" rx="8" fill="#edafad" />
      <rect x="671" y="38" width="165" height="132" rx="8" fill="#b6d8d5" />
      <path d="M242 83h165M671 83h165" />
    </g>
    <g stroke="#343434" stroke-width="3" fill="none" marker-end="url(#identity-arrow)">
      <path d="M202 63h35" />
      <path d="M202 132h35" />
      <path d="M643 104h23" />
    </g>
    <g font-family="Rajdhani, sans-serif" text-anchor="middle" fill="#343434" font-size="24">
      <text x="102" y="71">c1 = new Rgb(…)</text>
      <text x="102" y="140">c2 = c1</text>
      <text x="538" y="112">c3 = new Rgb(…)</text>
      <text x="324" y="23" font-weight="700">Objekt A</text>
      <text x="753" y="23" font-weight="700">Objekt B</text>
      <text x="324" y="68">Header</text>
      <text x="753" y="68">Header</text>
      <text x="324" y="119">r = 255</text>
      <text x="753" y="119">r = 255</text>
      <text x="324" y="151">g = 0 · b = 0</text>
      <text x="753" y="151">g = 0 · b = 0</text>
      <text x="102" y="192" style="font-size: 19px">Referenzvariablen</text>
      <text x="538" y="192" style="font-size: 19px">Referenzvariable</text>
    </g>
  </svg>
</template>

<style scoped>
.identity-twins text {
  font-size: 27px;
}
.identity-references text {
  font-size: 24px;
}
</style>
