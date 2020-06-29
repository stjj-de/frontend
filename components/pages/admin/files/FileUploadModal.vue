<template>
  <div class="file-upload-modal">
    <MyModal
      title="Datei wird hochgeladen"
      :active="active"
      closable
      @close="confirmCancelModalActive = true"
    >
      <template v-slot:default>
        <LoadingPlaceholder v-if="file" width="100%" height="100px">
          {{ file.name }}
        </LoadingPlaceholder>
      </template>
      <template v-slot:buttons="{ close }">
        <MyButton @click="close()">
          Abbrechen
        </MyButton>
      </template>
    </MyModal>
    <MyModal
      title="Hochladen abbrechen?"
      closable
      :active="confirmCancelModalActive"
      @close="confirmCancelModalActive = false"
    >
      <template v-slot:buttons="{ close: cancel }">
        <MyButton variant="primary" @click="cancel()">
          Zurück
        </MyButton>
        <MyButton variant="danger" @click="onCancel()">
          Abbrechen
        </MyButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import MyModal from "@/components/MyModal";
  import LoadingPlaceholder from "@/components/LoadingPlaceholder";
  import MyButton from "@/components/MyButton";

  export default {
    name: "FileUploadModal",
    components: { MyButton, LoadingPlaceholder, MyModal },
    props: {
      active: {
        type: Boolean,
        required: true
      },
      file: {
        type: null,
        required: true,
        validate: value => value instanceof File || value === null
      }
    },
    data: () => ({
      confirmCancelModalActive: false,
      abortController: null
    }),
    watch: {
      active() {
        if (this.active && this.file !== null) {
          this.onActivate();
        }
      }
    },
    methods: {
      async onActivate() {
        this.abortController = new AbortController();

        const uploadedFile = null; // TODO

        this.$emit("close", uploadedFile.id);
      },
      onCancel() {
        this.confirmCancelModalActive = false;

        this.abortController.abort();
        this.$emit("close", null);
      }
    }
  };
</script>
