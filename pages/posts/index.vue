<template>
  <div class="posts-page content">
    <NavigationBar :title="title"/>
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
            @click="fetchMore"
          >
            Mehr laden
          </MyButton>
          <span v-else class="posts-page__the-end">
            {{ endReachedMessage }}
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
  import PostCard from "@/components/PostCard"
  import NavigationBar from "@/components/NavigationBar"
  import MyButton from "@/components/MyButton"
  import { combineFieldSets } from "@/assets/js/api-wrapper"
  import { createMeta } from "@/assets/js/meta"

  async function fetchPosts(offset, api, group) {
    const result = await api.posts.list({
      fields: combineFieldSets(PostCard.POST_FIELDS, ["id"]),
      limit: 10,
      offset,
      sortBy: "publishedAt",
      ascending: false,
      onlyRelevant: false,
      onlyPublished: true,
      group
    })

    return {
      hasMore: result.hasMore,
      items: await api.users.populate(result.items, "author", PostCard.POST_AUTHOR_FIELDS)
    }
  }

  export default {
    name: "PostsPage",
    components: { MyButton, NavigationBar, PostCard },
    async asyncData({ app: { $api }, route, error }) {
      const groupID = route.query.group
      let group = null
      if (groupID !== undefined) {
        const groupData = await $api.groups.get(groupID, ["id", "title"])
        if (groupData === null) {
          error({ m: "Diese Gruppe existiert nicht oder nicht mehr.", statusCode: 404 })
          return {}
        }

        group = groupData
      }

      const { hasMore, items: posts } = await fetchPosts(0, $api, route.query.group || "general")
      return { hasMore, posts, group }
    },
    data: () => ({
      posts: [],
      hasMore: false,
      loading: false
    }),
    computed: {
      title() {
        return this.group === null ? "Artikel" : `Artikel von ${this.group.title}`
      },
      endReachedMessage() {
        if (this.group === null) {
          return this.posts.length === 0
            ? "Es gibt noch keine Artikel."
            : "Das sind alle Artikel."
        }
        return this.posts.length === 0
          ? `${this.group.title} hat noch keine Artikel veröffentlicht.`
          : `Das sind alle Artikel von ${this.group.title}.`
      }
    },
    methods: {
      async fetchMore() {
        this.loading = true
        const result = await fetchPosts(this.posts.length, this.$api, this.$route.query.group || "general")
        this.hasMore = result.hasMore
        this.posts.push(...result.items)
        this.loading = false
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          ...createMeta({
            title: this.title,
            description: `Die neuesten Artikel ${
              this.group === null ? "unserer Webseite" : `von ${this.group.title}`
            }.`,
            path: "/posts"
          })
        ]
      }
    },
    watchQuery: ["group"],
    key: route => route.fullPath
  }
</script>
