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
    <ConfirmDeleteModal item-type="Termin" :active.sync="confirmDeleteModalActive" @confirm="delete_()"/>
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
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";
  import EventColorPicker from "@/components/pages/admin/calendar/EventColorPicker";
  import DateTimeField from "@/components/DateTimeField";
  import ConfirmCancelModal from "@/components/ConfirmCancelModal";
  import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

  const today = startOfDay(new Date());

  export default {
    name: "EditEventModal",
    components: {
      ConfirmDeleteModal, ConfirmCancelModal, DateTimeField, EventColorPicker, MyButton, InputField, MyModal
    },
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
              if (value === "") {
                this.relatedPostID = null;
                return null;
              }

              const post = null; // TODO

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
          if (this.color !== this.savedEvent.color) {
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
        this.fields.relatedPost.setValueAndReset("");

        if (this.isCreateNew) {
          this.startDate = today.toISOString();
          this.endDate = null;
          this.color = "GRAY";

          this.$nextTick(() => {
            this.fields.startDate.reset();
            this.fields.endDate.reset();
          });
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
        this.$emit("close", canceled);
      },
      async fetchEvent() {
        const { eventId } = this;

        this.loading = true;
        this.loadingText = "Termin wird geladen";

        const event = await this.$api.posts.populate(
          await this.$api.events.get(eventId, ["title", "description", "color", "date", "endDate", "relatedPost"]),
          "relatedPost",
          ["id", "slug"]
        );

        if (this.eventId !== eventId) return;

        this.savedEvent = event;

        this.fields.title.setValueAndReset(event.title);
        this.fields.description.setValueAndReset(event.description);

        this.startDate = event.date;
        this.endDate = event.endDate;
        this.color = event.color;

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

        const data = {
          title: this.fields.title.transformedValue,
          color: this.color,
          description: this.fields.description.transformedValue,
          date: this.startDate,
          endDate: this.endDate,
          relatedPost: this.relatedPostID
        };

        if (this.isCreateNew) {
          this.loadingText = "Termin wird erstellt";
          await this.$api.events.create(data);
        } else {
          this.loadingText = "Termin wird gespeichert";
          await this.$api.events.update(this.eventId, data);
        }

        this.loading = false;
        this.close();
      },
      async delete_() {
        this.loading = true;
        this.loadingText = "Termin wird gelöscht";

        await this.$api.events.delete(this.eventId);

        this.loading = false;
        this.close();
      }
    }
  };
</script>
