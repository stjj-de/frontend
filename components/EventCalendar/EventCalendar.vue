<template>
  <div class="event-calendar">
    <div class="_calendar">
      <client-only>
        <v-calendar
          is-expanded
          :attributes="attributes"
          @update:to-page="onPageChange"
          @dayclick="onDayClick"
        />
      </client-only>
      <LoadingOverlay :active="$apollo.queries.eventsInMonth.loading"/>
    </div>
    <transition mode="out-in" :name="dayDetailsTransitionName">
      <span v-if="selectedDay === null" :key="null" class="heading--6 _no-selection">
        Kein Tag ausgewählt.
      </span>
      <div v-else :key="selectedDay" ref="dayDetails">
        <h2 class="heading--5 _day-date">
          {{ selectedDayString }}
        </h2>
        <div class="_day-details">
          <EventCalendarDayDetails v-if="!$apollo.queries.eventsOnDay.loading" :events="eventsOnDay"/>
          <LoadingOverlay :active="$apollo.queries.eventsOnDay.loading"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/transitions";

  @include transitions.fade($duration: 200ms);
  @include transitions.slide($name: "slide-left", $direction: "left", $duration: 200ms, $easing: ease);
  @include transitions.slide($name: "slide-right", $direction: "right", $duration: 200ms, $easing: ease);

  ._calendar {
    position: relative;

    &::v-deep {
      .vc-day-content:focus {
        background-color: rgba(0, 161, 210, 0.2);
      }
    }
  }

  ._day-date {
    margin-bottom: 5px;
  }

  ._day-details {
    position: relative;
    min-height: 150px;
  }
</style>

<script>
  import { format } from "date-fns";
  import { de } from "date-fns/locale";
  import EventsInMonthQuery from "./eventsInMonthQuery.graphql";
  import EventsOnDayQuery from "./eventsOnDayQuery.graphql";
  import EventCalendarDayDetails from "./DayDetails/EventCalendarDayDetails";
  import LoadingOverlay from "@/components/loading/LoadingOverlay";
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
      selectedDay: new Date().toISOString()
        .slice(0, 10),
      previousSelectedDay: null
    }),
    apollo: {
      eventsInMonth: {
        query: EventsInMonthQuery,
        variables: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }
      },
      eventsOnDay: {
        query: EventsOnDayQuery,
        variables() {
          return {
            date: this.selectedDay
          };
        },
        skip() {
          return this.selectedDay === null;
        }
      }
    },
    computed: {
      attributes() {
        if (!this.eventsInMonth) return [];

        const eventAttributes = this.eventsInMonth.map(event => ({
          bar: event.color.toLowerCase(),
          dates: new Date(event.date)
        }));

        return [
          ...eventAttributes,
          {
            key: "today",
            highlight: true,
            dates: new Date()
          }
        ];
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

        return format(new Date(this.selectedDay), "eeeeee, d.L.y", { locale: de });
      }
    },
    methods: {
      onPageChange(page) {
        if (this.isFirstPageChange) {
          this.isFirstPageChange = false;
          return;
        }

        this.selectedDay = null;
        this.$apollo.queries.eventsInMonth.refetch(page);
      },
      onDayClick(day) {
        this.selectedDay = day.id;

        setTimeout(() => {
          this.$refs.dayDetails.scrollIntoView({
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
