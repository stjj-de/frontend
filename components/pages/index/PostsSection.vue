<template>
  <div class="posts-section content">
    <div class="posts-section__posts">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
    <div class="posts-section__show-all-posts">
      <nuxt-link
        v-if="posts && posts.length !== 0"
        class="link"
        to="/posts"
      >
        Alle Artikel anzeigen
      </nuxt-link>
    </div>
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
    margin-top: 20px;

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
  import PostCard from "@/components/PostCard"
  import { combineFieldSets } from "@/assets/js/api-wrapper"

  export default {
    name: "PostsSection",
    components: { PostCard },
    props: {
      posts: {
        type: Array,
        required: true
      }
    },
    POST_FIELDS: combineFieldSets(PostCard.POST_FIELDS, ["id"]),
    POST_AUTHOR_FIELDS: PostCard.POST_AUTHOR_FIELDS
  }
</script>
