<template>
  <KApp class="default-layout">
    <nuxt/>
    <KFooter/>
  </KApp>
</template>

<script>
  import KApp from "kiste/components/KApp";
  import KFooter from "kiste/components/KFooter";

  export default {
    name: "DefaultLayout",
    components: { KApp, KFooter }
  };
</script>
