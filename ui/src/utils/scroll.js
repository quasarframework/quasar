import { isSSR } from '../plugins/Platform.js'
import { css, getElement } from './dom.js'

const scrollTargets = isSSR === true
  ? []
  : [ null, document, document.body, document.scrollingElement, document.documentElement ]

let rtlHasScrollBugStatus
export function rtlHasScrollBug () {
  if (isSSR === true) {
    return false
  }

  if (rtlHasScrollBugStatus === void 0) {
    const scroller = document.createElement('div')
    const spacer = document.createElement('div')

    Object.assign(scroller.style, {
      direction: 'rtl',
      width: '1px',
      height: '1px',
      overflow: 'auto'
    })

    Object.assign(spacer.style, {
      width: '1000px',
      height: '1px'
    })

    scroller.appendChild(spacer)
    document.body.appendChild(scroller)
    scroller.scrollLeft = -1000

    rtlHasScrollBugStatus = scroller.scrollLeft >= 0

    scroller.remove()
  }

  return rtlHasScrollBugStatus
}

export function getScrollTarget (el, targetEl) {
  let target = getElement(targetEl)

  if (target === null) {
    if (el !== Object(el) || typeof el.closest !== 'function') {
      return window
    }

    target = el.closest('.scroll,.scroll-y,.overflow-auto')
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

export function getVerticalScrollPosition (scrollTarget) {
  return scrollTarget === window
    ? window.pageYOffset || window.scrollY || document.body.scrollTop || 0
    : scrollTarget.scrollTop
}

export const getScrollPosition = getVerticalScrollPosition

export function getHorizontalScrollPosition (scrollTarget) {
  return scrollTarget === window
    ? window.pageXOffset || window.scrollX || document.body.scrollLeft || 0
    : scrollTarget.scrollLeft
}

export function animVerticalScrollTo (el, to, duration = 0 /* , prevTime */) {
  const prevTime = arguments[ 3 ] === void 0 ? performance.now() : arguments[ 3 ]
  const pos = getVerticalScrollPosition(el)

  if (duration <= 0) {
    if (pos !== to) {
      setScroll(el, to)
    }
    return
  }

  requestAnimationFrame(nowTime => {
    const frameTime = nowTime - prevTime
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime
    setScroll(el, newPos)
    if (newPos !== to) {
      animVerticalScrollTo(el, to, duration - frameTime, nowTime)
    }
  })
}

export const animScrollTo = animVerticalScrollTo

export function animHorizontalScrollTo (el, to, duration = 0 /* , prevTime */) {
  const prevTime = arguments[ 3 ] === void 0 ? performance.now() : arguments[ 3 ]
  const pos = getHorizontalScrollPosition(el)

  if (duration <= 0) {
    if (pos !== to) {
      setHorizontalScroll(el, to)
    }
    return
  }

  requestAnimationFrame(nowTime => {
    const frameTime = nowTime - prevTime
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime
    setHorizontalScroll(el, newPos)
    if (newPos !== to) {
      animHorizontalScrollTo(el, to, duration - frameTime, nowTime)
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

export function setVerticalScrollPosition (scrollTarget, offset, duration) {
  if (duration) {
    animVerticalScrollTo(scrollTarget, offset, duration)
    return
  }
  setScroll(scrollTarget, offset)
}

export const setScrollPosition = setVerticalScrollPosition

export function setHorizontalScrollPosition (scrollTarget, offset, duration) {
  if (duration) {
    animHorizontalScrollTo(scrollTarget, offset, duration)
    return
  }
  setHorizontalScroll(scrollTarget, offset)
}

let size
export function getScrollbarWidth () {
  if (size !== void 0) {
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
        [ 'auto', 'scroll' ].includes(window.getComputedStyle(el)['overflow-y'])
      )
    )
    : (
      el.scrollWidth > el.clientWidth && (
        el.classList.contains('scroll') ||
        el.classList.contains('overflow-auto') ||
        [ 'auto', 'scroll' ].includes(window.getComputedStyle(el)['overflow-x'])
      )
    )
}

export default {
  getScrollTarget,

  getScrollHeight,
  getScrollWidth,

  getScrollPosition,
  getVerticalScrollPosition,
  getHorizontalScrollPosition,
  rtlHasScrollBug,

  animScrollTo,
  animVerticalScrollTo,
  animHorizontalScrollTo,

  setScrollPosition,
  setVerticalScrollPosition,
  setHorizontalScrollPosition,

  getScrollbarWidth,
  hasScrollbar
}
