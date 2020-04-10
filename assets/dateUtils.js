export { de as dateFnsLocale } from "date-fns/locale";

export function isFullDay(startDate, endDate) {
  return startDate.getHours() === 0 && endDate.getHours() === 0 && endDate - startDate === 86400000;
}

export function toFilterStringDate(date, includeDay) {
  return String(date.getFullYear()).padStart(4, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") +
    (includeDay ? "-" + String(date.getDate()).padStart(2, "0") : "");
}
