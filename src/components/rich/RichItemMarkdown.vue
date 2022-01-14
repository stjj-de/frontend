<template>
  <div class="space-y-2" :class="$style.root" v-html="rendered"/>
</template>

<style module>
  .root {
    ul {
      @apply list-disc list-inside;
    }

    ol {
      @apply pl-5 space-y-1;
    }
  }
</style>

<script>
  import { marked } from "marked"
  import { computed } from "vue"

  const NOOP_REGEX = { exec: () => {}, test: () => false }

  const ALLOWED_BLOCK = [
    "newline",
    "list",
    "listItemStart",
    "html",
    "text",
    "tag",
    "paragraph"
  ]

  const INLINE_BLOCK = [
    "escape",
    "tag",
    "link",
    "emStrong",
    "br",
    "text",
    "punctuation"
  ]

  const filterRules = (object, allowed) => {
    const entries = Object.entries(object).map(([key, value]) => [key, allowed.includes(key) ? value : NOOP_REGEX])
    return Object.fromEntries(entries)
  }

  export default {
    name: "RichItemMarkdown",
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const rendered = computed(() => {
        const lexer = new marked.Lexer()
        lexer.tokenizer.rules.block = filterRules(lexer.tokenizer.rules.block, ALLOWED_BLOCK)
        lexer.tokenizer.rules.inline = filterRules(lexer.tokenizer.rules.inline, INLINE_BLOCK)

        const renderer = new marked.Renderer()

        renderer.link = (href, title, text) =>
          `<a class="link" href="${href}" rel="noreferrer noopener" target="_blank">${text}</a>`

        return marked.Parser.parse(lexer.lex(props.data.content), {
          renderer
        })
      })

      return {
        rendered
      }
    }
  }
</script>
