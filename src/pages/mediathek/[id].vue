<template>
  <Head>
    <title>{{ title }}</title>
  </Head>
  <NotFound v-if="video === null" resource="Dieses Video"/>
  <main v-else>
    <div class="flex flex-col-reverse items-start">
      <h1 class="font-serif font-bold font-serif text-8 pt-6"><span>{{ video.title }}</span></h1>
      <YouTubeEmbed :video-id="video.youtubeVideoId"/>
    </div>
    <div class="mb-6 mt-3 text-4">
      Veröffentlicht am {{ date }}
    </div>
    <Document :data="video.description.document" :increment-headings="1"/>
  </main>
</template>

<style module>

</style>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useQuery } from "@urql/vue"
import { computed } from "vue"
import { Head } from "@vueuse/head"
import query from "../../gql/pages/mediathek/[id].graphql"
import NotFound from "../../components/NotFound.vue"
import YouTubeEmbed from "../../components/YouTubeEmbed.vue"
import { getFormattedTitle } from "../../util"
import Document from "../../components/document/DocumentRendered.vue"

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric"
})

const route = useRoute()

const { data } = await useQuery({
  query,
  variables: {
    id: route.params.id
  }
})

const video = computed(() => data.value.video)

const title = computed(() => getFormattedTitle(video.value === null ? "Nicht gefunden" : video.value.title))
const date = computed(() => video.value === null ? null : dateFormat.format(new Date(video.value.publicationDate)))
</script>
