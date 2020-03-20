<template>
  <div class="admin-layout">
    <KApp>
      <div class="_container">
        <AdminNavigation/>
        <div class="_content">
          <transition name="admin-page">
            <nuxt/>
          </transition>
        </div>
      </div>
    </KApp>
  </div>
</template>

<style scoped lang="scss">
  @use "~kiste/css/mixins/screenSize";
  @use "~@/assets/styles/transitions";

  @include transitions.fade($name: "admin-page", $duration: 400ms);

  .admin-layout {
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
  }

  ._container {
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
  }

  ._content {
    max-width: 100%;
    width: var(--content-width);
  }

  @include screenSize.mobile {
    ._container {
      flex-direction: column;
    }

    ._content {
      padding: 0 var(--content-padding);
    }
  }
</style>

<script>
  import KApp from "kiste/components/KApp";
  import AdminNavigation from "@/components/AdminNavigation/AdminNavigation";

  export default {
    name: "AdminLayout",
    components: { AdminNavigation, KApp }
  };
</script>
