export function offset (el) {
  if (el === window) {
    return { top: 0, left: 0 }
  }
  const { top, left } = el.getBoundingClientRect()
  return { top, left }
}

export function style (el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

export function height (el) {
  return el === window
    ? window.innerHeight
    : el.getBoundingClientRect().height
}

export function width (el) {
  return el === window
    ? window.innerWidth
    : el.getBoundingClientRect().width
}

export function css (element, css) {
  let style = element.style

  Object.keys(css).forEach(prop => {
    style[prop] = css[prop]
  })
}

export function cssBatch (elements, style) {
  elements.forEach(el => css(el, style))
}

export function ready (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState !== 'loading') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false)
}

export default {
  offset,
  style,
  height,
  width,
  css,
  cssBatch,
  ready
}
