<template>
  <section class="title-section">
    <div class="title-section__side">
      <ContentOutlet class="title-section__content" :html="content"/>
    </div>
    <div class="title-section__side">
      <img class="title-section__logo" alt="Unser Logo" src="/icon.png"/>
    </div>
  </section>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";

  @keyframes title-section__scale-up {
    from {
      transform: scale(0.4);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .title-section {
    height: 60vh;
    padding: 0 100px;
    display: flex;
    justify-content: space-around;

    max-width: 1500px;
    margin: 0 auto;
  }

  .title-section__side {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    animation: title-section__scale-up 0.8s ease-out both;

    &:first-child {
      animation-delay: 0ms;
    }

    &:last-child {
      animation-delay: 400ms;

      max-width: 500px;
      align-items: center;
      margin-top: 10px;
    }
  }

  .title-section__content {
    font-size: 2.5rem;
  }

  .title-section__logo {
    width: 50%;
    min-width: 200px;
    max-width: 300px;
  }

  @media(max-width: 1000px) {
    .title-section {
      flex-direction: column-reverse;
      justify-content: center;
      align-items: center;
      padding: 0 50px;
      height: auto;
      margin-top: -10px;
    }

    .title-section__side {
      &:first-child {
        width: 100%;
        animation-delay: 400ms;
      }

      &:last-child {
        animation-delay: 0ms;
      }
    }

    .title-section__logo {
      width: 300px;
    }

    .title-section__content {
      font-size: 1.8rem;
    }
  }
</style>

<script>
  import ContentOutlet from "@/components/ContentOutlet"

  export default {
    name: "TitleSection",
    components: { ContentOutlet },
    props: {
      content: {
        type: String,
        required: true
      }
    }
  }
</script>
