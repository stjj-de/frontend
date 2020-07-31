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
  import NavigationBar from "@/components/NavigationBar";
  import ExternalLink from "@/components/ExternalLink";
  import { PRIVACY_POLICY } from "@/assets/js/contents";

  export default {
    name: "PrivacyPolicyPage",
    components: { ExternalLink, NavigationBar },
    head: () => ({
      title: "Datenschutzerklärung"
    }),
    async asyncData({ $api }) {
      return {
        content: await $api.contents.get(PRIVACY_POLICY)
      };
    }
  };
</script>
