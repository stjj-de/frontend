<template>
  <div
    class="input-field"
    :class="{
      [`input-field--${companion._state}`]: companion._state !== null,
      'input-field--keep-showing-state': keepShowingState,
      'input-field--invalid': companion._error !== null && showPossibleError
    }"
  >
    <GlobalEvents
      target="window"
      @resize="recomputeErrorTextHeight"
    />
    <span v-if="!hideLabel" class="input-field__label">{{ label }}</span>
    <div class="input-field__input-container">
      <textarea
        v-if="companion.type === 'textarea'"
        ref="input"
        class="input-field__input"
        :placeholder="placeholder"
        :aria-label="label"
        :autocomplete="autocomplete"
        :disabled="companion.disabled"
        :spellcheck="String(!disableSpellcheck)"
        :aria-required="String(Boolean(companion.required))"
        :readonly="companion.readonly"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        v-text="companion.value"
      ></textarea>
      <input
        v-else
        ref="input"
        class="input-field__input"
        :placeholder="placeholder"
        :aria-label="label"
        :value="companion.value"
        :type="companion.type"
        :autocomplete="autocomplete"
        :disabled="companion.disabled"
        :spellcheck="String(!disableSpellcheck)"
        :min="companion.min"
        :max="companion.max"
        :step="companion.step"
        :aria-required="String(Boolean(companion.required))"
        :readonly="companion.readonly"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      />
      <span class="input-field__disabled-overlay"></span>
    </div>
    <div class="input-field__state">
      <div class="input-field__cross"></div>
      <div class="input-field__spinner"></div>
      <div class="input-field__tick"></div>
    </div>
    <span class="input-field__error" :style="errorStyle">
      {{ companion._lazyErrorText }}
    </span>
    <span ref="invisibleError" class="input-field__invisible-error" aria-hidden="true">
      {{ companion._error }}
    </span>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/spinner";
  @use "~@/assets/styles/colors";

  .input-field {
    margin-top: 15px;
    position: relative;
    width: 100%;

    &.input-field--invalid {
      color: colors.$red;

      .input-field__input {
        border-color: colors.$red;
      }
    }
  }

  .input-field__label {
    display: block;
    font-size: 1.2rem;
    margin-bottom: 5px;

    transition: 100ms linear color;
  }

  .input-field__input-container {
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .input-field__disabled-overlay {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: colors.$background-c;

    pointer-events: none;
    opacity: 0;
    transition: 200ms ease opacity;

    .input-field__input:disabled ~ & {
      pointer-events: auto;
      opacity: 0.04;
    }
  }

  $input-height: 45px;

  .input-field__input {
    box-shadow: inset 0 2px 10px 0 rgba(0, 0, 0, 0.1);

    width: 100%;
    height: $input-height;

    padding: 10px;
    border-radius: 5px 5px 0 0;
    border: none;
    border-bottom: 2px solid lighten(colors.$background-c, 80%);

    font-size: 1.2rem;
    font-family: "Sen", sans-serif;

    background-color: colors.$background;

    transition: 200ms linear;
    transition-property: border-color;
    &:focus {
      outline: none;

      border-color: colors.$green;
    }
  }

  textarea.input-field__input {
    resize: vertical;
    min-height: $input-height * 3;
    max-height: $input-height * 10;
  }

  .input-field__state {
    position: absolute;
    top: 41px;
    right: 10px;
    width: 20px;
    height: 20px;

    opacity: 0;
    transition: 200ms ease opacity;

    display: flex;
    justify-content: space-between;

    & > * {
      position: absolute;
      top: 0;
      left: 0;

      opacity: 0;
      transition: 200ms ease opacity;
    }

    .input-field--loading & {
      opacity: 1;
    }
  }

  .input-field--success, .input-field--failed {
    .input-field__state {
      opacity: 1;
    }

    &:not(.input-field--keep-showing-state) {
      .input-field__state {
        transition-delay: 1500ms;
        opacity: 0;
      }
    }
  }

  .input-field--loading .input-field__spinner {
    opacity: 1;
  }

  .input-field--success .input-field__tick {
    opacity: 1;
  }

  .input-field--failed .input-field__cross {
    opacity: 1;
  }

  .input-field__tick {
    border: 2px solid colors.$green;
    border-top-color: transparent;
    border-right-color: transparent;

    transform: rotate(-45deg);

    width: 18px;
    height: 10px;
    top: 2px;

    background-color: transparent;
  }

  .input-field__cross {
    height: 100%;
    width: 100%;
    position: relative;

    &::before, &::after {
      position: absolute;
      top: 8px;

      content: "";
      display: block;
      width: 20px;
      height: 3px;
      background-color: colors.$red;

      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }

  .input-field__spinner {
    @include spinner.spinner($size: 20px, $color: colors.$green, $thickness: 2px);
    height: 100%;
  }

  .input-field__error {
    display: block;
    margin-top: 10px;
    overflow: hidden;
    color: colors.$red;

    height: 0;
    transition: 300ms ease height;
  }

  .input-field__invisible-error {
    position: absolute;
    top: 0;
    display: block;
    visibility: hidden;
  }
</style>

<script>
  /* eslint-disable vue/no-mutating-props */
  import GlobalEvents from "vue-global-events"

  export default {
    name: "InputField",
    components: { GlobalEvents },
    props: {
      label: {
        type: String,
        required: true
      },
      hideLabel: { type: Boolean },
      companion: {
        type: Object,
        required: true
      },
      autocomplete: {
        type: String,
        default: "off"
      },
      disableSpellcheck: { type: Boolean },
      keepShowingState: { type: Boolean },
      forceShowError: { type: Boolean },
      placeholder: {
        type: String,
        default: ""
      }
    },
    data: () => ({
      errorTextHeight: 0
    }),
    computed: {
      showPossibleError() {
        return this.forceShowError || (!this.companion.disabled && this.companion.touched)
      },
      errorStyle() {
        return this.showPossibleError ? `height: ${this.errorTextHeight + 1}px` : ""
      },
      error() {
        return this.companion._error
      }
    },
    watch: {
      error() {
        this.recomputeErrorTextHeight()
      },
      companion: {
        immediate: true,
        handler() {
          this.companion._instance = this
        }
      }
    },
    mounted() {
      this.recomputeErrorTextHeight()
    },
    methods: {
      onInput(event) {
        this.companion.touched = true
        this.companion.value = event.target.value
        this.companion._onInput()
      },
      onBlur() {
        this.companion.touched = true
      },
      onFocus() {
        this.$emit("focus")
      },
      recomputeErrorTextHeight() {
        this.$nextTick(() => {
          this.errorTextHeight = this.$refs.invisibleError.getBoundingClientRect().height
        })
      },
      focus() {
        this.$nextTick(() => { // required, if it was disabled
          this.$refs.input.focus()
        })
      }
    }
  }
</script>
