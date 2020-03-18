<template>
  <div class="loading-overlay" :data-active="active">
    <span class="_text" v-if="$slots.default"><slot/></span>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/spinner.scss";

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

    pointer-events: none;
    opacity: 0;
    transition: 200ms ease opacity;

    &[data-active] {
      pointer-events: auto;
      opacity: 1;
    }

    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      opacity: 0.6;
      background-color: var(--colors-background);
    }

    &::after {
      position: relative;
      z-index: 2;
      content: "";

      @include spinner.spinner()
    }
  }

  ._text {
    margin-top: 20px;
    position: relative;
  }
</style>

<script>
  export default {
    name: "LoadingOverlay",
    props: {
      active: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
