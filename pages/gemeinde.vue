<template>
  <div class="gemeinde-page">
    <NavigationBar title="Gemeinde"/>
    <main class="content formatted">
      <section>
        <h1>Gruppierungen</h1>
        <Accordion v-for="group in groups" :key="group.id" :label="group.title">
          <ContentOutlet :html="group.description"/>
          <div class="gemeinde-page__group-posts">
            <nuxt-link :to="`/posts?group=${group.id}`">Artikel anzeigen</nuxt-link>
          </div>
        </Accordion>
      </section>
      <section>
        <ContentOutlet :html="contents.gemeinde"/>
      </section>
      <section>
        <h1>Downloads</h1>
        <ul>
          <li class="gemeinde-page__download">
            <a class="link" :href="`/files/${contents.pfarrbrief}`" target="_blank">Pfarrbrief</a>
          </li>
          <li class="gemeinde-page__download">
            <a class="link" :href="`/files/${contents.messdienerplan}`" target="_blank">Messdienerplan</a>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style lang="scss">
  .gemeinde-page__download {
    font-size: 1.4rem;
    margin-bottom: 5px;
  }

  .gemeinde-page__group-posts {
    margin-top: 20px;
    font-size: 1.5rem;
    text-align: right;
  }
</style>

<script>
  import NavigationBar from "@/components/NavigationBar"
  import Accordion from "@/components/Accordion"
  import { GEMEINDE, MESSDIENERPLAN, PFARRBRIEF } from "@/assets/js/contents"
  import ContentOutlet from "@/components/ContentOutlet"

  export default {
    name: "GemeindePage",
    components: { ContentOutlet, Accordion, NavigationBar },
    async asyncData({ $api }) {
      return {
        groups: (await $api.groups.list({ limit: 50, fields: ["id", "title", "description"] })).items,
        contents: {
          gemeinde: await $api.contents.get(GEMEINDE),
          pfarrbrief: await $api.contents.get(PFARRBRIEF),
          messdienerplan: await $api.contents.get(MESSDIENERPLAN)
        }
      }
    }
  }
</script>
