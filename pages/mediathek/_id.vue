<template>
  <div class="video-page">
    <NavigationBar title="Mediathek"/>
    <main class="content">
      <nuxt-link
        class="video-page__back"
        to="/mediathek"
      >
        <ArrowLeftIcon class="video-page__back-icon"/>
        Zurück zur Übersicht
      </nuxt-link>
      <h1 class="heading--3">
        {{ video.title }}
      </h1>
      <div class="video-page__iframe-container">
        <iframe
          class="video-page__iframe"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
          :src="`https://www.youtube-nocookie.com/embed/${video.youtubeVideoID}?autoplay=1&rel=0`"
          @load="loading = false"
        ></iframe>
        <LoadingOverlay :active="loading" opacity="1">
          Video wird geladen
        </LoadingOverlay>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .video-page__back {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: none;

    color: colors.$blue;
    text-decoration: none;
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
  import NavigationBar from "@/components/NavigationBar"
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg"
  import LoadingOverlay from "@/components/LoadingOverlay"

  export default {
    name: "VideoPage",
    components: { LoadingOverlay, NavigationBar, ArrowLeftIcon },
    async asyncData({ error, app: { $api }, params }) {
      const video = await $api.videos.get(params.id, ["title", "youtubeVideoID"])

      if (video === null) return error({ statusCode: 404, m: "Dieses Video existiert nicht." })

      return { video }
    },
    data: () => ({
      video: null,
      loading: true
    }),
    head() {
      return {
        title: `${this.video.title} / Mediathek`
      }
    }
  }
</script>
