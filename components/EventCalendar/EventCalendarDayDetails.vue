<template>
  <div class="event-calendar-day-details">
    <div
      v-for="event in computedEvents"
      :key="event.id"
      class="event-calendar-day-details__event"
    >
      <div class="event-calendar-day-details__event-header">
        <span class="event-calendar-day-details__event-color" :style="getDotStyle(event.color)"></span>
        <span class="heading--5 event-calendar-day-details__event-title">{{ event.title }}</span>
      </div>
      <div class="event-calendar-day-details__event-date">
        {{ event.__displayedTime }}
      </div>
      <ContentOutlet class="event-calendar-day-details__event-description" :html="event.description"/>
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
        :user="event.creator"
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

  .event-calendar-day-details__event-title {
    display: inline;
  }

  .event-calendar-day-details__event-date {
    margin-top: 4px;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .event-calendar-day-details__event-color {
    @include dot.dot();

    margin-right: 5px;
    position: relative;
    top: -2px;
  }

  .event-calendar-day-details__event-creator {
    margin-left: 4px;
    margin-top: 10px;
    margin-bottom: -10px;

    display: flex;

    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }

  .event-calendar-day-details__event-more {
    font-size: 1.1rem;
    display: inline-block;
    margin: 10px 0;
  }

  .event-calendar-day-details__no-events {
    font-size: 1.2rem;
  }
</style>

<script>
  import cloneDeep from "lodash.clonedeep"
  import { format } from "date-fns"
  import { dateFnsLocale, isFullDay } from "@/assets/js/date-utils"
  import UserImageWithPopup from "@/components/UserImageWithPopup"
  import { getCSSColorForEventColor } from "@/assets/js/event-colors"
  import ContentOutlet from "@/components/ContentOutlet"

  export default {
    name: "EventCalendarDayDetails",
    components: { ContentOutlet, UserImageWithPopup },
    props: {
      events: {
        type: Array,
        required: true
      }
    },
    computed: {
      computedEvents() {
        const events = cloneDeep(this.events)

        events.forEach(event => {
          const dateObjects = {
            start: new Date(event.date),
            end: event.endDate === null ? null : new Date(event.endDate)
          }

          if (dateObjects.end && isFullDay(dateObjects.start, dateObjects.end)) {
            event.__displayedTime = "Ganztägig"
            event.__fullDay = true
          } else {
            event.__displayedTime = format(dateObjects.start, "HH:mm", { locale: dateFnsLocale }) + " Uhr"

            if (event.endDate !== null) {
              event.__displayedTime += " bis "

              const { start, end } = dateObjects
              const includeTime = end.getHours() !== 0 || end.getMinutes() !== 0
              const includeYear = end.getFullYear() !== start.getFullYear()
              const includeDayAndMonth = includeYear ||
                start.getDate() !== end.getDate() ||
                start.getMonth() !== end.getMonth()

              if (includeTime) {
                event.__displayedTime += format(end, "HH:mm", { locale: dateFnsLocale })
                event.__displayedTime += " Uhr"
              }

              let template = ""

              if (includeDayAndMonth) template += "d.L."
              if (includeYear) template += "y"

              if (template !== "") {
                event.__displayedTime += ` ${includeTime ? "am" : "zum"} `
                event.__displayedTime += format(end, template, { locale: dateFnsLocale })
              }
            }

            event.__fullDay = false
          }
        })

        return events.sort((a, b) => {
          if (a.__fullDay && b.__fullDay)
            return 0
          else if (!a.__fullDay && b.__fullDay)
            return -1
          else if (a.__fullDay && !b.__fullDay)
            return 1

          return a.date.localeCompare(b.date)
        })
      }
    },
    methods: {
      getDotStyle(color) {
        return `background-color: ${getCSSColorForEventColor(color)}`
      }
    },
    EVENT_FIELDS: ["id", "color", "title", "description", "creator", "date", "endDate", "relatedPost"],
    EVENT_RELATED_POST_FIELDS: ["slug"],
    EVENT_CREATOR_FIELDS: UserImageWithPopup.USER_FIELDS
  }
</script>
