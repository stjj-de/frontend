<template>
  <div class="event-color-picker">
    <div
      v-for="(color, name) in $options.eventColors"
      :key="name"
      v-ripple.400.click="'rgba(255,255,255,0.2)'"
      class="event-color-picker__color"
      aria-label="Farbe"
      tabindex="0"
      :class="{ 'event-color-picker__color--checked': value === name }"
      :title="color.title"
      :aria-checked="value === name ? 'true' : 'false'"
      :style="`--color: ${color.hex}`"
      @click="$emit('input', name)"
      @keydown.enter="$emit('input', name)"
      @keydown.space.prevent="$emit('input', name)"
    ></div>
  </div>
</template>

<style scoped lang="scss">
  .event-color-picker {
    display: flex;
    flex-wrap: wrap;
  }

  .event-color-picker__color {
    position: relative;
    height: 30px;
    width: 40px;
    border-radius: 2px;

    background: var(--color);

    &:hover, &:focus {
      outline: none;

      &::after {
        opacity: 0.3;
      }
    }

    &::before {
      content: "";

      border: 2px solid white;
      border-top: none;
      border-right: none;
      transform: translate(-50%, -50%) rotate(-45deg);
      width: 20px;
      height: 10px;

      position: absolute;
      top: 40%;
      left: 50%;

      opacity: 0;
    }

    &::after {
      content: "";
      background: white;
      opacity: 0;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      transition: 100ms ease opacity;
    }

    &:not(:last-child) {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  .event-color-picker__color--checked::before {
    opacity: 1;
  }
</style>

<script>
  import { eventColors } from "@/assets/js/event-colors"

  export default {
    name: "EventColorPicker",
    props: {
      value: {
        type: null,
        validate: value => value === null || Object.keys(eventColors).includes(value),
        default: null
      }
    },
    eventColors
  }
</script>
