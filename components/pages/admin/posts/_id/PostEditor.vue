<template>
  <div class="post-editor">
    <vue-editor
      class="quill-enduser"
      use-custom-image-handler
      :value="value"
      :editor-toolbar="editorToolbar"
      @image-added="handleImage"
      @input="val => $emit('input', val)"
    />
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/quill-enduser.scss";
</style>

<script>
  import "vue2-editor/dist/vue2-editor.css";
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "@/assets/styles/quill.scss";

  export default {
    name: "PostEditor",
    components: {
      VueEditor: () => process.server
        ? Promise.resolve()
        : import("vue2-editor/dist/vue2-editor.core").then(m => m.VueEditor)
    },
    props: {
      value: {
        type: String,
        required: true
      },
      highestHeading: {
        type: Number,
        default: 1,
        validate: value => value >= 1 && value <= 6
      }
    },
    data() {
      const headings = [1, 2, 3, 4, 5, 6].filter(level => level >= this.highestHeading);

      return {
        editorToolbar: [
          [{ header: [false, ...headings] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "super" }, { script: "sub" }],
          [{ color: [] }, { background: [] }],
          [{ align: "" }, { align: "center" }, { align: "right" }]
        ]
      };
    },
    methods: {
      async handleImage(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.$axios.post("/files", formData, {
          validateStatus: status => status === 201
        });

        const url = response.headers["location"];
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
      }
    }
  };
</script>
