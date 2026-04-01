import { getRootTarget } from '../private.dom/root.js'

export default function setCssVar(propName, value, element) {
  if (typeof propName !== 'string') {
    throw new TypeError('Expected a string as propName')
  }
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string as value')
  }
  const target = element || getRootTarget()
  target.style.setProperty(`--q-${propName}`, value)
}
