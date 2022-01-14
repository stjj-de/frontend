<template>
  <img
    :src="src"
    :alt="alt"
  >
</template>

<style module>

</style>

<script>
  import { getStrapiUrl } from "../util"

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
    },
    setup(props) {
      return {
        src: getStrapiUrl(props.url)
      }
    }
  }
</script>
