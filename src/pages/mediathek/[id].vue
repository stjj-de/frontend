<template>
  <Head>
    <title>{{ title }}</title>
  </Head>
  <NotFound v-if="video === null" resource="Dieses Video"/>
  <main v-else>
    <div class="flex flex-col-reverse items-start">
      <h1 class="font-serif font-bold font-serif text-8 pt-4"><span>{{ video.title }}</span></h1>
      <YouTubeEmbed :video-id="video.youtubeVideoId"/>
    </div>
    <div class="mb-6 mt-3">
      Veröffentlicht am {{ date }}
    </div>
    <RichContent :increment-heading-levels-by="1" :content="video.richContent"/>
  </main>
</template>

<style module>

</style>

<script>
  import { useRoute } from "vue-router"
  import { useQuery } from "@urql/vue"
  import { computed } from "vue"
  import { Head } from "@vueuse/head"
  import query from "../../gql/pages/mediathek/[id].graphql"
  import NotFound from "../../components/NotFound.vue"
  import YouTubeEmbed from "../../components/YouTubeEmbed.vue"
  import { getFormattedTitle } from "../../util"
  import RichContent from "../../components/rich/RichContent.vue"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  export default {
    name: "VideoPage",
    components: { RichContent, YouTubeEmbed, NotFound, Head },
    async setup() {
      const route = useRoute()

      const result = await useQuery({
        query,
        variables: {
          id: route.params.id
        }
      })

      const video = computed(() => result.data.value.video.data?.attributes)

      return {
        video,
        title: computed(() => getFormattedTitle(video.value === null ? "Nicht gefunden" : video.value.title)),
        date: computed(() => video.value === null ? null : dateFormat.format(new Date(video.value.publicationDate)))
      }
    }
  }
</script>
