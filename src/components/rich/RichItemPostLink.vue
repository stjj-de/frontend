<template>
  <RichCard type="Artikel" :title="data.post.title">
    <div class="flex space-x-1">
      <img
        v-for="author in data.post.authors"
        :key="author.id"
        class="rounded-full h-8 w-8 mt-2 mb-2 object-cover shadow-lg"
        draggable="false"
        :src="author.image.url"
        :alt="author.name"
      >
    </div>
    <template #action="{ classes }">
      <router-link
        :to="`/neuigkeiten/${data.post.slug}`"
        :class="classes"
      >
        <div>
          Artikel lesen
        </div>
        <ArrowRightIcon/>
      </router-link>
    </template>
  </RichCard>
</template>

<style module>

</style>

<script>
  import RichCard from "./RichCard.vue"
  import ArrowRightIcon from "~icons/ph/arrow-right"

  export default {
    name: "RichItemPostLink",
    components: { RichCard, ArrowRightIcon },
    props: {
      data: {
        type: Object,
        required: true
      }
    }
  }
</script>
