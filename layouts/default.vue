<template>
  <div class="default-layout">
    <nuxt/>
    <MyFooter v-if="!isAdmin"/>
  </div>
</template>

<style scoped lang="scss">

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
