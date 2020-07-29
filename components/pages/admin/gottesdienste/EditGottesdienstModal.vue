<template>
  <div class="edit-gottesdienst-modal">
    <MyModal
      title="Gottesdienst bearbeiten"
      closable
      width="520px"
      :loading="loading"
      :loading-text="loadingText"
      :active="active"
      @close="onCancel"
    >
      <template v-slot:default>
        <DateTimeField
          label="Datum"
          :companion="fields.date"
          v-model="date"
        />
        <div class="input-field">
          <span class="input-field__label">Kirche</span>
          <v-select v-model="church" label="title" :options="churches" :clearable="false"/>
        </div>
        <div class="input-field">
          <span class="input-field__label">Beschreibung</span>
          <PostEditor v-model="description"/>
        </div>
      </template>
      <template v-slot:buttons>
        <MyButton
          class="edit-gottesdienst-modal__cancel"
          @click="onCancel()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-gottesdienst-modal__save"
          :disabled="!changed || !valid"
          variant="primary"
          @click="save()"
        >
          {{ isCreateNew ? "Erstellen" : "Speichern" }}
        </MyButton>
      </template>
    </MyModal>
    <MyModal
      title="Änderungen verwerfen?"
      closable
      :active.sync="confirmCancelModalActive"
    >
      <template v-slot:default>
        Deine Änderungen gehen verloren.
      </template>
      <template v-slot:buttons="{ close: _close }">
        <MyButton variant="primary" @click="_close()">
          Abbrechen
        </MyButton>
        <MyButton variant="danger" @click="close()">
          Verwerfen
        </MyButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">
</style>

<script>
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";
  import DateTimeField from "@/components/DateTimeField";
  import VSelect from "vue-select";
  import PostEditor from "@/components/pages/admin/posts/_id/PostEditor";

  export default {
    name: "EditGottesdienstModal",
    components: { PostEditor, DateTimeField, MyButton, InputField, MyModal, VSelect },
    props: {
      gottesdienstId: {
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
        savedGottesdienst: null,
        fields: {
          date: new InputFieldCompanion({
            required: true,
            readonly: true
          })
        },
        churches: [],
        date: new Date().toISOString(),
        church: null,
        description: ""
      };
    },
    computed: {
      valid() {
        return Object.values(this.fields).every(field => field.valid) && this.church !== null;
      },
      isCreateNew() {
        return this.gottesdienstId === "";
      },
      changed() {
        if (this.savedGottesdienst === null) return this.isCreateNew;

        return this.date !== this.savedGottesdienst.date ||
          this.church.id !== this.savedGottesdienst.church ||
          this.description !== this.savedGottesdienst.description;
      }
    },
    watch: {
      active() {
        if (this.active && this.gottesdienstId !== null) {
          this.onActivate();
        }
      }
    },
    methods: {
      async onActivate() {
        this.loading = true;
        this.loadingText = "Kirchen werden geladen";
        this.churches = (await this.$api.churches.list({ fields: ["id", "title"] })).items;

        if (this.isCreateNew) {
          this.church = this.churches[0] || null;
          this.date = new Date().toISOString();
          this.description = "";
          this.loading = false;
        } else {
          await this.fetchGottesdienst();
        }

        this.fields.date.focus();
      },
      onCancel() {
        if (this.changed) {
          this.confirmCancelModalActive = true;
        } else {
          this.close(true);
        }
      },
      close(canceled = false) {
        this.confirmCancelModalActive = false;
        this.$emit("close", canceled);
      },
      async fetchGottesdienst() {
        const { gottesdienstId } = this;

        this.loading = true;
        this.loadingText = "Gottesdienst wird geladen";

        const gottesdienst = await this.$api.churchServiceDates.get(gottesdienstId, ["id", "date", "church", "description"]);

        if (this.gottesdienstId !== gottesdienstId) return;
        this.savedGottesdienst = gottesdienst;

        this.date = gottesdienst.date;
        this.church = this.churches.find(church => church.id === gottesdienst.church);
        this.description = gottesdienst.description;

        this.loading = false;
      },
      async save() {
        this.loading = true;

        const data = {
          date: this.date,
          church: this.church.id,
          description: this.description
        };

        if (this.isCreateNew) {
          this.loadingText = "Gottesdienst wird erstellt";
          await this.$api.churchServiceDates.create(data);
        } else {
          this.loadingText = "Gottesdienst wird gespeichert";
          await this.$api.churchServiceDates.update(this.savedGottesdienst.id, data);
        }

        this.loading = false;
        this.close();
      }
    }
  };
</script>
