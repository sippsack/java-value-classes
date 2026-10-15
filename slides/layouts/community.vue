<template>
  <div class="slidev-layout embarc community">
    <h1>Teil der Java Community</h1>
    <div v-click="1">
      <img class="abs" src="/embarc/s4-1-105x140.png" style="left:105px;top:172px;width:274px" alt="JUG Darmstadt" />
      <div class="abs note" style="left:300px;top:124px">Nächster Termin<br />am <b>29.10.2026</b></div>
      <div class="abs note" style="left:105px;top:489px;width:274px">
        <a href="https://www.jug-da.de/" target="_blank" rel="noopener noreferrer">jug-da.de</a>
      </div>
      <svg class="abs" style="left:0;top:0;width:960px;height:540px;pointer-events:none" viewBox="0 0 960 540" fill="none" stroke="#eb3c44" stroke-width="3" stroke-linecap="round">
        <g transform="translate(0 32)">
          <path d="M365 142 C 360 158, 350 169, 332 174" />
          <path d="M336 159 L332 174 L347 181" stroke-linejoin="round" />
        </g>
      </svg>
    </div>
    <div v-click="2">
      <img class="abs" src="/embarc/s4-2-445x156.png" style="left:445px;top:188px;width:479px" alt="Cyberland" />
      <div class="abs note" style="left:674px;top:116px">monatliche Opensource<br />Code Camps</div>
      <div class="abs note" style="left:445px;top:460px;width:479px">
        <a href="https://cyberland.ijug.eu/" target="_blank" rel="noopener noreferrer">cyberland.ijug.eu</a>
      </div>
      <svg class="abs" style="left:0;top:0;width:960px;height:540px;pointer-events:none" viewBox="0 0 960 540" fill="none" stroke="#eb3c44" stroke-width="3" stroke-linecap="round">
        <path d="M845 175 C 845 187, 815 207, 800 215" />
        <path d="M800 215 l 4 -14 M800 215 l 15 2" />
      </svg>
    </div>
  </div>
</template>

<style>
.community .note {
  font-size: 22px;
  line-height: 1.1;
  text-align: center;
}
</style>
