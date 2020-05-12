<template>
  <div class="posts-section content">
    <div v-if="!$apollo.queries.posts.loading" class="posts-section__posts">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
    <nuxt-link
      v-if="posts.length !== 0"
      class="link posts-section__show-all-posts" to="/aktuelles"
    >
      Alle Artikel anzeigen
    </nuxt-link>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";

  .posts-section {
    margin-top: 50px;
    margin-bottom: 30px;
  }

  .posts-section__posts {
    display: flex;

    & > .post-card {
      min-width: 200px;

      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }

  .posts-section__show-all-posts {
    margin-top: 40px;

    font-size: 1.2rem;
    display: block;
    text-align: center;
  }

  @include screenSize.mobile {
    .posts-section__posts {
      flex-direction: column;

      & > .post-card:not(:last-child) {
        margin-right: 0;
        margin-bottom: 20px;
      }
    }
  }
</style>

<script>
  import PostCard from "@/components/PostCard/PostCard";
  import PostsQuery from "@/components/pages/index/PostsSection/postsQuery.graphql";

  export default {
    name: "PostsSection",
    components: { PostCard },
    apollo: {
      posts: {
        query: PostsQuery,
        update: data => data.posts.items
      }
    }
  };
</script>
