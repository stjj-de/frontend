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
          <img
            v-for="author in post.authors"
            :key="author.id"
            class="rounded-full h-14 w-14 object-cover shadow-lg"
            draggable="false"
            :src="author.image.url"
            :alt="author.name"
          >
        </div>
      </div>
      <RichContent :content="post.content"/>
    </article>
  </main>
</template>

<style module>

</style>

<script>
  import { Head } from "@vueuse/head"
  import { useQuery, gql } from "@urql/vue"
  import { useRoute } from "vue-router"
  import { computed } from "vue"
  import { getFormattedTitle } from "../../util"
  import { useSimplifiedStrapiData } from "../../simplifyStrapiData"
  import NotFound from "../../components/NotFound.vue"
  import RichContent from "../../components/rich/RichContent.vue"

  const dateFormat = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  export default {
    name: "PostPage",
    components: { RichContent, NotFound, Head },
    async setup() {
      const route = useRoute()

      const result = await useQuery({
        query: gql`
          query ($slug: String!) {
            posts(filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
              data {
                attributes {
                  title
                  authors {
                    data {
                      id
                      attributes {
                        name
                        image {
                          data {
                            attributes {
                              url
                            }
                          }
                        }
                      }
                    }
                  }

                  publicationDate
                  content {
                    ...on ComponentRichMarkdown {
                      content
                    }

                    ...on ComponentRichFile {
                      label
                      file {
                        data {
                          attributes {
                            mime
                            url
                          }
                        }
                      }
                    }

                    ...on ComponentRichHeading {
                      level
                      text
                    }

                    ...on ComponentRichPicture {
                      picture {
                        data {
                          attributes {
                            url
                            alternativeText
                          }
                        }
                      }
                    }

                    ...on ComponentRichPostLink {
                      post {
                        data {
                          attributes {
                            title
                            slug
                            publicationDate

                            authors {
                              data {
                                attributes {
                                  image {
                                    data {
                                      attributes {
                                        url
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
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
