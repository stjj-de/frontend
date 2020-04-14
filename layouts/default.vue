<template>
  <div class="default-layout">
    <nuxt/>
    <MyFooter/>
  </div>
</template>

<style scoped lang="scss">
  .k-footer {
    margin-top: 50px;
  }
</style>

<script>
  import MyFooter from "@/components/MyFooter";

  export default {
    name: "DefaultLayout",
    components: { MyFooter }
  };
</script>
