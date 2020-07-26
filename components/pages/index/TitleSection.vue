<template>
  <section class="title-section content">
    <div class="title-section__title">
      <div class="title-section__title-text">
        <div class="title-section__line-1">
          Katholische Kirchengemeinde
        </div>
        <div class="title-section__line-2">
          St. Josef - St. Johannes
        </div>
      </div>
      <BlueBlob class="title-section__blue-blob"/>
    </div>
    <div class="title-section__description">
      <div class="title-section__introduction-container">
        <div class="quill-enduser formatted title-section__introduction" v-html="introduction"></div>
      </div>
      <RedBlob class="title-section__red-blob"/>
    </div>
  </section>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";
  @use "~@/assets/styles/quill-enduser.scss";

  .title-section {
    margin-top: 20px;
  }

  .title-section__title {
    position: relative;
    height: 100px;
  }

  .title-section__title-text {
    position: absolute;
    top: 70px;
    right: 40px;
    z-index: 1;

    text-align: right;
  }

  .title-section__line-1 {
    font-size: 2.4rem;
  }

  .title-section__line-2 {
    font-size: 3.4rem;
  }

  .title-section__blue-blob {
    position: absolute;
    top: -50px;
    right: -20%;

    margin-right: 40px;

    height: 500px;
  }

  @include screenSize.mobile {
    .title-section__title {
      height: 200px;
    }

    .title-section__title-text {
      top: 80px;
      left: unset;
      right: 10px;
      width: 100%;
    }

    .title-section__line-1 {
      font-size: 2rem;
    }

    .title-section__line-2 {
      font-size: 2rem;
      font-weight: bold;
    }

    .title-section__blue-blob {
      top: -40px;
      height: 450px;
      right: -200px;
    }
  }

  .title-section__description {
    position: relative;
    height: 400px;
  }

  .title-section__introduction-container {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    min-height: 400px;
  }

  .title-section__introduction {
    font-size: 1.5rem!important;
    line-height: 2.8rem;
  }

  .title-section__red-blob {
    height: 600px;

    position: absolute;
    top: -50px;
    left: -210px;
  }

  @include screenSize.mobile {
    .title-section__introduction {
      font-size: 1.4rem;
      line-height: 2rem;
    }
  }
</style>

<script>
  import BlueBlob from "@/assets/blobs/blue.svg";
  import RedBlob from "@/assets/blobs/red.svg";

  export default {
    name: "TitleSection",
    components: { BlueBlob, RedBlob },
    props: {
      introduction: {
        type: String,
        required: true
      }
    }
  };
</script>
