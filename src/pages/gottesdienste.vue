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
            <div class="font-bold text-5 sm:text-7 -md:-mt-3 -md:mb-1">
              {{ item.shortDescription }}
            </div>
            <div class="md:hidden text-orange-500 text-3 sm:text-4 leading-4 whitespace-nowrap">
              {{ item.church.name }} ({{ item.church.location }})
            </div>
            <div class="text-4 -md:mt-4">
              <Document v-if="item.longDescription" :data="item.longDescription"/>
              <div v-if="item.livestreamPlanned" class="text-red-500 text-3">
                Wird im Livestream übertragen werden.
              </div>
            </div>
          </div>
          <div class="flex-shrink-0 md:ml-4 flex flex-col justify-center md:items-end -md:mb-2">
            <div class="text-6 sm:text-7">
              {{ formatDate(item.date) }}
            </div>
            <div class="-md:hidden text-orange-500 text-4 leading-5 whitespace-nowrap">
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
  import query from "../gql/pages/gottesdienste.graphql"
  import YouTubeEmbed from "../components/YouTubeEmbed.vue"
  import { liveVideoId, liveStatusLoading } from "../store"
  import LoadingSpinner from "../components/LoadingSpinner.vue"
  import { getFormattedTitle } from "../util"
  import Document from "../components/document/Document.vue"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  })

  export default {
    name: "GottesdienstePage",
    components: { Document, LoadingSpinner, YouTubeEmbed },
    async setup() {
      useHead({
        title: getFormattedTitle("Gottesdienste")
      })

      const { data } = await useQuery({
        query
      })

      return {
        data,
        formatDate: isoString => dateFormat.format(new Date(isoString)),
        liveVideoId,
        liveStatusLoading
      }
    }
  }
</script>
