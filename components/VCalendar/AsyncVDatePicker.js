import VCalendarLoadingPlaceholder from "@/components/VCalendar/VCalendarLoadingPlaceholder";

export default () => {
  const component = process.server ? new Promise(() => {
    // never resolves
  }) : import("v-calendar/lib/components/date-picker.umd");

  return {
    component,
    loading: VCalendarLoadingPlaceholder,
    error: VCalendarLoadingPlaceholder
  };
};
