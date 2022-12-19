<template>
  <div
    class="fixed -lg:bottom-4 -lg:left-4 lg:top-8 lg:right-8 bg-white shadow-md p-4 sm:p-5 rounded-2xl
           transition duration-200 transform z-101 flex space-x-3 sm:space-x-5 items-center"
    :class="isVisible && ($route.path !== '/gottesdienste') ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
  >
    <div class="text-5 font-bold flex items-center">
      Jetzt live!
      <div class="bg-red-500 rounded-full w-4 h-4 animate-pulse ml-2" />
    </div>
    <div>
      <router-link class="text-yellow-600 text-5 flex items-center space-x-2" to="/gottesdienste"
        @click.passive="track('click', 'livestream notification')">
        <ArrowRightIcon/>
        <div>Zuschauen</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowRightIcon from "~icons/ph/arrow-right"

defineProps({
  isVisible: Boolean
})
</script>
