import kebabCase from "lodash.kebabcase";

export function toModifierClasses(base, classes) {
  return Object.entries(classes)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => `${base}--${kebabCase(key)}`);
}
