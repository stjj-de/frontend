<template>
  <div class="edit-video-modal">
    <MyModal
      title="Video bearbeiten"
      closable
      width="520px"
      :loading="loading"
      :loading-text="loadingText"
      :active="active"
      @close="onCancel"
    >
      <template v-slot:default>
        <template v-if="savedVideo !== null">
          <span class="input-field__label">Thumbnail</span>
          <YoutubeThumbnail
            class="edit-video-modal__thumbnail"
            size="highest"
            :video-id="savedVideo.youtubeVideoID"
          />
        </template>
        <InputField label="Titel" :companion="fields.title"/>
        <DateTimeField
          v-model="publishedAt"
          label="Veröffentlichungsdatum"
          placeholder="Nicht festgelegt"
          :companion="fields.publishedAt"
        />
      </template>
      <template v-slot:secondary-buttons>
        <MyButton
          class="edit-video-modal__delete-button"
          variant="danger"
          @click="confirmDeleteModalActive = true"
        >
          Löschen
        </MyButton>
      </template>
      <template v-slot:buttons>
        <MyButton
          class="edit-video-modal__cancel"
          @click="onCancel"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-video-modal__save"
          :disabled="!changed || !valid"
          variant="primary"
          @click="save"
        >
          Speichern
        </MyButton>
      </template>
    </MyModal>
    <ConfirmCancelModal :active.sync="confirmCancelModalActive" @confirm="close(true)"/>
    <ConfirmDeleteModal item-type="Video" :active.sync="confirmDeleteModalActive" @confirm="delete_"/>
  </div>
</template>

<style lang="scss">
  .edit-video-modal__thumbnail {
    width: 100%;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
  }
</style>

<script>
  import "vue-datetime/dist/vue-datetime.css"
  import MyModal from "@/components/MyModal"
  import InputField from "@/components/InputField/InputField"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion"
  import MyButton from "@/components/MyButton"
  import DateTimeField from "@/components/DateTimeField"
  import ConfirmCancelModal from "@/components/ConfirmCancelModal"
  import ConfirmDeleteModal from "@/components/ConfirmDeleteModal"
  import YoutubeThumbnail from "@/components/YoutubeThumbnail"

  export default {
    name: "EditVideoModal",
    components: {
      YoutubeThumbnail, ConfirmDeleteModal, ConfirmCancelModal, DateTimeField, MyButton, InputField, MyModal
    },
    props: {
      videoId: {
        type: null,
        validate: value => typeof value === "string" || value === null,
        required: true
      },
      active: { type: Boolean }
    },
    data() {
      return {
        loading: false,
        loadingText: "",
        confirmCancelModalActive: false,
        confirmDeleteModalActive: false,
        publishedAt: null,
        savedVideo: null,
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
          publishedAt: new InputFieldCompanion({
            readonly: true
          })
        }
      }
    },
    computed: {
      valid() {
        return Object.values(this.fields).every(field => field.valid)
      },
      changed() {
        return Object.values(this.fields).some(field => field.changed)
      }
    },
    watch: {
      active() {
        if (this.active && this.videoId !== null)
          this.onActivate()
      }
    },
    methods: {
      onActivate() {
        this.fields.title.setValueAndReset("")
        this.fetchVideo()
        this.fields.title.focus()
      },
      onCancel() {
        if (this.changed)
          this.confirmCancelModalActive = true
        else
          this.close(true)
      },
      close(canceled = false) {
        this.confirmCancelModalActive = false
        this.$emit("close", canceled)
      },
      async fetchVideo() {
        const { videoId } = this

        this.loading = true
        this.loadingText = "Video wird geladen"

        const video = await this.$api.videos.get(videoId, ["title", "publishedAt", "youtubeVideoID"])
        if (this.videoId !== videoId) return

        this.savedVideo = video
        this.fields.title.setValueAndReset(video.title)
        this.publishedAt = video.publishedAt

        this.$nextTick(() => {
          this.fields.publishedAt.reset()
        })

        this.loading = false
      },
      async save() {
        this.loadingText = "Video wird gespeichert"
        this.loading = true

        await this.$api.videos.update(this.videoId, {
          title: this.fields.title.transformedValue,
          publishedAt: this.publishedAt
        })

        this.loading = false
        this.close()
      },
      async delete_() {
        this.loading = true
        this.loadingText = "Video wird gelöscht"

        await this.$api.videos.delete(this.videoId)

        this.loading = false
        this.close()
      }
    }
  }
</script>
