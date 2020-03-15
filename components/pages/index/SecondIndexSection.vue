<template>
  <section class="second-index-section content">
    <div class="_calendar-section">
      <h1 class="heading--3">
        Termine
      </h1>
      <EventCalendar/>
    </div>
    <div class="_posts-section">
      <h1 class="heading--3">
        Aktuelles
      </h1>
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

    @include screenSize.mobile {
      flex-direction: column-reverse;
    }
  }

  ._calendar-section {
    flex-basis: 500px;

    @include screenSize.notMobile {
      padding: 20px;
    }
  }

  ._posts-section {
    @include screenSize.notMobile {
      padding: 20px;
    }
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
  import EventCalendar from "@/components/EventCalendar/EventCalendar";

  export default {
    name: "SecondIndexSection",
    components: { EventCalendar, PostCard },
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
