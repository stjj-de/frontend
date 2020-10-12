<template>
  <main class="formatted admin-index-page">
    <h1>Neuigkeiten</h1>
    <ContentOutlet :html="content"/>
  </main>
</template>

<style lang="scss">
  @use "~@/assets/styles/quill-enduser";
</style>

<script>
  import { ADMIN_NEWS } from "@/assets/js/contents"
  import ContentOutlet from "@/components/ContentOutlet"

  export default {
    name: "AdminPage",
    components: { ContentOutlet },
    async asyncData({ $api }) {
      return {
        content: await $api.contents.get(ADMIN_NEWS)
      }
    }
  }
</script>
