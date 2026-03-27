import { getRootElement } from '../private.dom/root.js'

export default function getCssVar(propName, element) {
  if (typeof propName !== 'string') {
    throw new TypeError('Expected a string as propName')
  }

  let target = element || getRootElement()
  if (target instanceof ShadowRoot) target = target.host

  if (!(target instanceof Element)) {
    // If element was provided and not an Element, or getRootElement() didn't return an Element
    throw new TypeError(
      'Expected a DOM element or a valid root element to be found'
    )
  }

  return (
    getComputedStyle(element).getPropertyValue(`--q-${propName}`).trim() || null
  )
}
