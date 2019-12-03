import { getEventPath, listenOpts, stopAndPrevent } from '../utils/event.js'
import { hasScrollbar, getScrollPosition, getHorizontalScrollPosition } from '../utils/scroll.js'

let
  registered = 0,
  scrollPositionX,
  scrollPositionY,
  bodyLeft,
  bodyTop,
  closeTimer

function onWheel (e) {
  if (shouldPreventScroll(e)) {
    stopAndPrevent(e)
  }
}

function shouldPreventScroll (e) {
  if (e.target === document.body || e.target.classList.contains('q-layout__backdrop')) {
    return true
  }

  const
    path = getEventPath(e),
    shift = e.shiftKey && !e.deltaX,
    scrollY = !shift && Math.abs(e.deltaX) <= Math.abs(e.deltaY),
    delta = shift || scrollY ? e.deltaY : e.deltaX

  for (let index = 0; index < path.length; index++) {
    const el = path[index]

    if (hasScrollbar(el, scrollY)) {
      return scrollY
        ? (
          delta < 0 && el.scrollTop === 0
            ? true
            : delta > 0 && el.scrollTop + el.clientHeight === el.scrollHeight
        )
        : (
          delta < 0 && el.scrollLeft === 0
            ? true
            : delta > 0 && el.scrollLeft + el.clientWidth === el.scrollWidth
        )
    }
  }

  return true
}

function onAppleScroll (e) {
  if (e.target === document) {
    // required, otherwise iOS blocks further scrolling
    // until the mobile scrollbar dissapears
    document.scrollingElement.scrollTop = document.scrollingElement.scrollTop // eslint-disable-line
  }
}

function apply (action, is) {
  const body = document.body

  if (action === 'add') {
    const overflowY = window.getComputedStyle(body).overflowY

    scrollPositionX = getHorizontalScrollPosition(window)
    scrollPositionY = getScrollPosition(window)
    bodyLeft = body.style.left
    bodyTop = body.style.top

    body.style.left = `-${scrollPositionX}px`
    body.style.top = `-${scrollPositionY}px`
    if (overflowY !== 'hidden' && (overflowY === 'scroll' || body.scrollHeight > window.innerHeight)) {
      body.classList.add('q-body--force-scrollbar')
    }

    body.classList.add('q-body--prevent-scroll')
    if (is.ios === true) {
      const target = window.visualViewport !== void 0 && window.visualViewport.onscroll !== void 0
        ? window.visualViewport
        : window
      target.addEventListener('scroll', onAppleScroll, listenOpts.passiveCapture)
    }
  }

  if (is.desktop === true && is.mac === true) {
    // ref. https://developers.google.com/web/updates/2017/01/scrolling-intervention
    window[`${action}EventListener`]('wheel', onWheel, listenOpts.notPassive)
  }

  if (action === 'remove') {
    if (is.ios === true) {
      const target = window.visualViewport !== void 0 && window.visualViewport.onscroll !== void 0
        ? window.visualViewport
        : window
      target.removeEventListener('scroll', onAppleScroll, listenOpts.passiveCapture)
    }

    body.classList.remove('q-body--prevent-scroll')
    body.classList.remove('q-body--force-scrollbar')

    body.style.left = bodyLeft
    body.style.top = bodyTop

    window.scrollTo(scrollPositionX, scrollPositionY)
  }
}

export function preventScroll (state, is) {
  let action = 'add'

  if (state === true) {
    registered++

    if (closeTimer !== void 0) {
      clearTimeout(closeTimer)
      closeTimer = void 0
      return
    }

    if (registered > 1) {
      return
    }
  }
  else {
    if (registered === 0) {
      return
    }

    registered--

    if (registered > 0) {
      return
    }

    action = 'remove'

    if (is.ios === true && is.nativeMobile === true) {
      clearTimeout(closeTimer)

      closeTimer = setTimeout(() => {
        apply(action, is)
        closeTimer = void 0
      }, 100)
      return
    }
  }

  apply(action, is)
}

export default {
  methods: {
    __preventScroll (state) {
      if (
        state !== this.preventedScroll &&
        (this.preventedScroll !== void 0 || state === true)
      ) {
        this.preventedScroll = state
        preventScroll(state, this.$q.platform.is)
      }
    }
  }
}
