/* eslint-disable no-unused-vars */
const defaultConfig = {
  threshold: 0,
  root: null,
  rootMargin: '0px'
}

function except (object, keys) {
  return Object.keys(object).reduce((reduced, key) => {
    if (!keys.includes(key)) {
      reduced[key] = object[key]
    }
    return reduced
  }, {})
}

function parseIntersectValue (value) {
  return typeof value === 'function'
    ? Object.assign({}, defaultConfig, { callback: value })
    : Object.assign({}, defaultConfig, value)
}

function inserted (el, binding) {
  const modifiers = binding.modifiers || {}
  const value = binding.value
  const config = parseIntersectValue(value)

  const observer = new IntersectionObserver(([entry]) => {
    if (!el._visibleObserver) {
      return
    }

    if (modifiers.once === true &&
      entry.isIntersecting === true) {
      config.callback(entry)
      unbind(el)
      return
    }

    config.callback(entry)
  }, except(config, ['callback']))

  el._visibleObserver = observer

  observer.observe(el)
}

function unbind (el) {
  if (!el._visibleObserver) {
    return
  }

  el._visibleObserver.unobserve(el)
  delete el._visibleObserver
}

export const Visible = {
  name: 'visible',
  inserted,
  unbind
}

export default Visible
