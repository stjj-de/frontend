<template>
  <div class="images-section">
    <div class="images-section__waves">
      <YellowWave class="images-section__wave"/>
      <YellowWave class="images-section__wave"/>
    </div>
    <div class="images-section__images">
      <ChurchKohlhofClipped class="images-section__image"/>
      <ChurchWellesweilerClipped class="images-section__image"/>
      <ChurchFurpachClipped class="images-section__image"/>
    </div>
  </div>
</template>

<style lang="scss">
  .images-section {
    position: relative;
    margin: 5vh 0;
  }

  .images-section__waves {
    width: 100%;
    overflow: hidden;
  }

  .images-section__wave {
    color: #ffd274;
    width: 100%;
    height: 180px;

    &:last-child {
      margin-top: -70px;
      transform: rotateZ(180deg);
    }
  }

  .images-section__images {
    position: absolute;
    top: -100px;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: 20%;
    display: flex;
    justify-content: space-around;
  }

  .images-section__image {
    height: 300px;
  }

  @media(max-width: 1000px) {
    .images-section {
      margin-top: 50px;
    }

    .images-section__wave {
      width: 200%;
      height: 120px;
      transform: translateX(-50%);

      &:last-child {
        margin-top: -20px;
        transform: translateX(-50%) rotateZ(180deg);
      }
    }

    .images-section__image {
      min-width: 240px;
      margin: 0 25px;
    }
  }

  @media(max-width: 700px) {
    .images-section {
      margin: 10vh 0;
      border-top: 10px dashed #ffd274;
    }

    .images-section__images, .images-section__waves {
      display: none;
    }
  }
</style>

<script>
  import YellowWave from "@/assets/elements/yellow-wave.svg"
  import ChurchKohlhofClipped from "@/assets/images/church-kohlhof-clipped.svg"
  import ChurchWellesweilerClipped from "@/assets/images/church-wellesweiler-clipped.svg"
  import ChurchFurpachClipped from "@/assets/images/church-furpach-clipped.svg"

  export default {
    name: "ImagesSection",
    components: { YellowWave, ChurchKohlhofClipped, ChurchWellesweilerClipped, ChurchFurpachClipped }
  }
</script>
