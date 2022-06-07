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

<!--suppress CssUnusedSymbol -->
<style module>
  .nprogressBar {
    @apply bg-yellow-400 h-2 absolute top-0 w-100vw z-1000;
  }
</style>

<script lang="ts">
  import { computed, onMounted, ref, watchEffect, useCssModule } from "vue"
  import { useIntervalFn, whenever } from "@vueuse/core"
  import { useQuery } from "@urql/vue"
  import NProgress from "nprogress"
  import query from "./gql/App.graphql"
  import { liveStatusLoading, liveVideoId, pageComponentLoading } from "./store"
  import MainNavigation from "./components/MainNavigation.vue"
  import ArrowRightIcon from "~icons/ph/arrow-right"

  function useLoading(progressBarClass: string) {
    onMounted(() => {
      NProgress.configure({
        template: `<div class="${progressBarClass}" role="bar"><div class="peg"></div></div></div>`,
        trickleSpeed: 100
      })
    })

    const isLoading = ref(false)

    const stopLoading = () => {
      isLoading.value = false
      NProgress.done()
    }

    const startLoading = () => {
      isLoading.value = true
      NProgress.start()
    }

    // Suspense @resolve is also called when the component is not async, so we don't need to handle stopping
    whenever(pageComponentLoading, () => {
      // Runs when a page component is imported
      startLoading()
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

    const { data, executeQuery } = useQuery({
      query,
      context: {
        requestPolicy: "network-only"
      }
    })

    useIntervalFn(() => {
      executeQuery()
    }, 30 * 1000)

    watchEffect(() => {
      if (data.value) {
        liveStatusLoading.value = false

        const id = data.value.settingsSingletons[0].livestreamVideoId
        liveVideoId.value = id === "" ? null : id
      }
    })
  }

  export default {
    name: "App",
    components: { MainNavigation, ArrowRightIcon },
    setup() {
      const styles = useCssModule()
      const { isLoading, startLoading, stopLoading } = useLoading(styles.nprogressBar)

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
