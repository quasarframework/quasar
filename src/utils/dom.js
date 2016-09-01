export function offset (el) {
  let rect = el.getBoundingClientRect()

  return {
    top: rect.top,
    left: rect.left
  }
}

export function style (el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

export function height (el) {
  return parseFloat(window.getComputedStyle(el).getPropertyValue('height'), 10)
}

export function width (el) {
  return parseFloat(window.getComputedStyle(el).getPropertyValue('width'), 10)
}

export function css (element, css) {
  let style = element.style

  Object.keys(css).forEach(prop => {
    style[prop] = css[prop]
  })
}

export function viewport () {
  let
    e = window,
    a = 'inner'

  if (!('innerWidth' in window)) {
    a = 'client'
    e = document.documentElement || document.body
  }

  return {
    width: e[a + 'Width'],
    height: e[a + 'Height']
  }
}

export function ready (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState === 'complete') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false)
}

export function childOf (target, parent) {
  let element = target

  while (element && element.nodeType) {
    if (element === parent) {
      return true
    }

    element = element.parentNode
  }

  return false
}

export function getScrollTarget (el) {
  return el.closest('.layout-view') || window
}

export function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}
