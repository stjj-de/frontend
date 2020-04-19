<template>
  <div class="admin-layout">
    <AdminNavigation/>
    <div class="admin-layout__content">
      <nuxt/>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/screenSize";
  @use "~@/assets/styles/transitions";

  .admin-layout {
    overflow: hidden;
    width: 100vw;
    padding: 0;
    min-height: 100vh;

    display: flex;
    justify-content: flex-start;
  }

  .admin-layout__content {
    width: calc(100vw - 350px);
    margin-left: 350px;
    padding: 20px 60px 20px;
  }

  @media(max-width: 1000px) {
    .admin-layout {
      flex-direction: column;
    }

    .admin-layout__content {
      padding: 80px 20px 20px;
      width: 100vw;
      margin-left: 0;
    }
  }
</style>

<script>
  import AdminNavigation from "@/components/AdminNavigation/AdminNavigation";

  export default {
    name: "AdminLayout",
    middleware: ["auth"],
    components: { AdminNavigation }
  };
</script>
