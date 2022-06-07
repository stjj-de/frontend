<template>
  <div :class="$style.root">
    <DocumentNodes
      :data="data"
      :increment-headings="incrementHeadings"
    />
  </div>
</template>

<style module>
  .root {

  }
</style>

<script>
  import DocumentNodes from "./DocumentNodes.vue"

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
    }
  }
</script>
