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
    async asyncData({ app: { $axios } }) {
      const postFields = "id,slug,title,excerpt,publishedAt,authors";

      return {
        introduction: await $axios.$get(`/api/contents/${HOMEPAGE_INTRODUCTION}`),
        posts: await Promise.all((await $axios.$get(`/api/posts?limit=2&fields=${postFields}&onlyRelevant=true`))
          .items.map(async item => ({
            ...item,
            authors: await Promise.all(item.authors
              .map(async id => (await $axios.$get(`/api/users/${id}?fields=id,imageID,displayName,position`)).data))
          })))
      };
    }
  };
</script>
