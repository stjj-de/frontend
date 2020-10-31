<template>
  <div class="edit-post-page">
    <h1 class="heading--1">
      Artikel bearbeiten
    </h1>
    <div class="edit-post-page__container">
      <LoadingOverlay
        :active="saveLoading"
        :transition-delay="0"
        opacity="0.9"
      />
      <section class="edit-post-page__content-section">
        <client-only>
          <PostEditor v-model="content" class="edit-post-page__editor"/>
        </client-only>
      </section>
      <section class="edit-post-page__meta-section">
        <InputField label="Titel" :companion="fields.title"/>
        <InputField label="Slug" :companion="fields.slug"/>
        <GroupSelectField v-model="group" :groups="availableGroups"/>
        <DateTimeField
          v-model="publishedAt"
          label="Veröffentlichungsdatum"
          placeholder="Nicht geplant"
          :companion="fields.publishedAt"
        />
        <MyButton class="edit-post-page__reset-field-button" @click="publishedAt = null">
          Datum entfernen
        </MyButton>
        <DateTimeField
          v-model="relevantUntil"
          label="Relevant bis"
          placeholder="Für immer relevant"
          :companion="fields.relevantUntil"
        />
        <MyButton class="edit-post-page__reset-field-button" @click="relevantUntil = null">
          Auf "für immer" setzen
        </MyButton>
        <InputField label="Auszug" :companion="fields.excerpt"/>
        <div class="edit-post-page__meta-buttons">
          <MyButton variant="danger" @click="confirmDeleteModalActive = true">
            Löschen
          </MyButton>
          <MyButton
            variant="primary"
            :disabled="!changed || !valid"
            :loading="saveLoading"
            @click="save"
          >
            {{ submitButtonText }}
          </MyButton>
        </div>
      </section>
    </div>
    <MyModal
      title="Artikel löschen?"
      width="400px"
      closable
      loading-text="Artikel wird gelöscht"
      :loading="deleteLoading"
      :active.sync="confirmDeleteModalActive"
    >
      <template v-slot:default>
        Diese Aktion kann nicht rückgängig gemacht werden.
      </template>
      <template v-slot:buttons="{ close: _close }">
        <MyButton
          class="edit-event-modal__cancel"
          variant="primary"
          @click="_close"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__back"
          variant="danger"
          @click="delete_"
        >
          Löschen
        </MyButton>
      </template>
    </MyModal>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";

  .edit-post-page__container {
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }

  .edit-post-page__content-section {
    flex-grow: 1;
    flex-basis: 0;
    padding-right: 20px;
  }

  .edit-post-page__meta-section {
    flex-shrink: 0;
    width: 300px;
  }

  .edit-post-page__meta-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;

    .my-button:not(:last-child) {
      margin-right: 10px;
    }
  }

  .edit-post-page__editor {
    .ql-container {
      height: 75vh;
      overflow: auto;
      font-family: inherit;

      @include screenSize.mobile {
        height: 70vh;
      }
    }
  }

  .edit-post-page__reset-field-button {
    margin-top: 5px;
    width: 100%;
  }

  @include screenSize.mobile {
    .edit-post-page {
      flex-direction: column-reverse;
    }

    .edit-post-page__content-section {
      width: 100%;
      padding-right: 0;
    }

    .edit-post-page__meta-section {
      width: 100%;
      max-width: 100%;
    }
  }
</style>

