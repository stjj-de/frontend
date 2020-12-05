<template>
  <main class="videos-page">
    <h1 class="heading--1">
      Videos
    </h1>
    <DataTable
      :companion="table"
      loading-text="Videos werden geladen"
      @row-click="id => editVideo(id)"
    >
      <template #empty-state>
        <AdminDataTableEmptyState items-name="Videos"/>
      </template>
      <template #buttons>
        <MyButton
          variant="primary"
          @click="createVideoModalActive = true"
        >
          Erstellen
        </MyButton>
      </template>
    </DataTable>
    <CreateVideoModal :active="createVideoModalActive" @close="canceled => onCreatePostModalClose(canceled)"/>
    <EditVideoModal
      :active="editVideoModalActive"
      :video-id="editVideoModalID"
      @close="canceled => onEditVideoModalClose(canceled)"
    />
  </main>
</template>

<style scoped lang="scss">

</style>

<script>
  import DataTable from "@/components/DataTable/DataTable"
  import { DataTableCompanion } from "@/components/DataTable/data-table-companion"
  import MyButton from "@/components/MyButton"
  import AdminDataTableEmptyState from "@/components/AdminDataTableEmptyState"
  import CreateVideoModal from "@/components/pages/admin/videos/CreateVideoModal"
  import EditVideoModal from "@/components/pages/admin/videos/EditVideoModal"
  import { formatDateWithOptionalTime } from "@/assets/js/date-utils"

  const ITEMS_PER_PAGE = 10

  const transformDate = date => {
    if (date === null)
      return "Nicht festgelegt"

    return formatDateWithOptionalTime(date)
  }

  export default {
    name: "VideosAdminPage",
    components: { EditVideoModal, CreateVideoModal, AdminDataTableEmptyState, MyButton, DataTable },
    data() {
      return {
        createVideoModalActive: false,
        editVideoModalActive: false,
        editVideoModalID: null,
        isEditingCreatedVideo: false,
        table: new DataTableCompanion({
          columns: {
            title: {
              name: "Titel"
            },
            publishedAt: {
              name: "Veröffentlichung am",
              transform: transformDate,
              sortable: true,
              width: 200
            }
          },
          sortBy: "publishedAt",
          sortOrder: "desc",
          itemsPerPage: ITEMS_PER_PAGE,
          fetch: (pageIndex, sortBy, sortOrder) => this.$api.videos.list({
            fields: ["id", "title", "publishedAt"],
            sortBy,
            ascending: sortOrder === "asc",
            limit: ITEMS_PER_PAGE,
            offset: pageIndex * ITEMS_PER_PAGE,
            onlyPublished: false
          })
        })
      }
    },
    head: () => ({
      title: "Videos / Administration"
    }),
    beforeMount() {
      this.table.initialize()
    },
    methods: {
      editVideo(id) {
        this.editVideoModalID = id
        this.editVideoModalActive = true
      },
      onCreatePostModalClose(createdID) {
        this.createVideoModalActive = false

        if (createdID !== null) {
          this.isEditingCreatedVideo = true
          this.editVideo(createdID)
        }
      },
      onEditVideoModalClose(canceled) {
        this.editVideoModalActive = false

        if (this.isEditingCreatedVideo || !canceled) {
          this.table.invalidateLastFetch()
          this.table.fetch()
        }

        this.isEditingCreatedVideo = false
      }
    }
  }
</script>
