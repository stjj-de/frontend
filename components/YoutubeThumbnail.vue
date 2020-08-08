<template>
  <img class="youtube-thumbnail" :src="src" alt="Thumbnail"/>
</template>

<style lang="scss">

</style>

<script>
  const BASE_URL = "https://img.youtube.com/vi";

  const FILENAME_BY_SIZE = {
    small: "default.jpg",
    medium: "mqdefault.jpg",
    high: "hqdefault.jpg",
    highest: "maxresdefault.jpg"
  };

  export default {
    name: "YoutubeThumbnail",
    props: {
      size: {
        type: String,
        required: true,
        validate: value => Object.keys(FILENAME_BY_SIZE).includes(value)
      },
      videoId: {
        type: String,
        required: true
      }
    },
    computed: {
      src() {
        return `${BASE_URL}/${this.videoId}/${FILENAME_BY_SIZE[this.size]}`;
      }
    }
  };
</script>
