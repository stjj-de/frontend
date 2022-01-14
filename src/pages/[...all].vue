<template>
  <Head>
    <title>{{ title }}</title>
  </Head>
  <NotFound v-if="page === null" resource="Diese Seite"/>
  <main v-else>
    <h1 class="section-heading -mb-5">
      <span>{{ page.title }}</span>
    </h1>
    <RichContent class="text-4" :content="page.content"/>
  </main>
</template>

<style module>

</style>

<script>
  import { Head } from "@vueuse/head"
  import { useRoute } from "vue-router"
  import { useQuery } from "@urql/vue"
  import { computed } from "vue"
  import query from "../gql/pages/[...all].graphql"
  import NotFound from "../components/NotFound.vue"
  import { getFormattedTitle } from "../util"
  import { useSimplifiedStrapiData } from "../simplifyStrapiData"
  import RichContent from "../components/rich/RichContent.vue"

  export default {
    name: "FallbackPage",
    components: { RichContent, NotFound, Head },
    async setup() {
      const route = useRoute()

      const result = await useQuery({
        query,
        variables: {
          path: route.path.slice(1)
        }
      })

      const data = useSimplifiedStrapiData(result.data)
      const page = computed(() => data.value.customPages.length === 0 ? null : data.value.customPages[0])

      return {
        page,
        title: computed(() => getFormattedTitle(page.value === null ? "Nicht gefunden." : page.value.title))
      }
    }
  }
</script>
