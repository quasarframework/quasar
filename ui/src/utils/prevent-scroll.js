import { getEventPath, listenOpts, stopAndPrevent } from '../utils/event.js'
import { hasScrollbar, getVerticalScrollPosition, getHorizontalScrollPosition } from '../utils/scroll.js'
import { client } from '../plugins/Platform.js'

let
  registered = 0,
  scrollPositionX,
  scrollPositionY,
  maxScrollTop,
  vpPendingUpdate = false,
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
    const el = path[ index ]

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
    // until the mobile scrollbar dissappears
    document.scrollingElement.scrollTop = document.scrollingElement.scrollTop // eslint-disable-line
  }
}

function onAppleResize (evt) {
  if (vpPendingUpdate === true) {
    return
  }

  vpPendingUpdate = true

  requestAnimationFrame(() => {
    vpPendingUpdate = false

    const
      { height } = evt.target,
      { clientHeight, scrollTop } = document.scrollingElement

    if (maxScrollTop === void 0 || height !== window.innerHeight) {
      maxScrollTop = clientHeight - height
      document.scrollingElement.scrollTop = scrollTop
    }

    if (scrollTop > maxScrollTop) {
      document.scrollingElement.scrollTop -= Math.ceil((scrollTop - maxScrollTop) / 8)
    }
  })
}

function apply (action) {
  const
    body = document.body,
    hasViewport = window.visualViewport !== void 0

  if (action === 'add') {
    const { overflowY, overflowX } = window.getComputedStyle(body)

    scrollPositionX = getHorizontalScrollPosition(window)
    scrollPositionY = getVerticalScrollPosition(window)
    bodyLeft = body.style.left
    bodyTop = body.style.top

    body.style.left = `-${ scrollPositionX }px`
    body.style.top = `-${ scrollPositionY }px`

    if (overflowX !== 'hidden' && (overflowX === 'scroll' || body.scrollWidth > window.innerWidth)) {
      body.classList.add('q-body--force-scrollbar-x')
    }
    if (overflowY !== 'hidden' && (overflowY === 'scroll' || body.scrollHeight > window.innerHeight)) {
      body.classList.add('q-body--force-scrollbar-y')
    }

    body.classList.add('q-body--prevent-scroll')
    document.qScrollPrevented = true
    if (client.is.ios === true) {
      if (hasViewport === true) {
        window.scrollTo(0, 0)
        window.visualViewport.addEventListener('resize', onAppleResize, listenOpts.passiveCapture)
        window.visualViewport.addEventListener('scroll', onAppleResize, listenOpts.passiveCapture)
        window.scrollTo(0, 0)
      }
      else {
        window.addEventListener('scroll', onAppleScroll, listenOpts.passiveCapture)
      }
    }
  }

  if (client.is.desktop === true && client.is.mac === true) {
    // ref. https://developers.google.com/web/updates/2017/01/scrolling-intervention
    window[ `${ action }EventListener` ]('wheel', onWheel, listenOpts.notPassive)
  }

  if (action === 'remove') {
    if (client.is.ios === true) {
      if (hasViewport === true) {
        window.visualViewport.removeEventListener('resize', onAppleResize, listenOpts.passiveCapture)
        window.visualViewport.removeEventListener('scroll', onAppleResize, listenOpts.passiveCapture)
      }
      else {
        window.removeEventListener('scroll', onAppleScroll, listenOpts.passiveCapture)
      }
    }

    body.classList.remove('q-body--prevent-scroll')
    body.classList.remove('q-body--force-scrollbar-x')
    body.classList.remove('q-body--force-scrollbar-y')

    document.qScrollPrevented = false

    body.style.left = bodyLeft
    body.style.top = bodyTop

    window.scrollTo(scrollPositionX, scrollPositionY)
    maxScrollTop = void 0
  }
}

export default function (state) {
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

    if (client.is.ios === true && client.is.nativeMobile === true) {
      clearTimeout(closeTimer)

      closeTimer = setTimeout(() => {
        apply(action)
        closeTimer = void 0
      }, 100)
      return
    }
  }

  apply(action)
}
