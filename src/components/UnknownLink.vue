<template>
  <router-link
    v-if="isFrontendLink"
    class="link"
    :to="pathOnly"
  >
    <slot/>
  </router-link>
  <a
    v-else
    class="link"
    :href="to"
    rel="noopener noreferrer external"
  >
    <slot/>
  </a>
</template>

<style scoped>

</style>

<script>
  import { computed } from "vue"

  const FRONTEND_ORIGIN = "https://stjj.de"

  const BACKEND_PATHS = [
    "/files",
    "/images",
    "/api"
  ]

  export default {
    name: "UnknownLink",
    props: {
      to: {
        type: String,
        required: true
      }
    },
    setup(props) {
      return {
        isFrontendLink: computed(() => {
          if (BACKEND_PATHS.some(path => props.to.startsWith(path) || props.to.startsWith(FRONTEND_ORIGIN + path))) {
            return false
          }

          return props.to.startsWith("/") || props.to.startsWith(FRONTEND_ORIGIN)
        }),
        pathOnly: computed(() => props.to.startsWith(FRONTEND_ORIGIN) ? props.to.slice(15) : props.to)
      }
    }
  }
</script>
