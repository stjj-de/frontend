<template>
  <button
    :class="$style.button"
    :type="isSubmit ? 'submit' : 'button'"
    :disabled="isDisabled || isLoading"
    :data-t="t"
    :data-loading="isLoading"
    @click="emit('click')"
  >
    <component v-if="icon" :is="icon"/>
    <span :class="$style.slot">
      <slot/>
    </span>
    <span :class="$style.loadingOverlay">
      <span :class="$style.spinner"/>
    </span>
  </button>
</template>

<style module lang="scss">
.button {
  @apply rounded-md shadow-sm h-10 px-4;

  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 200ms ease;
  transition-property: background-color, box-shadow, border-color, opacity;

  &:focus {
    @apply outline-none;
  }

  &:disabled:not([data-loading="true"]) {
    @apply opacity-70 cursor-not-allowed;
  }

  &[data-loading="true"] {
    @apply cursor-wait;

    .loadingOverlay {
      opacity: 100%;
    }
  }

  &[data-t="primary"] {
    @apply font-bold bg-yellow-500 text-white;

    &:not(:disabled) {
      @apply hover:shadow-md focus-visible:shadow-md active:bg-yellow-600;
    }
  }

  &[data-t="secondary"] {
    @apply border-1 border-yellow-600;

    &:not(:disabled) {
      @apply hover:shadow-md focus-visible:shadow-md active:bg-gray-100;
    }
  }

  &[data-t="flat"] {
    @apply border-1 border-transparent;

    &:not(:disabled) {
      @apply hover:border-gray-300 active:bg-gray-100;
    }
  }
}

.slot {
  display: block;
}

.loadingOverlay {
  @apply bg-white bg-opacity-70;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0%;
  transition: 200ms ease opacity;
}

.spinner {
  @apply border-2 border-black border-t-transparent;

  $size: 20px;
  width: $size;
  height: $size;
  border-radius: 50%;

  animation: 500ms infinite spin linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup lang="ts">
import type { PropType, Component } from "vue"

defineProps({
  t: {
    type: String as PropType<"primary" | "secondary" | "flat">,
    default: "primary"
  },
  icon: {
    type: Object as PropType<Component>
  },
  isSubmit: Boolean,
  isLoading: Boolean,
  isDisabled: Boolean
})

const emit = defineEmits(["click"])
</script>
