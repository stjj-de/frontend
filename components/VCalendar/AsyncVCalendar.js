/* eslint-disable unicorn/filename-case */
import VCalendarLoadingPlaceholder from "@/components/VCalendar/VCalendarLoadingPlaceholder"

// eslint-disable-next-line import/no-anonymous-default-export,import/no-default-export
export default () => {
  const component = process.server
    ? new Promise(() => {
      // never resolves
    })
    : import("v-calendar/lib/components/calendar.umd")

  return {
    component,
    loading: VCalendarLoadingPlaceholder,
    error: VCalendarLoadingPlaceholder
  }
}