<script>
  import stripTags from "striptags"
  import InputField from "@/components/InputField/InputField"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion"
  import PostEditor from "@/components/pages/admin/posts/_id/PostEditor"
  import MyButton from "@/components/MyButton"
  import DateTimeField from "@/components/DateTimeField"
  import MyModal from "@/components/MyModal"
  import LoadingOverlay from "@/components/LoadingOverlay"
  import { validateSlug, validateSlugAsync } from "@/assets/js/validate-slug.js"
  import GroupSelectField from "@/components/GroupSelectField"
  import { isEmptyWithoutHTMLTags } from "@/assets/js/is-empty-without-html-tags"

  export default {
    name: "EditPostPage",
    components: { GroupSelectField, LoadingOverlay, MyModal, DateTimeField, MyButton, PostEditor, InputField },
    async asyncData({ $api, params, error: showError, store }) {
      const post = await $api.posts.get(
        params.id,
        ["id", "title", "slug", "group", "excerpt", "publishedAt", "relevantUntil", "content"]
      )

      if (post === null) {
        const error = new Error("The post does not exist")
        error.m = "Dieser Artikel existiert nicht."
        return showError(error)
      }

      await store.state.userPromise

      return {
        savedPost: post,
        availableGroups: store.getters.userIsEditor
          ? (await $api.groups.list({
            limit: 50,
            fields: ["id", "title"]
          })).items
          : store.state.user.groups
      }
    },
    data() {
      return {
        publishedAt: null,
        relevantUntil: null,
        content: "",
        saveLoading: false,
        confirmDeleteModalActive: false,
        deleteLoading: false,
        savedPost: {},
        group: null,
        availableGroups: [],
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
          }),
          excerpt: new InputFieldCompanion({
            transform: value => value.trim(),
            type: "textarea"
          }),
          publishedAt: new InputFieldCompanion({ readonly: true }),
          relevantUntil: new InputFieldCompanion({ readonly: true })
        }
      }
    },
    computed: {
      valid() {
        return !this.contentIsEmpty &&
          Object.values(this.fields).every(field => field.valid) &&
          this.relevantUntilValid
      },
      changed() {
        return this.groupChanged || this.contentChanged || Object.values(this.fields).some(field => field.changed)
      },
      contentIsEmpty() {
        return isEmptyWithoutHTMLTags(this.content)
      },
      contentChanged: vm => vm.content !== vm.savedPost.content && !vm.contentIsEmpty,
      groupChanged() {
        if (this.group === null)
          return this.savedPost.group !== null

        return this.group !== this.savedPost.group
      },
      submitButtonText() {
        const now = new Date()

        if (this.fields.publishedAt.changed) {
          if (this.fields.publishedAt.value === "")
            return "Unveröffentlichen"

          if (new Date(this.publishedAt) > now)
            return "Planen"

          return "Veröffentlichen"
        }

        if (this.publishedAt === null)
          return "Speichern"

        return "Aktualisieren"
      },
      relevantUntilValid() {
        if ([this.relevantUntil, this.publishedAt].includes(null)) return true

        return new Date(this.relevantUntil) > new Date(this.publishedAt)
      }
    },
    watch: {
      savedPost: {
        immediate: true,
        handler() {
          this.fields.title.setValueAndReset(this.savedPost.title)
          this.fields.slug.setValueAndReset(this.savedPost.slug)
          this.fields.excerpt.setValueAndReset(this.savedPost.excerpt)

          this.content = this.savedPost.content
          this.publishedAt = this.savedPost.publishedAt
          this.relevantUntil = this.savedPost.relevantUntil
          this.group = this.savedPost.group

          this.$nextTick(() => {
            this.fields.publishedAt.reset()
            this.fields.relevantUntil.reset()
          })
        }
      },
      relevantUntilValid() {
        if (this.relevantUntilValid)
          this.fields.relevantUntil.setError(null)
        else
          this.fields.relevantUntil.setError("\"Relevant bis\" muss nach dem Veröffentlichungsdatum liegen.")
      }
    },
    methods: {
      async save() {
        this.saveLoading = true

        const data = {
          slug: this.fields.slug.transformedValue,
          title: this.fields.title.transformedValue,
          publishedAt: this.publishedAt,
          relevantUntil: this.relevantUntil,
          excerpt: this.fields.excerpt.transformedValue,
          group: this.group === null ? null : this.group,
          content: this.content
        }

        await this.$api.posts.update(this.savedPost.id, data)

        this.savedPost = {
          id: this.savedPost.id,
          ...data
        }
        this.saveLoading = false
      },
      async delete_() {
        this.deleteLoading = true

        await this.$api.posts.delete(this.savedPost.id)
        await this.$router.push("/admin/posts?delete_success=1")
      }
    },
    head: () => ({
      title: "Artikel bearbeiten / Administration"
    })
  }
</script>
