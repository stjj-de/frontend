<template>
  <div class="post-page">
    <NavigationBar title="Aktuelles"/>
    <main class="content">
      <div class="post-page__meta">
        <span v-if="irrelevant" class="post-page__irrelevant">Dieser Artikel ist <b>nicht mehr relevant</b>.</span>
        <span class="post-page__title">{{ post.title }}</span>
        <span class="post-page__separator"></span>
        <span class="post-page__date">{{ formattedPublicationDate }}</span>
        <div class="post-page__authors">
          <UserImageWithPopup center :user="post.author"/>
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

  .post-page__irrelevant {
    display: block;
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
    padding: 20px 10px;
    color: darken(colors.$red, 10);
    border: 2px solid transparentize(colors.$red, 0.2);
    border-radius: 10px;
  }

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
  import { createMeta } from "@/assets/js/meta";

  export default {
    name: "PostPage",
    components: { UserImageWithPopup, TransformInternalLinks, NavigationBar },
    head() {
      return {
        title: this.post.title,
        meta: [
          ...createMeta({
            title: this.post.title,
            description: this.post.excerpt,
            path: `/posts/${this.post.slug}`
          })
        ]
      };
    },
    data: () => ({
      post: {}
    }),
    async asyncData({ error, app: { $api }, params }) {
      const post = await $api.posts.get(`_${params.slug}`, ["title", "excerpt", "slug", "relevantUntil", "publishedAt", "content", "author"]);

      if (post === null) {
        error({ statusCode: 404, m: "Dieser Artikel existiert nicht." });
      } else {
        const fullPost = await $api.users.populate(post, "author", UserImageWithPopup.USER_FIELDS);
        return { post: fullPost };
      }
    },
    computed: {
      formattedPublicationDate() {
        return format(new Date(this.post.publishedAt), "EEEE, d.L.yyyy", { locale: dateFnsLocale });
      },
      irrelevant() {
        return this.post.relevantUntil !== null && Date.parse(this.post.relevantUntil) < Date.now()
      }
    }
  };
</script>
