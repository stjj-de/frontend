<template>
  <div class="impressum-page">
    <NavigationBar title="Impressum"/>
    <main class="content formatted quill-enduser" v-html="content"></main>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/quill-enduser";
</style>

<script>
  import NavigationBar from "@/components/NavigationBar"
  import { IMPRESSUM } from "@/assets/js/contents"

  export default {
    name: "ImpressumPage",
    components: { NavigationBar },
    async asyncData({ $api }) {
      return {
        content: await $api.contents.get(IMPRESSUM)
      }
    },
    head: () => ({
      title: "Impressum"
    })
  }
</script>
