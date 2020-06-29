<template>
  <div class="edit-uploaded-file-modal">
    <MyModal
      title="Datei bearbeiten"
      width="520px"
      :loading-text="loadingText"
      :loading="loading"
      :active="active"
      @keypress.enter.native="save()"
      @close="onCancel"
    >
      <template v-slot:default>
        <a class="link" target="_blank" :href="ownURL">
          Datei ansehen oder herunterladen
        </a>
        <InputField label="Titel" :companion="fields.title"/>
        <span class="edit-uploaded-file-modal__title-description">
          Wird beim Herunterladen angezeigt. Bitte keine Dateiendung anhängen.
        </span>
        <InputField
          label="Alias"
          placeholder="Nicht festgelegt"
          :companion="fields.alias"
        />
        <div class="edit-uploaded-file-modal__magic-description" :data-show="magicAliasDescription !== null">
          <MagicFileAliasBadge/>
          "{{ fields.alias.transformedValue }}" ist ein Magic-Alias,
          d. h. er hat einen besonderen Nutzen innerhalb der Anwendung.
          Dieser Alias sollte immer zu folgender Datei gehören:
          {{ magicAliasDescription || "" }}
        </div>
        <div class="edit-uploaded-file-modal__other-file-existing" :data-show="otherFileWithAliasURL !== null">
          Dieser Alias wird bereits von
          <a
            class="link"
            target="_blank"
            :href="otherFileWithAliasURL"
          >
            einer anderen Datei
          </a>
          verwendet. Wenn du trotzdem speicherst, verliert die andere Datei ihren Alias.
        </div>
      </template>
      <template v-slot:secondary-buttons>
        <MyButton
          class="edit-uploaded-file-modal__delete-button"
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
          Speichern
        </MyButton>
      </template>
    </MyModal>
    <ConfirmCancelModal :active.sync="confirmCancelModalActive" @confirm="onCancelConfirm"/>
    <ConfirmDeleteModal item-type="Datei" :active.sync="confirmDeleteModalActive" @confirm="delete_()"/>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .edit-uploaded-file-modal__title-description {
    display: block;
    margin-top: 10px;
  }

  .edit-uploaded-file-modal__magic-description {
    color: colors.$pink;
    height: 0;
    transition: 300ms ease height;
    overflow: hidden;
    margin-bottom: 10px;

    &[data-show] {
      height: 90px;
    }
  }

  .edit-uploaded-file-modal__other-file-existing {
    color: colors.$red;
    height: 0;
    transition: 300ms ease height;
    overflow: hidden;

    &[data-show] {
      height: 70px;
    }
  }

  .edit-uploaded-file-modal__alias-input--magic .input-field__input {
    background: #ff99f3;
  }
</style>

<script>
  import MyModal from "@/components/MyModal";
  import ConfirmCancelModal from "@/components/ConfirmCancelModal";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import InputField from "@/components/InputField/InputField";
  import { getUploadURL } from "@/assets/js/getFileURL";
  import MyButton from "@/components/MyButton";
  import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
  import { magicFileAliases } from "@/assets/js/magicFileAliases";
  import MagicFileAliasBadge from "@/components/pages/admin/files/MagicFileAliasBadge";

  export default {
    name: "EditUploadedFileModal",
    components: { MagicFileAliasBadge, ConfirmDeleteModal, MyButton, InputField, ConfirmCancelModal, MyModal },
    props: {
      active: {
        type: Boolean,
        required: true
      },
      uploadedFileId: {
        type: null,
        required: true,
        validate: value => typeof value === "string" || value === null
      }
    },
    data() {
      return {
        confirmCancelModalActive: false,
        confirmDeleteModalActive: false,
        savedUploadedFile: null,
        otherFileWithAliasID: null,
        loading: false,
        loadingText: "",
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
          alias: new InputFieldCompanion({
            transform: value => value.trim(),
            validate: value => {
              if (value.length > 50) {
                return "Der Alias darf maximal 50 Zeichen lang sein.";
              }
            },
            validateOrSaveAsync: async value => {
              // TODO: Get other file with alias
              const uploadedFile = null;

              if (uploadedFile !== null && uploadedFile.id !== this.savedUploadedFile.id) {
                this.otherFileWithAliasID = uploadedFile.id;
              } else {
                this.otherFileWithAliasID = null;
              }

              return null;
            }
          })
        }
      };
    },
    computed: {
      changed() {
        return Object.values(this.fields).some(field => field.changed);
      },
      valid() {
        return this.fields.title.valid && this.fields.alias.valid;
      },
      otherFileWithAliasURL() {
        if (this.otherFileWithAliasID === null) return null;

        return getUploadURL(this.otherFileWithAliasID);
      },
      ownURL() {
        if (this.savedUploadedFile === null) return null;

        return getUploadURL(this.savedUploadedFile.id);
      },
      magicAliasDescription() {
        return magicFileAliases[this.fields.alias.transformedValue] || null;
      }
    },
    watch: {
      active() {
        if (this.active && this.uploadedFileId !== null) {
          this.onActivate();
        } else {
          this.loading = false;
          this.confirmDeleteModalActive = false;
          this.confirmCancelModalActive = false;
          this.otherFileWithAliasID = null;
        }
      }
    },
    methods: {
      async onActivate() {
        this.fields.title.setValueAndReset("");
        this.fields.alias.setValueAndReset("");

        const id = this.uploadedFileId;

        this.loadingText = "Datei wird geladen";
        this.loading = true;
        const uploadedFile = null; // TODO

        if (id !== this.uploadedFileId) return;

        this.fields.title.setValueAndReset(uploadedFile.title);
        this.fields.alias.setValueAndReset(uploadedFile.alias || "");
        this.savedUploadedFile = uploadedFile;

        this.loading = false;
      },
      onCancel() {
        if (this.changed) {
          this.confirmCancelModalActive = true;
        } else {
          this.$emit("close", true);
        }
      },
      onCancelConfirm() {
        this.$emit("close", true);
      },
      save() {
        if (this.loading || !this.valid || !this.changed) return;

        this.loadingText = "Datei wird gespeichert";
        this.loading = true;

        let alias;
        if (this.fields.alias.changed) {
          if (this.fields.alias.transformedValue === "") {
            alias = null;
          } else {
            alias = this.fields.alias.transformedValue;
          }
        }

        // TODO

        setTimeout(() => {
          this.loading = false;
          this.$emit("close", false);
        }, 200); // idk
      },
      delete_() {
        this.loadingText = "Datei wird gelöscht";
        this.loading = true;

        // TODO

        setTimeout(() => {
          this.loading = false;
          this.$emit("close", false);
        }, 200); // idk
      }
    }
  };
</script>
