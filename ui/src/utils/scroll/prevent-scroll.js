import {
  getHorizontalScrollPosition,
  getVerticalScrollPosition
} from './scroll.js'
import { listenOpts } from '../event/event.js'
import { client } from '../../plugins/platform/Platform.js'

let registered = 0,
  scrollPositionX,
  scrollPositionY,
  maxScrollTop,
  vpPendingUpdate = false,
  bodyLeft,
  bodyTop,
  href,
  closeTimer = null

function onAppleScroll(e) {
  if (e.target === document) {
    // required, otherwise iOS blocks further scrolling
    // until the mobile scrollbar dissappears
    document.scrollingElement.scrollTop = document.scrollingElement.scrollTop // oxlint-disable-line
  }
}

function onAppleResize(evt) {
  if (vpPendingUpdate) return

  vpPendingUpdate = true

  requestAnimationFrame(() => {
    vpPendingUpdate = false

    const { height } = evt.target,
      { clientHeight, scrollTop } = document.scrollingElement

    if (maxScrollTop === void 0 || height !== window.innerHeight) {
      maxScrollTop = clientHeight - height
      document.scrollingElement.scrollTop = scrollTop
    }

    if (scrollTop > maxScrollTop) {
      document.scrollingElement.scrollTop -= Math.ceil(
        (scrollTop - maxScrollTop) / 8
      )
    }
  })
}

function apply(action) {
  const body = document.body,
    hasViewport = window.visualViewport !== void 0

  if (action === 'add') {
    const { overflowY, overflowX } = window.getComputedStyle(body)

    scrollPositionX = getHorizontalScrollPosition(window)
    scrollPositionY = getVerticalScrollPosition(window)
    bodyLeft = body.style.left
    bodyTop = body.style.top

    href = window.location.href

    body.style.left = `-${scrollPositionX}px`
    body.style.top = `-${scrollPositionY}px`

    if (
      overflowX !== 'hidden' &&
      (overflowX === 'scroll' || body.scrollWidth > window.innerWidth)
    ) {
      body.classList.add('q-body--force-scrollbar-x')
    }
    if (
      overflowY !== 'hidden' &&
      (overflowY === 'scroll' || body.scrollHeight > window.innerHeight)
    ) {
      body.classList.add('q-body--force-scrollbar-y')
    }

    document.documentElement.classList.add('q-document--prevent-scroll')
    document.qScrollPrevented = true

    if (client.is.ios) {
      if (hasViewport) {
        window.scrollTo(0, 0)
        window.visualViewport.addEventListener(
          'resize',
          onAppleResize,
          listenOpts.passiveCapture
        )
        window.visualViewport.addEventListener(
          'scroll',
          onAppleResize,
          listenOpts.passiveCapture
        )
        window.scrollTo(0, 0)
      } else {
        window.addEventListener(
          'scroll',
          onAppleScroll,
          listenOpts.passiveCapture
        )
      }
    }
  } else {
    // action === 'remove'

    if (client.is.ios) {
      if (hasViewport) {
        window.visualViewport.removeEventListener(
          'resize',
          onAppleResize,
          listenOpts.passiveCapture
        )
        window.visualViewport.removeEventListener(
          'scroll',
          onAppleResize,
          listenOpts.passiveCapture
        )
      } else {
        window.removeEventListener(
          'scroll',
          onAppleScroll,
          listenOpts.passiveCapture
        )
      }
    }

    document.documentElement.classList.remove('q-document--prevent-scroll')
    body.classList.remove(
      'q-body--force-scrollbar-x',
      'q-body--force-scrollbar-y'
    )

    document.qScrollPrevented = false

    body.style.left = bodyLeft
    body.style.top = bodyTop

    // scroll back only if route has not changed
    if (window.location.href === href) {
      window.scrollTo(scrollPositionX, scrollPositionY)
    }

    maxScrollTop = void 0
  }
}

export default function preventScroll(state) {
  let action = 'add'

  if (state === true) {
    registered++

    if (closeTimer !== null) {
      clearTimeout(closeTimer)
      closeTimer = null
      return
    }

    if (registered > 1) return
  } else {
    if (registered === 0) return

    registered--

    if (registered > 0) return

    action = 'remove'

    if (client.is.ios && client.is.nativeMobile) {
      if (closeTimer !== null) clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        apply(action)
        closeTimer = null
      }, 100)
      return
    }
  }

  apply(action)
}
