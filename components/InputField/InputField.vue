<template>
  <div class="input-field" :data-invalid="companion._error !== null && showPossibleError">
    <GlobalEvents
      target="window"
      @resize="recomputeErrorTextHeight"
    />
    <span v-if="!hideLabel" class="input-field__label">{{ label }}</span>
    <div class="input-field__input-container">
      <input
        class="input-field__input"
        ref="input"
        :aria-label="label"
        :value="companion.value"
        :type="companion.type"
        :autocomplete="autocomplete"
        :disabled="companion.disabled"
        :spellcheck="disableSpellcheck ? 'false' : 'true'"
        :min="companion.min"
        :max="companion.max"
        :step="companion.step"
        v-on="$listeners"
        @input="onInput"
        @blur="onBlur"
      />
      <span class="input-field__disabled-overlay"></span>
    </div>
    <div
      class="input-field__state"
      :data-state="String(this.companion._state)"
      :data-keep-showing-state="this.companion.keepShowingState">
      <div class="input-field__cross"></div>
      <div class="input-field__spinner"></div>
      <div class="input-field__tick"></div>
    </div>
    <span class="input-field__error" :style="errorStyle">
      {{ this.companion._lazyErrorText }}
    </span>
    <span class="input-field__error--invisible" aria-hidden="true" ref="invisibleError">
      {{ this.companion._error }}
    </span>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/spinner.scss";

  .input-field {
    margin-top: 15px;
    position: relative;
    width: 100%;
    height: 100%;

    &[data-invalid] {
      color: var(--colors-red);

      .input-field__input {
        border-color: var(--colors-red);
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
    height: 100%;
  }

  .input-field__disabled-overlay {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: var(--colors-background-a);

    pointer-events: none;
    opacity: 0;
    transition: 200ms ease opacity;

    .input-field__input:disabled ~ & {
      pointer-events: auto;
      opacity: 0.1;
    }
  }

  .input-field__input {
    box-shadow: inset 0 2px 10px 0 rgba(0, 0, 0, 0.1);

    width: 100%;
    height: 100%;

    padding: 10px;
    border-radius: 5px 5px 0 0;
    border: none;
    border-bottom: 2px solid var(--colors-background-a);

    font-size: 1.2rem;
    font-family: "Sen", sans-serif;

    background-color: var(--colors-background);

    transition: 200ms linear;
    transition-property: border-color;
    &:focus {
      outline: none;

      border-color: var(--colors-green);
    }
  }

  .input-field__state {
    position: absolute;
    top: 41px;
    right: 10px;
    width: 20px;
    height: 20px;

    opacity: 1;
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

    &[data-state=null] {
      opacity: 0;
    }

    &[data-state=loading] {
      opacity: 1;
    }

    &[data-state=success], &[data-state=failed] {
      opacity: 1;

      &:not([data-keep-showing-state]) {
        transition-delay: 1500ms;
        opacity: 0;
      }
    }

    &[data-state=loading] > .input-field__spinner {
      opacity: 1;
    }

    &[data-state=success] > .input-field__tick {
      opacity: 1;
    }

    &[data-state=failed] > .input-field__cross {
      opacity: 1;
    }
  }

  .input-field__tick {
    border: 2px solid var(--colors-green);
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
      background-color: var(--colors-red);

      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }

  .input-field__spinner {
    @include spinner.spinner($size: 20px, $color: var(--colors-green), $thickness: 2px);
    height: 100%;
  }

  .input-field__error {
    display: block;
    margin-top: 10px;
    overflow: hidden;
    color: var(--colors-red);

    height: 0;
    transition: 300ms ease height;
  }

  .input-field__error--invisible {
    position: absolute;
    top: 0;
    display: block;
    visibility: hidden;
  }
</style>

<script>
  import GlobalEvents from "vue-global-events";

  export default {
    name: "InputField",
    components: { GlobalEvents },
    props: {
      label: {
        type: String,
        required: true
      },
      hideLabel: {
        type: Boolean,
        default: false
      },
      companion: {
        type: Object,
        required: true
      },
      autocomplete: {
        type: String,
        default: "off"
      },
      disableSpellcheck: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      errorTextHeight: 0
    }),
    computed: {
      showPossibleError() {
        return !this.companion.disabled && this.companion.touched;
      },
      errorStyle() {
        return this.showPossibleError ? `height: ${this.errorTextHeight}px` : "";
      },
      error() {
        return this.companion._error;
      }
    },
    mounted() {
      this.recomputeErrorTextHeight();
    },
    watch: {
      error() {
        this.recomputeErrorTextHeight();
      },
      companion: {
        immediate: true,
        handler() {
          this.companion._instance = this;
        }
      }
    },
    methods: {
      onInput(event) {
        this.companion.touched = true;
        this.companion.value = event.target.value;
        this.companion._onChange();
      },
      onBlur() {
        this.companion.touched = true;
      },
      recomputeErrorTextHeight() {
        this.$nextTick(() => {
          this.errorTextHeight = this.$refs.invisibleError.getBoundingClientRect().height;
        });
      },
      focus() {
        this.$nextTick(() => { // required, if it was disabled
          this.$refs.input.focus();
        });
      }
    }
  };
</script>
