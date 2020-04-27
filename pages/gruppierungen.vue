<template>
  <div class="gruppierungen-page">
    <NavigationBar title="Gruppierungen"/>
    <main class="content formatted">
      <h3>Frauengemeinschaft</h3>
      <h4>St. Josef</h4>
      <p>
        Kontakt: Frau Schu, Telefon <a href="tel:06841-80011">06841 80011</a>
      </p>
      <h4>St. Johannes</h4>
      <p>
        Kontakt: Fr. Bartholomä über Pfarrbuero
      </p>
      <h3>Frauensinggruppe</h3>
      <p>
        Treffen: wöchentlich Mittwoch, 16.00 Uh Uhr in der Pfarrkirche St. Josef
      </p>
      <h3>Geburtstags-Besuchsdienst in St. Johannes</h3>
      <p>
        Mitglieder der Frauengemeinschaft besuchen Pfarreiangehörige zu bestimmten Geburtstagen
      </p>
      <h3>Jugendchor</h3>
      <p>
        Treffen: Jede Woche am Montag, 18:00 Uhr im Jugendheim Oase
      </p>
      <h3>Kirchenchor</h3>
      <p>
        Treffen: Jede Woche am Mittwoch, 19:30 Uhr im Pfarrheim St. Johannes in Wellesweiler
      </p>
      <h3>Kinderchor</h3>
      <p>
        Treffen: Jede Woche am Freitag, 17:15 - 18:00 Uhr im Jugendheim Oase
      </p>
    </main>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import NavigationBar from "@/components/NavigationBar";

  export default {
    name: "gruppierungen",
    components: { NavigationBar }
  };
</script>
