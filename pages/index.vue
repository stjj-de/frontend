<template>
  <div class="index-page">
    <NavigationBar/>
    <TitleSection :introduction="introduction"/>
    <PostsSection :posts="posts"/>
    <CalendarSection/>
  </div>
</template>

<style scoped lang="scss">
  .index-page {
    overflow: hidden;
    padding-bottom: 80px;
  }
</style>

<script>
  import NavigationBar from "@/components/NavigationBar";
  import TitleSection from "@/components/pages/index/TitleSection";
  import PostsSection from "@/components/pages/index/PostsSection";
  import CalendarSection from "@/components/pages/index/CalendarSection";
  import { HOMEPAGE_INTRODUCTION } from "@/assets/js/content-ids";

  export default {
    name: "IndexPage",
    components: { CalendarSection, PostsSection, TitleSection, NavigationBar },
    head: () => ({
      title: "Start"
    }),
    data: () => ({
      introduction: "",
      posts: []
    }),
    async asyncData({ $api }) {
      return {
        introduction: await $api.contents.get(HOMEPAGE_INTRODUCTION),
        posts: await $api.users.populate(await $api.posts.list({
          fields: PostsSection.POST_FIELDS,
          onlyPublished: true,
          onlyRelevant: true,
          sortBy: "publishedAt",
          ascending: false
        }).then(data => data.items), "author", PostsSection.POST_AUTHOR_FIELDS),
      };
    }
  };
</script>
