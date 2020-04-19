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
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    min-height: 100vh;
  }

  ._back-link {
    margin-top: 40px;
    display: block;
    font-size: 1.2rem;
  }
</style>

<script>
  export default {
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
