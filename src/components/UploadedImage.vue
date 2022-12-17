<template>
  <img
    :src="url"
    :alt="alt"
    draggable="false"
  >
</template>

<style module>

</style>

<script setup lang="ts">
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
