<template>
  <template
    v-for="(child, index) in data"
    :key="index"
  >
    <template v-if="child.type">
      <Heading
        v-if="child.type === 'heading'"
        :semantic="child.level + incrementHeadings"
        :visual="child.level"
      >
        <DocumentNodes :data="child.children" :increment-headings="incrementHeadings"/>
      </Heading>
      <p v-else-if="child.type === 'paragraph'" class="my-3">
        <DocumentNodes :data="child.children" :increment-headings="incrementHeadings"/>
      </p>
      <ol v-else-if="child.type === 'ordered-list'" :class="$style.orderedList">
        <li
          v-for="(item, itemIndex) in child.children"
          :key="itemIndex"
        >
          <DocumentNodes :data="item.children.flatMap(c => c.children)" :increment-headings="incrementHeadings"/>
        </li>
      </ol>
      <ul v-else-if="child.type === 'unordered-list'" :class="$style.unorderedList">
        <li
          v-for="(item, itemIndex) in child.children"
          :key="itemIndex"
        >
          <DocumentNodes :data="item.children.flatMap(c => c.children)" :increment-headings="incrementHeadings"/>
        </li>
      </ul>
      <blockquote v-else-if="child.type === 'blockquote'" :class="$style.blockquote">
        <DocumentNodes :data="child.children" :increment-headings="incrementHeadings"/>
      </blockquote>
      <UnknownLink v-else-if="child.type === 'link'" :to="child.href">
        <DocumentNodes :data="child.children" :increment-headings="incrementHeadings"/>
      </UnknownLink>
    </template>
    <template v-else>
      <b v-if="child.bold" class="font-bold"><DocumentNodes :data="[{ ...child, bold: false }]" :increment-headings="incrementHeadings"/></b>
      <i v-else-if="child.italic" class="italic"><DocumentNodes :data="[{ ...child, italic: false }]" :increment-headings="incrementHeadings"/></i>
      <span v-else-if="child.strikethrough" class="line-through"><DocumentNodes :data="[{ ...child, strikethrough: false }]" :increment-headings="incrementHeadings"/></span>
      <sup v-else-if="child.superscript"><DocumentNodes :data="[{ ...child, superscript: false }]" :increment-headings="incrementHeadings"/></sup>
      <span v-else>{{ child.text }}</span>
    </template>
  </template>
</template>

<style module>
  .orderedList {
    @apply list-decimal pl-5;
  }

  .unorderedList {
    @apply list-disc list-inside pl-1;
  }

  .blockquote {
    @apply my-3 pl-7 py-1 border-l-4 border-gray-300 text-4 font-serif max-w-120;
  }
</style>

<script>
  import UnknownLink from "../UnknownLink.vue"
  import Heading from "../Heading.vue"

  export default {
    name: "DocumentNodes",
    components: { Heading, UnknownLink },
    props: {
      data: {
        type: Array,
        required: true
      },
      incrementHeadings: {
        type: Number,
        required: true
      }
    }
  }
</script>
