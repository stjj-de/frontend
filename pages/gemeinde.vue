<template>
  <div class="gemeinde-page">
    <NavigationBar title="Gemeinde"/>
    <main class="content formatted">
      <Accordion label="Gruppierungen">
        <Accordion v-for="group in groups" :key="group.id" :label="group.title">
          <div class="quill-enduser" v-html="group.description"></div>
          <
        </Accordion>
      </Accordion>
      <Accordion label="Für sie da">
        <div class="quill-enduser" v-html="content"></div>
      </Accordion>
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
        groups: (await $api.groups.list({ limit: 50, fields: ["id", "title", "description"] })).items,
        content: await $api.contents.get(GEMEINDE)
      };
    }
  };
</script>
