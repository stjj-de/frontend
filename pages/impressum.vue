<template>
  <div class="impressum-page">
    <NavigationBar title="Impressum"/>
    <main class="content">
      <h2 class="heading--5">
        Pfarrbüro St. Josef - St. Johannes
      </h2>
      <p class="paragraph">
        Karcherstr. 49<br/>
        66539 Furpach<br/>
      </p>
      <p class="paragraph">
        Montag - Freitag von 8:00 - 12:00 Uhr<br/>
        Montag und Dienstag von 14:00 - 17:00 Uhr
      </p>
      <p class="paragraph">
        Email: <a class="link" href="mailto:pfarrbuero@stjj.de">pfarrbuero@stjj.de</a><br/>
        Telefon: <a class="link" href="tel:+49682131179">+49 6821 31179</a><br/>
        Fax: <a class="link" href="fax:+49682133913">+49 6821 33913</a>
      </p>
    </main>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
  import NavigationBar from "@/components/NavigationBar";

  export default {
    name: "ImpressumPage",
    components: { NavigationBar },
    head: () => ({
      title: "Impressum"
    })
  };
</script>
