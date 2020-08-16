<template>
  <div
    class="data-table__column"
    role="cell"
    :style="style"
  >
    <component
      :is="column.component"
      v-if="column.component"
      :data="row[key]"
      :row="row"
    />
    <template v-else-if="column.transform">
      {{ column.transform(row[key], row, column, key) }}
    </template>
    <template v-else>
      {{ row[key] }}
    </template>
  </div>
</template>

<style lang="scss">
  .data-table__column {
    padding: 10px;
  }
</style>

<script>
  export default {
    name: "DataTableColumn",
    props: {
      column: {
        type: Object,
        required: true
      },
      columnKey: {
        type: String,
        required: true
      },
      row: {
        type: Object,
        required: true
      }
    },
    computed: {
      key: vm => vm.columnKey,
      style() {
        const style = {}

        if (this.column.width === undefined)
          style.flexGrow = "1"
        else
          style.width = this.column.width + "px"

        return style
      }
    }
  }
</script>
