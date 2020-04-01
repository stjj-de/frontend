export function isFullDay(startDate, endDate) {
  return startDate.getHours() === 0 && endDate.getHours() === 0 && endDate - startDate === 86400000;
}
