<template>
  <div class="index-page">
    <KNavigationBar/>
    <FirstIndexSection/>
    <SecondIndexSection/>
  </div>
</template>

<style scoped lang="scss">
  .index-page {
    overflow: auto;
    min-height: 100vh;

    padding-bottom: 40px;
  }
</style>

<script>
  import KNavigationBar from "kiste/components/KNavigationBar";
  import FirstIndexSection from "@/components/pages/index/FirstIndexSection";
  import SecondIndexSection from "@/components/pages/index/SecondIndexSection";

  export default {
    name: "IndexPage",
    components: { SecondIndexSection, FirstIndexSection, KNavigationBar }
  };
</script>
