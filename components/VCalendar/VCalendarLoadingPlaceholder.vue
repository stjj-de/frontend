<template>
  <LoadingPlaceholder width="100%" height="270px">
    Kalender wird geladen
  </LoadingPlaceholder>
</template>

<style scoped lang="scss">

</style>

<script>
  import LoadingPlaceholder from "@/components/LoadingPlaceholder"

  export default {
    name: "VCalendarLoadingPlaceholder",
    components: { LoadingPlaceholder }
  }
</script>
