<template>
  <div class="admin-page">
    <AdminNavigation/>
    <div class="admin-page__content">
      <nuxt-child/>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/_screenSize.scss";
  @use "~@/assets/styles/_transitions.scss";

  .admin-page {
    overflow: hidden;
    width: 100vw;
    padding: 0;
    min-height: 100vh;

    display: flex;
    justify-content: flex-start;
  }

  .admin-page__content {
    width: calc(100vw - 350px);
    margin-left: 350px;
    padding: 20px 60px 20px;
  }

  @media(max-width: 1000px) {
    .admin-page {
      flex-direction: column;
    }

    .admin-page__content {
      padding: 80px 20px 20px;
      width: 100vw;
      margin-left: 0;
    }
  }
</style>

<script>
  import AdminNavigation from "@/components/AdminNavigation/AdminNavigation";

  export default {
    name: "AdminPage",
    middleware: ["auth"],
    components: { AdminNavigation }
  };
</script>
