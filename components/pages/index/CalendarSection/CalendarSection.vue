<template>
  <section class="calendar-section content">
    <h1 class="heading--3">
      Termine
    </h1>
    <span class="calendar-section__gottesdienste-notice">
      Aus Gründen der Übersichtlichkeit sind
      <nuxt-link class="link" to="/gemeinde">Gottesdienste</nuxt-link>
      nicht im Kalender eingetragen.
    </span>
    <EventCalendar/>
  </section>
</template>

<style lang="scss">
  .calendar-section__gottesdienste-notice {
    display: block;
    margin-bottom: 20px;
    font-size: 1.2rem;
  }
</style>

<script>
  import EventCalendar from "@/components/EventCalendar/EventCalendar";

  export default {
    name: "CalendarSection",
    components: { EventCalendar }
  };
</script>
