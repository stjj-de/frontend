<template>
  <span class="events-table-color-column" :style="style" :title="title"></span>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/dot";

  .events-table-color-column {
    @include dot.dot(12px);
    margin: 0 auto;
    display: block;
    background: var(--color);
  }
</style>

<script>
  import { eventColors, getCSSColorForEventColor } from "@/assets/js/eventColors";

  export default {
    name: "EventsTableColorColumn",
    props: {
      data: {
        type: String,
        required: true
      }
    },
    computed: {
      name: vm => vm.data,
      style() {
        return `--color: ${getCSSColorForEventColor(this.name)}`;
      },
      title() {
        return eventColors[this.name].title;
      }
    }
  };
</script>
