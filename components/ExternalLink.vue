<template>
  <a
    class="external-link link"
    rel="noopener"
    target="_blank"
    :href="href"
  >
    <template v-if="this.$slots.default && this.$slots.default[0] && this.$slots.default[0].text">
      <slot/>
    </template>
    <template v-else>
      {{ label }}
    </template>
    <ExternalIcon class="external-link__icon"/>
  </a>
</template>

<style scoped lang="scss">
  .external-link {
    padding-right: 2px;
    white-space: nowrap;
  }

  .external-link__icon {
    margin-left: 3px;

    width: 15px;
    position: relative;
    top: 2px;
  }
</style>

<script>
  import ExternalIcon from "@/assets/icons/external.svg";

  export default {
    name: "ExternalLink",
    components: { ExternalIcon },
    props: {
      href: {
        type: String,
        required: true
      },
      showProtocol: {
        type: Boolean,
        default: false
      },
      showQuery: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      label() {
        const url = new URL(this.href);
        let label = "";

        if (this.showProtocol) {
          label += url.protocol;
          label += "//";
        }

        label += url.host + url.pathname;

        if (this.showQuery) {
          label += url.search;
        }

        return label;
      }
    }
  };
</script>
