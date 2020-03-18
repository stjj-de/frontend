<template>
  <div class="posts-page content">
    <KNavigationBar title="Alle Artikel"/>
    <main>
      <div class="_posts">
        <PostCard v-for="post in posts" :key="post.id" :post="post"/>
      </div>
      <div class="_end-of-list">
        <transition mode="out-in" name="fade">
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
        </transition>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/transitions";

  @include transitions.fade();

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
  import uniqBy from "lodash.uniqby";
  import KNavigationBar from "kiste/components/KNavigationBar";
  import KButton from "kiste/components/KButton";
  import PostsQuery from "./postsQuery.graphql";
  import PostCard from "@/components/PostCard/PostCard";

  const POSTS_LOADED_AT_ONCE = 5;

  export default {
    name: "PostsPage",
    components: { PostCard, KNavigationBar, KButton },
    head: () => ({
      title: "Artikel-Archiv"
    }),
    data: () => ({
      hasMore: true
    }),
    apollo: {
      posts: {
        query: PostsQuery,
        variables: {
          skip: 0,
          take: POSTS_LOADED_AT_ONCE
        },
        result({ data }) {
          this.hasMore = Array.isArray(data.posts) && data.posts.length === POSTS_LOADED_AT_ONCE;
        }
      }
    },
    methods: {
      fetchMorePosts() {
        this.$apollo.queries.posts.fetchMore({
          variables: {
            skip: this.posts.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => ({
            posts: uniqBy([
              ...previousResult.posts,
              ...fetchMoreResult.posts
            ], post => post.id)
          })
        });
      }
    }
  };
</script>
