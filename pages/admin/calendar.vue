<template>
  <main class="calendar-page">
    <h1 class="heading--1">
      Kalender
    </h1>
    <div class="calendar-page__filter">
      <span class="heading--5">Filter</span>
      <select v-model="dateFilter" class="calendar-page__filter-select" aria-label="Filter">
        <option :value="null">
          Keiner
        </option>
        <option value="day">
          An diesem Tag
        </option>
        <option value="span">
          In dieser Zeitspanne
        </option>
      </select>
      <div class="calendar-page__picker" :data-enabled="dateFilter !== null">
        <client-only>
          <v-date-picker
            v-if="dateFilterNotNull === 'span'"
            v-model="dateSpanFilter"
            is-inline
            mode="range"
            @input="onPickerInput"
          />
          <v-date-picker
            v-else
            v-model="dateDayFilter"
            is-inline
            @input="onPickerInput"
          />
        </client-only>
      </div>
    </div>
    <DataTable
      :companion="table"
      loading-text="Termine werden geladen"
      @row-click="id => onRowClick(id)"
    >
      <template #empty-state>
        <AdminDataTableEmptyState items-name="Termine"/>
      </template>
      <template #buttons>
        <MyButton
          variant="primary"
          @click="openEditEventModal('')"
        >
          Erstellen
        </MyButton>
      </template>
    </DataTable>
    <EditEventModal
      :event-id="editModalEventID"
      :active="editModalActive"
      @close="canceled => onEditModalClose(canceled)"
    />
  </main>
</template>

<style scoped lang="scss">
  .calendar-page__filter-select {
    font-size: 1.2rem;
  }

  .calendar-page__picker {
    margin-top: 10px;
    position: relative;

    max-width: 258px;

    &[data-enabled] {
      &::after {
        opacity: 0;
        pointer-events: none;
      }
    }

    &::after {
      content: "";
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-color: white;
      opacity: 0.8;
      transition: 100ms linear opacity;
    }
  }

  .calendar-page__filter {
    margin-bottom: 20px;
  }
</style>

<script>
  import DataTable from "@/components/DataTable/DataTable"
  import VDatePicker from "@/components/VCalendar/AsyncVDatePicker"
  import EventsTableColorColumn from "@/components/pages/admin/calendar/EventsTableColorColumn"
  import { DataTableCompanion } from "@/components/DataTable/data-table-companion"
  import { formatDate, formatDateWithTime, isFullDay, toFilterStringDate } from "@/assets/js/date-utils"
  import querystring from "query-string"
  import EditEventModal from "@/components/pages/admin/calendar/EditEventModal"
  import MyButton from "@/components/MyButton"
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState"

  const _isFullDay = (startDateString, endDateString) => {
    if (endDateString === null)
      return false

    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)

    return isFullDay(startDate, endDate)
  }

  const ITEMS_PER_PAGE = 10

  export default {
    name: "CalendarPage",
    components: { AdminDataTableEmptyState, MyButton, EditEventModal, DataTable, VDatePicker },
    data() {
      return {
        dateFilter: null,
        dateFilterNotNull: "day",
        dateSpanFilter: {},
        dateDayFilter: null,
        editModalEventID: null,
        editModalActive: false,
        table: new DataTableCompanion({
          columns: {
            color: {
              name: "Farbe",
              component: EventsTableColorColumn,
              headTextAlign: "center",
              width: 90,
              sortable: true
            },
            title: {
              name: "Titel",
              sortable: true
            },
            date: {
              name: "Datum",
              transform: (date, row) => _isFullDay(date, row.endDate) ? formatDate(date) : formatDateWithTime(date),
              width: 160,
              sortable: true
            },
            endDate: {
              name: "Enddatum",
              transform: (endDate, row) => endDate === null
                ? "nicht festgelegt"
                // eslint-disable-next-line no-extra-parens
                : (_isFullDay(row.date, endDate)
                  ? "ganztägig"
                  : formatDateWithTime(endDate)),
              width: 180
            }
          },
          sortBy: "date",
          sortOrder: "desc",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: (pageIndex, sortBy, sortOrder) => {
            const query = querystring.stringify({
              offset: pageIndex * ITEMS_PER_PAGE,
              limit: ITEMS_PER_PAGE,
              fields: "id,color,title,date,endDate",
              sortBy,
              asc: sortOrder === "asc",
              filter: this.filterString
            })

            return this.$axios.$get(`/api/events?${query}`)
          }
        })
      }
    },
    head: () => ({
      title: "Kalender / Administration"
    }),
    computed: {
      filterString() {
        switch (this.dateFilter) {
          case "day":
            if (this.dateDayFilter !== null)
              return toFilterStringDate(this.dateDayFilter, true)

            break

          case "span":
            if (this.dateSpanFilter && this.dateSpanFilter.start && this.dateSpanFilter.end) {
              return [
                toFilterStringDate(this.dateSpanFilter.start, true),
                toFilterStringDate(this.dateSpanFilter.end, true)
              ].join(":")
            }

            break
        }

        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined
      }
    },
    watch: {
      dateFilter() {
        if (this.dateFilter === null) {
          this.updateUserDefinedVariables()
          this.table.pageIndex = 0
          this.table.fetch()
        } else {
          if (this.dateFilter !== this.dateFilterNotNull) {
            this.dateDayFilter = null
            this.dateSpanFilter = {}
          }

          this.dateFilterNotNull = this.dateFilter
          this.updateUserDefinedVariables()
          this.table.fetch()
        }
      }
    },
    beforeMount() {
      this.table.initialize()
    },
    methods: {
      onPickerInput() {
        this.updateUserDefinedVariables()
        this.table.pageIndex = 0
        this.table.fetch()
      },
      onEditModalClose(canceled) {
        this.editModalActive = false

        if (!canceled) {
          this.table.invalidateLastFetch()
          this.table.fetch()
        }
      },
      onRowClick(id) {
        this.openEditEventModal(id)
      },
      updateUserDefinedVariables() {
        if (this.filterString === undefined)
          this.table.userDefinedVariables = []
        else
          this.table.userDefinedVariables = [this.filterString]
      },
      openEditEventModal(id) {
        this.editModalEventID = id
        this.editModalActive = true
      }
    }
  }
</script>
