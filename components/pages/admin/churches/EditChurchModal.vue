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
      <template v-slot:default>
        <InputField label="Titel" :companion="fields.title"/>
        <InputField label="Plus-Code (zu finden auf Google Maps)" placeholder="z. B. 86G7+9H" :companion="fields.plusCode"/>
      </template>
      <template v-if="$store.getters.userIsEditor" v-slot:secondary-buttons>
        <MyButton
          v-if="!isCreateNew"
          class="edit-church-modal__delete-button"
          variant="danger"
          @click="confirmDeleteModalActive = true"
        >
          Löschen
        </MyButton>
      </template>
      <template v-slot:buttons>
        <MyButton
          @click="onCancel()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          :disabled="!changed || !valid"
          variant="primary"
          @click="save()"
        >
          {{ isCreateNew ? "Erstellen" : "Speichern" }}
        </MyButton>
      </template>
    </MyModal>
    <ConfirmCancelModal :active.sync="confirmCancelModalActive" @confirm="close(true)"/>
    <ConfirmDeleteModal item-type="Kirche" :active.sync="confirmDeleteModalActive" @confirm="delete_()"/>
  </div>
</template>

<style lang="scss">
</style>

<script>
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";
  import ConfirmCancelModal from "@/components/ConfirmCancelModal";
  import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
  import PostEditor from "@/components/pages/admin/posts/_id/PostEditor";
  import { OpenLocationCode } from "open-location-code";

  export default {
    name: "EditChurchModal",
    components: { PostEditor, ConfirmDeleteModal, ConfirmCancelModal, MyButton, InputField, MyModal },
    props: {
      churchId: {
        type: null,
        validate: value => typeof value === "string" || value === null,
        required: true
      },
      active: {
        type: Boolean,
        default: false
      }
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
          plusCode: new InputFieldCompanion({
            transform: value => value.trim(),
            validate: value => {
              if (!new OpenLocationCode().isValid(value)) {
                return "Dieser Plus Code ist ungültig."
              }
            }
          })
        }
      };
    },
    computed: {
      valid() {
        return Object.values(this.fields).every(field => field.valid);
      },
      isCreateNew() {
        return this.churchId === "";
      },
      changed() {
        return Object.values(this.fields).some(field => field.changed)
      }
    },
    watch: {
      active() {
        if (this.active && this.churchId !== null) {
          this.onActivate();
        }
      }
    },
    methods: {
      onActivate() {
        this.fields.title.setValueAndReset("");

        if (!this.isCreateNew) {
          this.fetchGroup();
        }

        this.fields.title.focus();
      },
      onCancel() {
        if (this.changed) {
          this.confirmCancelModalActive = true;
        } else {
          this.close(true);
        }
      },
      close(canceled = false) {
        this.$emit("close", canceled);
      },
      async fetchGroup() {
        const { churchId } = this;

        this.loading = true;
        this.loadingText = "Kirche wird geladen";

        const church = await this.$api.churches.get(churchId, ["title", "plusCode"])

        if (this.churchId !== churchId) return;
        this.savedChurch = church;

        this.fields.title.setValueAndReset(church.title);
        this.fields.plusCode.setValueAndReset(church.plusCode);
        this.loading = false;
      },
      async save() {
        this.loading = true;

        const data = {
          title: this.fields.title.transformedValue,
          plusCode: this.fields.plusCode.transformedValue,
        };

        if (this.isCreateNew) {
          this.loadingText = "Kirche wird erstellt";
          await this.$api.churches.create(data);
        } else {
          this.loadingText = "Kirche wird gespeichert";
          await this.$api.churches.update(this.churchId, data);
        }

        this.loading = false;
        this.close();
      },
      async delete_() {
        this.loading = true;
        this.loadingText = "Kirche wird gelöscht";

        await this.$api.churches.delete(this.churchId);

        this.loading = false;
        this.close();
      }
    }
  };
</script>
