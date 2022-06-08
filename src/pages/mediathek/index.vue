<template>
  <main class="space-y-8">
    <h1 class="section-heading">
      <span>Mediathek</span>
    </h1>
    <Document class="text-4" :data="data.settingsSingletons[0].mediaLibraryPageContent.document" :increment-headings="1"/>
    <section>
      <Heading semantic="2" visual="1">
        Videos 🎞️
      </Heading>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <router-link
          v-for="video in data.videos"
          :key="video.id"
          :to="`/mediathek/${video.id}`"
          class="rounded-lg overflow-hidden border-gray-300 border-2 border-dashed p-2"
        >
          <div class="aspect-ratio-9/16 relative">
            <YouTubeThumbnail class="w-full h-full object-cover rounded-md" :video-id="video.youtubeVideoId"/>
            <div class="absolute flex justify-start items-end p-1">
              <div class="bg-black bg-opacity-80 text-white rounded-md px-2 py-1">
                {{ formatDate(video.publicationDate) }}
              </div>
            </div>
          </div>
          <div class="pt-2 px-1" :title="video.title">
            <div class="text-3 line-clamp-2">
              {{ video.title }}
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </main>
</template>

<style module>

</style>

<script>
  import { useQuery } from "@urql/vue"
  import { useHead } from "@vueuse/head"
  import query from "../../gql/pages/mediathek/index.graphql"
  import YouTubeThumbnail from "../../components/YouTubeThumbnail.vue"
  import { getFormattedTitle } from "../../util"
  import Heading from "../../components/Heading.vue"
  import ExternalIcon from "~icons/lucide/external-link"
  import Document from "../../components/document/Document.vue"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  })

  export default {
    name: "MediathekPage",
    components: { Document, Heading, YouTubeThumbnail, ExternalIcon },
    async setup() {
      useHead({
        title: getFormattedTitle("Mediathek")
      })

      const { data } = await useQuery({
        query
      })

      return {
        data,
        formatDate: isoString => dateFormat.format(new Date(isoString))
      }
    }
  }
</script>
