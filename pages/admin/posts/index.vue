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
  import DataTable from "@/components/DataTable/DataTable";
  import { DataTableCompanion } from "@/components/DataTable/DataTableCompanion";
  import { formatDateWithOptionalTime } from "@/assets/js/dateUtils";
  import MyButton from "@/components/MyButton";
  import CreatePostModal from "@/components/pages/admin/posts/CreatePostModal";
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
            publishedAt: {
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
          sortBy: "publishedAt",
          sortOrder: "desc",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: async (pageIndex, sortBy, sortOrder) => {
            return await this.$api.posts.list({
              fields: ["id", "title", "slug", "publishedAt", "relevantUntil"],
              onlyPublished: false,
              onlyRelevant: false,
              offset: pageIndex * ITEMS_PER_PAGE,
              limit: ITEMS_PER_PAGE,
              ascending: sortOrder === "asc",
              sortBy
            })
          }
        })
      };
    },
    async beforeMount() {
      this.table.initialize();

      if (this.$route.query.delete_success === "1") {
        (await import("izitoast")).show({
          message: "Der Artikel wurde gelöscht.",
          color: "green",
          timeout: 6000,
          position: "topRight"
        });

        await this.$router.replace("/admin/posts");
      }
    },
    methods: {
      onRowClick(id) {
        this.$router.push(`/admin/posts/${id}`);
      }
    }
  };
</script>
