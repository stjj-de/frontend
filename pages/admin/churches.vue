<template>
  <main class="groups-page">
    <h1 class="heading--1">
      Kirchen
    </h1>
    <DataTable
      :companion="table"
      loading-text="Kirchen werden geladen"
      @row-click="id => onRowClick(id)"
    >
      <template v-slot:empty-state>
        <AdminDataTableEmptyState items-name="Kirchen"/>
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
    <EditChurchModal
      :church-id="editModalChurchID"
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
  import EditChurchModal from "@/components/pages/admin/churches/EditChurchModal"

  const ITEMS_PER_PAGE = 10

  export default {
    name: "ChurchesPage",
    components: { EditChurchModal, AdminDataTableEmptyState, MyButton, DataTable },
    data() {
      return {
        editModalChurchID: null,
        editModalActive: false,
        table: new DataTableCompanion({
          columns: {
            title: {
              name: "Titel",
              sortable: true
            }
          },
          sortBy: "title",
          sortOrder: "desc",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: (pageIndex, sortBy, sortOrder) => this.$api.churches.list({
            sortBy,
            ascending: sortOrder === "asc",
            limit: ITEMS_PER_PAGE,
            offset: ITEMS_PER_PAGE * pageIndex,
            fields: ["id", "title"]
          })
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
        this.editModalChurchID = id
        this.editModalActive = true
      }
    },
    head: () => ({
      title: "Kirchen / Administration"
    })
  }
</script>
