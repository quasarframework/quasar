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
  // captured at lock time (tests mock the platform per-test); the iOS
  // lock pins the body, every other platform's clips the viewport
  isIos = false,
  routePath,
  closeTimer = null

// The lock strategy leaks into other components; when changing it, re-check
// every consumer that assumes how the page behaves while locked:
// - QSelect onDialogFieldFocus: iOS-only window.scrollTo(x, 0), valid only
//   while the iOS lock pins the body at top (under the clip lock the same
//   call would wipe a scroll position that release never restores)
// - QDialog handleShow transitionEnd: iOS-only scrollingElement/
//   scrollIntoView writes, same pinned-body assumption
// - QLayout + QInfiniteScroll: suppress scroll work while
//   document.qScrollPrevented is set and re-sync through the release
//   listeners below
// - QDrawer: skips updateBelowBreakpoint on totalWidth changes while
//   locked (dormant under the clip lock since the reserved scrollbar
//   gutter keeps the width stable at lock time)

// notified when the lock releases WITHOUT emitting a scroll event -- the
// clipped page never lost its position, the route changed while locked (no
// scroll restore happens), or the saved position is the one the page
// already sits at (a pinned page sits at top, so a position saved at top
// restores as a no-op); consumers that suppress scroll work while locked
// (QLayout, QInfiniteScroll) re-sync through this since no scroll event
// will ever fire for them
const releaseListeners = new Set()

export function addPreventScrollReleaseListener(fn) {
  releaseListeners.add(fn)
}

export function removePreventScrollReleaseListener(fn) {
  releaseListeners.delete(fn)
}

function onAppleResize(evt) {
  if (vpPendingUpdate) return

  vpPendingUpdate = true

  requestAnimationFrame(() => {
    vpPendingUpdate = false

    const { height, scale } = evt.target

    // While zoomed, the visual viewport is never as tall as the layout one,
    // so the correction below would rewrite scrollTop on every event -- and
    // each write emits another one, so it never settles. iOS keeps the focused
    // element in view by itself while zoomed. The tolerance keeps the shrink
    // handling on devices that report a scale a hair off 1 when not zoomed.
    if (Math.abs(scale - 1) > 0.01) return

    const { clientHeight, scrollTop } = document.scrollingElement

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
  const body = document.body

  if (action === 'add') {
    scrollPositionX = getHorizontalScrollPosition(window)
    scrollPositionY = getVerticalScrollPosition(window)
    routePath = window.location.pathname
    isIos = client.is.ios

    const classList = ['q-document--prevent-scroll']

    if (isIos) {
      // iOS pans the page by touch whatever the viewport says, so the body
      // gets pinned in place instead; sticky content cannot survive that
      // (it ends up inside a fixed subtree), but nothing else holds there
      bodyLeft = body.style.left
      bodyTop = body.style.top
      body.style.left = `-${scrollPositionX}px`
      body.style.top = `-${scrollPositionY}px`
      classList.push('q-document--pin-body')
    } else {
      // clipping the viewport leaves the page in flow and at its scroll
      // position, so position: sticky content keeps sticking (#18183)
      classList.push('q-document--clip-scroll')

      // a classic scrollbar takes up layout space that the clipped viewport
      // stops painting, and the page would shift sideways into it; overlay
      // scrollbars take up none, so they need no gutter
      if (window.innerWidth - document.documentElement.clientWidth > 0) {
        classList.push('q-document--reserve-scrollbar')
      }
    }

    document.documentElement.classList.add(...classList)
    document.qScrollPrevented = true

    if (isIos) {
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
    }
  } else {
    // action === 'remove'

    if (isIos) {
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
    }

    document.documentElement.classList.remove(
      'q-document--prevent-scroll',
      'q-document--clip-scroll',
      'q-document--reserve-scrollbar',
      'q-document--pin-body'
    )

    document.qScrollPrevented = false

    if (isIos) {
      body.style.left = bodyLeft
      body.style.top = bodyTop
    }

    // only a pinned page has a position to scroll back to, and only when
    // the route path has not changed AND the page is not already at the
    // saved position (scrollTo emits nothing then); a clipped page kept
    // its position all along, and if the app moved it meanwhile that move
    // is not ours to undo. When no scroll event can fire, notify the
    // release listeners instead
    if (
      isIos &&
      window.location.pathname === routePath &&
      (getHorizontalScrollPosition(window) !== scrollPositionX ||
        getVerticalScrollPosition(window) !== scrollPositionY)
    ) {
      window.scrollTo(scrollPositionX, scrollPositionY)
    } else {
      releaseListeners.forEach(fn => {
        fn()
      })
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

    if (isIos && client.is.nativeMobile) {
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
