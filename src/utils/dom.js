export function offset (el) {
  if (el === window) {
    return {top: 0, left: 0}
  }
  let {top, left} = el.getBoundingClientRect()

  return {top, left}
}

export function style (el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

export function height (el) {
  if (el === window) {
    return viewport().height
  }
  return parseFloat(window.getComputedStyle(el).getPropertyValue('height'), 10)
}

export function width (el) {
  if (el === window) {
    return viewport().width
  }
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

export function getScrollTarget (el) {
  return el.closest('.layout-view,.scroll') || window
}

export function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}

function animScrollTo (el, to, duration) {
  if (duration <= 0) {
    return
  }

  const pos = getScrollPosition(el)

  requestAnimationFrame(() => {
    setScroll(el, pos + (to - pos) / duration * 16)
    if (el.scrollTop !== to) {
      animScrollTo(el, to, duration - 16)
    }
  })
}

function setScroll (scrollTarget, offset) {
  if (scrollTarget === window) {
    document.documentElement.scrollTop = offset
    document.body.scrollTop = offset
    return
  }
  scrollTarget.scrollTop = offset
}

export function setScrollPosition (scrollTarget, offset, duration) {
  if (duration) {
    animScrollTo(scrollTarget, offset, duration)
    return
  }
  setScroll(scrollTarget, offset)
}

const prefix = ['-webkit-', '-moz-', '-ms-', '-o-']
export function cssTransform (val) {
  let o = {transform: val}
  prefix.forEach(p => {
    o[p + 'transform'] = val
  })
  return o
}
