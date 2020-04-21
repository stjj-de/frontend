<template>
  <div class="files-table-type-cell" :title="type.title">
    <component
      :is="type.icon"
      class="files-table-type-cell__icon"
    ></component>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/dot";

  .files-table-type-cell {
    margin: 0 auto;
    width: 35px;
  }

  .files-table-type-cell__icon {
    display: block;

    width: 100%;
    height: auto;
  }
</style>

<script>
  import PictureIcon from "@/assets/icons/picture.svg";
  import PDFIcon from "@/assets/icons/pdf.svg";
  import FileIcon from "@/assets/icons/file.svg";

  export default {
    name: "FilesTableTypeColumn",
    inheritAttrs: false,
    props: {
      data: {
        type: String,
        required: true
      }
    },
    computed: {
      mimeType() {
        return this.data;
      },
      type() {
        if (this.mimeType.startsWith("images/")) {
          return {
            icon: PictureIcon,
            title: "Bild"
          };
        } else if (this.mimeType === "application/pdf") {
          return {
            icon: PDFIcon,
            title: "PDF"
          };
        }

        return {
          icon: FileIcon,
          title: "Unbekannter Datei-Typ"
        };
      }
    }
  };
</script>
