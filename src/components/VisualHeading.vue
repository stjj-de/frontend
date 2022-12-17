<template>
  <component
    :is="`h${semantic}`"
    :data-level="visual"
    :class="$style.root"
  >
    <slot/>
  </component>
</template>

<style module lang="scss">
  .root {
    @apply font-bold mb-4;

    &[data-level="1"] {
      @apply text-7 text-gray-800;
    }

    &[data-level="2"] {
      @apply text-6 text-yellow-600;
    }

    &[data-level="3"] {
      @apply text-5 text-gray-800;
    }

    & + & {
      @apply -mt-2;

      &[data-level="2"] {
        @apply -mt-3;
      }
    }

    &:not(& + &) {
      @apply mt-6;
    }
  }
</style>

<script setup lang="ts">
defineProps({
  semantic: {
    type: Number,
    required: true,
    validate: (value: number) => value >= 1 && value <= 6
  },
  visual: {
    type: Number,
    required: true,
    validate: (value: number) => value >= 1 && value <= 6
  }
})
</script>
