<template>
  <div class="create-post-modal">
    <MyModal
      title="Artikel erstellen"
      width="500px"
      loading-text="Artikel wird erstellt"
      :closable="!loading"
      :active="active"
      :loading="loading"
      @close="close"
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
        <GroupSelectField v-model="group" :groups="groups"/>
      </template>
      <template v-slot:buttons>
        <MyButton
          @click="close"
        >
          Schließen
        </MyButton>
        <MyButton
          variant="primary"
          :disabled="!valid"
          @click="submit"
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
  import MyModal from "@/components/MyModal"
  import InputField from "@/components/InputField/InputField"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion"
  import MyButton from "@/components/MyButton"
  import { validateSlugAsync } from "@/assets/js/validate-slug.js"
  import GroupSelectField from "@/components/GroupSelectField"
  import { validateSlug } from "@/assets/js/validate-slug"
  import { slugify } from "@/assets/js/slugify"

  export default {
    name: "CreatePostModal",
    components: { GroupSelectField, MyButton, InputField, MyModal },
    props: {
      active: {
        type: Boolean,
        required: true
      },
      groups: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        group: this.groups.length === 0 ? null : this.groups[0].id,
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
          slug: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Slug ein.",
            validate: validateSlug,
            validateOrSaveAsync: value => validateSlugAsync(this.$api, value)
          })
        }
      }
    },
    computed: {
      valid() {
        return (
          this.$store.state.user.group !== "NONE" ||
          this.group !== null
        ) && Object.values(this.fields).every(field => field.valid)
      }
    },
    watch: {
      active() {
        if (this.active === false) {
          this.fields.title.setValueAndReset("")
          this.fields.slug.setValueAndReset("")
        } else
          this.fields.title.focus()
      },
      "fields.title.value"() {
        if (!this.fields.slug.touched) {
          this.fields.slug.value = slugify(this.fields.title.transformedValue, {
            lower: true,
            strict: true
          })

          this.fields.slug.runAllValidations()
        }
      }
    },
    methods: {
      close() {
        this.$emit("update:active", false)
        this.$emit("close")
      },
      async submit() {
        this.loading = true

        const { data: { id } } = await this.$api.posts.create({
          title: this.fields.title.transformedValue,
          slug: this.fields.slug.transformedValue,
          group: this.group,
          content: "",
          excerpt: ""
        })

        await this.$router.push(`/admin/posts/${id}`)
      }
    }
  }
</script>
