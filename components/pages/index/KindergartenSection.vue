<template>
  <section class="kindergarten-section content">
    <h2 class="kindergarten-section__title">
      2 Kindergärten
    </h2>
    <p class="kindergarten-section__text">
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
      dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
    </p>
    <GreenBlob class="kindergarten-section__blob"/>
  </section>
</template>

<style lang="scss">
  .kindergarten-section {
    position: relative;
    margin-top: 50px;
  }

  .kindergarten-section__title {
    position: relative;
    z-index: 1;
    text-align: center;
    font-size: 4rem;
    font-weight: normal;
  }

  .kindergarten-section__text  {
    position: relative;
    z-index: 1;
    text-align: center;

    padding: 0 20px;
    font-size: 1.2rem;
    line-height: 2rem;
  }

  .kindergarten-section__blob {
    position: absolute;
    right: -180px;
    top: -140px;
    height: 600px;
  }

  @media (max-width: 600px) {
    .kindergarten-section__title {
      font-size: 2.8rem;
    }
  }
</style>

<script>
  import GreenBlob from "@/assets/blobs/green.svg";

  export default {
    name: "KindergartenSection",
    components: { GreenBlob }
  };
</script>
