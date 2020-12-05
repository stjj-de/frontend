<template>
  <div class="edit-church-modal">
    <MyModal
      title="Kirche bearbeiten"
      closable
      width="520px"
      :loading="loading"
      :loading-text="loadingText"
      :active="active"
      @close="onCancel"
    >
      <template #default>
        <InputField label="Titel" :companion="fields.title"/>
        <InputField label="Google Maps ID" placeholder="z. B. geVDFBDgRSMoJ4SL9" :companion="fields.googleMapsID"/>
        <span>
          Du findest diese ID, wenn du auf Google Maps den Link zum Teilen eines Ortes
          (https://goo.gl/maps/xxxx) kopierst.
          Diesen kannst du einfach hier einfügen, er wird dann automatisch gekürzt.
        </span>
      </template>
      <template v-if="$store.getters.userIsEditor" #secondary-buttons>
        <MyButton
          v-if="!isCreateNew"
          class="edit-church-modal__delete-button"
          variant="danger"
          @click="confirmDeleteModalActive = true"
        >
          Löschen
        </MyButton>
      </template>
      <template #buttons>
        <MyButton
          @click="onCancel"
        >
          Abbrechen
        </MyButton>
        <MyButton
          :disabled="!changed || !valid"
          variant="primary"
          @click="save"
        >
          {{ isCreateNew ? "Erstellen" : "Speichern" }}
        </MyButton>
      </template>
    </MyModal>
    <ConfirmCancelModal :active.sync="confirmCancelModalActive" @confirm="close(true)"/>
    <ConfirmDeleteModal item-type="Kirche" :active.sync="confirmDeleteModalActive" @confirm="delete_"/>
  </div>
</template>

<style lang="scss">
</style>

<script>
  import MyModal from "@/components/MyModal"
  import InputField from "@/components/InputField/InputField"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion"
  import MyButton from "@/components/MyButton"
  import ConfirmCancelModal from "@/components/ConfirmCancelModal"
  import ConfirmDeleteModal from "@/components/ConfirmDeleteModal"

  export default {
    name: "EditChurchModal",
    components: { ConfirmDeleteModal, ConfirmCancelModal, MyButton, InputField, MyModal },
    props: {
      churchId: {
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
        savedChurch: null,
        description: "",
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
          googleMapsID: new InputFieldCompanion({
            transform: value => value.trim(),
            required: true
          })
        }
      }
    },
    computed: {
      valid() {
        return Object.values(this.fields).every(field => field.valid)
      },
      isCreateNew() {
        return this.churchId === ""
      },
      changed() {
        return Object.values(this.fields).some(field => field.changed)
      }
    },
    watch: {
      active() {
        if (this.active && this.churchId !== null)
          this.onActivate()
      },
      "fields.googleMapsID.transformedValue"(value) {
        if (value.startsWith("https://goo.gl/maps/"))
          this.fields.googleMapsID.value = value.slice(20)
      }
    },
    methods: {
      onActivate() {
        this.fields.title.setValueAndReset("")

        if (!this.isCreateNew)
          this.fetchGroup()

        this.fields.title.focus()
      },
      onCancel() {
        if (this.changed)
          this.confirmCancelModalActive = true
        else
          this.close(true)
      },
      close(canceled = false) {
        this.$emit("close", canceled)
      },
      async fetchGroup() {
        const { churchId } = this

        this.loading = true
        this.loadingText = "Kirche wird geladen"

        const church = await this.$api.churches.get(churchId, ["title", "googleMapsID"])

        if (this.churchId !== churchId) return
        this.savedChurch = church

        this.fields.title.setValueAndReset(church.title)
        this.fields.googleMapsID.setValueAndReset(church.googleMapsID)
        this.loading = false
      },
      async save() {
        this.loading = true

        const data = {
          title: this.fields.title.transformedValue,
          googleMapsID: this.fields.googleMapsID.transformedValue
        }

        if (this.isCreateNew) {
          this.loadingText = "Kirche wird erstellt"
          await this.$api.churches.create(data)
        } else {
          this.loadingText = "Kirche wird gespeichert"
          await this.$api.churches.update(this.churchId, data)
        }

        this.loading = false
        this.close()
      },
      async delete_() {
        this.loading = true
        this.loadingText = "Kirche wird gelöscht"

        await this.$api.churches.delete(this.churchId)

        this.loading = false
        this.close()
      }
    }
  }
</script>
