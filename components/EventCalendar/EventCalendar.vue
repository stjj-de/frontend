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
    <span v-if="selectedDay === null" class="heading--6 _no-selection">
      Kein Tag ausgewählt.
    </span>
    <div v-else class="_day-details-container">
      <transition :name="dayDetailsTransitionName">
        <div :key="selectedDay" class="_day-details">
          <h2 class="heading--5">
            {{ new Date(selectedDay).toLocaleDateString() }}
          </h2>
          <EventCalendarDayDetails v-if="!$apollo.queries.eventsOnDay.loading" :events="eventsOnDay"/>
        </div>
      </transition>
      <LoadingOverlay :active="$apollo.queries.eventsOnDay.loading"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/transitions";

  @include transitions.slide($name: "slide-left", $direction: "left", $duration: 300ms, $easing: ease);
  @include transitions.slide($name: "slide-right", $direction: "right", $duration: 300ms, $easing: ease);

  ._calendar {
    position: relative;

    &::v-deep {
      .vc-day-content:focus {
        background-color: rgba(0, 161, 210, 0.2);
      }
    }
  }

  ._day-details-container {
    position: relative;
    min-height: 150px;
  }

  ._day-details {
    position: absolute;
    top: 0;
  }

  ._event-creators {
    margin-bottom: 20px;
  }

  ._event-description {
    font-size: 1.1rem;
  }

  ._event-more {
    font-size: 1.1rem;
  }

  ._no-selection {
    opacity: 0.5;
  }

  ._no-events {
    font-size: 1.2rem;
  }
</style>

<script>
  import gql from "graphql-tag";
  import LoadingOverlay from "@/components/loading/LoadingOverlay";
  import UserImageWithPopup, { userFragment as userImageWithPopupUserFragment } from "@/components/UserImageWithPopup";
  import AsyncVCalendar from "@/components/VCalendar/AsyncVCalendar";
  import EventCalendarDayDetails from "@/components/EventCalendar/EventCalendarDayDetails";

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
        query: gql`query($month: Int!, $year: Int!) {
          eventsInMonth(month: $month, year: $year) {
            id
            color
            date
          }
        }`,
        variables: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }
      },
      eventsOnDay: {
        query: gql`
          query($date: String!) {
            eventsOnDay(date: $date) {
              id
              title
              color
              creators {
                ...UserImageWithPopupUserFields
              }
              description
              relatedPost {
                slug
              }
            }
          }

          ${userImageWithPopupUserFragment}
        `,
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
        if (this.previousSelectedDay === null || this.previousSelectedDay > this.selectedDay) {
          return "slide-right";
        }

        return "slide-left";
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
      }
    },
    watch: {
      selectedDay(newValue, oldValue) {
        this.previousSelectedDay = oldValue;
      }
    }
  };
</script>
