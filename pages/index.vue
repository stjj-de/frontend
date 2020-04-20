<template>
  <div class="index-page">
    <NavigationBar title="Start"/>
    <main class="content">
      <FirstIndexSection/>
      <SecondIndexSection/>
      <span class="index-page__image-credits formatted">
        Bild der Kirche St. Josef von
        <a href="https://commons.wikimedia.org/wiki/User:Mstp77">atreyu</a>
        /
        <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA</a>
      </span>
    </main>
  </div>
</template>

<style scoped lang="scss">
  .index-page__image-credits {
    display: block;
    margin-top: 20px;
  }
</style>

<script>
  import FirstIndexSection from "@/components/pages/index/FirstIndexSection";
  import SecondIndexSection from "@/components/pages/index/SecondIndexSection/SecondIndexSection";
  import NavigationBar from "@/components/NavigationBar";

  export default {
    name: "IndexPage",
    components: { NavigationBar, SecondIndexSection, FirstIndexSection },
    head: () => ({
      title: "Start"
    })
  };
</script>
