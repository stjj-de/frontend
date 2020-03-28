<template>
  <div class="index-page">
    <KNavigationBar/>
    <main class="content">
      <FirstIndexSection/>
      <SecondIndexSection/>
      <span class="_image-credits formatted">
        Bild der Kirche St. Josef von
        <a href="https://commons.wikimedia.org/wiki/User:Mstp77">atreyu</a>
        /
        <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA</a>
      </span>
    </main>
  </div>
</template>

<style scoped lang="scss">
  ._image-credits {
    display: block;
    margin-top: 20px;
  }
</style>

<script>
  import KNavigationBar from "kiste/components/KNavigationBar";
  import FirstIndexSection from "@/components/pages/index/FirstIndexSection";
  import SecondIndexSection from "@/components/pages/index/SecondIndexSection/SecondIndexSection";

  export default {
    name: "IndexPage",
    components: { SecondIndexSection, FirstIndexSection, KNavigationBar },
    head: () => ({
      title: "Start"
    })
  };
</script>
