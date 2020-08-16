<template>
  <main class="posts-page">
    <h1 class="heading--1">
      Artikel
    </h1>
    <DataTable
      :companion="table"
      loading-text="Artikel werden geladen"
      @row-click="id => onRowClick(id)"
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
    <CreatePostModal :groups="availableGroups" :active.sync="createPostModalActive"/>
  </main>
</template>

<style scoped lang="scss">

</style>

<script>
  import DataTable from "@/components/DataTable/DataTable"
  import { DataTableCompanion } from "@/components/DataTable/data-table-companion"
  import { formatDateWithOptionalTime } from "@/assets/js/date-utils"
  import MyButton from "@/components/MyButton"
  import CreatePostModal from "@/components/pages/admin/posts/CreatePostModal"
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState"

  const ITEMS_PER_PAGE = 10

  const transformDate = date => {
    if (date === null)
      return "Nicht festgelegt"

    return formatDateWithOptionalTime(date)
  }

  export default {
    name: "PostsAdminPage",
    components: { AdminDataTableEmptyState, CreatePostModal, MyButton, DataTable },
    async asyncData({ store, $api }) {
      await store.state.userPromise

      return {
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
        createPostModalActive: false,
        availableGroups: [],
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
            group: {
              name: "Gruppe",
              sortable: true,
              transform: data => data === null ? "" : data.title,
              width: 200
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
          fetch: async (pageIndex, sortBy, sortOrder) => this.$api.groups.populate(
            await this.$api.posts.list({
              fields: ["id", "title", "slug", "publishedAt", "relevantUntil", "group"],
              onlyPublished: false,
              onlyRelevant: false,
              group: this.$store.getters.userIsEditor ? undefined : "own",
              offset: pageIndex * ITEMS_PER_PAGE,
              limit: ITEMS_PER_PAGE,
              ascending: sortOrder === "asc",
              sortBy
            }),
            "group",
            ["title"]
          )
        })
      }
    },
    async beforeMount() {
      this.table.initialize()

      if (this.$route.query.delete_success === "1") {
        this.$flash("Artikel wurde gelöscht.", "success", { timeout: 10000 })

        await this.$router.replace("/admin/posts")
      }
    },
    methods: {
      onRowClick(id) {
        this.$router.push(`/admin/posts/${id}`)
      }
    },
    head: () => ({
      title: "Artikel / Administration"
    })
  }
</script>
