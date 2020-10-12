<template>
  <div class="index-page">
    <NavigationBar/>
    <TitleSection :introduction="introduction"/>
    <TransformInternalLinks
      class="quill-enduser content formatted index-page__text"
      tag="div"
      :html="text"
    />
    <PostsSection :posts="posts"/>
    <CalendarSection/>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/quill-enduser";
  @use "~@/assets/styles/formatted";

  .index-page {
    overflow: hidden;
    padding-bottom: 80px;
  }

  .index-page__text {
    margin-top: 100px;

    font-size: 1.2rem;
  }
</style>

<script>
  import NavigationBar from "@/components/NavigationBar"
  import TitleSection from "@/components/pages/index/TitleSection"
  import PostsSection from "@/components/pages/index/PostsSection"
  import CalendarSection from "@/components/pages/index/CalendarSection"
  import { HOMEPAGE_INTRODUCTION, HOMEPAGE_TOP } from "@/assets/js/contents"
  import TransformInternalLinks from "@/components/TransformInternalLinks"

  export default {
    name: "IndexPage",
    components: { TransformInternalLinks, CalendarSection, PostsSection, TitleSection, NavigationBar },
    async asyncData({ $api }) {
      return {
        introduction: await $api.contents.get(HOMEPAGE_INTRODUCTION),
        text: await $api.contents.get(HOMEPAGE_TOP),
        posts: await $api.users.populate(await $api.posts.list({
          fields: PostsSection.POST_FIELDS,
          limit: 2,
          onlyPublished: true,
          onlyRelevant: true,
          group: "general",
          sortBy: "publishedAt",
          ascending: false
        }).then(data => data.items), "author", PostsSection.POST_AUTHOR_FIELDS)
      }
    },
    data: () => ({
      introduction: "",
      text: "",
      posts: []
    }),
    head: () => ({
      title: "Start"
    })
  }
</script>
