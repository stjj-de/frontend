<template>
  <main class="space-y-25">
    <section class="flex flex-grow justify-between -lg:flex-col pt-10 lg:pb-10">
      <div class="flex flex-col justify-center items-start -lg:mb-10">
        <div class="yellow-underlined font-bold font-serif text-11 sm:text-14">
          Willkommen
        </div>
        <div class="text-7 sm:text-9 pt-10 leading-11 font-serif">
          Katholische Kirchengemeinde<br>
          St. Josef — St. Johannes
        </div>
        <div class="text-6 sm:text-8 pt-15 flex flex-col items-start space-y-4">
          <router-link :to="`/mediathek/${data.videos[0].id}`" class="link">
            📺 Aktueller Gottesdienst
          </router-link>
          <a :href="data.generalSettings.acolyteSchedule.url" class="link">
            📄 Messdienerplan
          </a>
          <template
            v-for="link in data.generalSettings.startPageLinks"
            :key="link.id"
          >
            <router-link
              v-if="link.target.startsWith('/')"
              class="link"
              :to="link.target"
            >
              {{ link.label }}
            </router-link>
            <a
              v-else
              class="link"
              :href="link.target"
              rel="noopener noreferrer"
            >
              {{ link.label }}
            </a>
          </template>
        </div>
      </div>
      <div class="flex-grow pt-10 flex flex-col justify-center lg:max-w-90">
        <router-link
          v-for="post in data.posts"
          :key="post.slug"
          :to="`/neuigkeiten/${post.slug}`"
          class="not-last:border-b-1px border-gray-200 py-3 first:pt-0"
        >
          <div class="font-serif text-gray-800 text-5 sm:text-6 mb-1 truncate leading-8">
            {{ post.title }}
          </div>
          <div class="text-3 text-gray-700">
            {{ post.authors.map(author => author.name).join(", ") }}
          </div>
        </router-link>
      </div>
    </section>
    <section>
      <h1 class="section-heading"><span>Seelsorger</span></h1>
      <HorizontalScrollContainer :scroll-step-size="220">
        <div
          v-for="person in data.generalSettings.pastors.map(value => value.person)"
          :key="person.name"
          class="w-70 flex-shrink-0 flex flex-col items-center px-8 py-6 bg-white shadow-md rounded-2xl"
        >
          <img
            class="rounded-full w-50 h-50 object-cover mb-8"
            draggable="false"
            :src="person.image.url"
            :alt="person.name"
          >
          <div class="text-6 font-bold">
            {{ person.name }}
          </div>
          <div class="text-5">
            {{ person.role }}
          </div>
        </div>
        <div class="w-1px h-1 flex-shrink-0"/>
      </HorizontalScrollContainer>
    </section>
    <section>
      <h1 class="section-heading"><span>Kirchorte</span></h1>
      <div class="space-y-10">
        <div
          v-for="(church, index) in data.churches"
          :key="church.id"
          class="flex -lg:flex-col"
          :class="index % 2 === 0 ? 'lg:-mr-10 lg:text-right' : 'lg:flex-row-reverse lg:-ml-10'"
        >
          <div class="lg:w-1/2 lg:px-14 lg:py-10">
            <h2 class="font-bold text-9">
              {{ church.name }}
            </h2>
            <div class="text-5">
              in {{ church.location }}
            </div>
            <div class="text-4 leading-7 mt-4">
              {{ church.text }}
            </div>
          </div>
          <img
            class="-lg:max-w-120 -lg:mt-8 lg:w-1/2 object-cover"
            :src="church.image.url"
            :alt="church.name"
          >
        </div>
      </div>
    </section>
    <section>
      <h1 class="section-heading"><span>Pfarrbüro</span></h1>
      <RichContent class="text-4" :content="data.generalSettings.officeSectionContent"/>
    </section>
  </main>
</template>

<style module>

</style>

<script>
  import { useQuery } from "@urql/vue"
  import { useHead } from "@vueuse/head"
  import query from "../gql/pages/index.graphql"
  import HorizontalScrollContainer from "../components/HorizontalScrollContainer.vue"
  import { useSimplifiedStrapiData } from "../simplifyStrapiData.ts"
  import { getFormattedTitle } from "../util"
  import RichContent from "../components/rich/RichContent.vue"

  export default {
    name: "IndexPage",
    components: { RichContent, HorizontalScrollContainer },
    async setup() {
      useHead({
        title: getFormattedTitle("Start")
      })

      const result = await useQuery({
        query
      })

      const data = useSimplifiedStrapiData(result.data)

      return {
        data
      }
    }
  }
</script>
