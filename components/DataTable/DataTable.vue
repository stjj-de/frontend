<template>
  <div class="data-table">
    <div class="data-table__table" role="table">
      <div class="data-table__head" :style="`min-width: ${companion.bodyWidth}`" role="rowheader">
        <div
          class="data-table__head-column data-table__head-select-column"
          title="Auswählen"
          role="columnheader"
        ></div>
        <div
          v-for="(column, key) in companion.columns"
          :key="key"
          class="data-table__head-column"
          role="columnheader"
          @click="onHeadColumnClick(key)"
          @keydown.enter="onHeadColumnClick(key)"
          :style="getHeadColumnStyle(key)"
          :tabindex="column.sortable ? '0' : false"
          :data-sortable="column.sortable"
          v-ripple.400="column.sortable ? 'rgba(0,0,0,0.1)' : 'transparent'"
        >
          {{ column.name }}
          <div
            class="data-table__sort-arrow-container"
            :data-order="companion.sortBy === key ? companion.sortOrder : false"
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
          />
        </transition>
      </div>
    </div>
    <div class="data-table__footer">
      <KButton
        class="data-table__page-button"
        @click="companion.pageIndex -= 1"
        :disabled="companion.pageIndex === 0"
      >
        <ArrowLeftIcon class="data-table__arrow-icon"/>
      </KButton>
      <span>Seite {{ companion.pageIndex + 1 }}</span>
      <KButton class="data-table__page-button" @click="companion.pageIndex += 1" :disabled="!companion.hasNextPage">
        <ArrowRightIcon class="data-table__arrow-icon"/>
      </KButton>
    </div>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/transitions";

  @include transitions.fade($name: "data-table__fade", $duration: 200ms);

  .data-table {
    width: 100%;
  }

  .data-table__table {
    overflow-x: scroll;
    width: 100%;
  }

  .data-table__head {
    border-bottom: 2px solid var(--colors-background-a);
    display: flex;
    align-items: center;
  }

  .data-table__head-column {
    padding: 5px 10px 10px;
    user-select: none;

    &[data-sortable] {
      transition: 200ms linear background-color;
      &:hover {
        background-color: rgba(0,0,0,0.02);
      }

      &:focus {
        outline: none;
        background-color: rgba(0,0,0,0.05);
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
    border-top: 2px solid var(--colors-background-a);

    height: 50px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 10px 2px;
    overflow: hidden;
  }

  .data-table__arrow-icon {
    height: 15px;
  }

  .data-table__page-button {
    width: 20px;
    margin: 0 5px;
  }
</style>

<script>
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
  import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
  import ArrowDownIcon from "@/assets/icons/arrow-down.svg";
  import KButton from "kiste/components/KButton";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import DataTableBody from "@/components/DataTable/DataTableBody";

  export default {
    name: "DataTable",
    components: { DataTableBody, LoadingOverlay, ArrowLeftIcon, ArrowRightIcon, ArrowDownIcon, KButton },
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
    methods: {
      onHeadColumnClick(key) {
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
      }
    }
  };
</script>
