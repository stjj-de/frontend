<template>
  <main class="pt-20">
    <h1 class="font-bold text-7 sm:text-9 mb-4">{{ resource }} existiert&nbsp;nicht.</h1>
    <router-link class="link text-8 inline-flex items-center" to="/">
      <ArrowLeftIcon class="mr-2"/>
      Zur Startseite
    </router-link>
  </main>
</template>

<style scoped>

</style>

<script setup lang="ts">
import ArrowLeftIcon from "~icons/ph/arrow-left"

defineProps({
  resource: {
    type: String,
    required: true
  }
})
</script>
