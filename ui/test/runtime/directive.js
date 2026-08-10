export function getMainEvent(ctx, name) {
  return ctx.__q_main_evt.find(event => event[1] === name)
}
