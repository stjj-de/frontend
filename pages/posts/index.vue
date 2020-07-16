<template>
  <div class="posts-page content">
    <NavigationBar title="Artikel"/>
    <main v-if="posts">
      <div class="posts-page__posts">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          class="posts-page__post"
          :post="post"
        />
      </div>
      <div class="posts-page__end-of-list">
        <transition mode="out-in" name="posts-page__fade">
          <MyButton
            v-if="hasMore"
            class="posts-page__load-more"
            :loading="loading"
            @click="fetchMore()"
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
  import PostCard from "@/components/PostCard";
  import NavigationBar from "@/components/NavigationBar";
  import MyButton from "@/components/MyButton";
  import { combineFieldSets } from "@/assets/js/APIWrapper";

  async function fetchPosts(offset, api) {
    const result = await api.posts.list({
      fields: combineFieldSets(PostCard.POST_FIELDS, ["id"]),
      limit: 10,
      offset,
      sortBy: "publishedAt",
      ascending: false,
      onlyRelevant: false,
      onlyPublished: true
    });

    return {
      hasMore: result.hasMore,
      items: await api.users.populate(result.items, "author", PostCard.POST_AUTHOR_FIELDS)
    };
  }

  export default {
    name: "PostsPage",
    components: { MyButton, NavigationBar, PostCard },
    head: () => ({
      title: "Artikel"
    }),
    data: () => ({
      posts: [],
      hasMore: false,
      loading: false
    }),
    async asyncData({ app: { $api } }) {
      const { hasMore, items: posts } = await fetchPosts(0, $api);
      return { hasMore, posts };
    },
    methods: {
      async fetchMore() {
        this.loading = true;
        const result = await fetchPosts(this.posts.length, this.$api);
        this.hasMore = result.hasMore;
        this.posts.push(...result.items);
        this.loading = false;
      }
    }
  };
</script>
