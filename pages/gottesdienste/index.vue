<template>
  <div class="gottesdienste-page">
    <NavigationBar title="Gottesdienste"/>
    <main class="content">
      <h1 class="heading--1">
        Gottesdienste
      </h1>
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
  .gottesdienste-page__gottesdienste {
    display: flex;
    flex-direction: column;
  }

  $colors: (
    #c7e8ef,
    #b9d7de,
    #a5c0c6
  );

  .gottesdienste-page__gottesdienst {
    @each $color in $colors {
      &:nth-child(#{length($colors)}n+#{index($colors, $color)}) {
        background: $color;
      }
    }

    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
</style>

<script>
  import GottesdiensteQuery from "./gottesdiensteQuery.graphql";
  import NavigationBar from "@/components/NavigationBar";
  import GottesdienstCard from "@/components/GottesdienstCard";

  export default {
    name: "GottesdienstePage",
    components: { GottesdienstCard, NavigationBar },
    apollo: {
      gottesdienste: GottesdiensteQuery
    }
  };
</script>
