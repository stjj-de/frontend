<template>
  <div class="edit-content-modal">
    <MyModal
      width="1000vw"
      title="Inhalt bearbeiten"
      closable
      :loading="loading"
      :active="active"
      @close="cancel"
    >
      <template #default>
        <h2 class="heading--5">{{ meta.title }}</h2>
        <client-only>
          <PostEditor
            :key="contentId"
            v-model="content"
            class="edit-content-modal__editor"
            :highest-heading="meta.maxHeading"
          />
        </client-only>
      </template>
      <template #buttons>
        <MyButton
          @click="cancel"
        >
          Abbrechen
        </MyButton>
        <MyButton variant="primary" :disabled="!changed || !valid" @click="save">
          Speichern
        </MyButton>
      </template>
    </MyModal>
    <ConfirmCancelModal :active.sync="confirmCancelModalActive" @confirm="close"/>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";

  .edit-content-modal__editor {
    .ql-container {
      height: 50vh;
      overflow: auto;

      @include screenSize.mobile {
        height: 40vh;
      }
    }
  }
</style>

<script>
  import PostEditor from "@/components/pages/admin/posts/_id/PostEditor"
  import MyModal from "@/components/MyModal"
  import stripTags from "striptags"
  import { CONTENTS } from "@/assets/js/contents"
  import MyButton from "@/components/MyButton"
  import ConfirmCancelModal from "@/components/ConfirmCancelModal"

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
      meta: vm => vm.contentId === null ? { title: "", maxHeading: 1 } : CONTENTS[vm.contentId],
      changed: vm => vm.content !== vm.savedContent,
      valid: vm => stripTags(vm.content).trim() !== ""
    },
    watch: {
      async active() {
        if (!this.active) return
        this.loadingText = "Inhalt wird geladen"
        this.loading = true
        this.savedContent = await this.$api.contents.get(this.contentId)
        this.content = this.savedContent
        this.loading = false
      }
    },
    methods: {
      close() {
        this.$emit("update:active", false)
      },
      cancel() {
        if (this.changed) this.confirmCancelModalActive = true
        else this.close()
      },
      save() {
        this.loadingText = "Inhalt wird gespeichert"
        this.loading = true
        this.$api.contents.update(this.contentId, this.content)
        this.close()
        this.loading = false
      }
    }
  }
</script>
