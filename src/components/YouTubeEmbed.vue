<template>
  <div class="aspect-9/16 relative w-full">
    <iframe
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&amp;rel=0`"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  videoId: {
    type: String,
    required: true
  }
})
</script>
