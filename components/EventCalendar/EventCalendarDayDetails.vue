<template>
  <div class="event-calendar-day-details">
    <div
      v-for="event in events"
      :key="event.id"
    >
      <span class="heading--6">{{ event.title }}</span>
      <div class="_event-creators">
        <UserImageWithPopup
          v-for="(creator, index) in event.creators"
          :key="creator.id"
          :user="creator"
          :index="event.creators.length - index"
        />
      </div>
      <span class="_event-description">
          {{ event.description }}
        </span>
      <nuxt-link
        v-if="event.relatedPost !== null"
        class="link _event-more"
        :to="`/posts/${event.relatedPost.slug}`"
      >
        Mehr erfahren
      </nuxt-link>
    </div>
    <span v-if="events === undefined || events.length === 0" class="_no-events">Keine Termine</span>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
  import UserImageWithPopup from "@/components/UserImageWithPopup";

  export default {
    name: "EventCalendarDayDetails",
    components: { UserImageWithPopup },
    props: {
      events: {
        type: Array,
        required: true
      }
    }
  };
</script>
