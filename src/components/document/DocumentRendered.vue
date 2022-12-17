<template>
  <div :class="$style.root">
    <DocumentNodes
      v-if="!isEmpty"
      :data="data"
      :increment-headings="incrementHeadings"
    />
  </div>
</template>

<style module>
  .root {
    hyphens: auto;
    text-align: justify;
  }
</style>

<script setup lang="ts">
import { computed } from "vue"
import { whitespaceRegex } from "../../util/whitespace"
import DocumentNodes from "./DocumentNodes.vue"

function getAsRawString(node: unknown) {
  // @ts-expect-error
  if ("text" in node) return node.text

  // @ts-expect-error
  return node.children.map(getAsRawString).join(" ")
}

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  incrementHeadings: {
    type: Number,
    default: 0,
    validate: (value: number) => value > 0 && value < 6 && value % 1 === 0
  }
})

const isEmpty = computed(() => whitespaceRegex.test(props.data.map(getAsRawString).join(" ")))
</script>
