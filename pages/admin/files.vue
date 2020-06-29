<template>
  <main class="files-admin-page">
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
        <MyButton variant="primary" @click="openSelectFileDialog()">
          Hochladen
        </MyButton>
      </template>
    </DataTable>
    <input
      ref="fileInput"
      class="files-admin-page__input"
      type="file"
      @input="onFileSelect"
    >
    <FileUploadModal :active="uploadFileModalActive" :file="uploadFileModalFile" @close="onUploadFileModalClose"/>
    <EditUploadedFileModal
      :active="editUploadedFileModalActive"
      :uploaded-file-id="editUploadedFileModalID"
      @close="onEditUploadedFileModalClose"
    />
  </main>
</template>

<style scoped lang="scss">
  .files-admin-page__input {
    display: none;
  }
</style>

<script>
  import snakeCase from "lodash.snakecase";
  import DataTable from "@/components/DataTable/DataTable";
  import { DataTableCompanion } from "@/components/DataTable/DataTableCompanion";
  import MyButton from "@/components/MyButton";
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState";
  import { formatDateWithOptionalTime } from "@/assets/js/dateUtils";
  import FilesTableTypeCell from "@/components/pages/admin/files/FilesTableTypeCell";
  import FileUploadModal from "@/components/pages/admin/files/FileUploadModal";
  import EditUploadedFileModal from "@/components/pages/admin/files/EditUploadedFileModal";
  import FilesTableAliasCell from "@/components/pages/admin/files/FilesTableAliasCell";

  const ITEMS_PER_PAGE = 10;

  export default {
    name: "FilesAdminPage",
    components: { EditUploadedFileModal, FileUploadModal, AdminDataTableEmptyState, MyButton, DataTable },
    head: () => ({
      title: "Dateien / Administration"
    }),
    data() {
      return {
        editUploadedFileModalActive: false,
        editUploadedFileModalID: null,
        uploadFileModalActive: false,
        uploadFileModalFile: null,
        isEditingUploaded: false,
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
              component: FilesTableAliasCell,
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
          fetch: async (pageIndex, sortBy, order) => {
            return []; // TODO
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

        if (!canceled || this.isEditingUploaded) {
          this.table.invalidateLastFetch();
          this.table.fetch();
        }
      },
      openSelectFileDialog() {
        this.$refs.fileInput.click();
      },
      onFileSelect() {
        this.uploadFile(this.$refs.fileInput.files[0]);
      },
      uploadFile(file) {
        if (!file) return;

        this.uploadFileModalFile = file;
        this.uploadFileModalActive = true;
      },
      async onUploadFileModalClose(uploadedID) {
        this.uploadFileModalActive = false;

        if (uploadedID !== null) {
          (await import("izitoast")).show({
            message: "Die Datei wurde erfolgreich hochgeladen.",
            color: "green",
            timeout: 6000,
            position: "topRight",
            buttons: [
              ["<button>Bearbeiten</button>", (instance, toast) => {
                this.editUploadedFile(uploadedID);
                instance.hide({
                  transitionOut: "fadeOutUp"
                }, toast);
              }, true]
            ]
          });
        }

        this.table.invalidateLastFetch();
        this.table.fetch();
      }
    }
  };
</script>
