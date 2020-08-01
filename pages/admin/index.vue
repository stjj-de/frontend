<template>
  <main class="formatted admin-index-page">
    <h1>Administration</h1>
    <p v-if="$store.state.user.role === 'ADMINISTRATOR'">
      Du bist <b>Administrator</b>, das heißt, du kannst alles bearbeiten.
    </p>
    <p v-else-if="$store.state.user.role === 'EDITOR'">
      Du bist <b>Editor</b>, das heißt, du kannst alles bearbeiten.
    </p>
    <p>
      Erstelle zum Beispiel <nuxt-link to="/admin/posts">einen Artikel</nuxt-link>,
      trage einen Termin <nuxt-link to="/admin/calendar">in den Kalender ein</nuxt-link>
      oder verwalte <nuxt-link to="/admin/gottesdienste">die Gottesdiensttermine</nuxt-link>.
    </p>
  </main>
</template>

<style lang="scss">
  .admin-index-page {
    p {
      font-size: 1.2rem;
      line-height: 1.6rem;
    }
  }
</style>

<script>
  export default {
    name: "index"
  }
</script>
