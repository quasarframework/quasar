export let Vue
export let moment

export function setVue (_Vue) {
  Vue = _Vue
}
export function setDeps (deps) {
  moment = deps.moment
}
