
export default function getCssVar (propName, element = document.body) {
  if (typeof propName !== 'string') {
    throw new TypeError('Expected a string as propName')
  }
  if (!(element instanceof Element)) {
    throw new TypeError('Expected a DOM element')
  }

  return getComputedStyle(element).getPropertyValue(`--q-${ propName }`).trim() || null
}
