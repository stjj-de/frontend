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
    padding: 20px 60px 60px;
  }

  @media(max-width: 1000px) {
    .admin-page {
      flex-direction: column;
    }

    .admin-page__content {
      padding: 100px 20px 20px;
      width: 100vw;
      margin-left: 0;
    }
  }
</style>

<script>
  import AdminNavigation from "@/components/AdminNavigation"

  export default {
    name: "AdminPage",
    middleware: ["auth"],
    components: { AdminNavigation },
    async asyncData({ $api, store }) {
      store.commit("setUserPromise", (async () => {
        store.commit("setUser", await $api.groups.populate(
          await $api.users.get(
            store.state.userID,
            ["id", "username", "realName", "displayName", "position", "groups", "role", "image"]
          ),
          "groups",
          ["id", "title"]
        ))
      })())

      await store.state.userPromise
    }
  }
</script>
