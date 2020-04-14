<template>
  <div class="event-calendar-day-details">
    <div
      v-for="event in computedEvents"
      :key="event.id"
      class="event-calendar-day-details__event"
    >
      <h3 class="event-calendar-day-details__event-header">
        <span class="event-calendar-day-details__event-color" :style="getDotStyle(event.color)"></span>
        <span class="heading--6 event-calendar-day-details__event-title">{{ event.title }}</span>
      </h3>
      <div class="event-calendar-day-details__event-date">
        {{ event.__displayedTime }}
      </div>
      <p class="event-calendar-day-details__event-description">
        {{ event.description }}
      </p>
      <nuxt-link
        v-if="event.relatedPost !== null"
        class="link event-calendar-day-details__event-more"
        :to="`/posts/${event.relatedPost.slug}`"
      >
        Mehr erfahren
      </nuxt-link>
      <UserImageWithPopup
        v-if="event.creator !== null"
        class="event-calendar-day-details__event-creator"
        :user="creator"
      />
    </div>
    <span
      v-if="events === undefined || events.length === 0"
      class="event-calendar-day-details__no-events"
    >
      Keine Termine
    </span>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/dot";

  .event-calendar-day-details__event:not(:last-child) {
    margin-bottom: 30px;
  }

  .event-calendar-day-details__event-date {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .event-calendar-day-details__event-title {
    display: inline;
  }

  .event-calendar-day-details__event-color {
    @include dot.dot();

    margin-right: 5px;
    position: relative;
    top: -2px;
  }

  .event-calendar-day-details__event-creators {
    margin-top: 15px;
    margin-bottom: -10px;

    display: flex;

    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }

  .event-calendar-day-details__event-description {
    font-size: 1.1rem;
  }

  .event-calendar-day-details__event-more {
    font-size: 1.1rem;
    display: block;
    margin-top: 10px;
  }

  .event-calendar-day-details__no-events {
    font-size: 1.2rem;
  }
</style>

<script>
  import cloneDeep from "lodash.clonedeep";
  import { format } from "date-fns";
  import { dateFnsLocale } from "@/assets/js/dateUtils";
  import UserImageWithPopup from "@/components/UserImageWithPopup/UserImageWithPopup";
  import { getCSSColorForEventColor } from "@/assets/js/getCSSColorForEventColor";
  import { isFullDay } from "@/assets/js/dateUtils";

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
      computedEvents() {
        const events = cloneDeep(this.events);

        events.forEach(event => {
          const dateObjects = {
            start: new Date(event.date),
            end: event.endDate === null ? null : new Date(event.endDate)
          };

          if (dateObjects.end && isFullDay(dateObjects.start, dateObjects.end)) {
            event.__displayedTime = "Ganztägig";
            event.__fullDay = true;
          } else {
            event.__displayedTime = format(dateObjects.start, "HH:mm", { locale: dateFnsLocale });

            if (event.endDate !== null) {
              let template = "";
              const { start, end } = dateObjects;

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

              event.__displayedTime += " - " + format(end, template, { locale: dateFnsLocale });
            }

            event.__fullDay = false;
          }
        });

        return events.sort((a, b) => {
          if (a.__fullDay && b.__fullDay) {
            return 0;
          } else if (!a.__fullDay && b.__fullDay) {
            return -1;
          } else if (a.__fullDay && !b.__fullDay) {
            return 1;
          }

          return a.date.localeCompare(b.date);
        });
      }
    },
    methods: {
      getDotStyle(color) {
        return `background-color: ${getCSSColorForEventColor(color)}`;
      }
    }
  };
</script>
