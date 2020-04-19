<template>
  <div class="post-editor">
    <vue-editor
      :value="value"
      :editor-toolbar="editorToolbar"
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
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "super" }, { script: "sub" }],
        [{ color: [] }, { background: [] }],
        [{ align: "" }, { align: "center" }, { align: "right" }]
      ]
    })
  };
</script>
