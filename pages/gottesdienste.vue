<template>
  <div class="gottesdienste-page">
    <NavigationBar title="Gottesdienste"/>
    <main class="content formatted">
      <div class="gottesdienste-page__gottesdienste">
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
</style>

<script>
  import NavigationBar from "@/components/NavigationBar"
  import GottesdienstCard from "@/components/GottesdienstCard"

  export default {
    name: "GottesdienstePage",
    components: { GottesdienstCard, NavigationBar },
    async asyncData({ $api }) {
      return {
        gottesdienste: (await $api.churches.populate(
          await $api.churchServiceDates.list({ sortBy: "date", fields: GottesdienstCard.CHURCH_SERVICE_DATE_FIELDS }),
          "church",
          GottesdienstCard.CHURCH_SERVICE_DATE_CHURCH_FIELDS
        )).items
      }
    },
    data: () => ({
      gottesdienste: []
    }),
    head: () => ({
      title: "Gottesdienste"
    })
  }
</script>
