<template>
  <img :src="src" alt="Thumbnail des Videos" loading="lazy" draggable="false">
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  videoId: {
    type: String,
    required: true
  },
  maxRes: Boolean
})

const src = computed(() => `https://img.youtube.com/vi/${props.videoId}/${props.maxRes ? "maxresdefault" : "mqdefault"}.jpg`)
</script>
