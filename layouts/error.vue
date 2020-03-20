<template>
  <div class="error-page">
    <main class="formatted">
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <nuxt-link to="/" class="_back-link">
        Zurück zur Startseite
      </nuxt-link>
    </main>
  </div>
</template>

<style scoped lang="scss">
  .error-page {
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  ._back-link {
    margin-top: 40px;
    display: block;
    font-size: 1.2rem;
  }
</style>

<script>
  import KNavigationBar from "kiste/components/KNavigationBar";

  export default {
    components: { KNavigationBar },
    props: {
      error: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        pageNotFound: "Diese Seite existiert nicht :/",
        otherError: "Ein Fehler ist aufgetreten :("
      };
    },
    head() {
      return {
        title: this.error.statusCode === 404 ? this.pageNotFound : this.otherError
      };
    }
  };
</script>
