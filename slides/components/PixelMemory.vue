<template>
  <div class="pixel-memory">
    <section>
      <h2>Identity Objects: vier separate Objekte</h2>
      <svg viewBox="0 0 470 220" role="img" aria-label="Pixel mit Referenzen auf Position und ColorWithAlpha; ColorWithAlpha referenziert Rgb. Insgesamt 88 Bytes unter den angegebenen Annahmen.">
        <defs>
          <marker id="pixel-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 8 4 0 8Z" fill="#343434" />
          </marker>
        </defs>
        <g fill="#f4f4f4" stroke="#666" stroke-width="1.5">
          <rect x="5" y="5" width="190" height="87" rx="8" />
          <rect x="270" y="5" width="195" height="87" rx="8" />
          <rect x="5" y="129" width="190" height="87" rx="8" />
          <rect x="270" y="129" width="195" height="87" rx="8" />
        </g>
        <g fill="none" stroke="#343434" stroke-width="2.5" marker-end="url(#pixel-arrow)">
          <path d="M270 49H202" />
          <path d="M368 92v30" />
          <path d="M270 174H202" />
        </g>
        <g class="pixel-node-title">
          <text x="17" y="29">Position · 24 B</text>
          <text x="282" y="29">Pixel · 24 B</text>
          <text x="17" y="153">Rgb · 16 B</text>
          <text x="282" y="153">ColorWithAlpha · 24 B</text>
        </g>
        <g class="pixel-node-detail">
          <text x="17" y="53">Header 12 + x, y 8</text>
          <text x="17" y="76">+ Padding 4</text>
          <text x="282" y="53">Header 12 + Referenzen 8</text>
          <text x="282" y="76">+ Padding 4</text>
          <text x="17" y="177">Header 12 + r, g, b 3</text>
          <text x="17" y="200">+ Padding 1</text>
          <text x="282" y="177">Header 12 + ref 4 + α 1</text>
          <text x="282" y="200">+ Padding 7</text>
        </g>
      </svg>
      <div class="pixel-total"><strong>88 Bytes</strong><span>4 Header · 3 interne Referenzen</span></div>
    </section>
    <section>
      <h2>Value Objects: idealisiert flach</h2>
      <div class="pixel-flat">
        <b>Pixel</b>
        <div><span>Position</span><strong>x · 4 B</strong><strong>y · 4 B</strong></div>
        <div><span>ColorWithAlpha</span><strong>Rgb · r g b · 3 B</strong><strong>α · 1 B</strong></div>
      </div>
      <div class="pixel-total"><strong>12 Bytes</strong><span>reine Nutzdaten</span></div>
    </section>
  </div>
</template>

<style scoped>
.pixel-memory {
  display: grid;
  grid-template-columns: 470px 356px;
  gap: 20px;
}
.pixel-memory h2 {
  margin: 0 0 6px;
  font-size: 24px;
}
.pixel-memory svg {
  display: block;
  width: 470px;
  height: 220px;
  font-family: Rajdhani, sans-serif;
  fill: #343434;
}
.pixel-node-title text {
  font-size: 19px;
  font-weight: 700;
}
.pixel-node-detail text {
  font-size: 17px;
}
.pixel-flat {
  height: 220px;
  border: 2px solid #6ca59e;
  border-radius: 8px;
  background: #e8f4f1;
  padding: 10px 14px;
}
.pixel-flat > b {
  font-size: 24px;
}
.pixel-flat > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.pixel-flat span {
  width: 100%;
  font-size: 20px;
}
.pixel-flat strong {
  padding: 6px 12px;
  border: 1px solid #6ca59e;
  background: white;
  font-size: 23px;
}
.pixel-total {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 6px;
}
.pixel-total > strong {
  font-size: 33px;
  white-space: nowrap;
}
.pixel-total > span {
  font-size: 16px;
}
</style>
