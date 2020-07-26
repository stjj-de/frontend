<template>
  <button
    class="my-button"
    :key="rippleColor"
    :class="classes"
    :type="isSubmit ? 'submit' : 'button'"
    :disabled="this.loading || this.disabled"
    :tabindex="this.disabled || this.loading ? '-1' : '0'"
    @click="onClick"
    v-ripple.400.click="rippleColor"
  >
    <slot/>
  </button>
</template>

<style scoped lang="scss">
  @use "sass:list";
  @use "~@/assets/styles/colors";

  $color-variants: (
    "primary": (colors.$blue, colors.$blue-c),
    "danger": (colors.$red, colors.$red-c)
  );

  .my-button {
    position: relative;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;

    padding: 0 15px;
    border-radius: 4px;

    height: 40px;
    min-width: 50px;

    border: none;
    text-decoration: none;
    font: inherit;
    color: inherit;
    font-size: 1.2rem;

    box-shadow: 0 5px 14px 0 transparentize(colors.$background-c, 0.7);
    background-color: transparent;

    transition: 500ms ease;
    transition-property: background-color, box-shadow;

    &:disabled {
      box-shadow: 0 4px 10px 0 transparentize(colors.$background-c, 0.8);
    }

    &.my-button--loading {
      &::after {
        opacity: 1;
      }
    }

    &.my-button--center {
      justify-content: center;
    }

    @each $name, $colors in $color-variants {
      &.my-button--#{$name} {
        $background: list.nth($colors, 1);
        $background-c: list.nth($colors, 2);

        background-color: $background;
        color: $background-c;

        &:disabled {
          $amount: 0.4;
          background-color: transparentize($background, $amount);
          color: transparentize($background-c, $amount);
        }

        &:focus:not(:disabled) {
          background-color: transparentize($background, 0.06);
        }

        &:hover:not(:disabled) {
          background-color: transparentize($background, 0.07);
        }
      }
    }

    &.my-button--secondary {
      background-color: colors.$background;
      color: colors.$background-c;

      border: 1px solid transparentize(colors.$background-c, 0.8);
      box-shadow: none;

      &:disabled {
        $amount: 0.4;
        color: transparentize(colors.$background-c, $amount);
      }

      &:focus, &:hover {
        &:not(:disabled) {
          background-color: colors.$hover-and-focus;
        }
      }
    }
  }

  .my-button::after {
    $size: 20px;

    pointer-events: none;
    opacity: 0;
    transition: 100ms linear opacity;

    content: "";
    position: absolute;
    top: calc(50% - #{$size} / 2 + 2px);
    left: calc(50% - #{$size} / 2);
    width: $size;
    height: $size;

    border: 2px solid colors.$background-c;
    border-left-color: transparent;
    border-radius: 50%;

    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0)
    }

    to {
      transform: rotate(360deg);
    }
  }

  .my-button__text {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .my-button__prefix {
    display: inline-flex;
    margin-right: 10px;
    margin-left: -5px;

    justify-content: center;

    & > * {
      height: 20px;
    }
  }

  .my-button__suffix {
    display: inline-flex;
    margin-left: 10px;

    justify-content: center;

    & > * {
      height: 20px;
    }
  }
</style>

<script>
  import { toModifierClasses } from "@/assets/js/toModifierClasses";

  export default {
    name: "MyButton",
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      isSubmit: {
        type: Boolean,
        default: false
      },
      noCenter: {
        type: Boolean,
        default: false
      },
      variant: {
        type: String,
        default: "secondary",
        validate: value => ["primary", "secondary", "danger"].includes(value)
      }
    },
    computed: {
      classes() {
        const { disabled, loading, noCenter, variant } = this;

        return toModifierClasses("my-button", {
          disabled,
          loading,
          center: !noCenter,
          [variant]: true
        });
      },
      rippleColor() {
        return (this.loading || this.disabled) ? "transparent" : "rgba(0, 0, 0, 0.15)";
      }
    },
    methods: {
      onClick(event) {
        if (!this.disabled && !this.loading) {
          this.$emit("click", event);
        }
      }
    }
  };
</script>
