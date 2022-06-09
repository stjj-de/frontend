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
  }
</style>

<script>
  import { computed } from "vue"
  import { whitespaceRegex } from "../../util/whitespace"
  import DocumentNodes from "./DocumentNodes.vue"

  function getAsRawString(node) {
    if ("text" in node) return node.text

    return node.children.map(getAsRawString).join(" ")
  }

  export default {
    name: "Document",
    components: { DocumentNodes },
    props: {
      data: {
        type: Array,
        required: true
      },
      incrementHeadings: {
        type: Number,
        default: 0,
        validate: value => value > 0 && value < 6 && value % 1 === 0
      }
    },
    setup(props) {
      const isEmpty = computed(() => whitespaceRegex.test(props.data.map(getAsRawString).join(" ")))

      return { isEmpty }
    }
  }
</script>
