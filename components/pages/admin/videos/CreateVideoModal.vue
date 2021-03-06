<template>
  <div class="create-video-modal" @keypress.enter="submit">
    <MyModal
      title="Video erstellen"
      loading-text="Video wird erstellt"
      width="400px"
      :loading="loading"
      :closable="!loading"
      :active="active"
      @close="$emit('close', null)"
    >
      <template #default>
        <InputField label="YouTube Video ID" placeholder="z. B.: dQw4w9WgXcQ" :companion="videoID"/>
        <span>
          Du kannst auch eine YouTube-URL der Form "https://youtu.be/xxx" oder "https://www.youtube.com/watch?v=xxx"
          einfügen, sie wird dann automatisch gekürzt.
        </span>
      </template>
      <template #buttons="{ close }">
        <MyButton @click="close">
          Abbrechen
        </MyButton>
        <MyButton variant="primary" :disabled="!videoID.valid" @click="submit">
          Erstellen
        </MyButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import MyModal from "@/components/MyModal"
  import InputField from "@/components/InputField/InputField"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion"
  import MyButton from "@/components/MyButton"

  export default {
    name: "CreateVideoModal",
    components: { MyButton, InputField, MyModal },
    props: {
      active: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({
      loading: false,
      videoID: new InputFieldCompanion({
        required: true,
        transform: value => value.trim()
      })
    }),
    watch: {
      active() {
        if (this.active)
          this.videoID.focus()
        else {
          this.videoID.setValueAndReset("")
          this.loading = false
        }
      },
      "videoID.transformedValue"() {
        if (this.videoID.transformedValue.startsWith("https://youtu.be/"))
          this.videoID.value = this.videoID.value.slice(17)
        else if (this.videoID.transformedValue.startsWith("https://www.youtube.com/watch?v="))
          this.videoID.value = this.videoID.value.slice(32)
      }
    },
    methods: {
      async submit() {
        if (this.loading || !this.videoID.valid) return
        this.loading = true

        const { data } = await this.$api.videos.create({ youtubeVideoID: this.videoID.transformedValue }, [201, 404])

        if (data)
          this.$emit("close", data.id)
        else {
          this.loading = false
          this.videoID.setError("Dieses Video konnte nicht gefunden werden.", true)
        }
      }
    }
  }
</script>
