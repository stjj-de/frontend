<template>
  <main class="space-y-8">
    <section class="mb-5">
      <a
        class="text-6 link"
        href="https://www.dropbox.com/sh/wg5kxn1ttaecikz/AADQQ9RV1mB8kV6C6jjmakcUa?dl=0"
        target="_blank"
        rel="noopener noreferrer"
      >
        📷 Unser Bilderarchiv<ExternalIcon class="text-0.7em ml-2 relative top-0.5"/>
      </a>
    </section>
    <section>
      <h1 class="section-heading">Videos 🎞️</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <router-link
          v-for="video in data.videos"
          :key="video.id"
          :to="`/mediathek/${video.id}`"
          class="rounded-md overflow-hidden border-gray-200 border-1"
        >
          <div class="aspect-ratio-9/16">
            <YouTubeThumbnail class="w-full h-full object-cover" :video-id="video.youtubeVideoId"/>
          </div>
          <div class="py-2 px-3" :title="video.title">
            <div class="font-bold text-3 truncate">
              {{ video.title }}
            </div>
            <div class="text-gray-600">
              {{ formatDate(video.publicationDate) }}
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
  import { useQuery, gql } from "@urql/vue"
  import { useHead } from "@vueuse/head"
  import YouTubeThumbnail from "../../components/YouTubeThumbnail.vue"
  import { useSimplifiedStrapiData } from "../../simplifyStrapiData"
  import { getFormattedTitle } from "../../util"
  import ExternalIcon from "~icons/lucide/external-link"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "2-digit",
    year: "2-digit"
  })

  export default {
    name: "MediathekPage",
    components: { YouTubeThumbnail, ExternalIcon },
    async setup() {
      useHead({
        title: getFormattedTitle("Mediathek")
      })

      const result = await useQuery({
        query: gql`
          query {
            videos(sort: "publicationDate:desc") {
              data {
                id
                attributes {
                  title
                  publicationDate
                  youtubeVideoId
                }
              }
            }
          }
        `
      })

      const data = useSimplifiedStrapiData(result.data)

      return {
        data,
        formatDate: isoString => dateFormat.format(new Date(isoString))
      }
    }
  }
</script>
