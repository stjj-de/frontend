<template>
  <div class="gottesdienste-page">
    <NavigationBar title="Gemeinde"/>
    <main class="content">
      <section>
        <h2 class="heading--3">
          Gottesdienste
        </h2>
        <div class="gottesdienste-page__gottesdienste">
          <GottesdienstCard
            v-for="gottesdienst in gottesdienste"
            :key="gottesdienst.id"
            class="gottesdienste-page__gottesdienst"
            :gottesdienst="gottesdienst"
          />
        </div>
      </section>
      <section class="gottesdienste-page__downloads-section">
        <h2 class="heading--3">
          Downloads
        </h2>
        <ul class="formatted gottesdienste-page__downloads">
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
  .gottesdienste-page__gottesdienste {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-gap: 30px;

    @media (max-width: 450px) {
      grid-template-columns: 1fr;
    }

    /* Can be replaced with this, once min() is better supported */
    /* grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); */
  }

  .gottesdienste-page__downloads-section {
    margin-top: 40px;
  }

  .gottesdienste-page__downloads {
    font-size: 1.3rem;
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
    async asyncData() {
      return {
        gottesdienste: [] // TODO
      };
    }
  };
</script>
