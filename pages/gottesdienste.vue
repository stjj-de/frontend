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
  @use "~@/assets/styles/screenSize";

  .gottesdienste-page__gottesdienste {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    & > .gottesdienste-page__gottesdienst {
      width: 100%;
      margin-bottom: 20px;

      @include screenSize.notMobile {
        width: auto;
        flex-grow: 0.5;
        &:nth-child(odd) {
          margin-right: 20px;
        }
      }
    }

    /* Can be replaced with this, once min() is better supported */
    /* grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); */
  }
</style>

<script>
  import NavigationBar from "@/components/NavigationBar";
  import GottesdienstCard from "@/components/GottesdienstCard";

  export default {
    name: "GottesdienstePage",
    components: { GottesdienstCard, NavigationBar },
    head: () => ({
      title: "Gottesdienste"
    }),
    data: () => ({
      gottesdienste: []
    }),
    async asyncData({ $api }) {
      return {
        gottesdienste: (await $api.churches.populate(
          await $api.churchServiceDates.list({ sortBy: "date", fields: GottesdienstCard.CHURCH_SERVICE_DATE_FIELDS }),
          "church",
          GottesdienstCard.CHURCH_SERVICE_DATE_CHURCH_FIELDS
        )).items
      };
    }
  };
</script>
