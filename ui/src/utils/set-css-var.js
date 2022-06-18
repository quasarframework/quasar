export default function setCssVar (propName, value, element = document.body) {
  if (typeof propName !== 'string') {
    throw new TypeError('Expected a string as propName')
  }
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string as value')
  }
  if (!(element instanceof Element)) {
    throw new TypeError('Expected a DOM element')
  }

  element.style.setProperty(`--q-${ propName }`, value)
}
