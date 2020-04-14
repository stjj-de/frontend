<template>
  <div class="data-table">
    <div class="data-table__table" role="table">
      <div class="data-table__head" :style="`min-width: ${companion.bodyWidth}`" role="rowheader">
        <div
          v-for="(column, key) in companion.columns"
          :key="key"
          class="data-table__head-column"
          role="columnheader"
          @click="onHeadColumnClick(key)"
          @keydown.enter="onHeadColumnClick(key)"
          :style="getHeadColumnStyle(key)"
          :tabindex="isColumnSortable(column) ? '0' : false"
          :data-sortable="isColumnSortable(column)"
          v-ripple.400="isColumnSortable(column) ? 'rgba(0,0,0,0.1)' : 'transparent'"
        >
          {{ column.name }}
          <div
            class="data-table__sort-arrow-container"
            :data-order="!isEmpty && companion.sortBy === key ? companion.sortOrder : false"
          >
            <ArrowDownIcon
              v-if="column.sortable"
              class="data-table__sort-arrow"
            />
          </div>
        </div>
      </div>
      <div class="data-table__body-container">
        <LoadingOverlay :active="companion.loading" :transition-delay="200">
          {{ loadingText }}
        </LoadingOverlay>
        <transition
          mode="out-in"
          name="data-table__fade"
        >
          <DataTableBody
            :key="companion.lastFetchVariables.join('-')"
            :companion="companion"
            :page-index="companion.pageIndex"
            @row-click="onRowClick"
          >
            <template v-slot:empty-state>
              <slot name="empty-state"/>
            </template>
          </DataTableBody>
        </transition>
      </div>
    </div>
    <div class="data-table__footer">
      <div class="data-table__custom-buttons">
        <slot name="buttons"/>
      </div>
      <div class="data-table__page-buttons">
        <MyButton
          class="data-table__page-button"
          @click="companion.pageIndex -= 1"
          :disabled="companion.pageIndex === 0"
        >
          <ArrowLeftIcon class="data-table__arrow-icon"/>
        </MyButton>
        <span class="data-table__page">Seite {{ companion.pageIndex + 1 }}</span>
        <MyButton
          class="data-table__page-button"
          @click="companion.pageIndex += 1"
          :disabled="!companion.hasNextPage"
        >
          <ArrowRightIcon class="data-table__arrow-icon"/>
        </MyButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/transitions";
  @use "~@/assets/styles/colors";

  @include transitions.fade($name: "data-table__fade", $duration: 200ms);

  .data-table {
    width: 100%;
  }

  .data-table__table {
    overflow-x: auto;
    width: 100%;
  }

  .data-table__head {
    border-bottom: 2px solid colors.$background-a;
    display: flex;
    align-items: center;
  }

  .data-table__head-column {
    padding: 5px 10px 10px;
    user-select: none;
    flex-shrink: 0;

    &[data-sortable] {
      transition: 200ms linear background-color;
      &:hover {
        background-color: transparentize(colors.$background, 0.8);
      }

      &:focus {
        outline: none;
        background-color: transparentize(colors.$background, 0.5);
      }
    }
  }

  .data-table__head-select-column {
    padding: 10px 0 10px 10px;
    width: 49px;
  }

  .data-table__sort-arrow-container {
    display: inline-block;
    width: 0;
    height: 100%;
    overflow: hidden;
    position: relative;
    top: 6px;

    transition: 200ms ease width;

    &[data-order] {
      width: 18px;
      transition-delay: 0ms;

      .data-table__sort-arrow {
        transition-delay: 0ms;
      }
    }

    &[data-order="ASCENDING"] {
      .data-table__sort-arrow {
        transform: rotate(-180deg);
      }
    }
  }

  .data-table__sort-arrow {
    width: 18px;
    transition: 400ms ease transform;
    transition-delay: 200ms;
  }

  .data-table__body-container {
    position: relative;
  }

  .data-table__footer {
    border-top: 2px solid colors.$background-a;

    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 5px;
    overflow: hidden;
  }

  .data-table__custom-buttons {
    justify-self: flex-start;
  }

  .data-table__arrow-icon {
    height: 15px;
  }

  .data-table__page {
    margin: 0 10px;
  }

  .data-table__page-button {
    min-width: 0!important;
    width: 40px;
    padding: 0!important;
  }
</style>

<script>
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
  import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
  import ArrowDownIcon from "@/assets/icons/arrow-down.svg";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import DataTableBody from "@/components/DataTable/DataTableBody";
  import MyButton from "@/components/MyButton";

  export default {
    name: "DataTable",
    components: { MyButton, DataTableBody, LoadingOverlay, ArrowLeftIcon, ArrowRightIcon, ArrowDownIcon },
    props: {
      loadingText: {
        type: String,
        default: ""
      },
      companion: {
        type: Object,
        required: true
      }
    },
    computed: {
      isEmpty: vm => vm.companion.items.length === 0
    },
    methods: {
      onHeadColumnClick(key) {
        if (this.isEmpty) return;

        const column = this.companion.columns[key];

        if (column.sortable) {
          if (this.companion.sortBy === key) {
            this.companion.sortOrder = this.companion.sortOrder === "DESCENDING" ? "ASCENDING" : "DESCENDING";
          } else {
            this.companion.sortOrder = "DESCENDING";
            this.companion.sortBy = key;
          }

          this.companion.pageIndex = 0;
        }
      },
      getHeadColumnStyle(key) {
        const column = this.companion.columns[key];
        const style = {};

        if (column.width === undefined) {
          style.flexGrow = "1";
        } else {
          style.width = column.width + "px";
        }

        style.textAlign = column.headTextAlign || "inherit";

        return style;
      },
      isColumnSortable(column) {
        return !this.isEmpty && column.sortable;
      },
      onRowClick(id, row) {
        this.$emit("row-click", id, row);
      }
    }
  };
</script>
