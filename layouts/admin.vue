<template>
  <div class="admin-layout">
    <KApp class="_container">
      <AdminNavigation/>
      <div class="_content">
        <transition name="admin-page">
          <nuxt/>
        </transition>
      </div>
    </KApp>
  </div>
</template>

<style scoped lang="scss">
  @use "~kiste/css/mixins/screenSize";
  @use "~@/assets/styles/transitions";

  @include transitions.fade($name: "admin-page", $duration: 400ms);

  ._container {
    overflow: hidden;
    width: 100vw;
    padding: 0;

    display: flex;
    justify-content: flex-start;
  }

  ._content {
    width: calc(100vw - 350px);
    margin-left: 350px;
    padding: 20px 60px 50px;
  }

  @media(max-width: 1000px) {
    ._container {
      flex-direction: column;
    }

    ._content {
      padding: 80px 20px 0;
      width: 100vw;
      margin-left: 0;
    }
  }
</style>

<script>
  import KApp from "kiste/components/KApp";
  import AdminNavigation from "@/components/AdminNavigation/AdminNavigation";

  export default {
    name: "AdminLayout",
    middleware: ["auth"],
    components: { AdminNavigation, KApp }
  };
</script>
