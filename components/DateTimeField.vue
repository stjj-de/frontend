<template>
  <div class="date-time-field">
    <vue-datetime
      ref="picker"
      v-model="pickerValue"
      input-style="display: none"
      type="datetime"
      :min-datetime="minDatetime"
      :phrases="{ ok: 'Fertig', cancel: 'Abbrechen' }"
    />
    <InputField
      :label="label"
      :companion="companion"
      :placeholder="placeholder"
      :force-show-error="forceShowError"
      :hide-label="hideLabel"
      :keep-showing-state="keepShowingState"
      :disable-spellcheck="true"
      @keypress.native="openPicker"
      @click.native="openPicker"
    />
  </div>
</template>

<style lang="scss">

</style>

<script>
  /* eslint-disable unicorn/no-useless-undefined */

  import { Datetime as VueDatetime } from "vue-datetime"
  import { format } from "date-fns"
  import InputField from "@/components/InputField/InputField"
  import { dateFnsLocale } from "@/assets/js/date-utils"

  const formatPickerInputDate = date => format(date, "EEEE, d.M.Y HH:mm", { locale: dateFnsLocale })

  export default {
    name: "DateTimeField",
    components: { InputField, VueDatetime },
    inheritAttrs: false,
    props: {
      value: {
        type: null,
        required: true,
        validate: value => value === null || typeof value === "string"
      },
      companion: {
        type: Object,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      hideLabel: { type: Boolean },
      keepShowingState: { type: Boolean },
      forceShowError: { type: Boolean },
      requireFuture: { type: Boolean },
      placeholder: {
        type: String,
        default: ""
      }
    },
    data: () => ({
      now: new Date()
    }),
    computed: {
      pickerValue: {
        set(value) {
          if (value === "") {
            // vue-datetime sets this to "" upon initialization.
            return
          }

          this.$emit("input", value)
        },
        get() {
          return this.value
        }
      },
      minDatetime() {
        if (this.requireFuture) return this.now.toISOString()
        return undefined
      }
    },
    watch: {
      value: {
        immediate: true,
        handler() {
          this.setFieldValue()
          this.companion.runAllValidations()
        }
      }
    },
    created() {
      const id = setInterval(() => {
        this.now = new Date()
      }, 1000)

      this.$on("hook:beforeDestroy", () => {
        clearInterval(id)
      })
    },
    methods: {
      openPicker() {
        this.$refs.picker.$el.querySelector("input").click()
      },
      setFieldValue() {
        if (this.value === null)
          this.companion.value = ""
        else
          this.companion.value = formatPickerInputDate(new Date(this.value))
      }
    }
  }
</script>
