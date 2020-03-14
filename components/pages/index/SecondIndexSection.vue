<template>
  <section class="second-index-section content">
    <div class="_calendar-section">
      <span class="heading--4">
        Termine
      </span>
      <client-only>
        <v-calendar is-expanded/>
      </client-only>
    </div>
    <div class="_posts-section">
      <span class="heading--4">
        Aktuelles
      </span>
      <div v-if="!$apollo.queries.posts.loading" class="_posts">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
        <span v-if="posts.length === 0" class="_no-news">
          Zurzeit gibt es keine Neuigkeiten.
          <nuxt-link class="link _show-all-posts" to="/posts">Ältere Artikel anzeigen</nuxt-link>
        </span>
        <nuxt-link v-else class="link _show-all-posts" to="/posts">Alle Artikel anzeigen</nuxt-link>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  @use "~kiste/css/mixins/screenSize";

  .second-index-section {
    display: flex;

    @media (max-width: 800px) {
      flex-direction: column-reverse;
    }
  }

  ._calendar-section {
    padding: 20px;
    width: 350px;
    max-width: 100%;
  }

  ._posts-section {
    padding: 20px;
    min-width: 200px;
  }

  ._posts {
    display: flex;
    flex-direction: column;

    & > *:not(:last-child) {
      margin-bottom: var(--gutter-size);
    }
  }

  ._no-news {
    font-size: 1.3rem;
  }

  ._show-all-posts {
    margin-left: auto;
    font-size: 1.2rem;
    display: inline-block;
  }
</style>

<script>
  import gql from "graphql-tag";
  import PostCard, { postFragment as postCardPostFragment } from "@/components/PostCard";

  export default {
    name: "SecondIndexSection",
    components: { PostCard },
    apollo: {
      posts: {
        query: gql`
          query {
            posts(onlyRelevant: true) {
              ...PostCardPostFields
            }
          }

          ${postCardPostFragment}
        `
      }
    }
  };
</script>
