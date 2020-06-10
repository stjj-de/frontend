<template>
  <div class="accordion" role="group" :class="classes">
    <button class="accordion__toggle" @click="open = !open">
      <ArrowRight class="accordion__arrow"/>
      {{ text }}
    </button>
    <div class="accordion__content">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .accordion {
    margin-top: 20px;
    border-radius: 10px;

    padding: 20px;
    box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1);
  }

  .accordion__arrow {
    height: 20px;
    margin-right: 10px;

    transition: 100ms linear;
    .accordion--open & {
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

    &:focus {
      outline: none;
    }
  }

  .accordion__content {
    overflow: hidden;
    height: 0;

    margin-left: 15px;
    padding-left: 20px;
    border-left: 2px solid #e2e2e2;

    & > :first-child {
      margin-top: 0;
    }

    .accordion--open & {
      margin-top: 20px;
      overflow: auto;
      height: auto;
    }
  }
</style>

<script>
  import { toModifierClasses } from "@/assets/js/toModifierClasses";
  import ArrowRight from "@/assets/icons/arrow-right.svg";

  export default {
    name: "Accordion",
    components: { ArrowRight },
    props: {
      text: {
        type: String,
        required: true
      }
    },
    data: () => ({
      open: false
    }),
    computed: {
      classes() {
        return toModifierClasses("accordion", { open: this.open });
      }
    }
  };
</script>
