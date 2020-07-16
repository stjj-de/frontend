export const eventColors = {
  GRAY: { hex: "#718096", title: "Grau" },
  RED: { hex: "#e53e3e", title: "Rot" },
  ORANGE: { hex: "#dd6b20", title: "Orange" },
  YELLOW: { hex: "#d69e2e", title: "Gelb" },
  GREEN: { hex: "#38a169", title: "Grün" },
  TEAL: { hex: "#319795", title: "Türkis" },
  BLUE: { hex: "#3182ce", title: "Blau" },
  INDIGO: { hex: "#5a67d8", title: "Indigo" },
  PURPLE: { hex: "#805ad5", title: "Violett" },
  PINK: { hex: "#d53f8c", title: "Pink" }
};

export function getCSSColorForEventColor(name) {
  return eventColors[name.toUpperCase()].hex;
}
