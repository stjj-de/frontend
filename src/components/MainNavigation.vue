<template>
  <teleport to="#nav">
    <div class="transition-all duration-200 linear text-8 flex justify-end items-center bg-gray-50" :class="classes">
      <nav
        :class="active ? 'opacity-100' : '-md:opacity-0 -md:pointer-events-none'"
        class="flex items-center top-0 left-0 bg-gray-50 w-100vw
               -md:fixed -md:bg-gray-50 -md:h-100vh -md:space-y-10 -md:flex-col -md:justify-center
               md:space-x-12 md:h-full md:max-w-1024px md:px-12 md:mx-auto"
      >
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="font-serif"
          @click.passive="active = false"
        >
          {{ item.label }}
        </router-link>
      </nav>
      <button
        class="text-gray-800 mr-6 md:hidden flex justify-center items-center relative"
        @click="active = !active"
      >
        <MenuIcon class="text-10"/>
      </button>
    </div>
  </teleport>
</template>

<style module>
</style>

<script>
  import { useWindowScroll } from "@vueuse/core"
  import { computed, ref, watch } from "vue"
  import MenuIcon from "~icons/tabler/menu-2"

  const items = [
    {
      label: "Start",
      path: "/",
      exact: true
    },
    {
      label: "Gottesdienste",
      path: "/gottesdienste"
    },
    {
      label: "Mediathek",
      path: "/mediathek"
    }
  ]

  export default {
    name: "MainNavigation",
    components: { MenuIcon },
    setup() {
      const { y: yScroll } = useWindowScroll()
      const active = ref(false)
      const elevated = ref(false)

      watch(yScroll, () => {
        if (elevated.value && yScroll.value === 0) elevated.value = false
        else if (!elevated.value && yScroll.value > 50) elevated.value = true
      })

      return {
        items,
        active,
        classes: computed(() => {
          if (elevated.value) return "h-22 md:h-22 shadow-md md:text-7"
          return "h-22 md:h-30 md:text-8"
        })
      }
    }
  }
</script>
