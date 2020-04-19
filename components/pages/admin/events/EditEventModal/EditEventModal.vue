<template>
  <div class="edit-event-modal">
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
        <InputField label="Titel" :companion="fields.title"/>
        <span class="input-field__label edit-event-modal__color-label">Farbe</span>
        <EventColorPicker v-model="color"/>
        <DateTimeField
          label="Start-Zeitpunkt"
          :companion="fields.startDate"
          v-model="startDate"
        />
        <DateTimeField
          label="End-Zeitpunkt"
          placeholder="Nicht festgelegt"
          :companion="fields.endDate"
          v-model="endDate"
        />
        <div>Du musst keinen End-Zeitpunkt festlegen.</div>
        <div>
          Um einen ganztägigen Termin zu erstellen, stelle die Start- und End-Uhrzeit auf 00:00 Uhr und das
          End-Datum auf genau einen Tag nach dem Startdatum.
        </div>
        <MyButton
          class="edit-event-modal__remove-end-button"
          center
          :disabled="endDate === null"
          @click="endDate = null"
        >
          End-Zeitpunkt entfernen
        </MyButton>
        <InputField
          label="Verknüpfter Artikel (Slug)"
          placeholder="Nicht festgelegt"
          disable-spellcheck
          :keep-showing-state="fields.relatedPost.transformedValue !== ''"
          :companion="fields.relatedPost"
        />
        <InputField label="Beschreibung" :companion="fields.description"/>
      </template>
      <template v-slot:secondary-buttons>
        <MyButton
          v-if="!isCreateNew"
          class="edit-event-modal__delete-button"
          variant="danger"
          @click="confirmDeleteModalActive = true"
        >
          Löschen
        </MyButton>
      </template>
      <template v-slot:buttons>
        <MyButton
          class="edit-event-modal__cancel"
          @click="onCancel()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__save"
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
        <MyButton
          class="edit-event-modal__cancel"
          variant="primary"
          @click="_close()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__back"
          variant="danger"
          @click="close()"
        >
          Verwerfen
        </MyButton>
      </template>
    </MyModal>
    <MyModal
      title="Termin löschen?"
      closable
      width="400px"
      :active.sync="confirmDeleteModalActive"
    >
      <template v-slot:default>
        Diese Aktion kann nicht rückganging gemacht werden.
      </template>
      <template v-slot:buttons="{ close: _close }">
        <MyButton
          class="edit-event-modal__cancel"
          variant="primary"
          @click="_close()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__back"
          variant="danger"
          @click="delete_()"
        >
          Löschen
        </MyButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">
  .edit-event-modal__remove-end-button {
    width: 100%;
    margin-top: 10px;
  }

  .edit-event-modal__color-label {
    margin-top: 15px;
  }
</style>

