<template>
  <div class="create-post-modal">
    <MyModal
      title="Artikel erstellen"
      width="500px"
      loading-text="Artikel wird erstellt"
      :closable="!loading"
      :active="active"
      :loading="loading"
      @close="close()"
    >
      <template v-slot:default>
        <InputField
          label="Titel"
          :companion="fields.title"
        />
        <InputField
          label="Slug"
          keep-showing-state
          :force-show-error="fields.title.changed"
          :companion="fields.slug"
        />
      </template>
      <template v-slot:buttons>
        <MyButton
          @click="close()"
        >
          Schließen
        </MyButton>
        <MyButton
          variant="primary"
          :disabled="!valid"
          @click="submit()"
        >
          Erstellen
        </MyButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import slugify from "slugify";
  import MyModal from "@/components/MyModal";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import MyButton from "@/components/MyButton";
  import { validateSlug } from "@/assets/js/validateSlug.js";

  export default {
    name: "CreatePostModal",
    components: { MyButton, InputField, MyModal },
    props: {
      active: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
          slug: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Slug ein.",
            validateOrSaveAsync: value => validateSlug(this.$apollo, value)
          })
        }
      };
    },
    computed: {
      valid() {
        return Object.values(this.fields).every(field => field.valid);
      }
    },
    watch: {
      active() {
        if (this.active === false) {
          this.fields.title.setValueAndReset("");
          this.fields.slug.setValueAndReset("");
        } else {
          this.fields.title.focus();
        }
      },
      "fields.title.value"() {
        if (!this.fields.slug.touched) {
          this.fields.slug.value = slugify(this.fields.title.transformedValue, {
            lower: true,
            strict: true
          });

          this.fields.slug.runAllValidations();
        }
      }
    },
    methods: {
      close() {
        this.$emit("update:active", false);
        this.$emit("close");
      },
      async submit() {
        this.loading = true;

        const post = null; // TODO

        this.$router.push(`/admin/posts/${post.id}`);
      }
    }
  };
</script>
