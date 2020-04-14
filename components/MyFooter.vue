<template>
  <footer class="my-footer">
    <nuxt-link
      v-for="item in $options.items"
      class="my-footer__link underlined-link"
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
      flex-direction: column;
      margin-bottom: 10px;
    }

    .my-footer__link:not(:last-child) {
      margin-right: 0;
      margin-bottom: 10px;
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
        to: "/datenschutzerklaerung"
      },
      {
        label: "Anmelden",
        to: "/login"
      }
    ]
  };
</script>
