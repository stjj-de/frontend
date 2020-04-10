<template>
  <div class="edit-event-modal">
    <MyModal
      title="Termin bearbeiten"
      closable
      width="500px"
      :active="eventId !== null"
      @close="onClose"
    >
      <template v-slot:default>
        <LoadingOverlay :active="loading"/>
        <form>
          <InputField label="Titel" :companion="inputs.title"/>
          <InputField label="Beschreibung" :companion="inputs.description"/>
        </form>
      </template>
      <template v-slot:buttons="{ close }">
        <KButton
          class="edit-event-modal__save"
          :disabled="!valid"
          @click="save()"
        >
          Speichern
        </KButton>
        <KButton
          class="edit-event-modal__cancel"
          @click="close()"
        >
          Abbrechen
        </KButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import EventsQuery from "./eventQuery.graphql";
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import KButton from "kiste/components/KButton";

  export default {
    name: "EditEventModal",
    components: { LoadingOverlay, InputField, MyModal, KButton },
    props: {
      eventId: {
        type: null,
        validate: value => typeof value === "string" || value === null,
        required: true
      }
    },
    data: () => ({
      loading: false,
      inputs: {
        title: new InputFieldCompanion({
          transform: value => value.trim(),
          required: "Bitte gib einen Titel ein."
        }),
        description: new InputFieldCompanion({
          type: "textarea",
          transform: value => value.trim()
        })
      }
    }),
    computed: {
      valid() {
        return Object.values(this.inputs).every(input => input.valid);
      }
    },
    watch: {
      eventId() {
        Object.values(this.inputs).forEach(input => input.reset());

        if (this.eventId !== null) {
          this.fetchEvent();
        }
      }
    },
    methods: {
      onClose() {
        this.$emit("close");
      },
      async fetchEvent() {
        const { eventId } = this;

        this.loading = true;
        const { data: { event } } = await this.$apollo.query({
          query: EventsQuery,
          variables: {
            id: eventId
          }
        });

        if (this.eventId !== eventId) return;

        Object.entries(this.inputs).forEach(([key, value]) => value.setValueAndReset(event[key]));

        this.loading = false;
        this.inputs.title.focus();
      },
      async save() {

      }
    }
  };
</script>
