import { client } from '../../plugins/platform/Platform.js'
import { listenOpts } from '../event/event.js'

/**
 * One capture-phase document listener tracks every scrolling container
 * at once — nested ones included, which per-container listeners could
 * never cover — and fans out to the subscribers (popups re-expressing
 * their frozen placement, QParallax recomputing its scroll percentage).
 * A subscriber that positions its own content filters out the scrolls
 * originating inside it (they never move it).
 */
const scrollSubscribers = new Set()

function onViewportMove(evt) {
  scrollSubscribers.forEach(fn => {
    fn(evt)
  })
}

function changeGlobalListeners(fnProp) {
  document[fnProp]('scroll', onViewportMove, listenOpts.passiveCapture)

  if (client.is.ios && window.visualViewport !== void 0) {
    // with the soft keyboard open (or while pinch-zoomed), iOS scrolls
    // only the visual viewport: no scroll event fires anywhere for those
    // steps, yet position:fixed popups stay pinned to the pre-scroll
    // viewport, so the subscribers must also run on visual viewport
    // moves to read a settled offsetTop/offsetLeft
    window.visualViewport[fnProp]('scroll', onViewportMove, listenOpts.passive)
    window.visualViewport[fnProp]('resize', onViewportMove, listenOpts.passive)
  }
}

export function addScrollTracking(fn) {
  if (scrollSubscribers.size === 0) {
    changeGlobalListeners('addEventListener')
  }

  scrollSubscribers.add(fn)
}

export function removeScrollTracking(fn) {
  if (scrollSubscribers.delete(fn) && scrollSubscribers.size === 0) {
    changeGlobalListeners('removeEventListener')
  }
}
