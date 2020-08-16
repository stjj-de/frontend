<template>
  <div class="privacy-policy-page">
    <NavigationBar title="Datenschutzerklärung"/>
    <main class="content formatted quill-enduser" v-html="content"></main>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/quill-enduser";
</style>

<script>
  import NavigationBar from "@/components/NavigationBar"
  import { PRIVACY_POLICY } from "@/assets/js/contents"

  export default {
    name: "PrivacyPolicyPage",
    components: { NavigationBar },
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
