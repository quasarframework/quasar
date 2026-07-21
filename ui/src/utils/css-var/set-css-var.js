import { getTeleportTargetElement } from '../private.dom/teleport-target.js'

export default function setCssVar(propName, value, element) {
  if (typeof propName !== 'string') {
    throw new TypeError('Expected a string as propName')
  }
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string as value')
  }
  const target = element === void 0 ? getTeleportTargetElement() : element

  if (!(target instanceof Element)) {
    throw new TypeError('Expected a DOM element')
  }

  target.style.setProperty(`--q-${propName}`, value)
}
