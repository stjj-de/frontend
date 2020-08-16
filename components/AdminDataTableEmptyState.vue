<template>
  <div class="admin-data-table-empty-state">
    <span class="admin-data-table-empty-state__emoji">
      😕
    </span>
    Keine {{ itemsName }} gefunden.
  </div>
</template>

<style lang="scss">
  .admin-data-table-empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    font-size: 1.3rem;
  }

  .admin-data-table-empty-state__emoji {
    font-size: 4rem;
    margin-bottom: 20px;
  }
</style>

<script>
  export default {
    name: "AdminDataTableEmptyState",
    props: {
      itemsName: {
        type: String,
        required: true
      }
    }
  }
</script>
