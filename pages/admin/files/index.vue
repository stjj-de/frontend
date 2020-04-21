<template>
  <main class="uploaded-files-page">
    <h1 class="heading--1">
      Dateien
    </h1>
    <DataTable
      :companion="table"
      loading-text="Dateien werden geladen"
      @row-click="id => editUploadedFile(id)"
    >
      <template v-slot:empty-state>
        <AdminDataTableEmptyState items-name="Dateien"/>
      </template>
      <template v-slot:buttons>
        <MyButton
          variant="primary"
          @click="createUploadedFileModalActive = true"
        >
          Hochladen
        </MyButton>
      </template>
    </DataTable>
  </main>
</template>

<style scoped lang="scss">

</style>

<script>
  import UploadedFilesQuery from "./uploadedFilesQuery.graphql";
  import DataTable from "@/components/DataTable/DataTable";
  import { DataTableCompanion } from "@/components/DataTable/DataTableCompanion";
  import MyButton from "@/components/MyButton";
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState";
  import { formatDateWithOptionalTime } from "@/assets/js/dateUtils";
  import FilesTableTypeCell from "@/components/pages/admin/files/FilesTableTypeCell";

  // <EditUploadedFileModal
  //   :active="editUploadedFileModalActive"
  // :uploaded-file-id="editUploadedFileModalID"
  // @close="onEditUploadedFileModalClose"
  //   />

  const ITEMS_PER_PAGE = 10;

  export default {
    name: "FilesAdminPage",
    components: { AdminDataTableEmptyState, MyButton, DataTable },
    head: () => ({
      title: "Dateien / Administration"
    }),
    data() {
      return {
        editUploadedFileModalActive: false,
        editUploadedFileModalID: null,
        table: new DataTableCompanion({
          columns: {
            mimeType: {
              name: "Typ",
              component: FilesTableTypeCell,
              sortable: true,
              headTextAlign: "center",
              width: 80
            },
            title: {
              name: "Titel",
              sortable: true
            },
            alias: {
              name: "Alias",
              sortable: true,
              width: 200
            },
            uploadDate: {
              name: "Datum",
              transform: formatDateWithOptionalTime,
              sortable: true,
              width: 200
            }
          },
          sortBy: "uploadDate",
          sortOrder: "DESCENDING",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: async (pageIndex, sortBy, sortOrder) => {
            const result = await this.$apollo.query({
              query: UploadedFilesQuery,
              variables: {
                skip: pageIndex * ITEMS_PER_PAGE,
                take: ITEMS_PER_PAGE,
                order: sortOrder
              },
              fetchPolicy: "network-only"
            });

            return result.data.uploadedFiles;
          }
        })
      };
    },
    beforeMount() {
      this.table.initialize();
    },
    methods: {
      editUploadedFile(id) {
        this.editUploadedFileModalID = id;
        this.editUploadedFileModalActive = true;
      },
      onEditUploadedFileModalClose(canceled) {
        this.editUploadedFileModalActive = false;

        if (!canceled) {
          this.table.invalidateLastFetch();
          this.table.fetch();
        }
      }
    }
  };
</script>
