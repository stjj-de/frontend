<template>
  <div class="video-page">
    <NavigationBar :title="video.title"/>
    <main class="content">
      <nuxt-link
        class="link video-page__back"
        to="/mediathek"
      >
        <ArrowLeftIcon class="video-page__back-icon"/>
        Zurück zur Übersicht
      </nuxt-link>
      <h1 class="heading--3">
        Video: {{ video.title }}
      </h1>
      <div class="video-page__iframe-container">
        <iframe
          class="video-page__iframe"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
          :src="`https://www.youtube-nocookie.com/embed/${video.videoID}?autoplay=1&rel=0`"
        ></iframe>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
  .video-page__back {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .video-page__back-icon {
    width: 30px;
    margin-right: 10px;
  }

  .video-page__iframe-container {
    height: 0;
    overflow: hidden;
    padding-top: 591.44px / 1127.34px * 100%;
    background: white;
    position: relative;
  }

  .video-page__iframe {
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

<script>
  import VideoQuery from "./videoQuery.graphql";
  import NavigationBar from "@/components/NavigationBar";
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";

  export default {
    name: "VideoPage",
    components: { NavigationBar, ArrowLeftIcon },
    data: () => ({
      video: null
    }),
    async asyncData({ error, app, params }) {
      const $apollo = app.apolloProvider.defaultClient;

      const { data: { video } } = await $apollo.query({
        query: VideoQuery,
        variables: {
          id: params.id
        }
      });

      if (video === null) {
        error({ statusCode: 404, message: "Dieses Video existiert nicht." });
      } else {
        return {
          video
        };
      }
    }
  };
</script>
