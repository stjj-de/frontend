<template>
  <section class="second-index-section">
    <div class="second-index-section__calendar-section">
      <h1 class="heading--3">
        Kalender
      </h1>
      <span class="second-index-section__gottesdienste-info">
        Aus Gründen der Übersichtlichkeit sind
        <nuxt-link class="link" to="/gemeinde">Gottesdienste</nuxt-link>
        nicht im Kalender eingetragen.
      </span>
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
          <nuxt-link
            class="link second-index-section__show-all-posts"
            to="/aktuelles"
          >
            Ältere Artikel anzeigen
          </nuxt-link>
        </span>
        <nuxt-link
          v-else
          class="link second-index-section__show-all-posts" to="/aktuelles"
        >
          Alle Artikel anzeigen
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/screenSize";

  .second-index-section {
    display: flex;

    @include screenSize.mobile {
      flex-direction: column-reverse;
    }
  }

  .second-index-section__gottesdienste-info {
    display: block;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }

  .second-index-section__calendar-section {
    flex-basis: 400px;

    @include screenSize.notMobile {
      padding: 20px;
    }
  }

  .second-index-section__posts-section {
    flex-basis: 0;
    width: 100%;

    @include screenSize.notMobile {
      flex-basis: 600px;
      flex-grow: 1;
      padding: 20px;
    }
  }

  .second-index-section__posts {
    display: flex;
    flex-direction: column;

    & > *:not(:last-child) {
      margin-bottom: 20px;
    }

    @include screenSize.mobile {
      margin: 0 -10px;
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
        query: PostsQuery,
        update: data => data.posts.items
      }
    }
  };
</script>
