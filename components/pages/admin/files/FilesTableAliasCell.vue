<template>
  <div class="files-table-alias-cell" v-if="alias !== null">
    <MagicFileAliasBadge v-if="isMagic"/>
    {{ alias }}
  </div>
</template>

<style lang="scss">

</style>

<script>
  import MagicFileAliasBadge from "@/components/pages/admin/files/MagicFileAliasBadge";
  import { magicFileAliases } from "@/assets/js/magicFileAliases";

  export default {
    name: "FilesTableAliasCell",
    components: { MagicFileAliasBadge },
    props: {
      data: {
        type: null,
        required: true,
        validate: value => value === null || typeof value === "string"
      }
    },
    computed: {
      alias: vm => vm.data,
      isMagic() {
        return Object.keys(magicFileAliases).includes(this.alias);
      }
    }
  };
</script>
