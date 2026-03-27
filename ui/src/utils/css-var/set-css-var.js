import { getRootElement } from '../private.dom/root.js'

export default function setCssVar(propName, value, element) {
  if (typeof propName !== 'string') {
    throw new TypeError('Expected a string as propName')
  }
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string as value')
  }
  let target = element || getRootElement()
  if (target instanceof ShadowRoot) target = target.host
  if (target?.style) {
    target.style.setProperty(`--q-${propName}`, value)
  }
}
