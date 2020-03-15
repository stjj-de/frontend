import VCalendarLoadingPlaceholder from "@/components/VCalendarLoadingPlaceholder";

// eslint-disable-next-line import/no-default-export
export default () => {
  // eslint-disable-next-line no-undef
  const component = process.server ? new Promise(() => {
    // never resolves
  }) : import("v-calendar/lib/components/calendar.umd");

  return {
    component,
    loading: VCalendarLoadingPlaceholder,
    error: VCalendarLoadingPlaceholder
  };
};
