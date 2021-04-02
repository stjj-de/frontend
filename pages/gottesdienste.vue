<template>
  <div class="gottesdienste-page">
    <NavigationBar title="Gottesdienste"/>
    <main class="content formatted">
      <div>
        <h1 class="heading--3">Live</h1>
        <div v-if="liveVideoId" class="gottesdienste-page-container">
          <iframe
            class="gottesdienste-page__iframe"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            :src="`https://www.youtube-nocookie.com/embed/${liveVideoId}?autoplay=1&rel=0`"
            @load="loading = false"
          ></iframe>
        </div>
        <div v-else>
          Wenn wir live sind, kannst du hier zuschauen.
        </div>
      </div>
      <div class="gottesdienste-page__gottesdienste">
        <h1 class="heading--3">Gottesdienste</h1>
        <GottesdienstCard
          v-for="gottesdienst in gottesdienste"
          :key="gottesdienst.id"
          class="gottesdienste-page__gottesdienst"
          :gottesdienst="gottesdienst"
        />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
  .gottesdienste-page__gottesdienst {
    margin-bottom: 20px;
  }

  .gottesdienste-page-container {
    height: 0;
    overflow: hidden;
    padding-top: 56.35%;
    background: white;
    position: relative;
  }

  .gottesdienste-page__iframe {
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
  import GottesdienstCard from "@/components/GottesdienstCard"

  export default {
    name: "GottesdienstePage",
    components: { GottesdienstCard, NavigationBar },
    async asyncData({ $api }) {
      return {
        liveVideoId: await $api.contents.get("LIVE_VIDEO_ID"),
        gottesdienste: (await $api.churches.populate(
          await $api.churchServiceDates.list({ sortBy: "date", fields: GottesdienstCard.CHURCH_SERVICE_DATE_FIELDS }),
          "church",
          GottesdienstCard.CHURCH_SERVICE_DATE_CHURCH_FIELDS
        )).items
      }
    },
    data: () => ({
      gottesdienste: [],
      liveVideoId: ""
    }),
    head: () => ({
      title: "Gottesdienste"
    })
  }
</script>
