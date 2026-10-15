<script setup lang="ts">
const sponsors = [
  'Helvetia', 'Karakun', 'Kanton Basel-Stadt', 'ERNI',
  'Innofuse', 'BaselTech', 'Basel', 'Java User Group Switzerland',
  'BLKB', 'Optravis', 'cyon', 'CS2',
  'CSS', 'iRIX', 'swiss made software', 'ICT Scouts',
  'SwissDevJobs',
]
</script>

<template>
  <div class="slidev-layout sponsors">
    <img class="sponsor-skyline" src="/baselone/sponsor-assets/image1.png" alt="" />
    <div class="sponsor-grid">
      <div v-for="(name, index) in sponsors" :key="name" class="sponsor-box">
        <img :src="`/baselone/sponsor-assets/logo-${index + 1}.png`" :alt="name" />
      </div>
    </div>
    <footer><span>#BaselOne26</span><span>baselone.ch</span></footer>
  </div>
</template>

<style>
.slidev-layout.sponsors {
  background: #9b1445;
}
.sponsor-skyline {
  position: absolute;
  inset: auto 0 0;
  width: 100%;
  filter: brightness(0) invert(0.2);
}
.sponsor-grid {
  position: absolute;
  inset: 25px 60px auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 72px;
  gap: 20px 40px;
}
.sponsor-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 11px 14px;
  background: white;
  overflow: hidden;
}
.sponsor-box img {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  object-fit: contain;
}
.sponsors footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #333;
  color: #b01b50;
  font-size: 25px;
}
</style>
