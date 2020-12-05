<template>
  <div class="input-field group-select-field">
    <span class="input-field__label">Gruppe</span>
    <v-select
      v-model="v"
      label="title"
      :options="groups"
      :clearable="userIsEditor"
    >
      <template #no-options="{ searching }">
        <template v-if="searching">
          Keine Ergebnisse gefunden.
        </template>
      </template>
    </v-select>
    <p v-if="!userIsEditor">
      Du kannst nur Gruppen auswählen, für die du die Berechtigung hast.
    </p>
  </div>
</template>

<style lang="scss">
</style>

<script>
  import "vue-select/dist/vue-select.css"
  import VSelect from "vue-select"

  export default {
    name: "GroupSelectField",
    components: { VSelect },
    props: {
      value: {
        type: null,
        required: true,
        validate: v => v === null || typeof v === "number"
      },
      groups: {
        type: Array,
        required: true
      }
    },
    computed: {
      userIsEditor: vm => vm.$store.getters.userIsEditor,
      v: {
        get() {
          return this.value === null ? null : this.groups.find(group => group.id === this.value)
        },
        set(newValue) {
          this.$emit("input", newValue === null ? null : newValue.id)
        }
      }
    }
  }
</script>
