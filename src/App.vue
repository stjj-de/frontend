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
  <div
    class="fixed -lg:bottom-4 -lg:left-4 lg:top-8 lg:right-8 bg-white shadow-md p-4 sm:p-5 rounded-2xl
           transition duration-200 transform z-101 flex space-x-3 sm:space-x-5 items-center"
    :class="isLive && ($route.path !== '/gottesdienste') ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
  >
    <div class="text-5 font-bold flex items-center">
      Jetzt live!
      <div class="bg-red-500 rounded-full w-4 h-4 animate-pulse ml-2"/>
    </div>
    <div>
      <router-link class="text-yellow-600 text-5 flex items-center space-x-2" to="/gottesdienste">
        <ArrowRightIcon/>
        <div>Zuschauen</div>
      </router-link>
    </div>
  </div>
</template>

<style>

</style>

<script lang="ts">
  import { computed, ref, watchEffect } from "vue"
  import { useIntervalFn, whenever } from "@vueuse/core"
  import { useRouter } from "vue-router"
  import { useQuery } from "@urql/vue"
  import query from "./gql/App.graphql"
  import { liveStatusLoading, liveVideoId, pageComponentLoading } from "./store"
  import MainNavigation from "./components/MainNavigation.vue"
  import ArrowRightIcon from "~icons/ph/arrow-right"

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
      query,
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
    components: { MainNavigation, ArrowRightIcon },
    setup() {
      const { isLoading, startLoading, stopLoading } = useLoading()

      useLiveStatus()

      return {
        startLoading,
        stopLoading,
        isLoading,
        isLive: computed(() => !liveStatusLoading.value && liveVideoId.value !== null)
      }
    }
  }
</script>
