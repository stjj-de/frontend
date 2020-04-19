<template>
  <main class="posts-page">
    <h1 class="heading--1">
      Artikel
    </h1>
    <DataTable
      :companion="table"
      loading-text="Artikel werden geladen"
      @row-click="onRowClick"
    >
      <template v-slot:empty-state>
        <div class="_no-results">
          <span class="_no-results-emoji">
            😕
          </span>
          Keine Artikel passen zu deinem Filter.
        </div>
      </template>
      <template v-slot:buttons>
        <MyButton
          variant="primary"
          @click="createPostModalActive = true"
        >
          Erstellen
        </MyButton>
      </template>
    </DataTable>
    <CreatePostModal :active.sync="createPostModalActive"/>
  </main>
</template>

<style scoped lang="scss">
  ._no-results {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    font-size: 1.3rem;
  }

  ._no-results-emoji {
    font-size: 4rem;
    margin-bottom: 20px;
  }
</style>

<script>
  import snakeCase from "lodash.snakecase";
  import PostsQuery from "./postsQuery.graphql";
  import DataTable from "@/components/DataTable/DataTable";
  import { DataTableCompanion } from "@/components/DataTable/DataTableCompanion";
  import { formatDate, formatDateWithTime, isAtStartOfDay } from "@/assets/js/dateUtils";
  import MyButton from "@/components/MyButton";
  import CreatePostModal from "@/components/pages/admin/posts/CreatePostModal/CreatePostModal";
  import "izitoast/dist/css/iziToast.min.css";

  const ITEMS_PER_PAGE = 10;

  const transformDate = date => {
    if (date === null) {
      return "Nicht festgelegt";
    }

    return isAtStartOfDay(date) ? formatDate(date) : formatDateWithTime(date);
  };

  export default {
    name: "PostsPage",
    components: { CreatePostModal, MyButton, DataTable },
    layout: "admin",
    data() {
      return {
        createPostModalActive: false,
        table: new DataTableCompanion({
          columns: {
            title: {
              name: "Titel",
              sortable: true
            },
            slug: {
              name: "Slug",
              sortable: true
            },
            publicationDate: {
              name: "Veröffentlichung am",
              transform: transformDate,
              sortable: true,
              width: 200
            },
            relevantUntil: {
              name: "Relevant bis",
              transform: transformDate,
              sortable: true,
              width: 200
            }
          },
          sortBy: "publicationDate",
          sortOrder: "DESCENDING",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: async (pageIndex, sortBy, sortOrder) => {
            const result = await this.$apollo.query({
              query: PostsQuery,
              variables: {
                skip: pageIndex * ITEMS_PER_PAGE,
                take: ITEMS_PER_PAGE,
                order: sortOrder,
                sortBy: snakeCase(sortBy).toUpperCase()
              },
              fetchPolicy: "network-only"
            });

            return result.data.posts;
          }
        })
      };
    },
    async beforeMount() {
      this.table.initialize();

      if (this.$route.query.delete_success === "1") {
        this.$router.replace("/admin/posts");
        (await import("izitoast")).show({
          message: "Der Artikel wurde gelöscht.",
          color: "green",
          timeout: 6000,
          position: "topRight"
        });
      }
    },
    methods: {
      onRowClick(id) {
        this.$router.push(`/admin/posts/${id}`);
      }
    }
  };
</script>
