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
        <AdminDataTableEmptyState items-name="Artikel"/>
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

</style>

<script>
  import snakeCase from "lodash.snakecase";
  import PostsQuery from "./postsQuery.graphql";
  import DataTable from "@/components/DataTable/DataTable";
  import { DataTableCompanion } from "@/components/DataTable/DataTableCompanion";
  import { formatDateWithOptionalTime } from "@/assets/js/dateUtils";
  import MyButton from "@/components/MyButton";
  import CreatePostModal from "@/components/pages/admin/posts/CreatePostModal/CreatePostModal";
  import "izitoast/dist/css/iziToast.min.css";
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState";

  const ITEMS_PER_PAGE = 10;

  const transformDate = date => {
    if (date === null) {
      return "Nicht festgelegt";
    }

    return formatDateWithOptionalTime(date);
  };

  export default {
    name: "PostsAdminPage",
    components: { AdminDataTableEmptyState, CreatePostModal, MyButton, DataTable },
    head: () => ({
      title: "Artikel / Administration"
    }),
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
