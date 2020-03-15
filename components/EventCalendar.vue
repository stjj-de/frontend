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
    <div v-else class="_day-details">
      <h2 class="heading--4">
        {{ new Date(selectedDay).toLocaleDateString() }}
      </h2>
      <div
        v-for="event in eventsOnDay"
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
      <span v-if="eventsOnDay === undefined || eventsOnDay.length === 0" class="_no-events">Keine Termine</span>
      <LoadingOverlay :active="$apollo.queries.eventsOnDay.loading"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
  ._calendar {
    position: relative;
  }

  ._day-details {
    position: relative;
    min-height: 150px;
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
  import LoadingOverlay from "@/components/LoadingOverlay";
  import UserImageWithPopup, { userFragment as userImageWithPopupUserFragment } from "@/components/UserImageWithPopup";
  import AsyncVCalendar from "@/components/AsyncVCalendar";

  export default {
    name: "EventCalendar",
    components: {
      UserImageWithPopup, LoadingOverlay,
      VCalendar: AsyncVCalendar
    },
    data: () => ({
      isFirstPageChange: true,
      selectedDay: new Date().toISOString()
        .slice(0, 10)
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
    }
  };
</script>
