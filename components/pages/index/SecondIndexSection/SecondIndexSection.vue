<template>
  <section class="second-index-section">
    <div class="second-index-section__calendar-section">
      <h1 class="heading--3">
        Kalender
      </h1>
      <EventCalendar/>
    </div>
    <div class="second-index-section__posts-section">
      <h1 class="heading--3">
        Aktuelles
      </h1>
      <div v-if="!$apollo.queries.posts.loading" class="second-index-section__posts">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
        <span v-if="posts.length === 0" class="second-index-section__no-news">
          Zurzeit gibt es keine Neuigkeiten.
          <nuxt-link class="link second-index-section__show-all-posts" to="/posts">Ältere Artikel anzeigen</nuxt-link>
        </span>
        <nuxt-link
          v-else
          class="link second-index-section__show-all-posts" to="/posts"
        >
          Alle Artikel anzeigen
        </nuxt-link>
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

  .second-index-section__calendar-section {
    flex-basis: 500px;

    @include screenSize.notMobile {
      padding: 20px;
    }
  }

  .second-index-section__posts-section {
    @include screenSize.notMobile {
      padding: 20px;
    }
  }

  .second-index-section__posts {
    display: flex;
    flex-direction: column;

    & > *:not(:last-child) {
      margin-bottom: var(--gutter-size);
    }
  }

  .second-index-section__no-news {
    font-size: 1.3rem;
  }

  .second-index-section__show-all-posts {
    margin-left: auto;
    font-size: 1.2rem;
    display: inline-block;
  }
</style>

<script>
  import PostsQuery from "./postsQuery.graphql";
  import PostCard from "@/components/PostCard/PostCard";
  import EventCalendar from "@/components/EventCalendar/EventCalendar";

  export default {
    name: "SecondIndexSection",
    components: { EventCalendar, PostCard },
    apollo: {
      posts: {
        query: PostsQuery
      }
    }
  };
</script>
