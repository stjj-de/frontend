<template>
  <div class="events-page">
    <h1 class="heading--1 _heading">
      Ereignisse
    </h1>
    <DataTable :companion="table" loading-text="Ereignisse werden geladen">
      <template v-slot:date="row">
        {{ new Date(row).toLocaleDateString() }}
      </template>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
  import { de } from "date-fns/locale";
  import { format } from "date-fns";
  import EventsQuery from "./eventsQuery.graphql";
  import DataTable from "@/components/DataTable/DataTable";
  import EventsTableColorColumn from "@/components/pages/admin/events/EventsTableColorColumn";
  import { DataTableCompanion } from "@/components/DataTable/DataTableCompanion";

  const formatDateWithTime = date => format(new Date(date), "d.L.yyyy, HH:mm", { locale: de });
  const formatDate = date => format(new Date(date), "d.L.yyyy", { locale: de });
  const isFullDay = (startDateString, endDateString) => {
    if (endDateString === null) {
      return false;
    }

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // 86400000 = a full day
    return startDate.getHours() === 0 && endDate.getHours() === 0 && endDate - startDate === 86400000;
  };

  const ITEMS_PER_PAGE = 10;

  export default {
    name: "EventsPage",
    components: { DataTable },
    layout: "admin",
    data() {
      return {
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
              transform: (date, row) => isFullDay(date, row.endDate) ? formatDate(date) : formatDateWithTime(date),
              width: 160,
              sortable: true
            },
            endDate: {
              name: "Enddatum",
              transform: (endDate, row) => endDate === null
                ? "nicht festgelegt"
                : (isFullDay(row.date, endDate)
                  ? "ganztägig"
                  : formatDateWithTime(endDate)),
              width: 180
            }
          },
          sortBy: "date",
          sortOrder: "DESCENDING",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: async (pageIndex, sortBy, sortOrder) => {
            const result = await this.$apollo.query({
              query: EventsQuery,
              variables: {
                skip: pageIndex * ITEMS_PER_PAGE,
                take: ITEMS_PER_PAGE,
                order: sortOrder,
                sortBy: sortBy.toUpperCase()
              },
              fetchPolicy: "network-only"
            });

            return result.data.events;
          }
        })
      };
    },
    beforeMount() {
      this.table.initialize();
    }
  };
</script>
