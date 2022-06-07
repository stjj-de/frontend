<template>
  <template
    v-for="(child, index) in data"
    :key="index"
  >
    <template v-if="child.type">
      <component
        :is="`h${child.level + incrementHeadings}`"
        v-if="child.type === 'heading'"
        :data-level="child.level"
        :class="$style.heading"
      >
        <DocumentNodes :data="child.children" :increment-headings="incrementHeadings"/>
      </component>
      <p v-else-if="child.type === 'paragraph'" class="my-3">
        <DocumentNodes :data="child.children" :increment-headings="incrementHeadings"/>
      </p>
      <ol v-else-if="child.type === 'ordered-list'" :class="$style.orderedList">
        <li
          v-for="(item, itemIndex) in child.children"
          :key="itemIndex"
        >
          <DocumentNodes :data="item.children.map(c => c.children[0])" :increment-headings="incrementHeadings"/>
        </li>
      </ol>
      <ul v-else-if="child.type === 'unordered-list'" :class="$style.unorderedList">
        <li
          v-for="(item, itemIndex) in child.children"
          :key="itemIndex"
        >
          <DocumentNodes :data="item.children.map(c => c.children[0])" :increment-headings="incrementHeadings"/>
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
  .heading {
    @apply font-bold mb-4;

    &[data-level="1"] {
      @apply text-7 text-gray-800;
    }

    &[data-level="2"] {
      @apply text-6 text-yellow-600;
    }

    &[data-level="3"] {
      @apply text-5 text-gray-800;
    }

    & + & {
      @apply -mt-2;

      &[data-level="2"] {
        @apply -mt-3;
      }
    }

    &:not(& + &) {
      @apply mt-6;
    }
  }

  .orderedList {
    @apply list-decimal pl-5;
  }

  .unorderedList {
    @apply list-disc list-inside pl-1;
  }

  .blockquote {
    @apply my-3 pl-7 py-1 border-l-4 border-gray-300 text-4 font-serif max-w-100;
  }
</style>

<script>
  import UnknownLink from "../UnknownLink.vue"

  export default {
    name: "DocumentNodes",
    components: { UnknownLink },
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
