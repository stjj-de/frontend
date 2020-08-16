<template>
  <main class="contents-page">
    <h1 class="heading--1">
      Inhalte
    </h1>
    <section v-for="[id, meta] in Object.entries(contents)" :key="id">
      <h2>{{ meta.title }}</h2>
      <p v-if="meta.description">
        {{ meta.description }}
      </p>
      <template v-if="meta.file !== undefined">
        <p>
          <span v-if="meta.file.id === ''">Keine Datei hochgeladen.</span>
          <a
            v-else
            class="link"
            target="_blank"
            :href="`/files/${meta.file.id}`"
          >Datei anzeigen</a>
        </p>
        <FileUploadButton
          :after-upload-action="getAfterUploadAction(id)"
          :mime-type="meta.file.mimeType || null"
        />
      </template>
      <MyButton v-else @click="openEditModal(id)">
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
  import { CONTENTS } from "@/assets/js/contents"
  import FileUploadButton from "@/components/FileUploadButton"

  export default {
    name: "ContentsPage",
    components: { FileUploadButton, EditContentModal, MyButton },
    async asyncData({ $api }) {
      const contents = { ...CONTENTS }

      for (const key in contents) {
        if (!Object.hasOwnProperty.apply(contents, [key])) continue

        const meta = contents[key]

        if (meta.file) {
          contents[key] = {
            ...meta,
            file: {
              ...meta.file,
              // eslint-disable-next-line no-await-in-loop
              id: await $api.contents.get(key)
            }
          }
        }
      }

      return { contents }
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
      getAfterUploadAction(id) {
        return async data => {
          await this.$api.contents.update(id, data.id)
          this.contents[id].file.id = data.id
        }
      }
    },
    head: () => ({
      title: "Inhalte / Administration"
    })
  }
</script>
