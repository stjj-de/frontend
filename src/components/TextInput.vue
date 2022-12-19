<template>
  <input
    v-model="value"
    class="shadow-sm focus:shadow-md border-1 border-gray-200 rounded-lg p-2 transition duration-200 ease focus:outline-none focus-visible:border-yellow-500"
    :type="type"
  />
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import type { PropType } from "vue"

const props = defineProps({
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
