<template>
  <div class="edit-post-page">
    <h1 class="heading--1">
      Artikel bearbeiten
    </h1>
    <div class="edit-post-page__container">
      <LoadingOverlay
        :active="$apollo.loading"
        :transition-delay="0"
      >
        Artikel wird geladen
      </LoadingOverlay>
      <section class="edit-post-page__content-section">
        <client-only>
          <PostEditor v-model="content"/>
        </client-only>
      </section>
      <section class="edit-post-page__meta-section">
        <InputField label="Titel" :companion="fields.title"/>
        <InputField label="Slug" :companion="fields.slug"/>
        <DateTimeField
          label="Veröffentlichungsdatum"
          placeholder="Nicht geplant"
          :companion="fields.publicationDate"
          v-model="publicationDate"
        />
        <MyButton class="edit-post-page__reset-field-button" @click="publicationDate = null">
          Datum entfernen
        </MyButton>
        <DateTimeField
          label="Relevant bis"
          placeholder="Für immer relevant"
          :companion="fields.relevantUntil"
          v-model="relevantUntil"
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
            :disabled="!changed"
            :loading="loading"
            @click="save()"
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
          @click="_close()"
        >
          Abbrechen
        </MyButton>
        <MyButton
          class="edit-event-modal__back"
          variant="danger"
          @click="delete_()"
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
  import striptags from "striptags";
  import PostQuery from "./postQuery.graphql";
  import UpdatePostMutation from "./updatePostMutation.graphql";
  import DeletePostMutation from "./deletePostMutation.graphql";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import PostEditor from "@/components/pages/admin/posts/_id/PostEditor";
  import MyButton from "@/components/MyButton";
  import DateTimeField from "@/components/DateTimeField";
  import MyModal from "@/components/MyModal";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import { validateSlug } from "@/assets/js/validateSlug";

  export default {
    name: "EditPostPage",
    components: { LoadingOverlay, MyModal, DateTimeField, MyButton, PostEditor, InputField },
    layout: "admin",
    data() {
      return {
        publicationDate: null,
        relevantUntil: null,
        content: "",
        loading: false,
        confirmDeleteModalActive: false,
        deleteLoading: false,
        fields: {
          title: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Titel ein."
          }),
          slug: new InputFieldCompanion({
            transform: value => value.trim(),
            required: "Bitte gib einen Slug ein.",
            validate: value => {
              if (value.startsWith("-") || value.endsWith("-")) {
                return "Slugs dürfen nicht mit \"-\" anfangen oder enden.";
              }
            },
            validateOrSaveAsync: value => validateSlug(this.$apollo, value)
          }),
          excerpt: new InputFieldCompanion({
            transform: value => value.trim(),
            type: "textarea"
          }),
          publicationDate: new InputFieldCompanion({
            readonly: true
          }),
          relevantUntil: new InputFieldCompanion({
            readonly: true
          })
        }
      };
    },
    apollo: {
      savedPost: {
        query: PostQuery,
        variables() {
          return {
            id: this.$route.params.id
          };
        },
        update: data => data.post,
        fetchPolicy: "network-only"
      }
    },
    watch: {
      savedPost() {
        this.fields.title.setValueAndReset(this.savedPost.title);
        this.fields.slug.setValueAndReset(this.savedPost.slug);
        this.fields.excerpt.setValueAndReset(this.savedPost.excerpt);

        this.content = this.savedPost.content;
        this.publicationDate = this.savedPost.publicationDate;
        this.relevantUntil = this.savedPost.relevantUntil;
        this.$nextTick(() => {
          this.fields.publicationDate.reset();
          this.fields.relevantUntil.reset();
        });
      },
      relevantUntilValid() {
        if (this.relevantUntilValid) {
          this.fields.relevantUntil.setError(null);
        } else {
          this.fields.relevantUntil.setError("\"Relevant bis\" muss nach dem Veröffentlichungsdatum liegen.");
        }
      }
    },
    computed: {
      valid() {
        return !this.contentIsEmpty &&
          Object.values(this.fields).every(field => field.valid) &&
          this.relevantUntilValid;
      },
      changed() {
        return this.contentChanged || Object.values(this.fields).some(field => field.changed);
      },
      contentIsEmpty() {
        return striptags(this.content).trim() === "";
      },
      contentChanged() {
        if (this.savedPost === undefined) {
          return false;
        }

        return this.content !== this.savedPost.content && !this.contentIsEmpty;
      },
      submitButtonText() {
        const now = new Date();

        if (this.fields.publicationDate.changed) {
          if (this.fields.publicationDate.value === "") {
            return "Unveröffentlichen";
          }

          if (new Date(this.publicationDate) > now) {
            return "Planen";
          }

          return "Veröffentlichen";
        }

        if (this.publicationDate === null) {
          return "Speichern";
        }

        return "Aktualisieren";
      },
      relevantUntilValid() {
        if ([this.relevantUntil, this.publicationDate].includes(null)) return true;

        return new Date(this.relevantUntil) > new Date(this.publicationDate);
      }
    },
    methods: {
      getFieldValuesWithoutUnchanged() {
        const fields = ["title", "slug", "excerpt"];
        const object = {};

        for (const field of fields) {
          object[field] = this.fields[field].changed ? this.fields[field].value : undefined;
        }

        return object;
      },
      async save() {
        this.loading = true;

        const { data: { updatePost: post } } = await this.$apollo.mutate({
          mutation: UpdatePostMutation,
          variables: {
            id: this.savedPost.id,
            post: {
              ...this.getFieldValuesWithoutUnchanged(),
              content: this.contentChanged ? this.content : undefined,
              publicationDate: this.fields.publicationDate.changed ? this.publicationDate : undefined,
              relevantUntil: this.fields.relevantUntil.changed ? this.relevantUntil : undefined
            }
          }
        });

        this.savedPost = post;

        this.loading = false;
      },
      delete_() {
        this.deleteLoading = true;

        this.$apollo.mutate({
          mutation: DeletePostMutation,
          variables: {
            id: this.savedPost.id
          }
        });

        this.$router.push("/admin/posts?delete_success=1");
      }
    }
  };
</script>
