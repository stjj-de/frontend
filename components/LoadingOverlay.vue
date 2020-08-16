<template>
  <div class="loading-overlay" :data-active="active" :style="style">
    <span v-if="$slots.default" class="loading-overlay__text" :aria-hidden="String(active)"><slot/></span>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/spinner";
  @use "~@/assets/styles/colors";

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column-reverse;

    overflow: hidden;

    pointer-events: none;
    opacity: 0;
    transition: 400ms ease opacity;

    &[data-active] {
      pointer-events: auto;
      opacity: 1;
    }

    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      opacity: var(--opacity);
      background-color: colors.$background;
    }

    &::after {
      position: relative;
      z-index: 2;
      content: "";

      @include spinner.spinner()
    }
  }

  .loading-overlay__text {
    white-space: nowrap;
    margin-top: 20px;
    position: relative;
    max-width: 100%;
    padding: 0 20px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<script>
  export default {
    name: "LoadingOverlay",
    props: {
      active: { type: Boolean },
      transitionDelay: {
        type: Number,
        default: 0
      },
      opacity: {
        type: String,
        default: "0.6"
      }
    },
    computed: {
      style() {
        if (this.active) {
          return {
            "transitionDelay": this.transitionDelay + "ms",
            "--opacity": this.opacity
          }
        }

        return {}
      }
    }
  }
</script>
