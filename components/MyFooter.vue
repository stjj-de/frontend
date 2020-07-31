<template>
  <footer class="my-footer">
    <nuxt-link
      v-for="item in $options.items"
      class="my-footer__link link"
      :key="item.label"
      :to="item.to"
      @click.native.passive="open = false"
    >
      {{ item.label }}
    </nuxt-link>
  </footer>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";
  @use "~@/assets/styles/colors";

  .my-footer {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100vw;
    height: 100px;
  }

  .my-footer__link:not(:last-child) {
    margin-right: 20px;
  }

  @include screenSize.mobile {
    .my-footer {
      height: auto;
      flex-direction: column;
      padding-top: 30px;
      padding-bottom: 20px;
    }

    .my-footer__link:not(:last-child) {
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
</style>

<script>
  export default {
    name: "MyFooter",
    items: [
      {
        label: "Impressum",
        to: "/impressum"
      },
      {
        label: "Datenschutzerklärung",
        to: "/datenschutz"
      },
      {
        label: "Anmelden",
        to: "/login"
      }
    ]
  };
</script>
