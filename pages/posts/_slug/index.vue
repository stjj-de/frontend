<template>
  <div class="post-page">
    <NavigationBar :title="post.title"/>
    <main class="content">
      <div class="post-page__meta">
        <span class="post-page__title">{{ post.title }}</span>
        <span class="post-page__separator"></span>
        <span class="post-page__date">{{ formattedPublicationDate }}</span>
        <div class="post-page__authors">
          <UserImageWithPopup
            v-for="author in post.authors"
            :key="author.id"
            :user="author"
          />
        </div>
      </div>
      <TransformInternalLinks
        class="quill-enduser formatted"
        tag="article"
        :html="post.content"
      />
    </main>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/colors";

  .post-page__meta {
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
  }

  .post-page__title {
    display: block;
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
  }

  .post-page__separator {
    display: block;
    margin: 20px auto 10px;
    width: 30%;
    height: 2px;
    background-color: transparentize(colors.$background-c, 0.6);
  }

  .post-page__date {
    display: block;
    text-align: center;
    font-size: 1.4rem;
  }

  .post-page__authors {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
  import PostBySlugQuery from "./postBySlugQuery.graphql";
  import NavigationBar from "@/components/NavigationBar";
  import "@/assets/styles/quill-enduser.scss";
  import TransformInternalLinks from "@/components/TransformInternalLinks";
  import { ensureDateObject, formatDate } from "@/assets/js/dateUtils";
  import UserImageWithPopup from "@/components/UserImageWithPopup/UserImageWithPopup";
  import { format } from "date-fns";
  import { de as dateFnsLocale } from "date-fns/locale";

  export default {
    name: "PostPage",
    components: { UserImageWithPopup, TransformInternalLinks, NavigationBar },
    async asyncData({ error, app, params }) {
      const $apollo = app.apolloProvider.defaultClient;

      const { data: { postBySlug: post } } = await $apollo.query({
        query: PostBySlugQuery,
        variables: {
          slug: params.slug
        }
      });

      if (post === null) {
        error({ statusCode: 404, message: "Dieser Artikel existiert nicht." });
      } else {
        return {
          post
        };
      }
    },
    computed: {
      formattedPublicationDate() {
        return format(new Date(this.post.publicationDate), "EEEE, d.L.yyyy", { locale: dateFnsLocale });
      }
    }
  };
</script>
