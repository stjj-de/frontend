<template>
  <div class="default-layout">
    <nuxt/>
    <MyFooter v-if="!isAdmin"/>
  </div>
</template>

<style scoped lang="scss">
  .default-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>

<script>
  import MyFooter from "@/components/MyFooter";

  export default {
    name: "DefaultLayout",
    components: { MyFooter },
    computed: {
      isAdmin() {
        return this.$route.path.startsWith("/admin");
      }
    }
  };
</script>
