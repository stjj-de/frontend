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
        role="row"
        v-ripple.400="'rgba(0,0,0,0.1)'"
        @click="onRowClick(row)"
      >
        <DataTableColumn
          v-for="(column, key) in companion.columns"
          :key="key"
          :columnKey="key"
          :column="column"
          :row="row"
        />
      </div>
      <div
        v-if="companion.items.length === 0"
        class="data-table__empty-state"
      >
        <slot name="empty-state"/>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .data-table__body {
    width: max-content;
    min-width: 100%;
  }

  .data-table__row {
    display: flex;
    align-items: center;

    height: 50px;
    border-bottom: 1px solid colors.$background-a;

    transition: 100ms linear background-color;
    &:hover, &:focus {
      outline: none;
      background-color: colors.$hover-and-focus;
    }
  }

  .data-table__checkbox {
    $size: 25px;
    width: $size;
    height: $size;
  }

  .data-table__empty-state {
    height: 100%;
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
        style.height = (this.companion.itemsPerPage * 50) + "px";
        return style;
      }
    },
    mounted() {
      this.companion.tableBodyInstance = this;
      this.companion.updateBodyWidth();
    },
    watch: {
      "companion.items"() {
        this.$nextTick(() => {
          this.companion.updateBodyWidth();
        });
      }
    },
    methods: {
      getWidth() {
        return this.$el.getBoundingClientRect().width;
      },
      onWindowResize() {
        this.companion.updateBodyWidth();
      },
      onRowClick(row) {
        this.$emit("row-click", row[this.companion.specialKeys.id], row);
      }
    }
  };
</script>
