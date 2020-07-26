<template>
  <div class="edit-content-modal">
    <MyModal
      width="1000vw"
      title="Inhalt bearbeiten"
      closable
      :loading="loading"
      :active="active"
      @close="cancel()"
    >
      <template v-slot:default>
        <h2 class="heading--5">{{ title }}</h2>
        <PostEditor class="edit-content-modal__editor" v-model="content"/>
      </template>
      <template v-slot:buttons>
        <MyButton
          @click="cancel()"
        >
          Abbrechen
        </MyButton>
        <MyButton variant="primary" @click="save()" :disabled="!changed || !valid">Speichern</MyButton>
      </template>
    </MyModal>
    <ConfirmCancelModal :active.sync="confirmCancelModalActive" @confirm="close()"/>
  </div>
</template>

<style lang="scss">
  .edit-content-modal__editor {
    .ql-container {
      min-height: 50vh;
    }
  }
</style>

<script>
  import PostEditor from "@/components/pages/admin/posts/_id/PostEditor";
  import MyModal from "@/components/MyModal";
  import stripTags from "striptags";
  import { CONTENTS } from "@/assets/js/contents";
  import MyButton from "@/components/MyButton";
  import ConfirmCancelModal from "@/components/ConfirmCancelModal";

  export default {
    name: "EditContentModal",
    components: { ConfirmCancelModal, MyButton, MyModal, PostEditor },
    props: {
      active: {
        type: Boolean,
        required: true
      },
      contentId: {
        type: null,
        required: true,
        validate: value => value === null || typeof value === "string"
      }
    },
    data: () => ({
      content: "",
      savedContent: null,
      loading: false,
      loadingText: "",
      confirmCancelModalActive: false
    }),
    computed: {
      title: vm => vm.contentId === null ? "" : CONTENTS[vm.contentId].title,
      changed: vm => vm.content !== vm.savedContent,
      valid: vm => stripTags(vm.content).trim() !== ""
    },
    watch: {
      async active() {
        if (!this.active) return;
        this.loadingText = "Inhalt wird geladen";
        this.loading = true;
        this.savedContent = await this.$api.contents.get(this.contentId);
        this.content = this.savedContent;
        this.loading = false;
      }
    },
    methods: {
      close() {
        this.$emit('update:active', false);
      },
      cancel() {
        if (this.changed) this.confirmCancelModalActive = true;
        else this.close();
      },
      save() {
        this.loadingText = "Inhalt wird gespeichert";
        this.loading = true;
        this.$api.contents.update(this.contentId, this.content);
        this.close();
        this.loading = false;
      }
    }
  };
</script>
