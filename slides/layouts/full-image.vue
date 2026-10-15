<script setup lang="ts">
import { resolveAssetUrl } from '@slidev/client/layoutHelper.ts'

defineProps<{ image: string }>()
</script>

<template>
  <div class="slidev-layout">
    <img :src="resolveAssetUrl(image)" alt="" style="width: 100%; height: 100%; object-fit: cover" />
  </div>
</template>
