<template>
  <component
    :is="`h${data.level + pushLevelDown}`"
    :data-level="data.level"
    :class="$style.root"
  >
    {{ data.text }}
  </component>
</template>

<style module>
  .root {
    @apply font-bold mb-4;

    &[data-level="1"] {
      @apply text-7 text-gray-800;
    }

    &[data-level="2"] {
      @apply text-6 text-yellow-500;
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

<script>
  export default {
    name: "RichItemHeading",
    props: {
      data: {
        type: Object,
        required: true
      },
      pushLevelDown: {
        type: Number,
        default: 0
      }
    }
  }
</script>
