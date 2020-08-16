<template>
  <div class="accordion" role="group" :class="classes">
    <button class="accordion__toggle" @click="open = !open">
      <ArrowRight class="accordion__arrow"/>
      {{ label }}
    </button>
    <div class="accordion__content" @focusin="open = true">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .accordion {
    margin: 20px 0;
    border-radius: 10px;

    padding: 20px;
    box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.1);
  }

  .accordion__arrow {
    height: 20px;
    margin-right: 10px;

    transition: 100ms linear;
    .accordion--open> * > & {
      transform: rotate(90deg);
    }
  }

  .accordion__toggle {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1.4rem;
    color: colors.$blue;
    background: none;
    border: none;
  }

  .accordion__content {
    overflow: hidden;
    height: 0;

    margin-left: 15px;
    padding-left: 30px;
    border-left: 2px solid transparentize(colors.$blue, 0.7);

    & > :first-child {
      margin-top: 0;
    }

    & > :last-child {
      margin-bottom: 0;
    }

    .accordion--open > & {
      margin-top: 20px;
      overflow: visible;
      height: auto;
    }
  }
</style>

<script>
  import { toModifierClasses } from "@/assets/js/to-modifier-classes"
  import ArrowRight from "@/assets/icons/arrow-right.svg"

  export default {
    name: "Accordion",
    components: { ArrowRight },
    props: {
      label: {
        type: String,
        required: true
      }
    },
    data: () => ({
      open: false
    }),
    computed: {
      classes() {
        return toModifierClasses("accordion", { open: this.open })
      }
    }
  }
</script>
