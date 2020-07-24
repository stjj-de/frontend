<template>
  <div class="edit-group-modal">
    <MyModal
      title="Gruppe bearbeiten"
      closable
      width="800px"
      :loading="loading"
      :loading-text="loadingText"
      :active="active"
      @close="onCancel"
    >
      <template v-slot:default>
        <InputField label="Titel" :companion="fields.title"/>
        <PostEditor v-model="description"/>
      </template>
      <template v-if="$store.getters.userIsEditor" v-slot:secondary-buttons>
        <MyButton
          v-if="!isCreateNew"
          class="edit-group-modal__delete-button"
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
    <ConfirmDeleteModal item-type="Termin" :active.sync="confirmDeleteModalActive" @confirm="delete_()">
      <p>Alle zu dieser Gruppe gehörenden Artikel werden ebenfalls gelöscht.</p>
      <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
    </ConfirmDeleteModal>
  </div>
</template>

<style lang="scss">
  .edit-group-modal__remove-end-button {
    width: 100%;
    margin-top: 10px;
  }

  .edit-group-modal__color-label {
    margin-top: 15px;
  }
</style>

<script>
  import "vue-datetime/dist/vue-datetime.css";
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";
  import EventColorPicker from "@/components/pages/admin/calendar/EventColorPicker";
  import DateTimeField from "@/components/DateTimeField";
  import ConfirmCancelModal from "@/components/ConfirmCancelModal";
  import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
  import PostEditor from "@/components/pages/admin/posts/_id/PostEditor";

  export default {
    name: "EditGroupModal",
    components: {
      PostEditor,
      ConfirmDeleteModal, ConfirmCancelModal, DateTimeField, EventColorPicker, MyButton, InputField, MyModal
    },
    props: {
      groupId: {
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
        savedGroup: null,
        description: "",
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
        }
      };
    },
    computed: {
      valid() {
        return Object.values(this.fields).every(field => field.valid);
      },
      isCreateNew() {
        return this.groupId === "";
      },
      changed() {
        return this.savedGroup !== null &&
          (
            this.description !== this.savedGroup.description ||
            Object.values(this.fields).some(field => field.changed)
          );
      }
    },
    watch: {
      active() {
        if (this.active && this.groupId !== null) {
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
        const { groupId } = this;

        this.loading = true;
        this.loadingText = "Gruppe wird geladen";

        const group = await this.$api.groups.get(groupId, ["title", "description"])

        if (this.groupId !== groupId) return;
        this.savedGroup = group;

        this.fields.title.setValueAndReset(group.title);
        this.description = this.savedGroup.description;
        this.loading = false;
      },
      async save() {
        this.loading = true;

        const data = {
          title: this.fields.title.transformedValue,
          description: this.description
        };

        if (this.isCreateNew) {
          this.loadingText = "Gruppe wird erstellt";
          await this.$api.groups.create(data);
        } else {
          this.loadingText = "Gruppe wird gespeichert";
          await this.$api.groups.update(this.groupId, data);
        }

        this.loading = false;
        this.close();
      },
      async delete_() {
        this.loading = true;
        this.loadingText = "Gruppe wird gelöscht";

        await this.$api.groups.delete(this.groupId);

        this.loading = false;
        this.close();
      }
    }
  };
</script>
