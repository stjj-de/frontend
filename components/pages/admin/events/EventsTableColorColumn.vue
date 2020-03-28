<template>
  <span class="events-table-color-column" :style="style"></span>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/dot";

  .events-table-color-column {
    @include dot.dot(12px);
    margin: 0 auto;
    display: block;
  }
</style>

<script>
  import { getCSSColorForEventColor } from "@/assets/getCSSColorForEventColor";

  export default {
    name: "EventsTableColorColumn",
    props: {
      data: {
        type: String,
        required: true
      }
    },
    computed: {
      style() {
        return `background-color: ${getCSSColorForEventColor(this.data)}`;
      }
    }
  };
</script>
