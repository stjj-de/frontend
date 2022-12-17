<template>
  <UploadedImage
    class="absolute filter blur-xl z-0 transform scale-110 opacity-30"
    v-bind="$attrs"
    :url="url"
    :alt="alt"
    aria-hidden="true"
  />
  <UploadedImage
    v-bind="$attrs"
    class="relative z-1"
    :url="url"
    :alt="alt"
  />
</template>

<script setup lang="ts">
import UploadedImage from "./UploadedImage.vue"

defineProps({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  }
})
</script>
