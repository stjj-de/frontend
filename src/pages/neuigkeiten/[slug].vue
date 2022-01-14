<template>
  <Head>
    <title>{{ title }}</title>
  </Head>
  <NotFound v-if="post === null" resource="Dieser Artikel"/>
  <main v-else>
    <article>
      <h1 class="font-bold text-10 text-gray-800">
        {{ post.title }}
      </h1>
      <div class="rounded-md border-2 border-gray-200 w-90 p-5 mt-5 mb-10">
        <div class="text-gray-600 uppercase font-bold text-s1 tracking-wide">
          Veröffentlicht am {{ formatDate(post.publicationDate) }}
        </div>
        <div class="flex space-x-2 pt-4">
          <UploadedImage
            v-for="author in post.authors"
            :key="author.id"
            class="rounded-full h-14 w-14 object-cover shadow-lg"
            draggable="false"
            :url="author.image.url"
            :alt="author.name"
          />
        </div>
      </div>
      <RichContent class="text-4" :content="post.content"/>
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
  import { getFormattedTitle } from "../../util"
  import { useSimplifiedStrapiData } from "../../simplifyStrapiData"
  import NotFound from "../../components/NotFound.vue"
  import RichContent from "../../components/rich/RichContent.vue"
  import UploadedImage from "../../components/UploadedImage.vue"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  export default {
    name: "PostPage",
    components: { UploadedImage, RichContent, NotFound, Head },
    async setup() {
      const route = useRoute()

      const result = await useQuery({
        query,
        variables: {
          slug: route.params.slug
        }
      })

      const data = useSimplifiedStrapiData(result.data)
      const post = computed(() => data.value.posts.length === 0 ? null : data.value.posts[0])
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
