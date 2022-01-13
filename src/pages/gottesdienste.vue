<template>
  <main class="space-y-10">
    <section>
      <h1 class="section-heading"><span>Live 👀</span></h1>
      <div class="relative">
        <p v-if="liveVideoId === null" class="text-4 leading-6 sm:text-6 sm:leading-8 pb-4">
          Wenn wir live sind, kannst du es dir hier&nbsp;anschauen.<br>
          Die&nbsp;Seite aktualisiert sich&nbsp;automatisch.
        </p>
        <div v-if="liveStatusLoading">
          <LoadingSpinner class="text-4">
            Live-Status wird abgerufen
          </LoadingSpinner>
        </div>
        <template v-else>
          <div v-if="liveVideoId === null" class="text-5">
            Zurzeit ist kein Livestream verfügbar.
          </div>
          <div v-else class="mb-10">
            <YouTubeEmbed :video-id="liveVideoId"/>
          </div>
        </template>
      </div>
    </section>
    <section>
      <h1 class="section-heading"><span>Gottesdienste 🔔</span></h1>
      <div class="flex flex-col justify-start space-y-8">
        <div
          v-for="item in data.churchServiceDates"
          :key="item.id"
          class="border border-gray-200 shadow-sm rounded-md p-5 flex justify-start justify-between -md:flex-col-reverse relative"
        >
          <div class="flex flex-col justify-center">
            <div class="font-bold text-4 sm:text-7">
              {{ item.title }}
            </div>
            <div v-if="item.text" class="text-4 mt-1 sm:mt-2">
              <TextWithNewlines :text="item.text"/>
            </div>
          </div>
          <div class="flex-shrink-0 md:ml-4 flex flex-col justify-center md:items-end -md:mb-2">
            <div v-if="item.willBeStreamed" class="text-s1 uppercase text-red-500 font-bold mb-1">
              🔴 Live
            </div>
            <div class="text-7 sm:text-5 sm:text-8 mb-0.5">
              {{ formatDate(item.date) }}
            </div>
            <div v-if="item.church" class="text-yellow-500 text-4 leading-5 whitespace-nowrap">
              {{ item.church.name }} ({{ item.church.location }})
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style module>

</style>

<script>
  import { useQuery } from "@urql/vue"
  import { useHead } from "@vueuse/head"
  import query from "../gql/gottesdienste.graphql"
  import { useSimplifiedStrapiData } from "../simplifyStrapiData"
  import YouTubeEmbed from "../components/YouTubeEmbed.vue"
  import { liveVideoId, liveStatusLoading } from "../store"
  import TextWithNewlines from "../components/TextWithNewlines.vue"
  import LoadingSpinner from "../components/LoadingSpinner.vue"
  import { getFormattedTitle } from "../util"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  })

  export default {
    name: "GottesdienstePage",
    components: { LoadingSpinner, TextWithNewlines, YouTubeEmbed },
    async setup() {
      useHead({
        title: getFormattedTitle("Gottesdienste")
      })

      const result = await useQuery({
        query
      })

      const data = useSimplifiedStrapiData(result.data)

      return {
        data,
        formatDate: isoString => dateFormat.format(new Date(isoString)),
        liveVideoId,
        liveStatusLoading
      }
    }
  }
</script>
