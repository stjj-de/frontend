<template>
  <div class="flex items-center">
    <LoaderIcon class="animate-spin mr-2 relative top-1px"/>
    <div>
      <slot/>
    </div>
  </div>
</template>

<style module>

</style>

<script>
  import LoaderIcon from "~icons/teenyicons/loader-outline"

  export default {
    name: "LoadingSpinner",
    components: { LoaderIcon }
  }
</script>
