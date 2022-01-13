<template>
  <NotFound resource="Diese Seite"/>
</template>

<style module>

</style>

<script>
  import { useHead } from "@vueuse/head"
  import NotFound from "../components/NotFound.vue"
  import { getFormattedTitle } from "../util"

  export default {
    name: "FallbackPage",
    components: { NotFound },
    setup() {
      useHead({
        title: getFormattedTitle("Nicht gefunden.")
      })
    }
  }
</script>
