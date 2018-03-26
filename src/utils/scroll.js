import { css } from './dom'

export function getScrollTarget (el) {
  return el.closest('.scroll') || window
}

export function getScrollHeight (el) {
  return (el === window ? document.body : el).scrollHeight
}

export function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}

export function animScrollTo (el, to, duration) {
  if (duration <= 0) {
    return
  }

  const pos = getScrollPosition(el)

  window.requestAnimationFrame(() => {
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

  let w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth

  if (w1 === w2) {
    w2 = outer.clientWidth
  }

  document.body.removeChild(outer)
  size = w1 - w2

  return size
}

const originalScrollStyle = {
  top: '',
  scrollTop: 0
}

let scrollHideRequests = 0

export function isScrollHidden () {
  return scrollHideRequests > 0
}

export function setBodyScroll (scrollable) {
  const body = document.body
  scrollHideRequests = Math.max(0, scrollHideRequests + (scrollable ? -1 : 1))
  if (scrollable) {
    if (!scrollHideRequests) {
      body.style.top = originalScrollStyle.top
      body.classList.remove('body-scroll-disabled')
      body.classList.remove('body-overflow-scroll')
      setScroll(window, originalScrollStyle.scrollTop)
    }
  }
  else if (scrollHideRequests === 1) {
    originalScrollStyle.top = body.style.top
    originalScrollStyle.scrollTop = getScrollPosition(window)

    if (body.scrollHeight > document.documentElement.clientHeight) {
      body.style.top = `-${originalScrollStyle.scrollTop}px`
      body.classList.add('body-overflow-scroll')
    }
    setTimeout(() => {
      if (scrollHideRequests) {
        body.classList.add('body-scroll-disabled')
      }
    }, 0)
  }
}
