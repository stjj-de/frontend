<template>
  <section class="first-index-section">
    <div class="_container">
      <span class="_title-line1">
        Katholische Kirchengemeinde
      </span>
      <span class="_title-line2">
        St.Josef - St. Johannes
      </span>
      <img class="_image" src="/Furpach_St_Josef.jpeg" alt="Die Kirche St. Josef"/>
    </div>
  </section>
</template>

<style scoped lang="scss">
  @use "~kiste/css/mixins/screenSize";

  ._container {
    position: relative;
  }

  ._image {
    position: relative;
    z-index: -1;
    width: 100%;
    height: auto;
  }

  ._title-line1, ._title-line2 {
    position: absolute;

    display: block;
    font-weight: 800;

    // TODO: Replace this with max() as soon as it's generally supported.
    font-size: 4.6vw;

    // Set this to the content-width
    @media (min-width: 1020px) {
      font-size: 47px;
    }

    @include screenSize.mobile {
      position: static;
      font-size: 2rem;
    }
  }

  ._title-line1 {
    top: 5%;
    left: 3%;

    @include screenSize.mobile {
      font-size: 6vw;
    }
  }

  ._title-line2 {
    top: 14%;
    left: 3%;

    @include screenSize.mobile {
      margin-bottom: 30px;
      font-size: 8vw;
    }
  }
</style>

<script>
  export default {
    name: "FirstIndexSection"
  };
</script>
