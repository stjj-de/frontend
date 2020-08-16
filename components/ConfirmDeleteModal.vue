<template>
  <MyModal
    class="confirm-delete-modal"
    :title="`${itemType} löschen?`"
    closable
    width="400px"
    :active="active"
    @close="onCancel"
  >
    <template v-slot:default>
      <slot>
        Diese Aktion kann nicht rückgängig gemacht werden.
      </slot>
    </template>
    <template v-slot:buttons="{ close: cancel }">
      <MyButton variant="primary" @click="cancel">
        Abbrechen
      </MyButton>
      <MyButton variant="danger" @click="confirm">
        Löschen
      </MyButton>
    </template>
  </MyModal>
</template>

<style lang="scss">

</style>

<script>
  import MyModal from "@/components/MyModal"
  import MyButton from "@/components/MyButton"

  export default {
    name: "ConfirmDeleteModal",
    components: { MyButton, MyModal },
    props: {
      active: {
        type: Boolean,
        required: true
      },
      itemType: {
        type: String,
        required: true
      }
    },
    methods: {
      onCancel() {
        this.$emit("cancel")
        this.$emit("update:active", false)
      },
      confirm() {
        this.$emit("confirm")
        this.$emit("update:active", false)
      }
    }
  }
</script>
