<template>
  <div class="error-page">
    <main class="error-page__content content formatted">
      <Illustration class="error-page__illustration"/>
      <span class="error-page__message" v-if="error.statusCode === 404">
        {{ error.message === "This page could not be found" ? pageNotFound : error.message }}
      </span>
      <span class="error-page__message" v-else>
        {{ otherError }}
      </span>
      <div class="error-page__back">
        <nuxt-link to="/">
          Zurück zur Startseite
        </nuxt-link>
      </div>
    </main>
    <MyFooter class="error-page__footer"/>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/screenSize";

  .error-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .error-page__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .error-page__message {
    font-size: 2.4rem;

    @include screenSize.mobile {
      font-size: 1.6rem;
    }
  }

  .error-page__illustration {
    max-height: 40vh;
    margin-bottom: 30px;
  }

  .error-page__back {
    margin-top: 30px;
    display: block;
    font-size: 1.2rem;
  }

  .error-page__footer {
    justify-self: flex-end;
  }
</style>

<script>
  import Illustration from "@/assets/illustrations/error-404.svg";
  import MyFooter from "@/components/MyFooter";

  export default {
    components: { MyFooter, Illustration },
    layout: "none",
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
