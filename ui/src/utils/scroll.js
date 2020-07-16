import { isSSR } from '../plugins/Platform.js'
import { css } from './dom.js'

const scrollTargets = isSSR === false
  ? [ null, document, document.body, document.scrollingElement, document.documentElement ]
  : []

export function getScrollTarget (el, target) {
  if (typeof target === 'string') {
    try {
      target = document.querySelector(target)
    }
    catch (err) {
      target = void 0
    }
  }

  if (target === void 0 || target === null) {
    target = el.closest('.scroll,.scroll-y,.overflow-auto')
  }
  else if (target._isVue === true && target.$el !== void 0) {
    target = target.$el
  }

  return scrollTargets.includes(target)
    ? window
    : target
}

export function getScrollHeight (el) {
  return (el === window ? document.body : el).scrollHeight
}

export function getScrollWidth (el) {
  return (el === window ? document.body : el).scrollWidth
}

export function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}

export function getHorizontalScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageXOffset || window.scrollX || document.body.scrollLeft || 0
  }
  return scrollTarget.scrollLeft
}

export function animScrollTo (el, to, duration = 0) {
  const pos = getScrollPosition(el)

  if (duration <= 0) {
    if (pos !== to) {
      setScroll(el, to)
    }
    return
  }

  requestAnimationFrame(() => {
    const newPos = pos + (to - pos) / Math.max(16, duration) * 16
    setScroll(el, newPos)
    if (newPos !== to) {
      animScrollTo(el, to, duration - 16)
    }
  })
}

export function animHorizontalScrollTo (el, to, duration = 0) {
  const pos = getHorizontalScrollPosition(el)

  if (duration <= 0) {
    if (pos !== to) {
      setHorizontalScroll(el, to)
    }
    return
  }

  requestAnimationFrame(() => {
    const newPos = pos + (to - pos) / Math.max(16, duration) * 16
    setHorizontalScroll(el, newPos)
    if (newPos !== to) {
      animHorizontalScrollTo(el, to, duration - 16)
    }
  })
}

function setScroll (scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, offset)
    return
  }
  scrollTarget.scrollTop = offset
}

function setHorizontalScroll (scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(offset, window.pageYOffset || window.scrollY || document.body.scrollTop || 0)
    return
  }
  scrollTarget.scrollLeft = offset
}

export function setScrollPosition (scrollTarget, offset, duration) {
  if (duration) {
    animScrollTo(scrollTarget, offset, duration)
    return
  }
  setScroll(scrollTarget, offset)
}

export function setHorizontalScrollPosition (scrollTarget, offset, duration) {
  if (duration) {
    animHorizontalScrollTo(scrollTarget, offset, duration)
    return
  }
  setHorizontalScroll(scrollTarget, offset)
}

let size
export function getScrollbarWidth () {
  if (size !== undefined) {
    return size
  }

  const
    inner = document.createElement('p'),
    outer = document.createElement('div')

  css(inner, {
    width: '100%',
    height: '200px'
  })
  css(outer, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  })

  outer.appendChild(inner)

  document.body.appendChild(outer)

  const w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth

  if (w1 === w2) {
    w2 = outer.clientWidth
  }

  outer.remove()
  size = w1 - w2

  return size
}

export function hasScrollbar (el, onY = true) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  return onY
    ? (
      el.scrollHeight > el.clientHeight && (
        el.classList.contains('scroll') ||
        el.classList.contains('overflow-auto') ||
        ['auto', 'scroll'].includes(window.getComputedStyle(el)['overflow-y'])
      )
    )
    : (
      el.scrollWidth > el.clientWidth && (
        el.classList.contains('scroll') ||
        el.classList.contains('overflow-auto') ||
        ['auto', 'scroll'].includes(window.getComputedStyle(el)['overflow-x'])
      )
    )
}

export default {
  getScrollTarget,

  getScrollHeight,
  getScrollWidth,

  getScrollPosition,
  getHorizontalScrollPosition,

  animScrollTo,
  animHorizontalScrollTo,

  setScrollPosition,
  setHorizontalScrollPosition,

  getScrollbarWidth,
  hasScrollbar
}
