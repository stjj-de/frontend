<template>
  <div class="file-upload-button">
    <MyButton :loading="loading" @click="openSelectFileWindow()">Datei hochladen</MyButton>
    <transition name="file-upload-button__fade" mode="out-in">
      <span :key="status" v-if="status !== null" class="file-upload-button__status">{{ status }}</span>
    </transition>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/transitions";

  @include transitions.fade("file-upload-button__fade", 200ms);

  .file-upload-button__status {
    display: inline-block;
    margin-left: 10px;
    font-size: 1.1rem;
  }
</style>

<script>
  import MyButton from "@/components/MyButton";
  import { oneOf } from "@/assets/js/statusValidationHelper";

  export default {
    name: "FileUploadButton",
    components: { MyButton },
    props: {
      afterUploadAction: {
        type: Function,
        default: () => Promise.resolve()
      }
    },
    data: () => ({
      status: null,
      loading: false
    }),
    methods: {
      openSelectFileWindow() {
        const input = document.createElement("input");
        input.type = "file";
        input.click();

        input.addEventListener("change", async () => {
          this.loading = true;
          this.status = "Datei wird hochgeladen.";
          const file = input.files[0];

          const formData = new FormData();
          formData.append("file", file);

          const id = await this.$axios.$post("/files", formData, {
            validateStatus: oneOf(200, 201)
          });

          await this.afterUploadAction(id);

          this.loading = false;
          this.status = "Datei wurde hochgeladen.";
        }, { passive: true });
      }
    }
  }
</script>
