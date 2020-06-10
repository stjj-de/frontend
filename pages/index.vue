<template>
  <div class="index-page">
    <NavigationBar/>
    <TitleSection :introduction="introduction"/>
    <PostsSection/>
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
  import PostsSection from "@/components/pages/index/PostsSection/PostsSection";
  import CalendarSection from "@/components/pages/index/CalendarSection/CalendarSection";
  import ContentQuery from "@/assets/ContentQuery.graphql";
  import { HOMEPAGE_INTRODUCTION } from "@/server-shared/content-ids";

  export default {
    name: "IndexPage",
    components: { CalendarSection, PostsSection, TitleSection, NavigationBar },
    head: () => ({
      title: "Start"
    }),
    data: () => ({
      introduction: ""
    }),
    async asyncData({ app }) {
      const $apollo = app.apolloProvider.defaultClient;

      return {
        introduction: (await $apollo.query({
          query: ContentQuery,
          variables: { id: HOMEPAGE_INTRODUCTION }
        })).data.content.content
      };
    }
  };
</script>
