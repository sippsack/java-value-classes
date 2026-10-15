<template>
  <div class="slidev-layout embarc thanks">
    <div class="abs sky-oval"></div>
    <h1>Vielen Dank.</h1>
    <div class="abs ask"><b>Ich freue mich auf Eure Fragen!</b></div>
    <div v-for="(c, i) in contacts" :key="c.text" class="abs row" :style="{ top: 232 + i * 48.5 + 'px' }">
      <img :src="c.icon" alt="" />
      <span>{{ c.text }}</span>
    </div>
    <img class="abs" src="/embarc/s10-0-68x452.png" style="left:68px;top:452px;width:238px" alt="embarc" />
    <img class="abs" src="/embarc/s10-10-564x101.png" style="left:720px;top:160px;width:225px" alt="Falk Sippach" />
    <div class="abs feedback">
      <div class="feedback-label">
        <b>Feedback</b>
        <svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
          <path d="M15 3v26M5 19l10 10 10-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <img src="/baselone/feedback-code.png" alt="QR-Code zum Feedback für diesen Vortrag" />
    </div>
  </div>
</template>

<script setup lang="ts">
const contacts = [
  { icon: '/embarc/s10-7-68x235.png', text: 'falk.sippach@embarc.de' },
  { icon: '/embarc/s10-8-68x284.png', text: 'linkedin.com/in/falk-sippach' },
  { icon: '/embarc/s10-11-68x333.png', text: '@sippsack' },
  { icon: '/embarc/s10-4-68x383.png', text: '@sippsack@ijug.social' },
]
</script>

<style>
.thanks .sky-oval {
  left: 518px; top: 190px; width: 491px; height: 491px;
  border-radius: 50%; background: #98d6f5;
}
.thanks .ask { left: 59px; top: 150px; font-size: 30px; }
.thanks .row { left: 68px; height: 46px; display: flex; align-items: center; gap: 16px; font-size: 28px; }
.thanks .row img { width: 33px; height: 33px; }
.thanks .feedback { left: 480px; top: 211px; width: 225px; }
.thanks .feedback-label { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 10px; font-size: 30px; }
.thanks .feedback > img { display: block; width: 225px; height: 225px; }
</style>
