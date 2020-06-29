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
      <LoadingOverlay :active="$apollo.queries.eventsInMonth.loading"/>
    </div>
    <transition mode="out-in" :name="dayDetailsTransitionName">
      <span v-if="selectedDay === null" :key="null" class="heading--5 event-calendar__no-selection">
        Kein Tag ausgewählt.
      </span>
      <div v-else :key="selectedDay" ref="dayDetails">
        <h2 class="heading--4 _day-date">
          {{ selectedDayString }}
        </h2>
        <div class="event-calendar__day-details">
          <EventCalendarDayDetails v-if="!$apollo.queries.eventsOnDay.loading" :events="eventsOnDay"/>
          <LoadingOverlay :active="$apollo.queries.eventsOnDay.loading">
            Termine werden geladen
          </LoadingOverlay>
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

  .event-calendar__day-details {
    position: relative;
    min-height: 50px;
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
  import { format } from "date-fns";
  import EventCalendarDayDetails from "./EventCalendarDayDetails";
  import { dateFnsLocale } from "@/assets/js/dateUtils";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import AsyncVCalendar from "@/components/VCalendar/AsyncVCalendar";
  import { toFilterStringDate } from "@/assets/js/dateUtils";

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
      previousSelectedDay: null
    }),
    computed: {
      attributes() {
        if (!this.eventsInMonth) return [];

        const eventAttributes = this.eventsInMonth.map(event => ({
          dot: event.color.toLowerCase(),
          dates: new Date(event.date)
        }));

        return eventAttributes;
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
      onPageChange(page) {
        if (this.isFirstPageChange) {
          this.isFirstPageChange = false;
          return;
        }

        this.selectedDay = null;
        // TODO
      },
      onDayClick(day) {
        this.selectedDay = day.id;

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
