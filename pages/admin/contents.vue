<template>
  <main class="contents-page">
    <h1 class="heading--1">
      Inhalte
    </h1>
    <template v-for="[id, meta] in Object.entries(contents)">
      <h2>{{ meta.title }}</h2>
      <p v-if="meta.description">{{ meta.description }}</p>
      <template v-if="meta.file !== undefined">
        <p>
          <span v-if="meta.file.id === ''">Keine Datei hochgeladen.</span>
          <a v-else class="link" target="_blank" :href="`/files/${meta.file.id}`">Datei anzeigen</a>
        </p>
        <FileUploadButton
          :after-upload-action="getAfterUploadAction(id)"
          :mime-type="meta.file.mimeType || null"
        />
      </template>
      <MyButton v-else @click="openEditModal(id)">Bearbeiten</MyButton>
    </template>
    <EditContentModal :active.sync="editModalActive" :content-id="editModalContentID"/>
  </main>
</template>

<style scoped lang="scss">
</style>

<script>
  import DataTable from "@/components/DataTable/DataTable";
  import MyButton from "@/components/MyButton";
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState";
  import MyModal from "@/components/MyModal";
  import EditContentModal from "@/components/pages/admin/contents/EditContentModal";
  import { CONTENTS } from "@/assets/js/contents";
  import FileUploadButton from "@/components/pages/admin/contents/FileUploadButton";

  export default {
    name: "ContentsPage",
    components: { FileUploadButton, EditContentModal, MyModal, AdminDataTableEmptyState, MyButton, DataTable },
    head: () => ({
      title: "Inhalte / Administration"
    }),
    data: () => ({
      contents: {},
      editModalContentID: null,
      editModalActive: false
    }),
    async asyncData({ $api }) {
      const contents = { ...CONTENTS };

      for (const key in contents) {
        const meta = contents[key];

        if (meta.file) {
          contents[key] = {
            ...meta,
            file: {
              ...meta.file,
              id: await $api.contents.get(key)
            }
          };
        }
      }

      return { contents };
    },
    methods: {
      onEditModalClose() {
        this.editModalActive = false;
      },
      openEditModal(id) {
        this.editModalContentID = id;
        this.editModalActive = true;
      },
      getAfterUploadAction(id) {
        return async (fileID) => {
          await this.$api.contents.update(id, fileID);
          this.contents[id].file.id = fileID;
        };
      }
    }
  };
</script>
