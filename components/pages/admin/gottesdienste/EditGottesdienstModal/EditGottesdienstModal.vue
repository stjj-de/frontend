<template>
  <div class="edit-gottesdienst-modal">
    <MyModal
      title="Termin bearbeiten"
      closable
      width="520px"
      :loading="loading"
      :loading-text="loadingText"
      :active="active"
      @close="onCancel"
    >
      <template v-slot:default>
        <InputField label="Zeit" placeholder="z. B.: Jeden Samstag um 11 Uhr" :companion="fields.time"/>
        <InputField label="Ort" placeholder="z. B.: St. Josef in Furpach" :companion="fields.location"/>
        <InputField label="Beschreibung" placeholder="z. B.: Heilige Messe" :companion="fields.description"/>
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
  .edit-gottesdienst-modal__remove-end-button {
    width: 100%;
    margin-top: 10px;
  }

  .edit-gottesdienst-modal__color-label {
    margin-top: 15px;
  }
</style>

<script>
  import GottesdienstQuery from "./gottesdienstQuery.graphql";
  import CreateGottesdienstMutation from "./createGottesdienstMutation.graphql";
  import UpdateGottesdienstMutation from "./updateGottesdienstMutation.graphql";
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";

  export default {
    name: "EditGottesdienstModal",
    components: { MyButton, InputField, MyModal },
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
          time: new InputFieldCompanion({
            transform: value => value.trim(),
            required: true
          }),
          location: new InputFieldCompanion({
            transform: value => value.trim(),
            required: true
          }),
          description: new InputFieldCompanion({
            transform: value => value.trim(),
            required: true
          })
        }
      };
    },
    computed: {
      valid() {
        return Object.values(this.fields).every(field => field.valid);
      },
      isCreateNew() {
        return this.gottesdienstId === "";
      },
      changed() {
        return Object.values(this.fields).some(field => field.changed);
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
      onActivate() {
        this.fields.time.setValueAndReset("");
        this.fields.location.setValueAndReset("");
        this.fields.description.setValueAndReset("");

        if (!this.isCreateNew) {
          this.fetchGottesdienst();
        }

        this.fields.time.focus();
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

        const { data: { gottesdienst } } = await this.$apollo.query({
          query: GottesdienstQuery,
          variables: {
            id: gottesdienstId
          },
          fetchPolicy: "network-only"
        });

        if (this.gottesdienstId !== gottesdienstId) return;
        this.savedGottesdienst = gottesdienst;

        this.fields.time.setValueAndReset(gottesdienst.time);
        this.fields.location.setValueAndReset(gottesdienst.location);
        this.fields.description.setValueAndReset(gottesdienst.description);

        this.loading = false;
      },
      async save() {
        this.loading = true;

        let mutation;
        let variables;

        if (this.isCreateNew) {
          this.loadingText = "Gottesdienst wird erstellt";
          mutation = CreateGottesdienstMutation;
          variables = {
            gottesdienst: {
              time: this.fields.time.transformedValue,
              location: this.fields.location.transformedValue,
              description: this.fields.description.transformedValue
            }
          };
        } else {
          this.loadingText = "Gottesdienst wird gespeichert";
          mutation = UpdateGottesdienstMutation;

          const { time, location, description } = this.fields;

          variables = {
            id: this.gottesdienstId,
            gottesdienst: {
              time: time.changed ? time.transformedValue : undefined,
              location: location.changed ? location.transformedValue : undefined,
              description: description.changed ? description.transformedValue : undefined
            }
          };
        }

        await this.$apollo.mutate({ mutation, variables });

        this.loading = false;
        this.close();
      }
    }
  };
</script>
