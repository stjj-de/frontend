const cssColorByEventColors = {
  gray: "#718096",
  red: "#e53e3e",
  orange: "#dd6b20",
  yellow: "#d69e2e",
  green: "#38a169",
  teal: "#319795",
  blue: "#3182ce",
  indigo: "#5a67d8",
  purple: "#805ad5",
  pink: "#d53f8c"
};

export function getCSSColorForEventColor(eventColor) {
  return cssColorByEventColors[eventColor.toLowerCase()];
}
