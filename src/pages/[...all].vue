<template>
  <Head>
    <title>{{ title }}</title>
  </Head>
  <NotFound v-if="page === null" resource="Diese Seite"/>
  <main v-else>
    <h1 class="section-heading">
      <span>{{ page.title }}</span>
    </h1>
    <Document class="text-4" :data="page.content.document"/>
  </main>
</template>

<style module>

</style>

<script setup lang="ts">
import { Head } from "@vueuse/head"
import { useRoute } from "vue-router"
import { useQuery } from "@urql/vue"
import { computed } from "vue"
import query from "../gql/pages/[...all].graphql"
import NotFound from "../components/NotFound.vue"
import { getFormattedTitle } from "../util"
import Document from "../components/document/DocumentRendered.vue"

const route = useRoute()

const { data } = await useQuery({
  query,
  variables: {
    path: route.path.slice(1)
  }
})

const page = computed(() => data.value.customPage)

const title = computed(() => getFormattedTitle(page.value === null ? "Nicht gefunden" : page.value.title))
</script>
