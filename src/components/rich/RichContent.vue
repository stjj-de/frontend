<template>
  <div>
    <template
      v-for="(item) in content"
      :key="`${item.__typename}-${item.id}`"
    >
      <RichItemMarkdown v-if="item.__typename === 'ComponentRichMarkdown'" :data="item"/>
      <RichItemHeading
        v-else-if="item.__typename === 'ComponentRichHeading'"
        :data="item"
        :increment-level-by="incrementHeadingLevelsBy"
      />
      <RichItemPicture v-else-if="item.__typename === 'ComponentRichPicture'" :data="item"/>
      <RichItemPostLink v-else-if="item.__typename === 'ComponentRichPostLink'" :data="item"/>
      <RichItemFile v-else-if="item.__typename === 'ComponentRichFile'" :data="item"/>
    </template>
  </div>
</template>

<style module>

</style>

<script>
  import RichItemMarkdown from "./RichItemMarkdown.vue"
  import RichItemHeading from "./RichItemHeading.vue"
  import RichItemPicture from "./RichItemPicture.vue"
  import RichItemPostLink from "./RichItemPostLink.vue"
  import RichItemFile from "./RichItemFile.vue"

  export default {
    name: "RichContent",
    components: { RichItemFile, RichItemPostLink, RichItemPicture, RichItemHeading, RichItemMarkdown },
    props: {
      content: {
        type: Array,
        required: true
      },
      incrementHeadingLevelsBy: {
        type: Number,
        default: 0
      }
    }
  }
</script>
