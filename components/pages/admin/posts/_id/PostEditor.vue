<template>
  <div class="post-editor">
    <vue-editor
      class="quill-enduser"
      use-custom-image-handler
      :value="value"
      :editor-toolbar="editorToolbar"
      @image-added="handleImage"
      @input="value => $emit('input', value)"
    />
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/quill-enduser.scss";

  .post-editor {
    .ql-container {
      min-height: 75vh;
      font-family: inherit;
    }
  }
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
      }
    },
    data: () => ({
      editorToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "super" }, { script: "sub" }],
        [{ color: [] }, { background: [] }],
        [{ align: "" }, { align: "center" }, { align: "right" }]
      ]
    }),
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
