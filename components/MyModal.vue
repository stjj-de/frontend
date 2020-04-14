<template>
  <div
    class="my-modal"
    :class="classes"
  >
    <div
      class="my-modal__backdrop"
      @click="onBackdropClick"
    ></div>
    <focus-lock :disabled="!active">
      <div class="my-modal__container">
        <div
          class="my-modal__modal"
          role="dialog"
          :style="`width: ${width}`"
          :aria-label="title"
        >
          <header class="my-modal__header">
            <h1 class="heading--4 my-modal__title">
              {{ title }}
            </h1>
          </header>
          <main class="my-modal__content">
            <LoadingOverlay opacity="1" :active="loading !== false">
              {{ loadingText }}
            </LoadingOverlay>
            <slot/>
          </main>
          <footer class="my-modal__footer">
            <div class="my-modal__secondary-buttons">
              <slot name="secondary-buttons" :close="close"/>
            </div>
            <div class="my-modal__buttons">
              <slot name="buttons" :close="close">
                <MyButton :disabled="!closable" @click="close()">
                  Schließen
                </MyButton>
              </slot>
            </div>
          </footer>
        </div>
      </div>
    </focus-lock>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/screenSize";

  .my-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    // because of v-ripple
    z-index: 10000;

    pointer-events: none;
    opacity: 0;
    transition: 200ms ease opacity;
  }

  .my-modal--active {
    opacity: 1;
    pointer-events: auto;

    .my-modal__modal {
      transform: scale(1);
    }
  }

  .my-modal__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background: transparentize(colors.$background-c, 0.7);
  }

  .my-modal__container {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 10px;

    width: 100vw;
    height: 100vh;
  }

  .my-modal__modal {
    position: relative;

    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.25);
    background-color: colors.$background;

    border-radius: 4px;
    max-height: calc(100% - 20px);
    max-width: calc(100% - 20px);
    overflow-y: auto;

    transform: scale(0.9);
    transition: 400ms ease transform;
  }

  .my-modal__header {
    position: sticky;
    top: 0;
    z-index: 1;

    background-color: colors.$background;
    padding: 30px 30px 10px;
  }

  .my-modal__title {
    margin: 0;

    font-size: 2rem;
    font-weight: bold;

    @include screenSize.mobile {
      font-size: 1.5rem;
    }
  }

  .my-modal__content {
    padding: 0 30px;
    position: relative;
    font-size: 1.1rem;
  }

  .my-modal__footer {
    position: sticky;
    bottom: 0;

    background-color: colors.$background;

    margin-top: 10px;
    padding: 20px;

    display: flex;
    justify-content: space-between;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background: colors.$background;
      pointer-events: none;

      opacity: 0;
      transition: 400ms ease opacity;
    }

    .my-modal--loading &::after {
      opacity: 0.6;
      pointer-events: auto;
    }
  }

  .my-modal__secondary-buttons, .my-modal__buttons {
    & > .my-button:not(:last-child) {
      margin-right: 10px;
    }
  }

  @include screenSize.mobile {
    .my-modal__footer {
      flex-direction: column;
      justify-content: flex-start;
    }

    .my-modal__secondary-buttons {
      border-bottom: 1px solid colors.$background-a;
      padding-bottom: 10px;
    }

    .my-modal__buttons {
      padding-top: 10px;
    }

    .my-modal__secondary-buttons, .my-modal__buttons {
      display: flex;

      & > .my-button {
        flex-grow: 1;
      }
    }
  }
</style>

<script>
  import FocusLock from "vue-focus-lock";
  import MyButton from "@/components/MyButton";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import { toModifierClasses } from "@/assets/js/toModifierClasses";

  export default {
    name: "MyModal",
    components: { LoadingOverlay, MyButton, FocusLock },
    props: {
      active: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        required: true
      },
      width: {
        type: String,
        default: "auto"
      },
      loading: {
        type: Boolean,
        default: false
      },
      loadingText: {
        type: String,
        default: ""
      }
    },
    computed: {
      classes() {
        const { active, loading } = this;

        return toModifierClasses("my-modal", {
          active,
          loading
        });
      }
    },
    methods: {
      onBackdropClick() {
        this.close();
      },
      close() {
        if (this.closable) {
          this.$emit("close");
          this.$emit("update:active", false);
        }
      }
    }
  };
</script>
