<template>
  <div class="relative">
    <div ref="element" class="flex overflow-x-auto space-x-5 px-1 pb-5 relative z-1" :class="$style.container">
      <slot/>
    </div>
    <div class="cannot-hover:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-between items-center px-1">
      <button
        class="rounded-full w-14 h-14 bg-black text-white text-7 flex justify-center items-center transition duration-200 z-1"
        :class="showLeft ? '' : 'opacity-0 pointer-events-none'"
        @click="scrollLeft()"
      >
        <ArrowLeft/>
      </button>
      <button
        class="rounded-full w-14 h-14 bg-black text-white text-7 flex justify-center items-center transition duration-200 z-1"
        :class="showRight ? '' : 'opacity-0 pointer-events-none'"
        @click="scrollRight()"
      >
        <ArrowRight/>
      </button>
    </div>
  </div>
</template>

<style module lang="scss">
  @media (hover: hover) {
    .container {
      &::-webkit-scrollbar {
        height: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useEventListener, useWindowSize } from "@vueuse/core"
import ArrowLeft from "~icons/mdi-light/arrow-left"
import ArrowRight from "~icons/mdi-light/arrow-right"

const props = defineProps({
  scrollStepSize: {
    type: Number,
    default: 100
  }
})

const element = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)

const windowSize = useWindowSize()
useEventListener(element, "scroll", () => {
  scrollPosition.value = element.value!.scrollLeft
})

function scrollRight() {
  element.value!.scrollTo({
    left: element.value!.scrollLeft + props.scrollStepSize,
    behavior: "smooth"
  })
}

function scrollLeft(): void {
  element.value!.scrollTo({
    left: element.value!.scrollLeft - props.scrollStepSize,
    behavior: "smooth"
  })
}

const showLeft = computed(() => scrollPosition.value > 0)

const showRight = computed(() =>
  typeof windowSize.width.value === "number" && // to make it dependent on the window size
    element.value !== null &&
    scrollPosition.value < (element.value.scrollWidth - element.value.clientWidth) - 1
)
</script>
