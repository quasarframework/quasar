export const globalConfig = {}
export let globalConfigIsFrozen = false

export function freezeGlobalConfig () {
  globalConfigIsFrozen = true
}
