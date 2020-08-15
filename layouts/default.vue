<template>
  <div class="default-layout">
    <flash-message class="default-layout__flash-messages" transitionName="default-layout__flash-slide"/>
    <nuxt/>
    <MyFooter v-if="!isAdmin"/>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/transitions";

  @include transitions.slide("default-layout__flash-slide", $offset: 100px, $duration: 200ms);

  .default-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .default-layout__flash-messages {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
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
