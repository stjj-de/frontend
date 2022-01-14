import "virtual:windi.css"
import "./main.css"
import { createApp, FunctionalComponent } from "vue"
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { createHead } from "@vueuse/head"
import urql, { cacheExchange, createClient, fetchExchange } from "@urql/vue"
import App from "./App.vue"
import { pageComponentLoading } from "./store"
import { getStrapiUrl } from "./util"
import originalRoutes from "~pages"

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
    }
  }
}) as RouteRecordRaw[]

const router = createRouter({
  routes: routes.map(route => ({
    ...route,
    props: false
  })),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
  history: createWebHistory()
})

const urqlClient = createClient({
  url: getStrapiUrl("/graphql"),
  requestPolicy: "cache-and-network",
  suspense: true,
  exchanges: [
    cacheExchange,
    fetchExchange
  ]
})

const head = createHead()

const app = createApp(App)
app.use(urql, urqlClient)
app.use(router)
app.use(head)

app.mount("#app")
