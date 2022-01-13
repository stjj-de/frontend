<template>
  <img :src="src" alt="Thumbnail des Videos" loading="lazy">
</template>

<script>
  import { computed } from "vue"

  export default {
    name: "YouTubeThumbnail",
    props: {
      videoId: {
        type: String,
        required: true
      },
      maxRes: Boolean
    },
    setup(props) {
      return {
        src: computed(() => `https://img.youtube.com/vi/${props.videoId}/${props.maxRes ? "maxresdefault" : "mqdefault"}.jpg`)
      }
    }
  }
</script>
