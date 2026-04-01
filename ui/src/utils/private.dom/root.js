import { isShadowRoot } from '../dom/dom.js'
import { globalConfig } from '../private.config/instance-config.js'

export function getRootElement() {
  if (__QUASAR_SSR_SERVER__) return void 0

  if (globalConfig.root !== void 0) {
    if (typeof globalConfig.root === 'function') {
      return globalConfig.root()
    }
    if (typeof globalConfig.root === 'string') {
      return document.querySelector(globalConfig.root) || document.body
    }
    return globalConfig.root
  }
  return document.body
}

export function getRootTarget() {
  const root = getRootElement()
  return isShadowRoot(root) === true ? root.host : root
}
