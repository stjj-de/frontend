<template>
  <MyModal
    class="confirm-cancel-modal"
    title="Änderungen verwerfen?"
    closable
    :active="active"
    @close="onCancel"
  >
    <template #default>
      Deine Änderungen gehen verloren.
    </template>
    <template #buttons="{ close: cancel }">
      <MyButton variant="primary" @click="cancel">
        Abbrechen
      </MyButton>
      <MyButton variant="danger" @click="confirm">
        Verwerfen
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
    name: "ConfirmCancelModal",
    components: { MyButton, MyModal },
    props: {
      active: {
        type: Boolean,
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
