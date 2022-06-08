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
          <a :href="getBackendUrl(data.settingsSingletons[0].acolyteSchedule.url)" class="link">
            📄 Messdienerplan
          </a>
          <template
            v-for="link in data.settingsSingletons[0].homePageLinks"
            :key="link.id"
          >
            <UnknownLink :to="link.url">
              {{ link.emoji }} {{ link.text }}
            </UnknownLink>
          </template>
        </div>
      </div>
      <div class="flex-grow pt-10 flex flex-col justify-center lg:max-w-90">
        <div class="flex flex-col justify-center">
          <router-link
            v-for="post in data.posts"
            :key="post.slug"
            :to="`/neuigkeiten/${post.slug}`"
            class="not-last:border-b-1px border-gray-200 py-3 first:pt-0"
          >
            <div class="font-serif text-gray-800 text-5 sm:text-6 mb-1 truncate leading-8">
              {{ post.title }}
            </div>
            <div class="text-2 text-gray-700">
              {{ post.authors.map(author => author.displayName).join(", ") }}
            </div>
          </router-link>
        </div>
      </div>
    </section>
    <section>
      <h1 class="section-heading"><span>Seelsorger</span></h1>
      <HorizontalScrollContainer :scroll-step-size="220">
        <PersonCard
          v-for="person in data.settingsSingletons[0].pastors"
          :key="person.id"
          :person="person"
        />
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
            <Document class="text-4 mt-4" :data="church.description.document"/>
          </div>
          <div class="relative -lg:max-w-120 -lg:mt-8 lg:w-1/2">
            <UploadedImageWithShadow
              :url="church.image.url"
              :alt="church.name"
              class="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
    <section>
      <h1 class="section-heading"><span>Pfarrbüro</span></h1>
      <Document class="text-4" :increment-heading-levels-by="1" :data="data.settingsSingletons[0].officeSectionContent.document"/>
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
  import { getFormattedTitle, getBackendUrl } from "../util"
  import UploadedImage from "../components/UploadedImage.vue"
  import UnknownLink from "../components/UnknownLink.vue"
  import Document from "../components/document/Document.vue"
  import PersonCard from "../components/PersonCard.vue"
  import UploadedImageWithShadow from "../components/UploadedImageWithShadow.vue"

  export default {
    name: "IndexPage",
    components: { UploadedImageWithShadow, PersonCard, Document, UnknownLink, UploadedImage, HorizontalScrollContainer },
    async setup() {
      useHead({
        title: getFormattedTitle("Start")
      })

      const { data } = await useQuery({
        query
      })

      return {
        data,
        getBackendUrl
      }
    }
  }
</script>
