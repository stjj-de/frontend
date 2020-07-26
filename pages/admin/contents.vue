<template>
  <main class="contents-page">
    <h1 class="heading--1">
      Inhalte
    </h1>
    <template v-for="[id, content] in Object.entries($options.contents)">
      <h2>{{ content.title }}</h2>
      <p>{{ content.description }}</p>
      <MyButton @click="openEditModal(id)">Bearbeiten</MyButton>
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

  export default {
    name: "ContentsPage",
    components: { EditContentModal, MyModal, AdminDataTableEmptyState, MyButton, DataTable },
    head: () => ({
      title: "Inhalte / Administration"
    }),
    data() {
      return {
        editModalContentID: null,
        editModalActive: false
      };
    },
    methods: {
      onEditModalClose() {
        this.editModalActive = false;
      },
      openEditModal(id) {
        this.editModalContentID = id;
        this.editModalActive = true;
      }
    },
    contents: CONTENTS
  };
</script>
