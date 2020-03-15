<template>
  <LoadingPlaceholder width="280px" height="270px">
    Kalender wird geladen
  </LoadingPlaceholder>
</template>

<style scoped lang="scss">

</style>

<script>
  import LoadingPlaceholder from "@/components/loading/LoadingPlaceholder";

  export default {
    name: "VCalendarLoadingPlaceholder",
    components: { LoadingPlaceholder }
  };
</script>
