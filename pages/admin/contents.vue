<template>
  <main class="contents-page">
    <h1 class="heading--1">
      Inhalte
    </h1>
    <section v-for="content in contents" :key="content.id">
      <h2>{{ content.title }}</h2>
      <p v-if="content.description">
        {{ content.description }}
      </p>
      <template v-if="content.file !== undefined">
        <p>
          <span v-if="content.file.id === ''">Keine Datei hochgeladen.</span>
          <a
            v-else
            class="link"
            target="_blank"
            :href="`/files/${content.file.id}`"
          >
            Datei anzeigen
          </a>
        </p>
        <FileUploadButton
          :after-upload-action="getAfterUploadAction(content)"
          :mime-type="content.file.mimeType || null"
        />
      </template>
      <MyButton v-else @click="openEditModal(content.id)">
        Bearbeiten
      </MyButton>
    </section>
    <EditContentModal :active.sync="editModalActive" :content-id="editModalContentID"/>
  </main>
</template>

<style scoped lang="scss">
</style>

<script>
  import MyButton from "@/components/MyButton"
  import EditContentModal from "@/components/pages/admin/contents/EditContentModal"
  import {
    ADMIN_NEWS,
    CONTENTS,
    GEMEINDE,
    HOMEPAGE_INTRODUCTION,
    IMPRESSUM,
    MESSDIENERPLAN,
    PFARRBRIEF, PRIVACY_POLICY
  } from "@/assets/js/contents"
  import FileUploadButton from "@/components/FileUploadButton"

  const ORDER = [
    MESSDIENERPLAN,
    PFARRBRIEF,
    GEMEINDE,
    HOMEPAGE_INTRODUCTION,
    IMPRESSUM,
    PRIVACY_POLICY,
    ADMIN_NEWS
  ]

  export default {
    name: "ContentsPage",
    components: { FileUploadButton, EditContentModal, MyButton },
    async asyncData({ $api, store }) {
      return {
        contents: (await Promise.all(ORDER.map(async id => {
          const meta = CONTENTS[id]
          if (meta.adminOnly) {
            await store.state.userPromise
            if (store.state.user.role !== "ADMINISTRATOR") return null
          }

          const data = {
            id,
            ...meta
          }

          if (meta.file) data.file.id = await $api.contents.get(id)

          return data
        }))).filter(content => content !== null)
      }
    },
    data: () => ({
      contents: {},
      editModalContentID: null,
      editModalActive: false
    }),
    methods: {
      onEditModalClose() {
        this.editModalActive = false
      },
      openEditModal(id) {
        this.editModalContentID = id
        this.editModalActive = true
      },
      getAfterUploadAction(content) {
        return async data => {
          await this.$api.contents.update(content.id, data.id)
          content.file.id = data.id
        }
      }
    },
    head: () => ({
      title: "Inhalte / Administration"
    })
  }
</script>
