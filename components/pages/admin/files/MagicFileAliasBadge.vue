<template>
  <span class="magic-file-alias-badge">
    Magic
  </span>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .magic-file-alias-badge {
    display: inline-block;
    font-weight: bold;
    color: colors.$pink-c;
    background-color: colors.$pink;

    font-size: 0.9rem;
    padding: 3px;
  }
</style>

<script>
  export default {
    name: "MagicFileAliasBadge"
  };
</script>
