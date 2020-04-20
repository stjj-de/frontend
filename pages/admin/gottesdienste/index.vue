<template>
  <main class="gottesdienste-admin-page">
    <h1 class="heading--1">
      Gottesdienste
    </h1>
    <div class="gottesdienste-admin-page__gottesdienste">
      <LoadingOverlay opacity="1" :active="$apollo.queries.gottesdienste.loading">
        Gottesdienste werden geladen
      </LoadingOverlay>
      <GottesdienstCard
        v-for="gottesdienst in gottesdienste"
        :key="gottesdienst.id"
        class="gottesdienste-admin-page__gottesdienst"
        :gottesdienst="gottesdienst"
        @edit="editGottesdienst(gottesdienst.id)"
        @delete="confirmDeleteModalID = gottesdienst.id"
      />
      <MyButton variant="primary" @click="editGottesdienst('')">
        Erstellen
      </MyButton>
    </div>
    <EditGottesdienstModal
      :active="editModalActive"
      @close="onModalClose"
      :gottesdienst-id="editModalGottesdienstID"
    />
    <MyModal
      title="Gottesdienst löschen?"
      closable
      loading-text="Gottesdienst wird gelöscht"
      width="400px"
      :loading="deleteLoading"
      :active="confirmDeleteModalID !== null"
      @close="onModalClose"
    >
      <template v-slot:default>
        Diese Aktion kann nicht rückganging gemacht werden.
      </template>
      <template v-slot:buttons>
        <MyButton variant="primary" @click="onModalClose(true)">
          Abbrechen
        </MyButton>
        <MyButton variant="danger" @click="delete_()">
          Löschen
        </MyButton>
      </template>
    </MyModal>
  </main>
</template>

<style scoped lang="scss">
  .gottesdienste-admin-page__gottesdienste {
    position: relative;
    min-height: 400px;
  }

  .gottesdienste-admin-page__gottesdienst {
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
</style>

<script>
  import GottesdiensteQuery from "./gottesdiensteQuery.graphql";
  import DeleteGottesdienstMutation from "./deleteGottesdienstMutation.graphql";
  import GottesdienstCard from "@/components/GottesdienstCard";
  import EditGottesdienstModal
    from "@/components/pages/admin/gottesdienste/EditGottesdienstModal/EditGottesdienstModal";
  import MyModal from "@/components/MyModal";
  import MyButton from "@/components/MyButton";
  import LoadingOverlay from "@/components/LoadingOverlay";

  export default {
    name: "GottesdiensteAdminPage",
    components: { LoadingOverlay, MyButton, MyModal, EditGottesdienstModal, GottesdienstCard },
    head: () => ({
      title: "Gottesdienste / Administration"
    }),
    data: () => ({
      editModalActive: false,
      editModalGottesdienstID: null,
      confirmDeleteModalID: null,
      deleteLoading: false
    }),
    apollo: {
      gottesdienste: {
        query: GottesdiensteQuery,
        fetchPolicy: "network-only"
      }
    },
    methods: {
      onModalClose(canceled) {
        if (!canceled) this.refetch();
        this.confirmDeleteModalID = null;
        this.editModalActive = false;
      },
      editGottesdienst(id) {
        this.editModalGottesdienstID = id;
        this.editModalActive = true;
      },
      async delete_() {
        this.deleteLoading = true;

        await this.$apollo.mutate({
          mutation: DeleteGottesdienstMutation,
          variables: {
            id: this.confirmDeleteModalID
          }
        });

        this.confirmDeleteModalID = null;
        this.deleteLoading = false;
        this.refetch();
      },
      refetch() {
        return this.$apollo.queries.gottesdienste.refetch();
      }
    }
  };
</script>
