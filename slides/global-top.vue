<script setup lang="ts">
import { useNav } from '@slidev/client'
import { configs } from '@slidev/client/env.ts'

const { currentPage, currentFrontmatter } = useNav()
</script>

<template>
  <aside v-if="currentPage !== 1 && currentFrontmatter.sidebar !== false" class="presentation-sidebar" aria-label="Vortrag und Foliennummer">
    <img class="sidebar-logo" src="/embarc/embarc-logo-small.png" alt="embarc" />
    <svg class="sidebar-labels" viewBox="0 0 30 540" aria-label="Vortragstitel">
      <a class="sidebar-website" href="https://embarc.de/" target="_blank" rel="noopener noreferrer">
        <text x="15" y="165" transform="rotate(-90 15 165)">embarc.de</text>
      </a>
      <text class="sidebar-title" x="15" y="478" transform="rotate(-90 15 478)">{{ configs.title }}</text>
    </svg>
    <span class="sidebar-page">{{ currentPage }}</span>
  </aside>
</template>

<style>
.presentation-sidebar {
  position: absolute;
  inset: 0 auto 0 0;
  width: 30px;
  z-index: 50;
  background: linear-gradient(to bottom, #808080 0%, #808080 37%, #404040 100%);
  color: #d9d9d9;
  font-family: 'Rajdhani', sans-serif;
  pointer-events: none;
}
.presentation-sidebar .sidebar-labels {
  position: absolute;
  inset: 0;
  width: 30px;
  height: 100%;
}
.presentation-sidebar .sidebar-logo {
  position: absolute;
  top: 12px;
  left: 5px;
  width: 20px;
  height: auto;
}
.presentation-sidebar text {
  fill: currentColor;
  dominant-baseline: middle;
  font-size: 15px;
  font-weight: 400;
}
.presentation-sidebar .sidebar-website {
  color: inherit;
  text-decoration: none;
  pointer-events: auto;
}
.presentation-sidebar .sidebar-page {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
</style>
