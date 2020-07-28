<template>
  <div class="gemeinde-page">
    <NavigationBar title="Gemeinde"/>
    <main class="content formatted">
      <section>
        <h1>Gruppierungen</h1>
        <Accordion v-for="group in groups" :key="group.id" :label="group.title">
          <div class="quill-enduser" v-html="group.description"></div>
          <div class="gemeinde-page__group-posts">
            <nuxt-link :to="`/posts?group=${group.id}`">Artikel anzeigen</nuxt-link>
          </div>
        </Accordion>
      </section>
      <section>
        <h1>Für sie da</h1>
        <div class="quill-enduser" v-html="content"></div>
      </section>
    </main>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/quill-enduser";

  .gemeinde-page__group-posts {
    margin-top: 20px;
    font-size: 1.5rem;
    text-align: right;
  }
</style>

<script>
  import NavigationBar from "@/components/NavigationBar";
  import Accordion from "@/components/Accordion";
  import { GEMEINDE } from "@/assets/js/contents";
  import MyButton from "@/components/MyButton";

  export default {
    name: "GemeindePage",
    components: { MyButton, Accordion, NavigationBar },
    async asyncData({ $api }) {
      return {
        groups: (await $api.groups.list({ limit: 50, fields: ["id", "title", "description"] })).items,
        content: await $api.contents.get(GEMEINDE)
      };
    }
  };
</script>
