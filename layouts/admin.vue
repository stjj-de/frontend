<template>
  <div class="admin-layout">
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
    name: "AdminLayout",
    components: { KApp }
  };
</script>
