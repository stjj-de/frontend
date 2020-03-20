<template>
  <div class="only-app-layout">
    <KApp>
      <nuxt/>
    </KApp>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
  import KApp from "kiste/components/KApp";

  export default {
    name: "OnlyAppLayout",
    components: { KApp }
  };
</script>
