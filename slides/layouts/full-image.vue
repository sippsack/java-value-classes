<script setup lang="ts">
defineProps<{ image: string }>()
</script>

<template>
  <div class="slidev-layout">
    <img :src="image" alt="" style="width: 100%; height: 100%; object-fit: cover" />
  </div>
</template>
