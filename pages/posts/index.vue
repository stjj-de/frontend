<template>
  <div class="posts-page content">
    <KNavigationBar title="Alle Artikel"/>
    <div class="_posts">
      <PostCard v-for="post in posts" :key="post.id" :post="post"/>
    </div>
    <div class="_end-of-list">
      <KButton
        v-if="hasMore"
        class="_load-more"
        :loading="$apollo.queries.posts.loading"
        @click="fetchMorePosts()"
      >
        Mehr laden
      </KButton>
      <span class="_the-end" v-else>
        Du hast das Ende erreicht.
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  ._posts {
    display: flex;
    flex-direction: column;
    justify-items: center;

    & > *:not(:last-child) {
      margin-bottom: var(--gutter-size);
    }
  }

  ._end-of-list {
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  ._the-end {
    font-size: 1.2rem;
  }
</style>

<script>
  import gql from "graphql-tag";
  import uniqBy from "lodash.uniqby";
  import KNavigationBar from "kiste/components/KNavigationBar";
  import KButton from "kiste/components/KButton";
  import PostCard, { postFragment as postCardPostFragment } from "@/components/PostCard";

  const POSTS_LOADED_AT_ONCE = 5;

  export default {
    name: "PostsPage",
    components: { PostCard, KNavigationBar, KButton },
    data: () => ({
      hasMore: true
    }),
    apollo: {
      posts: {
        query: gql`
        query($skip: Int!, $take: Int!) {
          posts(take: $take, skip: $skip, onlyPublished: true, onlyRelevant: false) {
            id
            ...PostCardPostFields
          }
        }

        ${postCardPostFragment}
        `,
        variables: {
          skip: 0,
          take: POSTS_LOADED_AT_ONCE
        }
      }
    },
    methods: {
      fetchMorePosts() {
        this.$apollo.queries.posts.fetchMore({
          variables: {
            skip: this.posts.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.hasMore = fetchMoreResult.posts.length === POSTS_LOADED_AT_ONCE;

            return {
              posts: uniqBy([
                ...previousResult.posts,
                ...fetchMoreResult.posts
              ], post => post.id)
            };
          }
        });
      }
    }
  };
</script>
