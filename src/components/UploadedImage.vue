<template>
  <img
    :src="url"
    :alt="alt"
    draggable="false"
  >
</template>

<style module>

</style>

<script>
  export default {
    name: "UploadedImage",
    props: {
      url: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        required: true
      }
    }
  }
</script>
