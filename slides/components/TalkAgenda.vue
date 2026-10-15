<script setup lang="ts">
withDefaults(defineProps<{ current?: number }>(), { current: 0 })

const chapters = [
  { title: 'Hello Value Class', detail: 'Syntax, Erzeugung und Klassenregeln' },
  { title: 'Werte statt Identität', detail: 'Veränderbarkeit, Identität und Gleichheit' },
  { title: 'Optimierungen der JVM', detail: 'Flattening, Scalarization und ihre Grenzen' },
  { title: 'Nutzen für KI und Fachmodelle', detail: 'Numerische Daten und präzise Typen' },
  { title: 'Status und Ausblick', detail: 'JEPs, Einstieg und nächste Schritte' },
]
</script>

<template>
  <div class="talk-agenda">
    <div class="agenda-chapters">
      <div
        v-for="(chapter, index) in chapters"
        :key="chapter.title"
        class="agenda-chapter"
        :class="{ active: current === index + 1, dimmed: current > 0 && current !== index + 1 }"
        :aria-current="current === index + 1 ? 'step' : undefined"
      >
        <ChapterIcon :chapter="index === 0 ? 2 : index === 1 ? 1 : index + 1" />
        <div>
          <strong>{{ index + 1 }} · {{ chapter.title }}</strong>
          <span>{{ chapter.detail }}</span>
        </div>
      </div>
    </div>
    <div class="agenda-illustration">
      <svg viewBox="0 0 380 370" role="img" :aria-label="`Duke ohne Füße mit ${['Schutzschild', 'Farbpalette', 'Speicherbaustein', 'KI-Chip', 'Wegweiser'][(current || 1) - 1]}`">
        <rect x="153" y="5" width="220" height="220" rx="26" fill="#f4f4f4" />
        <path d="M162 70h-24c-27 0-27 60 0 60h24" fill="none" stroke="#343434" stroke-width="9" />
        <ChapterIcon :chapter="!current || current === 1 ? 2 : current === 2 ? 1 : current" x="163" y="15" width="200" height="200" />
        <image href="/valhalla/duke.png" x="0" y="38" width="180" height="324" style="mix-blend-mode: multiply" />
      </svg>
      <div>{{ current ? `Kapitel ${current} von ${chapters.length}` : 'Unser Weg durch Valhalla' }}</div>
    </div>
  </div>
</template>

<style>
.talk-agenda {
  display: grid;
  grid-template-columns: 510px 326px;
  gap: 10px;
  align-items: center;
}
.agenda-chapters {
  display: grid;
  gap: 7px;
}
.agenda-chapter {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 7px 12px;
  border-left: 5px solid transparent;
  border-radius: 6px;
}
.agenda-chapter > svg {
  flex: 0 0 45px;
  width: 45px;
  height: 45px;
}
.agenda-chapter strong,
.agenda-chapter span {
  display: block;
}
.agenda-chapter strong {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
}
.agenda-chapter span {
  margin-top: 3px;
  font-size: 17px;
  line-height: 1.15;
}
.agenda-chapter.active {
  background: var(--cream);
  border-left-color: var(--red);
}
.agenda-chapter.dimmed {
  opacity: 0.42;
}
.agenda-illustration > svg {
  display: block;
  width: 326px;
  height: 318px;
}
.agenda-illustration > div {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--muted);
}
</style>
