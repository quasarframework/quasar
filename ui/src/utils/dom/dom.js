import { unref } from 'vue'

export function offset(el) {
  if (el === window) {
    return { top: 0, left: 0 }
  }
  const { top, left } = el.getBoundingClientRect()
  return { top, left }
}

export function style(el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

export function height(el) {
  return el === window ? window.innerHeight : el.getBoundingClientRect().height
}

export function width(el) {
  return el === window ? window.innerWidth : el.getBoundingClientRect().width
}

export function css(element, cssObject) {
  const elementStyle = element.style

  for (const prop in cssObject) {
    elementStyle[prop] = cssObject[prop]
  }
}

export function cssBatch(elements, elementCssObject) {
  elements.forEach(el => css(el, elementCssObject))
}

export function ready(fn) {
  if (typeof fn !== 'function') return

  if (document.readyState !== 'loading') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false)
}

// internal
export function getElement(el) {
  if (el === void 0 || el === null) {
    return void 0
  }

  if (typeof el === 'string') {
    try {
      return document.querySelector(el) || void 0
    } catch {
      return void 0
    }
  }

  const target = unref(el)
  if (target) {
    return target.$el || target
  }
}

export function getActualActiveElement() {
  let el = document.activeElement
  while (
    el !== null &&
    el.shadowRoot !== null &&
    el.shadowRoot.activeElement !== null
  ) {
    el = el.shadowRoot.activeElement
  }
  return el
}

// internal
export function childHasFocus(el, focusedEl) {
  if (el === void 0 || el === null) {
    return true
  }

  if (focusedEl === void 0 || focusedEl === null) {
    focusedEl = getActualActiveElement()
  }

  // If focusedEl is the host of the Shadow DOM containing el,
  // we must get the ACTUAL focused element inside said Shadow DOM.
  let actualFocused = focusedEl
  while (
    actualFocused !== null &&
    actualFocused.shadowRoot !== null &&
    actualFocused.shadowRoot.activeElement !== null
  ) {
    actualFocused = actualFocused.shadowRoot.activeElement
  }

  if (el.contains(actualFocused) === true) {
    return true
  }

  for (
    let next = el.nextElementSibling;
    next !== null;
    next = next.nextElementSibling
  ) {
    if (next.contains(actualFocused)) {
      return true
    }
  }

  return false
}

export function isShadowRoot(el) {
  return typeof ShadowRoot !== 'undefined' && el instanceof ShadowRoot
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