<script>
  import "vue-datetime/dist/vue-datetime.css";

  import { startOfDay } from "date-fns";
  import EventsQuery from "./eventQuery.graphql";
  import PostBySlugQuery from "./postBySlugQuery.graphql";
  import CreateEventMutation from "./createEventMutation.graphql";
  import UpdateEventMutation from "./updateEventMutation.graphql";
  import DeleteEventMutation from "./deleteEventMutation.graphql";
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";
  import EventColorPicker from "@/components/pages/admin/events/EventColorPicker";
  import DateTimeField from "@/components/DateTimeField";

  const today = startOfDay(new Date());

  export default {
    name: "EditEventModal",
    components: { DateTimeField, EventColorPicker, MyButton, InputField, MyModal },
    props: {
      eventId: {
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
        startDate: null,
        endDate: null,
        color: null,
        relatedPostID: null,
        savedEvent: null,
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
          description: new InputFieldCompanion({
            type: "textarea",
            transform: value => value.trim()
          }),
          startDate: new InputFieldCompanion({
            required: "Bitte wähle einen Startzeitpunkt.",
            readonly: true
          }),
          endDate: new InputFieldCompanion({
            readonly: true
          }),
          relatedPost: new InputFieldCompanion({
            transform: value => value.trim(),
            validateOrSaveAsync: async value => {
              console.log("ad");
              if (value === "") {
                this.relatedPostID = null;
                return null;
              }

              const { data: { postBySlug: post } } = await this.$apollo.query({
                query: PostBySlugQuery,
                variables: {
                  slug: value
                }
              });

              if (post === null) {
                return "Es existiert kein Artikel mit diesem Slug.";
              }

              this.relatedPostID = post.id;
              return null;
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
        return this.eventId === "";
      },
      changed() {
        if (!this.isCreateNew && this.savedEvent !== null) {
          if (this.color !== this.savedEvent.color.toLowerCase()) {
            return true;
          }
        }

        return Object.values(this.fields).some(field => field.changed);
      }
    },
    watch: {
      active() {
        if (this.active && this.eventId !== null) {
          this.onActivate();
        }
      },
      startDate() {
        this.validateStartAndEndDate();
      },
      endDate() {
        this.validateStartAndEndDate();
      }
    },
    methods: {
      onActivate() {
        this.fields.title.setValueAndReset("");
        this.fields.description.setValueAndReset("");

        if (this.isCreateNew) {
          this.startDate = today.toISOString();
          this.endDate = null;
          this.color = "gray";
          this.fields.startDate.setSavedValueToCurrent();
        } else {
          this.fetchEvent();
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
      validateStartAndEndDate() {
        if (this.endDate !== null) {
          if (this.endDate <= this.startDate) {
            this.fields.endDate.setError("Der End-Zeitpunkt muss nach dem Start-Zeitpunkt liegen.");
            return;
          }
        }

        this.fields.endDate.setError(null);
      },
      close(canceled = false) {
        this.confirmCancelModalActive = false;
        this.$emit("close", canceled);
      },
      async fetchEvent() {
        const { eventId } = this;

        this.loading = true;
        this.loadingText = "Termin wird geladen";

        const { data: { event } } = await this.$apollo.query({
          query: EventsQuery,
          variables: {
            id: eventId
          },
          fetchPolicy: "network-only"
        });

        if (this.eventId !== eventId) return;

        this.savedEvent = event;

        this.fields.title.setValueAndReset(event.title);
        this.fields.description.setValueAndReset(event.description);

        this.startDate = event.date;
        this.endDate = event.endDate;
        this.color = event.color.toLowerCase();

        if (event.relatedPost === null) {
          this.fields.relatedPost.setValueAndReset("");
          this.relatedPostID = null;
        } else {
          this.fields.relatedPost.setValueAndReset(event.relatedPost.slug);
          this.relatedPostID = event.relatedPost.id;
        }

        this.$nextTick(() => {
          this.fields.startDate.reset();
          this.fields.endDate.reset();
        });

        this.loading = false;
      },
      async save() {
        this.loading = true;

        let mutation;
        let variables;

        if (this.isCreateNew) {
          this.loadingText = "Termin wird erstellt";
          mutation = CreateEventMutation;
          variables = {
            event: {
              title: this.fields.title.transformedValue,
              color: this.color.toUpperCase(),
              date: this.startDate,
              endDate: this.endDate,
              description: this.fields.description.transformedValue,
              relatedPostID: this.relatedPostID
            }
          };
        } else {
          this.loadingText = "Termin wird gespeichert";
          mutation = UpdateEventMutation;

          const { title, description } = this.fields;

          variables = {
            id: this.eventId,
            event: {
              title: title.changed ? title.transformedValue : undefined,
              color: this.savedEvent.color === this.color ? undefined : this.color.toUpperCase(),
              date: this.savedEvent.startDate === this.startDate ? undefined : this.startDate,
              endDate: this.savedEvent.endDate === this.endDate ? undefined : this.endDate,
              description: description.changed ? description.transformedValue : undefined,
              relatedPostID: this.savedEvent.relatedPost === this.relatedPostID ? undefined : this.relatedPostID
            }
          };
        }

        await this.$apollo.mutate({ mutation, variables });

        this.loading = false;
        this.close();
      },
      async delete_() {
        this.confirmDeleteModalActive = false;
        this.loading = true;
        this.loadingText = "Termin wird gelöscht";

        await this.$apollo.mutate({
          mutation: DeleteEventMutation,
          variables: {
            id: this.eventId
          }
        });

        this.loading = false;
        this.close();
      }
    }
  };
</script>
