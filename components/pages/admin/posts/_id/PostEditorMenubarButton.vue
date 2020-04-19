<template>
  <button
    class="post-editor-menubar-button"
    :title="title"
    :class="classes"
    v-ripple.100.click="'rgba(0,0,0,0.1)'"
    v-on="$listeners"
  >
    <slot/>
  </button>
</template>

<style lang="scss">
  @use "./assets/styles/colors";

  .post-editor-menubar-button {
    padding: 5px;
    background: transparent;
    border: none;
    border-radius: 4px;

    display: flex;
    justify-items: center;
    align-items: center;

    transition: 50ms linear background-color;

    &:focus {
      outline: none;
      background: transparentize(colors.$background-c, 0.94);
    }

    &:hover {
      background: transparentize(colors.$background-c, 0.93);
    }

    &.post-editor-menubar-button--active {
      background: transparentize(colors.$blue, 0.7);
    }
  }
</style>

<script>
  import { toModifierClasses } from "@/assets/js/toModifierClasses";

  export default {
    name: "PostEditorMenubarButton",
    props: {
      active: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        required: true
      }
    },
    computed: {
      classes() {
        const { active } = this;

        return toModifierClasses("post-editor-menubar-button", {
          active
        });
      }
    }
  };
</script>
