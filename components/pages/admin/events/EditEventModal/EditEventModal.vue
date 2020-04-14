<template>
  <div class="edit-event-modal">
    <MyModal
      title="Termin bearbeiten"
      closable
      width="500px"
      :loading="loading"
      :loading-text="loadingText"
      :active="active"
      @close="onCancel"
    >
      <template v-slot:default>
        <form class="edit-event-modal__form" action="javascript:" @submit="onSubmit()">
          <InputField label="Titel" :companion="fields.title"/>
          <InputField label="Start-Zeitpunkt" :companion="fields.startDate" @focus="openStartPicker()"/>
          <InputField
            label="End-Zeitpunkt"
            placeholder="Nicht festgelegt"
            :companion="fields.endDate"
            @focus="openEndPicker()"
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
          <InputField label="Beschreibung" :companion="fields.description"/>
        </form>
        <vue-datetime
          v-model="startDate"
          ref="startDatePicker"
          input-style="display: none"
          type="datetime"
          :phrases="{ ok: 'Fertig', cancel: 'Abbrechen' }"
        />
        <vue-datetime
          v-model="endDate"
          ref="endDatePicker"
          input-style="display: none"
          type="datetime"
          :phrases="{ ok: 'Fertig', cancel: 'Abbrechen' }"
        />
      </template>
      <template v-slot:secondary-buttons>
        <MyButton
          class="edit-event-modal__delete-button"
          variant="red"
          @click="confirmDeleteModalActive = true"
        >
          Löschen
        </MyButton>
      </template>
      <template v-slot:buttons>
        <MyButton
          class="edit-event-modal__cancel"
          variant="outline"
          @click="onCancel()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__save"
          :disabled="!changed || !valid"
          variant="blue"
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
          variant="blue"
          @click="_close()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__back"
          variant="red"
          @click="close()"
        >
          Verwerfen
        </MyButton>
      </template>
    </MyModal>
    <MyModal
      title="Termin löschen?"
      closable
      :active.sync="confirmDeleteModalActive"
    >
      <template v-slot:default>
        Dies kann nicht rückganging gemacht werden.
      </template>
      <template v-slot:buttons="{ close: _close }">
        <MyButton
          class="edit-event-modal__cancel"
          variant="blue"
          @click="_close()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__back"
          variant="red"
          @click="delete_()"
        >
          Löschen
        </MyButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">
  .edit-event-modal__form {
    .vc-popover-content-wrapper {
      top: -10px!important;
    }
  }

  .edit-event-modal__remove-end-button {
    width: 100%;
    margin-top: 10px;
  }
</style>

<script>
  import "vue-datetime/dist/vue-datetime.css";

  import { Datetime as VueDatetime } from "vue-datetime";
  import { startOfDay, format } from "date-fns";
  import EventsQuery from "./eventQuery.graphql";
  import CreateEventMutation from "./createEventMutation.graphql";
  import UpdateEventMutation from "./updateEventMutation.graphql";
  import DeleteEventMutation from "./deleteEventMutation.graphql";
  import { dateFnsLocale } from "@/assets/js/dateUtils";
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";

  const formatPickerInputDate = date => format(date, "EEEE, d.M.Y HH:mm", { locale: dateFnsLocale });

  const today = startOfDay(new Date());

  export default {
    name: "EditEventModal",
    components: { MyButton, InputField, MyModal, VueDatetime },
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
        return Object.values(this.fields).some(field => field.changed);
      }
    },
    watch: {
      active() {
        if (this.active && this.eventId !== null) {
          this.onActivate();
        }
      },
      startDate(value, oldValue) {
        if (this.startDate === "") {
          // vue-datetime sets this to "" upon initialization.
          this.startDate = oldValue;
        }

        this.setStartDateFieldValue();
        this.fields.startDate.runAllValidations();
        this.validateStartAndEndDate();
      },
      endDate(value, oldValue) {
        if (this.endDate === "") {
          // vue-datetime sets this to "" upon initialization.
          this.endDate = oldValue;
        }

        this.setEndDateFieldValue();
        this.fields.endDate.runAllValidations();
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
      onSubmit() {
        if (this.valid) {
          this.save();
        } else {
          this.forEveryField(field => field.touch());
        }
      },
      setStartDateFieldValue() {
        this.fields.startDate.value = formatPickerInputDate(new Date(this.startDate));
      },
      setEndDateFieldValue() {
        if (this.endDate === null) {
          this.fields.endDate.value = "";
        } else {
          this.fields.endDate.value = formatPickerInputDate(new Date(this.endDate));
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
      forEveryField(fn) {
        Object.values(this.fields).forEach(fn);
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

        this.fields.title.setValueAndReset(event.title);
        this.fields.description.setValueAndReset(event.description);

        this.startDate = event.date;
        this.endDate = event.endDate;
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
              date: this.startDate,
              endDate: this.endDate,
              description: this.fields.description.transformedValue
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
              date: this.startDate,
              endDate: this.endDate,
              description: description.changed ? description.transformedValue : undefined
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
      },
      openStartPicker() {
        this.$refs.startDatePicker.$el.querySelector("input").click();
      },
      openEndPicker() {
        this.$refs.endDatePicker.$el.querySelector("input").click();
      }
    }
  };
</script>
