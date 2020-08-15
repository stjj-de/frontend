<template>
  <div class="gottesdienst-card">
    <span class="gottesdienst-card__date heading--3">{{ formattedDate }}</span>
    <span class="gottesdienst-card__church">
      Ort: <a :href="`https://goo.gl/maps/${gottesdienst.church.googleMapsID}`" target="_blank">{{ gottesdienst.church.title }}</a>
    </span>
    <div class="gottesdienst-card__description quill-enduser formatted" v-html="gottesdienst.description"></div>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/card";

  .gottesdienst-card {
    @include card.all;

    font-size: 1.2rem;
    padding: 30px
  }

  .gottesdienst-card__date {
    margin-top: 0;
  }

  .gottesdienst-card__location::after {
    content: "/";
    color: transparentize(colors.$background-c, 0.5);
    margin: 0 5px;
  }
</style>

<script>
  import MyButton from "@/components/MyButton";
  import { formatDateWithTimeAndName } from "@/assets/js/dateUtils"

  export default {
    name: "GottesdienstCard",
    components: { MyButton },
    props: {
      gottesdienst: {
        type: Object,
        required: true
      }
    },
    computed: {
      formattedDate: vm => formatDateWithTimeAndName(vm.gottesdienst.date)
    },
    CHURCH_SERVICE_DATE_FIELDS: ["date", "church", "description"],
    CHURCH_SERVICE_DATE_CHURCH_FIELDS: ["title", "googleMapsID"]
  };
</script>
