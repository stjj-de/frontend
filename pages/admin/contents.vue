<template>
  <main class="contents-page">
    <h1 class="heading--1">
      Inhalte
    </h1>
    <section>
      <h2>Live</h2>
      <form @submit.prevent="saveLiveVideoId">
        <InputField
          class="contents-page__live-video"
          placeholder="Leer lassen, wenn offline"
          label="Live-Video-ID"
          :companion="liveVideoId"
        />
        <MyButton is-submit variant="primary" :disabled="!liveVideoId.changed">
          Speichern
        </MyButton>
      </form>
    </section>
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
  .contents-page__live-video {
    max-width: 400px;
  }
</style>

<script>
  import MyButton from "@/components/MyButton"
  import EditContentModal from "@/components/pages/admin/contents/EditContentModal"
  import {
    ADMIN_NEWS,
    CONTENTS,
    GEMEINDE,
    HOMEPAGE_INTRODUCTION, HOMEPAGE_TOP,
    IMPRESSUM, MEDIATHEK,
    MESSDIENERPLAN,
    PFARRBRIEF, PRIVACY_POLICY
  } from "@/assets/js/contents"
  import FileUploadButton from "@/components/FileUploadButton"
  import InputField from "@/components/InputField/InputField.vue"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion.js"

  const ORDER = [
    MESSDIENERPLAN,
    PFARRBRIEF,
    GEMEINDE,
    MEDIATHEK,
    HOMEPAGE_TOP,
    HOMEPAGE_INTRODUCTION,
    IMPRESSUM,
    PRIVACY_POLICY,
    ADMIN_NEWS
  ]

  export default {
    name: "ContentsPage",
    components: { InputField, FileUploadButton, EditContentModal, MyButton },
    async asyncData({ $api, store }) {
      return {
        initialLiveVideoId: await $api.contents.get("LIVE_VIDEO_ID"),
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
      editModalActive: false,
      liveVideoId: new InputFieldCompanion({})
    }),
    head: () => ({
      title: "Inhalte / Administration"
    }),
    created() {
      this.liveVideoId.setValueAndReset(this.initialLiveVideoId)
    },
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
      },
      async saveLiveVideoId() {
        await this.$api.contents.update("LIVE_VIDEO_ID", this.liveVideoId.value)
        this.liveVideoId.reset()
      }
    }
  }
</script>
