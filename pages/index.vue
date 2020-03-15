<template>
  <div class="index-page">
    <KNavigationBar/>
    <FirstIndexSection/>
    <SecondIndexSection/>
  </div>
</template>

<style scoped lang="scss">

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
