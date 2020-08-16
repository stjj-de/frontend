<template>
  <main class="church-service-dates-page">
    <h1 class="heading--1">
      Gottesdienste
    </h1>
    <DataTable
      :companion="table"
      loading-text="Gottesdienste werden geladen"
      @row-click="id => onRowClick(id)"
    >
      <template v-slot:empty-state>
        <AdminDataTableEmptyState items-name="Gottesdienste"/>
      </template>
      <template v-slot:buttons>
        <MyButton
          v-if="$store.getters.userIsEditor"
          variant="primary"
          @click="openEditModal('')"
        >
          Erstellen
        </MyButton>
      </template>
    </DataTable>
    <EditGottesdienstModal
      :gottesdienst-id="editModalChurchServiceDateID"
      :active="editModalActive"
      @close="canceled => onEditModalClose(canceled)"
    />
  </main>
</template>

<style scoped lang="scss">

</style>

<script>
  import DataTable from "@/components/DataTable/DataTable"
  import { DataTableCompanion } from "@/components/DataTable/data-table-companion"
  import MyButton from "@/components/MyButton"
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState"
  import EditGottesdienstModal from "@/components/pages/admin/gottesdienste/EditGottesdienstModal"
  import { formatDateWithTime } from "@/assets/js/date-utils"

  const ITEMS_PER_PAGE = 10

  export default {
    name: "ChurchServiceDatesPage",
    components: { AdminDataTableEmptyState, MyButton, DataTable, EditGottesdienstModal },
    data() {
      return {
        editModalChurchServiceDateID: null,
        editModalActive: false,
        table: new DataTableCompanion({
          columns: {
            date: {
              name: "Datum",
              sortable: true,
              transform: formatDateWithTime
            },
            church: {
              name: "Kirche",
              width: 400,
              transform: church => church.title
            }
          },
          sortBy: "date",
          sortOrder: "asc",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: async (pageIndex, sortBy, sortOrder) => this.$api.churches.populate(
            await this.$api.churchServiceDates.list({
              sortBy,
              ascending: sortOrder === "asc",
              limit: ITEMS_PER_PAGE,
              offset: ITEMS_PER_PAGE * pageIndex,
              fields: ["id", "date", "church"]
            }),
            "church",
            ["title"]
          )
        })
      }
    },
    beforeMount() {
      this.table.initialize()
    },
    methods: {
      onEditModalClose(canceled) {
        this.editModalActive = false

        if (!canceled) {
          this.table.invalidateLastFetch()
          this.table.fetch()
        }
      },
      onRowClick(id) {
        this.openEditModal(id)
      },
      updateUserDefinedVariables() {
        if (this.filterString === undefined)
          this.table.userDefinedVariables = []
        else
          this.table.userDefinedVariables = [this.filterString]
      },
      openEditModal(id) {
        this.editModalChurchServiceDateID = id
        this.editModalActive = true
      }
    },
    head: () => ({
      title: "Gottesdienste / Administration"
    })
  }
</script>
