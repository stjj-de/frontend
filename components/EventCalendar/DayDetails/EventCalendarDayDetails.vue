<template>
  <div class="event-calendar-day-details">
    <div
      v-for="event in sortedEvents"
      :key="event.id"
      class="_event"
    >
      <h3 class="_event-header">
        <span class="_event-color" :class="getColorClass(event.color)"></span>
        <span class="heading--6 _event-title">{{ event.title }}</span>
      </h3>
      <div class="_event-date">
        <span>{{ getEventStartDateString(event) }}</span>
        <span v-if="event.endDate">
          - {{ getEventEndDateString(event) }}
        </span>
      </div>
      <p class="_event-description">
        {{ event.description }}
      </p>
      <nuxt-link
        v-if="event.relatedPost !== null"
        class="link _event-more"
        :to="`/posts/${event.relatedPost.slug}`"
      >
        Mehr erfahren
      </nuxt-link>
      <div v-if="event.creators.length !== 0" class="_event-creators">
        <UserImageWithPopup
          v-for="creator in event.creators"
          class="_event-creator-image"
          :key="creator.id"
          :user="creator"
        />
      </div>
    </div>
    <span v-if="events === undefined || events.length === 0" class="_no-events">Keine Termine</span>
  </div>
</template>

<style scoped lang="scss">
  ._event:not(:last-child) {
    margin-bottom: 30px;
  }

  ._event-date {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  ._event-title {
    display: inline;
  }

  ._event-color {
    $size: 10px;

    display: inline-block;
    width: $size;
    height: $size;
    border-radius: 50%;

    margin-right: 5px;
    position: relative;
    top: -2px;
  }

  ._event-creators {
    margin-top: 15px;
    margin-bottom: -10px;

    display: flex;

    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }

  ._event-description {
    font-size: 1.1rem;
  }

  ._event-more {
    font-size: 1.1rem;
    display: block;
    margin-top: 10px;
  }

  ._no-events {
    font-size: 1.2rem;
  }
</style>

<script>
  import { de } from "date-fns/locale";
  import { format } from "date-fns";
  import UserImageWithPopup from "@/components/UserImageWithPopup/UserImageWithPopup";

  export default {
    name: "EventCalendarDayDetails",
    components: { UserImageWithPopup },
    props: {
      events: {
        type: Array,
        required: true
      }
    },
    computed: {
      sortedEvents() {
        return [...this.events].sort((eventA, eventB) => eventA.date.localeCompare(eventB.date));
      }
    },
    methods: {
      getColorClass(color) {
        return `vc-bg-${color.toLowerCase()}-600`;
      },
      getEventStartDateString(event) {
        return format(new Date(event.date), "HH:mm", { locale: de });
      },
      getEventEndDateString(event) {
        const start = new Date(event.date);
        const end = new Date(event.endDate);

        let template = "";

        const includeYear = end.getFullYear() !== start.getFullYear();
        const includeDayAndMonth = includeYear ||
          start.getDate() !== end.getDate() || start.getMonth() !== end.getMonth();

        if (includeDayAndMonth) {
          template += "d.L";
        }

        if (includeYear) {
          template += ".y";
        }

        if (template !== "") {
          template += " ";
        }

        template += "HH:mm";

        return format(end, template, { locale: de });
      }
    }
  };
</script>
