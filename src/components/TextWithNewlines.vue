<template>
  <div>
    <p
      v-for="(part, i) in text.split('\n')"
      :key="i"
    >
      {{ part }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>
