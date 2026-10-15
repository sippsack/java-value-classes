<template>
  <div class="slidev-layout opening">
    <img class="opening-helmet" src="/valhalla/viking-helmet.svg" alt="" />
    <slot />
  </div>
</template>

<style>
.opening {
  background: #343434;
  color: #fff;
  padding: 110px 68px 50px;
}
.opening .opening-helmet {
  position: absolute;
  top: 35px;
  right: 40px;
  width: 100px;
}
.opening h1 {
  font-size: 76px;
  font-weight: 700;
  margin: 0 0 24px;
}
.opening-answer {
  display: flex;
  align-items: baseline;
  gap: 16px;
  white-space: nowrap;
}
.opening-now {
  font-size: 64px;
  font-weight: 700;
  color: var(--yellow);
}
.opening-soon {
  font-size: 26px;
  color: var(--sky);
}
.opening .slidev-vclick-target {
  transition: opacity 450ms ease, transform 450ms ease;
}
.opening .slidev-vclick-hidden {
  transform: translateY(16px);
}
.opening-brian {
  position: absolute;
  right: 40px;
  bottom: 26px;
  width: 245px;
  margin: 0;
}
.opening-brian img {
  display: block;
  width: 245px;
  height: 138px;
  object-fit: cover;
  border-radius: 8px;
}
.opening-brian figcaption {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.2;
  color: #ddd;
}
.opening-brian a {
  color: var(--sky);
}
</style>
