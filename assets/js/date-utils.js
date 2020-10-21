import { format } from "date-fns"

import { de as dateFnsLocale } from "date-fns/locale"

export { dateFnsLocale }

export function isFullDay(startDate, endDate) {
  return startDate.getHours() === 0 && endDate.getHours() === 0 && endDate - startDate === 86400000
}

export function toFilterStringDate(date, includeDay) {
  return String(date.getFullYear()).padStart(4, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") +
    (includeDay ? "-" + String(date.getDate()).padStart(2, "0") : "")
}

export function ensureDateObject(date) {
  if (date instanceof Date)
    return date

  return new Date(date)
}

export const formatShortDateWithTimeAndNameAsSentence = date => {
  const d = ensureDateObject(date)

  const datePart = format(d, "EEEE, d.L.", { locale: dateFnsLocale })
  const timePart = format(d, "HH:mm", { locale: dateFnsLocale })

  return `${datePart} um ${timePart} Uhr`
}

export const formatDateWithTimeAndShortName = date => format(
  ensureDateObject(date),
  "EEEEEE, d.L.yyyy HH:mm",
  { locale: dateFnsLocale }
)

export function formatDateWithTime(date) {
  return format(ensureDateObject(date), "d.L.yyyy HH:mm", { locale: dateFnsLocale })
}

export function formatDate(date) {
  return format(ensureDateObject(date), "d.L.yyyy", { locale: dateFnsLocale })
}

export function isAtStartOfDay(date) {
  const _date = ensureDateObject(date)

  // Milliseconds are ignored, because they are not displayed either.
  return _date.getHours() === 0 && _date.getMinutes() === 0 && _date.getSeconds() === 0
}

export function formatDateWithOptionalTime(date) {
  return isAtStartOfDay(date) ? formatDate(date) : formatDateWithTime(date)
}
