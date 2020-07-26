<template>
  <div class="gemeinde-page">
    <NavigationBar title="Gemeinde"/>
    <main class="quill-enduser formatted content" v-html="content">
    </main>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/quill-enduser";
</style>

<script>
  import NavigationBar from "@/components/NavigationBar";
  import Accordion from "@/components/Accordion";
  import { GEMEINDE } from "@/assets/js/contents";

  export default {
    name: "GemeindePage",
    components: { Accordion, NavigationBar },
    async asyncData({ $api }) {
      return {
        content: await $api.contents.get(GEMEINDE)
      };
    }
  };
</script>
