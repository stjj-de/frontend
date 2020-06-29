<template>
  <div class="gemeinde-page">
    <NavigationBar title="Gemeinde"/>
    <main class="content formatted">
      <Accordion text="Pfarrgemeinderat">
        <h3>Vorstand</h3>
        <ul>
          <li>Fr. Anja Angresius, Vorsitzende</li>
          <li>Fr. Karoline Diehl, stellvertretende Vorsitzende</li>
          <li>Hr. Robert Rauer, Schriftführer</li>
          <li>Fr. Silke Kramer</li>
          <li>Fr. Julia Schley</li>
          <li>Fr. Gabi Schneider</li>
          <li>Pfr.i.R. Jochen Gabriel (Pfarrverwalter)</li>
        </ul>

        <h3>Mitglieder</h3>
        <ul>
          <li>Hr. Michael Gerwald</li>
          <li>Fr. Birgit Hemmer</li>
          <li>Hr. Alexander Dumser</li>
          <li>Hr. Manfred Örtel</li>
          <li>Hr. Philipp Örtel</li>
          <li>Fr. Sibylle Rhein</li>
          <li>Fr. Dagmar Ruf</li>
          <li>Hr. Horst Schäfer</li>
          <li>Hr. Jan Schaubitzer-Ruf</li>
          <li>Fr. Selina Schmitt</li>
          <li>Hr. Dr. Philipp Schwarz</li>
          <li>Fr. Kornelia Wack</li>
        </ul>
      </Accordion>
    </main>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import NavigationBar from "@/components/NavigationBar";
  import Accordion from "@/components/Accordion";

  export default {
    name: "GemeindePage",
    components: { Accordion, NavigationBar }
  };
</script>
