<template>
  <div class="impressum-page">
    <NavigationBar title="Impressum"/>
    <ContentOutlet class="content" :html="content" tag="main"/>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
  import NavigationBar from "@/components/NavigationBar"
  import { IMPRESSUM } from "@/assets/js/contents"
  import ContentOutlet from "@/components/ContentOutlet"

  export default {
    name: "ImpressumPage",
    components: { ContentOutlet, NavigationBar },
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
