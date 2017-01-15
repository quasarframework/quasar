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

export function isParentId (el, id, stopSelector) {
  let retval = null
  while (el) {
    if (el.id === id) {
      retval = el.id
      break
    }
    else if (stopSelector && el.matches(stopSelector)) {
      break
    }
    el = el.parentElement
  }
  return retval
}

export function isClosest (el, selector, stopSelector) {
  let retval = null
  while (el) {
    if (el.matches(selector)) {
      retval = el
      break
    }
    else if (stopSelector && el.matches(stopSelector)) {
      break
    }
    el = el.parentElement
  }
  return retval
}

export function isSelfOrChild (el, target, stopSelector) {
  let retval = null
  while (el) {
    if (el === target) {
      retval = el
      break
    }
    else if (stopSelector && el.matches(stopSelector)) {
      break
    }
    el = el.parentElement
  }
  return retval
}

export function isScreenMediaSize (mediaSize, paramWidth) {
  const
    sm = 600,
    md = 920,
    bg = 1280,
    lg = 9999
  // debugger

  let width = (paramWidth || viewport().width)
  let isMedia

  // console.log('mediaSize ' + mediaSize)
  // console.log('width ' + width)

  switch (mediaSize) {
    case 'lt-sm':
      isMedia = (width < sm)
      break
    case 'sm':
      isMedia = (width >= sm && width < md)
      break
    case 'gt-sm':
      isMedia = (width > sm)
      break
    case 'lt-md':
      isMedia = (width < md)
      break
    case 'md':
      isMedia = (width >= md && width < bg)
      break
    case 'gt-md':
      isMedia = (width > md)
      break
    case 'lt-bg':
      isMedia = (width < bg)
      break
    case 'bg':
      isMedia = (width >= bg && width < lg)
      break
    case 'lt-lg':
      isMedia = (width < lg)
      break
    case 'lg':
      isMedia = (width >= lg)
      break
    case 'gt-lg':
      isMedia = (width > lg)
      break
  }
  // console.log('isMedia ' + isMedia)

  return isMedia
}

