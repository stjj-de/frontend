export const eventColors = {
  gray: { hex: "#718096", title: "Grau" },
  red: { hex: "#e53e3e", title: "Rot" },
  orange: { hex: "#dd6b20", title: "Orange" },
  yellow: { hex: "#d69e2e", title: "Gelb" },
  green: { hex: "#38a169", title: "Grün" },
  teal: { hex: "#319795", title: "Türkis" },
  blue: { hex: "#3182ce", title: "Blau" },
  indigo: { hex: "#5a67d8", title: "Indigo" },
  purple: { hex: "#805ad5", title: "Violett" },
  pink: { hex: "#d53f8c", title: "Pink" }
};

export function getCSSColorForEventColor(name) {
  return eventColors[name].hex;
}
