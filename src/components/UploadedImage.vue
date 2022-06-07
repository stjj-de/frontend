<template>
  <img
    :src="src"
    :alt="alt"
  >
</template>

<style module>

</style>

<script>
  import { getBackendUrl } from "../util"

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
        src: getBackendUrl(props.url)
      }
    }
  }
</script>
