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
      introduction: ""
    }),
    async asyncData({ app }) {
      // TODO: Get text
    }
  };
</script>
