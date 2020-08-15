<template>
  <div class="file-upload-button" :class="classes">
    <MyButton :loading="loading" @click="openSelectFileWindow()"><slot>Datei hochladen</slot></MyButton>
    <transition name="file-upload-button__fade" mode="out-in">
      <span
        :key="status"
        v-if="status !== null"
        class="file-upload-button__status"
      >
        {{ status }}
      </span>
    </transition>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/_transitions.scss";

  @include transitions.fade("file-upload-button__fade", 200ms);

  .file-upload-button {
    display: flex;
    align-items: center;
  }

  .file-upload-button--vertical {
    flex-direction: column;
    justify-content: center;

    .file-upload-button__status {
      display: block;
      margin-left: 0;
      margin-top: 10px;
    }
  }

  .file-upload-button__status {
    display: inline-block;
    margin-left: 10px;
    font-size: 1.1rem;
  }
</style>

<script>
  import MyButton from "@/components/MyButton";
  import { oneOf } from "@/assets/js/statusValidationHelper";
  import { toModifierClasses } from "@/assets/js/toModifierClasses";

  export default {
    name: "FileUploadButton",
    components: { MyButton },
    props: {
      afterUploadAction: {
        type: Function,
        default: () => Promise.resolve()
      },
      mimeType: {
        type: null,
        validate: value => value === null || typeof value === "string",
        default: null
      },
      vertical: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      status: null,
      loading: false
    }),
    computed: {
      classes() {
        return toModifierClasses("file-upload-button", {
          vertical: this.vertical
        });
      }
    },
    methods: {
      openSelectFileWindow() {
        const input = document.createElement("input");
        input.type = "file";
        if (this.mimeType !== null) input.accept = this.mimeType;
        input.click();

        input.addEventListener("change", async () => {
          this.loading = true;
          this.status = "Datei wird hochgeladen.";
          const file = input.files[0];

          const formData = new FormData();
          formData.append("file", file);

          let path = "/files";
          if (this.mimeType !== null) path += "?allowedMimeTypes=" + encodeURI(this.mimeType);

          const response = await this.$axios.post(path, formData, {
            validateStatus: oneOf(200, 201, 415)
          });

          if (response.status === 415) {
            this.status = "Fehler: Falscher Datei-Typ.";
          } else {
            await this.afterUploadAction(response.data);
            this.status = "Datei wurde hochgeladen.";
          }

          this.loading = false;
        }, { passive: true });
      }
    }
  }
</script>
