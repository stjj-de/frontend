<template>
  <TransformInternalLinks class="quill-enduser formatted" :html="html" :tag="tag"/>
</template>

<style lang="scss">
  @use "~@/assets/styles/quill-enduser";
  @use "~@/assets/styles/formatted";
</style>

<script>
  import TransformInternalLinks from "@/components/TransformInternalLinks"

  export default {
    name: "ContentOutlet",
    components: { TransformInternalLinks },
    props: {
      html: {
        type: String,
        required: true
      },
      tag: {
        type: String,
        default: "div"
      }
    }
  }
</script>
