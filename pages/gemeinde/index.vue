<template>
  <div class="gemeinde-page">
    <NavigationBar title="Gottesdienste"/>
    <main class="content">
      <h1 class="heading--1">
        Gemeinde
      </h1>
      <section>
        <h2 class="heading--3">
          Gottesdienste
        </h2>
        <div class="gemeinde-page__gottesdienste">
          <GottesdienstCard
            v-for="gottesdienst in gottesdienste"
            :key="gottesdienst.id"
            class="gemeinde-page__gottesdienst"
            :gottesdienst="gottesdienst"
          />
        </div>
      </section>
      <section>
        <h2 class="heading--3">
          Downloads
        </h2>
        <ul class="formatted gemeinde-page__downloads">
          <li>
            <a target="_blank" href="/f/pfarrbrief">
              Pfarrbrief
            </a>
          </li>
          <li>
            <a target="_blank" href="/f/messdienerplan">
              Messdienerplan
            </a>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style lang="scss">
  .gemeinde-page__gottesdienste {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-gap: 30px;

    @media (max-width: 450px) {
      grid-template-columns: 1fr;
    }

    /* Can be replaced with this, once min() is better supported */
    /* grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); */
  }

  .gemeinde-page__downloads {
    font-size: 1.3rem;
  }
</style>

<script>
  import GottesdiensteQuery from "./gottesdiensteQuery.graphql";
  import NavigationBar from "@/components/NavigationBar";
  import GottesdienstCard from "@/components/GottesdienstCard";

  export default {
    name: "GemeindePage",
    components: { GottesdienstCard, NavigationBar },
    head: () => ({
      title: "Gottesdienste"
    }),
    apollo: {
      gottesdienste: GottesdiensteQuery
    }
  };
</script>
