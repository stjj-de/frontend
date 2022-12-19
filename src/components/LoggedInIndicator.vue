<template>
  <div
    v-if="authenticatedUser !== null"
    class="bg-black bg-opacity-3 backdrop-filter backdrop-blur-sm border-1 border-gray-300
           fixed bottom-5 left-5 rounded-md px-2 py-0.5"
  >
    Angemeldet als <span class="font-bold">{{ authenticatedUser.firstName }}</span>
  </div>
</template>

<script setup lang="ts">
import { authenticatedUser } from "@/auth"
</script>
