export function oneOf(...options) {
  return status => options.includes(status);
}
