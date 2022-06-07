<template>
  <router-link
    v-if="to.startsWith('/')"
    class="link"
    :to="to"
  >
    <slot/>
  </router-link>
  <router-link
    v-else-if="to.startsWith('https://stjj.de/')"
    class="link"
    :to="to.slice(15)"
  >
    <slot/>
  </router-link>
  <a
    v-else
    class="link"
    :href="to"
    rel="noopener noreferrer"
  >
    <slot/>
  </a>
</template>

<style scoped>

</style>

<script>
  export default {
    name: "UnknownLink",
    props: {
      to: {
        type: String,
        required: true
      }
    }
  }
</script>
