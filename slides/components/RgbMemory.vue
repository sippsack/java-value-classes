<template>
  <div class="rgb-memory">
    <section>
      <h2>Rgb als Identity Class</h2>
      <div class="rgb-memory-total">20 <small>Bytes im Beispiel</small></div>
      <div class="rgb-memory-bytes">
        <span v-for="n in 4" :key="`ref-${n}`" class="ref"></span>
        <span v-for="n in 12" :key="`header-${n}`" class="header"></span>
        <span class="red">r</span><span class="green">g</span><span class="blue">b</span>
        <span class="padding"></span>
      </div>
      <dl>
        <div><dt>Referenz im Array</dt><dd>4 Bytes</dd></div>
        <div><dt>Objekt-Header</dt><dd>12 Bytes</dd></div>
        <div><dt>r + g + b</dt><dd>3 Bytes</dd></div>
        <div><dt>Padding des Objekts</dt><dd>1 Byte</dd></div>
      </dl>
    </section>
    <section>
      <h2>Rgb als Value Class</h2>
      <div class="rgb-memory-total">3 <small>Bytes reine Nutzdaten</small></div>
      <div class="rgb-memory-bytes">
        <span class="red">r</span><span class="green">g</span><span class="blue">b</span>
      </div>
      <div class="rgb-memory-ideal">
        Idealisierter flacher Eintrag:<br>
        nur die drei Kanalwerte,<br>
        keine Referenz, kein Objekt-Header.
      </div>
    </section>
  </div>
</template>

<style>
.rgb-memory {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
}
.rgb-memory h2 {
  font-size: 29px;
}
.rgb-memory-total {
  margin: 6px 0 10px;
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
}
.rgb-memory-total small {
  font-size: 22px;
  font-weight: 500;
}
.rgb-memory-bytes {
  display: flex;
  gap: 2px;
  height: 30px;
  margin-bottom: 10px;
}
.rgb-memory-bytes span {
  flex: 0 0 17px;
  height: 30px;
  border: 1px solid #666;
  font-size: 20px;
  text-align: center;
  line-height: 28px;
}
.rgb-memory .ref { background: #98d6f5; }
.rgb-memory .header { background: #ddd; }
.rgb-memory .red { background: #edafad; }
.rgb-memory .green { background: #b6d8d5; }
.rgb-memory .blue { background: #98d6f5; }
.rgb-memory .padding { background: #f7dd49; }
.rgb-memory dl {
  margin: 0;
  font-size: 20px;
}
.rgb-memory dl > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}
.rgb-memory dd { margin: 0; }
.rgb-memory-ideal {
  font-size: 25px;
  line-height: 1.25;
}
</style>
