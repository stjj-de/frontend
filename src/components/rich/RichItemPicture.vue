<template>
  <UploadedImage
    :url="data.picture.url"
    :alt="data.picture.alternativeText"
    class="max-w-full max-h-80vh object-contain my-8"
  />
</template>

<style module>

</style>

<script>
  import UploadedImage from "../UploadedImage.vue"

  export default {
    name: "RichItemPicture",
    components: { UploadedImage },
    props: {
      data: {
        type: Object,
        required: true
      }
    }
  }
</script>
