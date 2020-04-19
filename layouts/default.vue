<template>
  <div class="default-layout">
    <nuxt/>
    <MyFooter/>
  </div>
</template>

<style scoped lang="scss">
</style>

<script>
  import MyFooter from "@/components/MyFooter";

  export default {
    name: "DefaultLayout",
    components: { MyFooter }
  };
</script>
