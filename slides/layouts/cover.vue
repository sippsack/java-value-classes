<script setup lang="ts">
defineProps<{ image?: string }>()
</script>

<template>
  <div class="slidev-layout embarc-dark cover">
    <div class="oval"></div>
    <img v-if="image" class="oval-img" :src="image" alt="" />
    <div class="title-box"><slot /></div>
    <div class="author-box"><slot name="author" /></div>
    <div class="date-box"><slot name="date" /></div>
    <div class="strips"><i /><i /><i /><i /></div>
    <img class="logo" src="/embarc/embarc-white.png" alt="embarc" />
  </div>
</template>

<style>
.embarc-dark {
  background: linear-gradient(225deg, #a6a6a6 0%, #595959 59%, #404040 99%) !important;
  color: #fff;
}
.embarc-dark .strips {
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 17px;
}
.embarc-dark .strips i {
  position: absolute;
  top: 0;
  height: 100%;
  width: 246px;
}
.embarc-dark .strips i:nth-child(1) { left: 0; background: #e17a7c; }
.embarc-dark .strips i:nth-child(2) { left: 242px; background: #98d6f5; }
.embarc-dark .strips i:nth-child(3) { left: 484px; background: #f8eaae; }
.embarc-dark .strips i:nth-child(4) { left: 730px; background: #b6d8d5; width: 230px; }
.embarc-dark .logo {
  position: absolute;
  left: 780px;
  top: 442px;
  width: 161px;
}

.cover .oval {
  position: absolute;
  left: 737px;
  top: -240px;
  width: 469px;
  height: 469px;
  border-radius: 50%;
  background: #fff;
}
.cover .oval-img {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 116px;
}
.cover .title-box {
  position: absolute;
  left: 68px;
  top: 40px;
  width: 700px;
  height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.cover .title-box h1 {
  margin: 0;
  font-size: 54px;
  font-weight: 700;
  line-height: 0.98;
  color: #fff;
}
.cover .title-box p {
  margin: 12px 0 0;
  font-size: 32px;
  font-weight: 500;
  color: #fff;
}
.cover .author-box {
  position: absolute;
  left: 68px;
  top: 326px;
  font-size: 30px;
}
.cover .author-box p {
  margin: 0;
  line-height: 1.15;
}
.cover .author-box .sub {
  font-size: 22px;
  color: #e8e8e8;
}
.cover .date-box {
  position: absolute;
  left: 68px;
  top: 462px;
  font-size: 20px;
  color: #f2f2f2;
}
.cover .date-box p {
  margin: 0;
}
.cover .conference-line {
  display: flex;
  align-items: center;
  gap: 20px;
}
.cover .conference-line img {
  width: 72px;
  height: 72px;
  object-fit: contain;
}
.cover .date-box:has(.conference-line) {
  top: 430px;
}
</style>
