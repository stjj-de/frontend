<template>
  <div class="flex items-center">
    <LoaderIcon class="animate-spin mr-2 relative top-1px"/>
    <div>
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoaderIcon from "~icons/teenyicons/loader-outline"
</script>
