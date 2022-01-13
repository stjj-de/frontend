<template>
  <MainNavigation/>
  <div class="max-w-1024px w-100vw px-5 sm:px-12 pt-4 pb-12 mx-auto overflow-hidden">
    <router-view v-slot="{ Component }">
      <suspense @pending="startLoading()" @resolve="stopLoading()">
        <!-- The key makes that components are not reused if only params changed -->
        <component :is="Component" :key="$route.fullPath"/>
      </suspense>
    </router-view>
  </div>
</template>

<style>

</style>

<script lang="ts">
  import { ref, watchEffect } from "vue"
  import { useIntervalFn, whenever } from "@vueuse/core"
  import { useRouter } from "vue-router"
  import { gql, useQuery } from "@urql/vue"
  import { liveStatusLoading, liveVideoId, pageComponentLoading } from "./store"
  import MainNavigation from "./components/MainNavigation.vue"

  function useLoading() {
    const isLoading = ref(false)

    const stopLoading = () => {
      isLoading.value = false
    }

    const startLoading = () => {
      isLoading.value = true
    }

    // Suspense @resolve is also called when the component is not async, so we don't need to handle stopping
    whenever(pageComponentLoading, () => {
      // Runs when a page component is imported
      startLoading()
    })

    const router = useRouter()
    let isFirst = true

    router.beforeResolve((to, from, next) => {
      if (isFirst) {
        isFirst = false

        // TODO: Hide the initial loading screen
      }

      next()
    })

    return {
      isLoading,
      startLoading,
      stopLoading
    }
  }

  function useLiveStatus() {
    liveStatusLoading.value = true
    liveVideoId.value = null

    const result = useQuery({
      query: gql`
        query {
          generalSettings {
            data {
              attributes {
                livestreamVideoId
              }
            }
          }
        }
      `,
      context: {
        requestPolicy: "network-only"
      }
    })

    useIntervalFn(() => {
      result.executeQuery()
    }, 30 * 1000)

    watchEffect(() => {
      if (result.data.value) {
        liveStatusLoading.value = false

        const id = result.data.value.generalSettings.data.attributes.livestreamVideoId
        liveVideoId.value = id === "" ? null : id
      }
    })
  }

  export default {
    name: "App",
    components: { MainNavigation },
    setup() {
      const { isLoading, startLoading, stopLoading } = useLoading()

      useLiveStatus()

      return {
        startLoading,
        stopLoading,
        isLoading
      }
    }
  }
</script>
