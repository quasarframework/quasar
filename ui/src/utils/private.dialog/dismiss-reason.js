export function getDismissReason(evt) {
  return evt === void 0
    ? 'programmatic'
    : evt.type.indexOf('key') === 0
      ? 'escape'
      : 'backdrop'
}
