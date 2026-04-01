import { getRootTarget } from '../private.dom/root.js'

export default function getCssVar(propName, element) {
  if (typeof propName !== 'string') {
    throw new TypeError('Expected a string as propName')
  }

  const target = element || getRootTarget()

  if (!(target instanceof Element)) {
    throw new TypeError('Expected a DOM element')
  }

  return (
    getComputedStyle(target).getPropertyValue(`--q-${propName}`).trim() || null
  )
}
