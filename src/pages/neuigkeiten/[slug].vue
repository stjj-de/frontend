<template>
  <Head>
    <title>{{ title }}</title>
  </Head>
  <NotFound v-if="post === null" resource="Dieser Artikel"/>
  <main v-else>
    <article>
      <div class="flex flex-col items-center pb-15 space-y-5">
        <h1 class="font-bold text-10 font-serif text-gray-800 text-center">
          {{ post.title }}
        </h1>
        <div
          style="background-image: url('/divider-1.svg')"
          class="h-8 w-full bg-center bg-contain bg-no-repeat opacity-80"
        />
        <div class="text-gray-800 text-3">
          {{ formatDate(post.publicationDate) }}
        </div>
        <div class="pt-2 flex justify-center space-x-4">
          <UploadedImage
            v-for="author in post.authors"
            :key="author.id"
            class="rounded-full h-16 w-16 object-cover shadow-md"
            draggable="false"
            :url="author.image.url"
            :alt="author.displayName"
            :title="author.displayName"
          />
        </div>
      </div>
      <Document class="text-4" :data="post.content.document"/>
      <div class="pt-10">
        <div class="text-gray-400 text-4 font-bold leading-wider pb-4">
          Geschrieben von
        </div>
        <div class="flex flex-wrap items-start gap-4">
          <div
            v-for="author in post.authors"
            :key="author.id"
            class="flex space-x-5 border-2 border-gray-300 rounded-lg border-dashed p-4 sm:p-6"
          >
            <UploadedImage
              class="rounded-full h-18 w-18 sm:h-25 sm:w-25 object-cover shadow-md"
              draggable="false"
              :url="author.image.url"
              :alt="author.displayName"
            />
            <div class="text-5 pt-1 sm:pt-5 pr-2">
              <div>
                {{ author.displayName }}
              </div>
              <div class="text-gray-600">
                {{ author.role }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style module>

</style>

<script>
  import { Head } from "@vueuse/head"
  import { useQuery } from "@urql/vue"
  import { useRoute } from "vue-router"
  import { computed } from "vue"
  import query from "../../gql/pages/neuigkeiten/[slug].graphql"
  import { getFormattedTitle } from "../../util/index.ts"
  import NotFound from "../../components/NotFound.vue"
  import UploadedImage from "../../components/UploadedImage.vue"
  import Document from "../../components/document/Document.vue"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  export default {
    name: "PostPage",
    components: { Document, UploadedImage, NotFound, Head },
    async setup() {
      const route = useRoute()

      const { data } = await useQuery({
        query,
        variables: {
          slug: route.params.slug
        }
      })

      const post = computed(() => data.value.post)
      const title = computed(() => getFormattedTitle(post.value === null ? "Nicht gefunden" : post.value.title))

      return {
        data,
        post,
        title,
        formatDate: isoString => dateFormat.format(new Date(isoString))
      }
    }
  }
</script>
