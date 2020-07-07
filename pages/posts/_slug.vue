<template>
  <div class="post-page">
    <NavigationBar title="Aktuelles"/>
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
        class="quill-enduser formatted post-page__article"
        tag="article"
        :html="post.content"
      />
    </main>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/screenSize";

  .post-page__meta {
    width: 700px;
    max-width: 100%;
    margin: 20px auto 40px;
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
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
  import { format } from "date-fns";
  import { de as dateFnsLocale } from "date-fns/locale";
  import NavigationBar from "@/components/NavigationBar";
  import "@/assets/styles/quill-enduser.scss";
  import TransformInternalLinks from "@/components/TransformInternalLinks";
  import UserImageWithPopup from "@/components/UserImageWithPopup";

  export default {
    name: "PostPage",
    components: { UserImageWithPopup, TransformInternalLinks, NavigationBar },
    head() {
      return {
        title: this.post.title
      };
    },
    data: () => ({
      post: null
    }),
    async asyncData({ error, app: { $axios }, params }) {
      const fields = "title,publishedAt,content,authors";
      let post = (await $axios.$get(`/api/posts/_${params.slug}?fields=${fields}`, { validateStatus: status => [200, 400].includes(status) })).data

      if (post === null) {
        error({ statusCode: 404, message: "Dieser Artikel existiert nicht." });
      } else {
        post = {
          ...post,
          authors: await Promise.all(post.authors.map(async id => (await $axios.$get(`/api/users/${id}?fields=displayName,position,imageID`)).data))
        }

        return { post };
      }
    },
    computed: {
      formattedPublicationDate() {
        return format(new Date(this.post.publishedAt), "EEEE, d.L.yyyy", { locale: dateFnsLocale });
      }
    }
  };
</script>
