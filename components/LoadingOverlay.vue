<template>
  <div class="loading-overlay" :data-active="active">
  </div>
</template>

<style scoped lang="scss">
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
      $size: 50px;

      position: relative;
      z-index: 2;

      content: "";

      border: 3px solid var(--colors-green);
      border-top-color: transparent;
      border-radius: 50%;

      width: $size;
      height: $size;

      animation: 1s linear spin infinite;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
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
