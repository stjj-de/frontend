<template>
  <div class="gottesdienst-card">
    <span class="gottesdienst-card__date heading--4">{{ formattedDate }}</span>
    <span class="gottesdienst-card__church">
      Ort: <a :href="`https://goo.gl/maps/${gottesdienst.church.googleMapsID}`" target="_blank">
        {{ gottesdienst.church.title }}
      </a>
    </span>
    <ContentOutlet class="gottesdienst-card__description" :html="gottesdienst.description"/>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/card";

  .gottesdienst-card {
    @include card.all;

    font-size: 1.2rem;
    padding: 25px 30px
  }

  .gottesdienst-card__date {
    margin-top: 0;
    font-size: 1.7rem;

    @media (max-width: 1000px) {
      font-size: 1.4rem;
    }

    @media (max-width: 850px) {
      font-size: 1.6rem;
    }
  }

  .gottesdienst-card__location::after {
    content: "/";
    color: transparentize(colors.$background-c, 0.5);
    margin: 0 5px;
  }

  .gottesdienst-card__description {
    & > :last-child {
      margin-bottom: 0;
    }
  }
</style>

<script>
  import { formatShortDateWithTimeAndNameAsSentence } from "@/assets/js/date-utils"
  import ContentOutlet from "@/components/ContentOutlet"

  export default {
    name: "GottesdienstCard",
    components: { ContentOutlet },
    props: {
      gottesdienst: {
        type: Object,
        required: true
      }
    },
    computed: {
      formattedDate: vm => formatShortDateWithTimeAndNameAsSentence(vm.gottesdienst.date)
    },
    CHURCH_SERVICE_DATE_FIELDS: ["date", "church", "description"],
    CHURCH_SERVICE_DATE_CHURCH_FIELDS: ["title", "googleMapsID"]
  }
</script>
