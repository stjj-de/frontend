<template>
  <Head>
    <title>{{ title }}</title>
  </Head>
  <NotFound v-if="video === null" resource="Dieses Video"/>
  <main v-else>
    <div class="flex flex-col-reverse">
      <h1 class="font-sans font-bold text-5 sm:text-7 pt-6">{{ video.title }}</h1>
      <YouTubeEmbed :video-id="video.youtubeVideoId"/>
    </div>
  </main>
</template>

<style module>

</style>

<script>
  import { useRoute } from "vue-router"
  import { useQuery } from "@urql/vue"
  import { computed } from "vue"
  import { Head } from "@vueuse/head"
  import query from "../../gql/mediathek/[id].graphql"
  import NotFound from "../../components/NotFound.vue"
  import YouTubeEmbed from "../../components/YouTubeEmbed.vue"
  import { getFormattedTitle } from "../../util"

  export default {
    name: "VideoPage",
    components: { YouTubeEmbed, NotFound, Head },
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
        title: computed(() => getFormattedTitle(video.value === null ? "Nicht gefunden" : video.value.title))
      }
    }
  }
</script>
