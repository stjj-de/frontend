<template>
  <div class="event-calendar">
    <div class="event-calendar__calendar">
      <client-only>
        <v-calendar
          is-expanded
          :attributes="attributes"
          @update:to-page="onPageChange"
          @dayclick="onDayClick"
        />
      </client-only>
      <LoadingOverlay :active="eventsInMonth === null"/>
    </div>
    <transition mode="out-in" :name="dayDetailsTransitionName">
      <span v-if="selectedDay === null" :key="null" class="heading--5 event-calendar__no-selection">
        Kein Tag ausgewählt.
      </span>
      <div v-else :key="selectedDay" ref="dayDetails" class="event-calendar__day-details-container">
        <h2 class="heading--4 _day-date">
          {{ selectedDayString }}
        </h2>
        <div class="event-calendar__day-details">
          <EventCalendarDayDetails v-if="eventsOnDay !== null" :events="eventsOnDay"/>
          <LoadingOverlay :active="eventsOnDay === null && eventsInMonth !== null">
            Termine werden geladen
          </LoadingOverlay>
          <span v-if="eventsOnDay === null && eventsInMonth === null">Termine werden geladen</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/transitions";
  @use "~@/assets/styles/screenSize";

  @include transitions.fade($duration: 200ms);
  @include transitions.slide($name: "slide-left", $direction: "left", $duration: 200ms, $easing: ease);
  @include transitions.slide($name: "slide-right", $direction: "right", $duration: 200ms, $easing: ease);

  .event-calendar {
    display: flex;
    justify-content: stretch;
  }

  .event-calendar__calendar {
    position: relative;

    max-width: 300px;
    margin-right: 30px;

    &::v-deep {
      .vc-day-content:focus {
        background-color: rgb(117, 211, 239);
      }

      .is-today .vc-day-content {
        background-color: rgb(203, 239, 250);
      }
    }
  }

  .event-calendar__day-date {
    margin-bottom: 5px;
  }

  .event-calendar__day-details-container {
    display: flex;
    flex-direction: column;
    min-width: 300px;
  }

  .event-calendar__day-details {
    position: relative;
    flex-grow: 1;
  }

  @include screenSize.mobile {
    .event-calendar {
      flex-direction: column;
    }

    .event-calendar__calendar {
      margin-right: 0;
      margin-bottom: 20px;
    }
  }
</style>

<script>
  /* eslint-disable function-paren-newline */

  import { format } from "date-fns";
  import EventCalendarDayDetails from "./EventCalendarDayDetails";
  import { dateFnsLocale, toFilterStringDate } from "@/assets/js/dateUtils";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import AsyncVCalendar from "@/components/VCalendar/AsyncVCalendar";

  export default {
    name: "EventCalendar",
    components: {
      EventCalendarDayDetails,
      LoadingOverlay,
      VCalendar: AsyncVCalendar
    },
    data: () => ({
      isFirstPageChange: true,
      selectedDay: toFilterStringDate(new Date(), true),
      previousSelectedDay: null,
      eventsInMonth: null,
      eventsOnDay: null
    }),
    computed: {
      attributes() {
        if (this.eventsInMonth === null) return [];

        return this.eventsInMonth.map(event => ({
          dot: event.color.toLowerCase(),
          dates: new Date(event.date)
        }));
      },
      dayDetailsTransitionName() {
        if (this.previousSelectedDay === null || this.selectedDay === null) {
          return "fade";
        }

        if (this.previousSelectedDay > this.selectedDay) {
          return "slide-right";
        }

        return "slide-left";
      },
      selectedDayString() {
        if (this.selectedDay === null) return null;

        return format(new Date(this.selectedDay), "eeeeee, d.L.y", { locale: dateFnsLocale });
      }
    },
    methods: {
      async onPageChange(page) {
        this.selectedDay = null;
        this.eventsInMonth = null;
        const filter = String(page.year).padStart(4, "0") + "-" + String(page.month).padStart(2, "0");
        this.eventsInMonth = (await this.$axios.$get(`/api/events?filter=${filter}&limit=50&fields=color,date`)).items;
      },
      async onDayClick(day) {
        this.selectedDay = day.id;

        const fields = "id,date,endDate,title,description,color,creator,relatedPost";
        this.eventsOnDay = null;
        this.eventsOnDay = await Promise.all(
          (await this.$axios.$get(`/api/events?filter=${this.selectedDay}&limit=50&fields=${fields}`))
            .items
            .map(async item => ({
              ...item,
              creator: item.creator === null ? null
                : (await this.$axios.$get(`/api/users/${item.creator}?fields=id,displayName,position,imageID`)).data,
              relatedPost: item.relatedPost === null ? null
                : (await this.$axios.$get(`/api/posts/${item.relatedPost}?fields=slug`)).data
            }))
        );

        setTimeout(() => {
          window.scroll({
            top: window.pageYOffset + this.$refs.dayDetails.getBoundingClientRect().top - 100,
            behavior: "smooth"
          });
        }, 400);
      }
    },
    watch: {
      selectedDay(value, oldValue) {
        this.previousSelectedDay = oldValue;
      }
    }
  };
</script>
