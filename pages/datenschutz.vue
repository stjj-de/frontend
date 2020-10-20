<template>
  <div class="privacy-policy-page">
    <NavigationBar title="Datenschutzerklärung"/>
    <ContentOutlet class="content" :html="content"/>
  </div>
</template>

<style scoped lang="scss">
</style>

<script>
  import NavigationBar from "@/components/NavigationBar"
  import { PRIVACY_POLICY } from "@/assets/js/contents"
  import ContentOutlet from "@/components/ContentOutlet"

  export default {
    name: "PrivacyPolicyPage",
    components: { ContentOutlet, NavigationBar },
    async asyncData({ $api }) {
      return {
        content: await $api.contents.get(PRIVACY_POLICY)
      }
    },
    head: () => ({
      title: "Datenschutzerklärung"
    })
  }
</script>
