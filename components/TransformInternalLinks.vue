<template>
  <component :is="tag" v-html="transformedHTML"></component>
</template>

<style lang="scss">

</style>

<script>
  import { transformQuillLinks } from "@/assets/js/transform-quill-links"

  export default {
    name: "TransformInternalLinks",
    props: {
      html: {
        type: String,
        required: true
      },
      tag: {
        type: String,
        default: "div"
      }
    },
    computed: {
      transformedHTML() {
        return process.server ? this.html : transformQuillLinks(this.html)
      }
    },
    watch: {
      html() {
        this.$nextTick(() => {
          this.addListeners()
        })
      }
    },
    mounted() {
      this.addListeners()
    },
    methods: {
      addListeners() {
        this.$el.querySelectorAll("[data-router-link]").forEach(element => {
          element.addEventListener("click", event => {
            if (event.ctrlKey || event.shiftKey) return

            event.preventDefault()
            this.$router.push(element.getAttribute("href"))
          })
        })
      }
    }
  }
</script>
