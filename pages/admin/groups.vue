<template>
  <main class="groups-page">
    <h1 class="heading--1">
      Gruppen
    </h1>
    <p v-if="!$store.getters.userIsEditor">
      Du siehst nur Gruppen, die du verwalten darfst.
    </p>
    <DataTable
      :companion="table"
      loading-text="Gruppen werden geladen"
      @row-click="onRowClick"
    >
      <template v-slot:empty-state>
        <AdminDataTableEmptyState items-name="Gruppen"/>
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
    <EditGroupModal
      :group-id="editModalGroupID"
      :active="editModalActive"
      @close="onEditModalClose"
    />
  </main>
</template>

<style scoped lang="scss">
</style>

<script>
  import DataTable from "@/components/DataTable/DataTable";
  import VDatePicker from "@/components/VCalendar/AsyncVDatePicker";
  import { DataTableCompanion } from "@/components/DataTable/DataTableCompanion";
  import EditEventModal from "@/components/pages/admin/calendar/EditEventModal";
  import MyButton from "@/components/MyButton";
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState";
  import EditGroupModal from "@/components/pages/admin/groups/EditGroupModal";

  const ITEMS_PER_PAGE = 10;

  export default {
    name: "GroupsPage",
    components: { EditGroupModal, AdminDataTableEmptyState, MyButton, EditEventModal, DataTable, VDatePicker },
    head: () => ({
      title: "Gruppen / Administration"
    }),
    data() {
      return {
        editModalGroupID: null,
        editModalActive: false,
        table: new DataTableCompanion({
          columns: {
            title: {
              name: "Titel",
              sortable: true
            },
            members: {
              name: "Mitglieder",
              width: 400,
              transform: members => members.map(member => member.realName).join(", ")
            }
          },
          sortBy: "title",
          sortOrder: "desc",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: async (pageIndex, sortBy, sortOrder) => {
            return await this.$api.users.populate(
              await this.$api.groups.list({
                sortBy,
                ascending: sortOrder === "asc",
                limit: ITEMS_PER_PAGE,
                offset: ITEMS_PER_PAGE * pageIndex,
                fields: ["id", "title", "members"],
                onlyOwn: !this.$store.getters.userIsEditor
              }),
              "members",
              ["realName"]
            );
          }
        })
      };
    },
    beforeMount() {
      this.table.initialize();
    },
    methods: {
      onEditModalClose(canceled) {
        this.editModalActive = false;

        if (!canceled) {
          this.table.invalidateLastFetch();
          this.table.fetch();
        }
      },
      onRowClick(id) {
        this.openEditModal(id);
      },
      updateUserDefinedVariables() {
        if (this.filterString === undefined) {
          this.table.userDefinedVariables = [];
        } else {
          this.table.userDefinedVariables = [this.filterString];
        }
      },
      openEditModal(id) {
        this.editModalGroupID = id;
        this.editModalActive = true;
      }
    }
  };
</script>
