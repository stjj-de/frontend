<template>

</template>

<style lang="scss">

</style>

<script>
  export default {
    name: "LogoutPage",
    async created() {
      await this.$axios.$delete("/api/auth", { validateStatus: status => [204, 403].includes(status) });
      await this.$router.replace("/login");
    }
  }
</script>
