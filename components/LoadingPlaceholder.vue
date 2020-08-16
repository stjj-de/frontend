<template>
  <transition>
    <div class="loading-placeholder" :style="style">
      <LoadingOverlay active>
        <slot/>
      </LoadingOverlay>
    </div>
  </transition>
</template>

<style scoped lang="scss">
  .loading-placeholder {
    position: relative;
  }
</style>

<script>
  import LoadingOverlay from "@/components/LoadingOverlay"

  export default {
    name: "LoadingPlaceholder",
    components: { LoadingOverlay },
    props: {
      width: {
        type: String,
        default: "100%"
      },
      height: {
        type: String,
        default: "200px"
      }
    },
    computed: {
      style() {
        return {
          width: this.width,
          height: this.height
        }
      }
    }
  }
</script>
