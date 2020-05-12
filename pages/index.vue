<template>
  <div class="index-page">
    <NavigationBar/>
    <TitleSection/>
    <PostsSection/>
    <CalendarSection/>
    <KindergartenSection/>
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
  import KindergartenSection from "@/components/pages/index/KindergartenSection";

  export default {
    name: "IndexPage",
    components: { KindergartenSection, CalendarSection, PostsSection, TitleSection, NavigationBar },
    head: () => ({
      title: "Start"
    })
  };
</script>
