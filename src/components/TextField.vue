<template>
  <label class="flex flex-col gap-0.5">
    <span>
      {{ label }}
    </span>
    <TextInput v-model="value"/>
  </label>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import type { PropType } from "vue"
import TextInput from "./TextInput.vue"

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  type: {
    type: String as PropType<"text" | "password">,
    default: "text"
  }
})

const emit = defineEmits(["update:modelValue"])

const value = useVModel(props, "modelValue", emit)
</script>
