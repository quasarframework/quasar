import { globalConfig } from '../private.config/instance-config.js'

function isValidTarget(target) {
  return (
    target instanceof Element ||
    (typeof ShadowRoot !== 'undefined' && target instanceof ShadowRoot)
  )
}

export function getTeleportTarget() {
  if (__QUASAR_SSR_SERVER__) return void 0

  const configured = globalConfig.teleportTarget
  const target =
    typeof configured === 'function'
      ? configured()
      : typeof configured === 'string'
        ? document.querySelector(configured)
        : configured

  if (target === void 0) return document.body

  if (!isValidTarget(target)) {
    throw new TypeError(
      'Quasar config.teleportTarget must resolve to an Element or ShadowRoot'
    )
  }

  return target
}

export function getTeleportTargetElement() {
  const target = getTeleportTarget()
  return target instanceof ShadowRoot ? target.host : target
}
