<template>
  <img
    :src="data.picture.url"
    :alt="data.picture.alternativeText"
    class="max-w-full max-h-80vh object-contain my-8"
  >
</template>

<style module>

</style>

<script>
  export default {
    name: "RichItemPicture",
    props: {
      data: {
        type: Object,
        required: true
      }
    }
  }
</script>
