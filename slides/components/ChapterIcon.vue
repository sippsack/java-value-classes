<script setup lang="ts">
defineProps<{ chapter: number }>()
</script>

<template>
  <svg viewBox="0 0 200 200" fill="none" stroke="#343434" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="chapter === 1">
      <path d="M101 18C45 18 16 53 16 103s32 79 66 79c25 0 9-29 34-29h28c57 0 52-135-43-135Z" fill="#f8eaae" />
      <circle cx="61" cy="62" r="18" fill="#eb3c44" />
      <circle cx="113" cy="52" r="18" fill="#46afe2" />
      <circle cx="150" cy="91" r="18" fill="#b6d8d5" />
      <circle cx="54" cy="115" r="18" fill="#f7dd49" />
    </template>
    <template v-else-if="chapter === 2">
      <path d="m100 15 71 25v57c0 39-28 66-71 88-43-22-71-49-71-88V40Z" fill="#b6d8d5" />
      <path d="m62 98 26 27 53-57" stroke="#343434" stroke-width="14" />
    </template>
    <template v-else-if="chapter === 3">
      <rect x="15" y="24" width="170" height="151" rx="12" fill="#98d6f5" />
      <path d="M15 68h170M15 120h170M71 24v151M128 24v151" />
      <path d="M39 46h9M93 46h12M150 46h13M39 94h9M93 94h12M150 94h13M39 147h9M93 147h12M150 147h13" stroke="#fff" stroke-width="12" />
    </template>
    <template v-else-if="chapter === 4">
      <path d="M52 10v21m48-21v21m48-21v21M52 169v21m48-21v21m48-21v21M10 52h21M10 100h21M10 148h21M169 52h21M169 100h21M169 148h21" />
      <rect x="31" y="31" width="138" height="138" rx="15" fill="#edafad" />
      <circle cx="70" cy="73" r="13" fill="#fff" />
      <circle cx="130" cy="73" r="13" fill="#fff" />
      <circle cx="100" cy="127" r="13" fill="#fff" />
      <path d="m80 85 14 30m26-30-14 30M83 73h34" />
    </template>
    <template v-else>
      <path d="M97 27v159M63 186h70" stroke-width="12" />
      <path d="M28 26h123l32 28-32 28H28Z" fill="#f7dd49" />
      <path d="M169 103H50l-32 28 32 28h119Z" fill="#98d6f5" />
      <path d="M57 54h77m8 77H67" stroke="#fff" stroke-width="10" />
    </template>
  </svg>
</template>
