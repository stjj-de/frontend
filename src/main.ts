import "virtual:windi.css"
import "./main.css"
import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { createHead } from "@vueuse/head"
import urql, { cacheExchange, createClient, fetchExchange } from "@urql/vue"
import App from "./App.vue"
import { pageComponentLoading } from "./store"
import originalRoutes from "~pages"
import type { FunctionalComponent } from "vue"
import type { RouteRecordRaw } from "vue-router"

const routes = originalRoutes.map(route => {
  if (typeof route.component !== "function") return route
  const load = route.component as (() => Promise<FunctionalComponent>)

  return {
    ...route,
    component: async () => {
      pageComponentLoading.value = true

      const value = await load()
      pageComponentLoading.value = false

      return value
    },
    props: false
  }
}) as RouteRecordRaw[]

routes.push({
  path: "/live",
  redirect: "/gottesdienste"
})

const router = createRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition != null) return savedPosition
    if (to.hash !== undefined) return { el: to.hash }
    return { top: 0 }
  },
  history: createWebHistory()
})

const app = createApp(App)
app.use(router)

app.use(urql, createClient({
  url: "/api/graphql",
  requestPolicy: "cache-and-network",
  suspense: true,
  exchanges: [
    cacheExchange,
    fetchExchange
  ]
}))

const head = createHead()
app.use(head)

app.mixin({
  methods: {
    track(type: string, value: string) {
      window.umami.trackEvent(value, type)
    }
  }
})

declare module "vue" {
  interface ComponentCustomProperties {
    track: (type: string, value: string) => void
  }
}

app.mount("#app")
