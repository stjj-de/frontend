<template>
  <div class="posts-page content">
    <NavigationBar title="Aktuelles"/>
    <main>
      <div class="posts-page__posts" v-if="posts">
        <PostCard
          v-for="post in posts.items"
          :key="post.id"
          class="posts-page__post"
          :post="post"
        />
      </div>
      <div class="posts-page__end-of-list">
        <transition mode="out-in" name="posts-page__fade">
          <MyButton
            v-if="posts.hasMore"
            class="posts-page__load-more"
            :loading="$apollo.queries.posts.loading"
            @click="fetchMorePosts()"
          >
            Mehr laden
          </MyButton>
          <span class="posts-page__the-end" v-else>
            Du hast das Ende erreicht.
          </span>
        </transition>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/transitions";

  @include transitions.fade($name: "posts-page__fade");

  .posts-page__posts {
    display: flex;
    flex-direction: column;
    justify-items: center;

    & > *:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .posts-page__end-of-list {
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .posts-page__the-end {
    font-size: 1.2rem;
  }
</style>

<script>
  import uniqBy from "lodash.uniqby";
  import PostsQuery from "./postsQuery.graphql";
  import PostCard from "@/components/PostCard/PostCard";
  import NavigationBar from "@/components/NavigationBar";
  import MyButton from "@/components/MyButton";

  const POSTS_LOADED_AT_ONCE = 10;

  export default {
    name: "AktuellesPage",
    components: { MyButton, NavigationBar, PostCard },
    head: () => ({
      title: "Aktuelles"
    }),
    apollo: {
      posts: {
        query: PostsQuery,
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
            skip: this.posts.items.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => ({
            posts: {
              __typename: previousResult.posts.__typename,
              items: uniqBy([
                ...previousResult.posts.items,
                ...fetchMoreResult.posts.items
              ], post => post.id),
              hasMore: fetchMoreResult.posts.hasMore
            }
          })
        });
      }
    }
  };
</script>
