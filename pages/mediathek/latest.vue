<template>
  <div></div>
</template>

<style lang="scss">

</style>

<script>
  export default {
    name: "LatestVideoPage",
    async asyncData({ $api, redirect }) {
      const { items } = await $api.videos.list({
        fields: ["id"],
        limit: 1,
        sortBy: "publishedAt",
        ascending: false
      })

      redirect(`/mediathek/${items[0].id}`)
    }
  }
</script>
