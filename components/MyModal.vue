<template>
  <div
    class="my-modal"
    :class="{ 'my-modal--active': active }"
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
            <h1 class="heading--5 my-modal__title">
              {{ title }}
            </h1>
          </header>
          <main class="my-modal__content">
            <slot/>
          </main>
          <footer class="my-modal__footer">
            <slot name="buttons" :close="close">
              <KButton :disabled="!closable" @click="close()">
                Schließen
              </KButton>
            </slot>
          </footer>
        </div>
      </div>
    </focus-lock>
  </div>
</template>

<style lang="scss">
  .my-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

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

    opacity: 0.3;
    background: var(--colors-background-c);
  }

  .my-modal__container {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 10px;
    overflow-y: auto;

    width: 100vw;
    height: 100vh;
  }

  .my-modal__modal {
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.25);
    background-color: var(--colors-background);

    border-radius: 4px;
    max-height: 100%;
    max-width: 100%;
    overflow-y: auto;

    transform: scale(0.9);
    transition: 400ms ease transform;
  }

  .my-modal__header {
    position: sticky;
    top: 0;

    background-color: var(--colors-background);
    padding: 30px;
    box-shadow: 0 -7px 20px 5px rgba(0, 0, 0, 0.05);
  }

  .my-modal__title {
    margin: 0;
  }

  .my-modal__content {
    padding: 20px 30px;
    position: relative;
  }

  .my-modal__footer {
    position: sticky;
    bottom: 0;

    background-color: var(--colors-background);
    padding: 20px 30px;
    box-shadow: 0 7px 20px 5px rgba(0, 0, 0, 0.05);

    display: flex;
    justify-content: flex-end;

    & > .k-button:not(:last-child) {
      margin-right: 5px;
    }
  }
</style>

<script>
  import FocusLock from "vue-focus-lock";
  import KButton from "kiste/components/KButton";

  export default {
    name: "MyModal",
    components: { FocusLock, KButton },
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
      }
    },
    data: () => ({
      isBrowser: !process.server,
      disabled: true
    }),
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
