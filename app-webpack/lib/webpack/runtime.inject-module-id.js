/**
 * Quasar runtime for server-side injecting module id.
 *
 * Warning! This file does NOT get transpiled by Babel
 * but is included into the UI code.
 *
 * @param {component} Vue Component object
 * @param {id}        Hashed id representing the module id
 */
module.exports = function injectModuleId (component, id) {
  const targetComponent = component.__vccOpts !== void 0
    ? component.__vccOpts
    : component

  const target = targetComponent.mixins
  const mixin = {
    created () { this.ssrContext._modules.add(`${id}`) }
  }

  if (target === void 0) {
    targetComponent.mixins = [ mixin ]
  }
  else {
    targetComponent.mixins.push(mixin)
  }
}
