<template>
  <div class="data-table__body" :style="style">
    <GlobalEvents
      target="window"
      @resize="onWindowResize"
    />
    <template v-if="!companion.loading">
      <div
        v-for="row in companion.items"
        :key="row[companion.specialKeys.id]"
        class="data-table__row"
        tabindex="0"
      >
        <div class="data-table__column data-table__column--select">
          <input
            class="data-table__checkbox"
            type="checkbox"
          />
        </div>
        <DataTableColumn
          v-for="(column, key) in companion.columns"
          :key="key"
          :columnKey="key"
          :column="column"
          :row="row"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  .data-table__body {
    width: max-content;
    min-width: 100%;
  }

  .data-table__row {
    display: flex;
    align-items: center;

    height: 50px;
    border-bottom: 1px solid var(--colors-background-a);

    transition: 100ms linear background-color;
    &:focus {
      outline: none;
      background-color: rgba(0, 0, 0, 0.05);
    }

    &:hover {
      background-color: rgba(0, 137, 255, 0.1);
    }
  }

  .data-table__checkbox {
    $size: 25px;
    width: $size;
    height: $size;
  }
</style>

<script>
  import GlobalEvents from "vue-global-events";
  import DataTableColumn from "@/components/DataTable/DataTableColumn";

  export default {
    name: "DataTableBody",
    components: { DataTableColumn, GlobalEvents },
    props: {
      companion: {
        type: Object,
        required: true
      },
      pageIndex: {
        type: Number,
        required: true
      }
    },
    computed: {
      style() {
        const style = {};
        style.minHeight = (this.companion.itemsPerPage * 50) + "px";
        return style;
      }
    },
    mounted() {
      this.companion.tableBodyInstance = this;
      this.companion.updateBodyWidth();
    },
    methods: {
      getWidth() {
        return this.$el.getBoundingClientRect().width;
      },
      onWindowResize() {
        this.companion.updateBodyWidth();
      }
    }
  };
</script>
