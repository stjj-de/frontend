<template>
  <MainNavigation />
  <div class="max-w-1024px w-100vw px-5 sm:px-12 pt-4 pb-12 mx-auto">
    <router-view v-slot="{ Component }">
      <suspense @pending="startLoading()" @resolve="stopLoading()">
        <!-- The key prevents the component from being reused when only the params were changed -->
        <component :is="Component" :key="$route.fullPath" />
      </suspense>
    </router-view>
  </div>
  <footer
    v-if="data"
    class="flex flex-col justify-center items-center space-y-5 py-6 opacity-70 hover:opacity-100 focus-within:opacity-100 transition"
  >
    <div class="h-1px w-80vw bg-gray-200 mb-2" />
    <UnknownLink v-for="link in data.settings.footerLinks" :key="link.text" :to="link.url">
      {{ link.emoji }} {{ link.text }}
    </UnknownLink>
  </footer>
  <LiveNotification :is-visible="isLive"/>
  <LoggedInIndicator/>
</template>

<style module lang="scss">
  .nprogressBar {
    @apply bg-yellow-400 h-2 absolute top-0 w-100vw z-1000;
  }
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect, useCssModule } from "vue"
import { useIntervalFn, whenever } from "@vueuse/core"
import { useQuery } from "@urql/vue"
import NProgress from "nprogress"
import livestreamQuery from "./gql/App_livestream.graphql"
import initialQuery from "./gql/App_initial.graphql"
import { liveStatusLoading, liveVideoId, pageComponentLoading } from "./store"
import MainNavigation from "./components/MainNavigation.vue"
import UnknownLink from "./components/UnknownLink.vue"
import { fetchAuthenticatedUser } from "./auth"
import LiveNotification from "./components/LiveNotification.vue"
import LoggedInIndicator from "./components/LoggedInIndicator.vue"

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
    query: livestreamQuery,
    context: {
      requestPolicy: "network-only"
    }
  })

  useIntervalFn(() => {
    void executeQuery()
  }, 30 * 1000)

  watchEffect(() => {
    if (data.value !== undefined) {
      liveStatusLoading.value = false

      const id = data.value.settings.livestreamVideoId
      liveVideoId.value = id === "" ? null : id
    }
  })
}

const styles = useCssModule()
const { startLoading, stopLoading } = useLoading(styles.nprogressBar)

void fetchAuthenticatedUser()

useLiveStatus()

const { data } = useQuery({ query: initialQuery })

const isLive = computed(() => !liveStatusLoading.value && liveVideoId.value !== null)
</script>
