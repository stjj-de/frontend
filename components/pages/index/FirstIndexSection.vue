<template>
  <section class="first-index-section">
    <div class="first-index-section__container">
      <span class="first-index-section__title-line1">
        Katholische Kirchengemeinde
      </span>
      <span class="first-index-section__title-line2">
        St.Josef - St. Johannes
      </span>
      <img class="first-index-section__image" src="/Furpach_St_Josef.jpeg" alt="Die Kirche St. Josef"/>
    </div>
  </section>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/screenSize";

  .first-index-section__container {
    position: relative;
  }

  .first-index-section__image {
    position: relative;
    width: 100%;
    height: auto;
  }

  .first-index-section__title-line1, .first-index-section__title-line2 {
    position: absolute;
    z-index: 1;

    display: block;
    font-weight: 800;

    font-size: 4.6vw;

    @media (min-width: 1020px) {
      font-size: 47px;
    }

    @include screenSize.mobile {
      position: static;
      font-size: 2rem;
    }
  }

  .first-index-section__title-line1 {
    top: 5%;
    left: 3%;

    @include screenSize.mobile {
      font-size: 6vw;
    }
  }

  .first-index-section__title-line2 {
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
