import { client } from '../../plugins/platform/Platform.js'
import { listenOpts } from '../event/event.js'

/**
 * The JS positioning engine: expresses a placement decided by the
 * shared boundary pass (position-engine.js) through pixel top/left
 * styles. A written position is only valid for the moment it was
 * computed, so its callers re-express the SAME frozen placement
 * (applyPosition) on every scroll step (addScrollTracking) and on
 * anchor motion (trackAnchorMotion) — the popup stays glued to its
 * anchor and scrolls off-screen with it, exactly like the native
 * engine's; only viewport/placement-prop changes re-open the decision.
 *
 * Serves every browser outside position-engine.js' supportsCssAnchor()
 * gate; the ones inside it run anchor-position-engine.js instead.
 */

let vpLeft, vpTop

/**
 * Writes the pixel styles for one placement pass. anchorOrigin/
 * selfOrigin arrive decision-resolved (post applyBoundary /
 * applyPointBoundary) and capHeight/capWidth carry the decision's size
 * caps; maxHeight/maxWidth stay the raw props, which alone bound the
 * fit/cover minimum sizes (mirroring the native engine, where the
 * min() expressions are built from the props while the caps overwrite
 * only the max sizes).
 *
 * A centered popup on a centered anchor line (anchor-center on the
 * native engine) shifts to stay inside the viewport, but the browser
 * computes that shift at LAYOUT time only: scrolling merely translates
 * the popup 1:1 with its anchor afterwards. Mirrored here through
 * `centerShift`: a decision pass (null) computes and returns the
 * shift, a tracking pass re-applies the frozen one it is handed.
 *
 * `point` positions relative to a coordinate inside the anchor (touch
 * position / context menu) instead of the anchor's box.
 */
export function applyPosition({
  targetEl: el,
  anchorEl,
  anchorOrigin,
  selfOrigin,
  offset,
  point,
  fit,
  cover,
  maxHeight,
  maxWidth,
  capHeight,
  capWidth,
  centerShift = null
}) {
  if (client.is.ios && window.visualViewport !== void 0) {
    // uses the q-position-engine CSS class

    const bodyStyle = document.body.style
    const { offsetLeft: left, offsetTop: top } = window.visualViewport

    if (left !== vpLeft) {
      bodyStyle.setProperty('--q-pe-left', left + 'px')
      vpLeft = left
    }
    if (top !== vpTop) {
      bodyStyle.setProperty('--q-pe-top', top + 'px')
      vpTop = top
    }
  }

  // the popup's own scroll position might reset if its max size
  // changes; restore it after the writes
  const { scrollLeft, scrollTop } = el

  const rect = anchorEl.getBoundingClientRect()
  const useOffset = offset !== void 0 && cover !== true
  const ox = useOffset ? offset[0] : 0
  const oy = useOffset ? offset[1] : 0

  const style = {
    // is removed on this first positioning (q-position-engine CSS class)
    visibility: 'visible',
    maxHeight: capHeight ?? maxHeight,
    maxWidth: capWidth ?? maxWidth,
    minWidth: null,
    minHeight: null
  }

  if (fit === true || cover === true) {
    style.minWidth = maxWidth
      ? `min(${rect.width}px, ${maxWidth})`
      : rect.width + 'px'

    if (cover === true) {
      style.minHeight = maxHeight
        ? `min(${rect.height}px, ${maxHeight})`
        : rect.height + 'px'
    }
  }

  Object.assign(el.style, style)

  const { offsetWidth: width, offsetHeight: height } = el
  const { clientWidth: VW, clientHeight: VH } = document.documentElement
  const shift = { top: 0, left: 0 }
  let top, left

  if (point !== void 0) {
    const lineY = rect.top + point.top + oy
    const lineX = rect.left + point.left + ox

    top =
      selfOrigin.vertical === 'bottom'
        ? lineY - height
        : selfOrigin.vertical === 'center'
          ? lineY - height / 2
          : lineY
    left =
      selfOrigin.horizontal === 'right'
        ? lineX - width
        : selfOrigin.horizontal === 'middle'
          ? lineX - width / 2
          : lineX
  } else {
    // the offset-expanded anchor box, same as the decision pass'
    const A = {
      top: rect.top - oy,
      bottom: rect.bottom + oy,
      center: rect.top + (rect.bottom - rect.top) / 2,
      left: rect.left - ox,
      right: rect.right + ox,
      middle: rect.left + (rect.right - rect.left) / 2
    }

    const lineY = A[anchorOrigin.vertical]

    if (selfOrigin.vertical === 'center') {
      top = lineY - height / 2

      if (anchorOrigin.vertical === 'center') {
        shift.top =
          centerShift !== null
            ? centerShift.top
            : Math.max(0, Math.min(top, VH - height)) - top
        top += shift.top
      }
    } else {
      top = lineY - (selfOrigin.vertical === 'bottom' ? height : 0)
    }

    const lineX = A[anchorOrigin.horizontal]

    if (selfOrigin.horizontal === 'middle') {
      left = lineX - width / 2

      if (anchorOrigin.horizontal === 'middle') {
        shift.left =
          centerShift !== null
            ? centerShift.left
            : Math.max(0, Math.min(left, VW - width)) - left
        left += shift.left
      }
    } else {
      left = lineX - (selfOrigin.horizontal === 'right' ? width : 0)
    }
  }

  el.style.top = top + 'px'
  el.style.left = left + 'px'

  if (el.scrollTop !== scrollTop) {
    el.scrollTop = scrollTop
  }
  if (el.scrollLeft !== scrollLeft) {
    el.scrollLeft = scrollLeft
  }

  return shift
}

/**
 * One capture-phase document listener tracks every scrolling container
 * at once — nested ones included, which per-container listeners could
 * never cover — and fans out to the shown popups. Each subscriber
 * filters out scrolls originating inside its own popup (they never move
 * its anchor) and re-expresses its frozen placement for the rest.
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

/**
 * Follows an anchor that is still moving while its popup opens — e.g. a
 * push QBtn springing back from its :active translateY, released by the
 * very click that opens the menu. The popup only measures the anchor at
 * show time and again when the enter transition ends, so a rect that
 * settles in between would land as a visible position snap at the end
 * of the transition (and QTooltip has no end-of-transition re-measure
 * at all).
 *
 * Re-measures the anchor every animation frame for the given duration
 * and invokes onMove only on frames where the rect actually changed;
 * idle frames cost a single clean-layout getBoundingClientRect() read.
 * Stops itself if the anchor goes away. Returns a stop function.
 */
export function trackAnchorMotion(getAnchorEl, onMove, duration) {
  const stopTime = performance.now() + Number(duration)

  let el = getAnchorEl()
  let prevRect = el === null ? null : el.getBoundingClientRect()
  let rafId = requestAnimationFrame(function step() {
    rafId = null
    el = getAnchorEl()

    if (el === null || !el.isConnected) return

    const rect = el.getBoundingClientRect()

    if (
      prevRect !== null &&
      (rect.top !== prevRect.top ||
        rect.left !== prevRect.left ||
        rect.width !== prevRect.width ||
        rect.height !== prevRect.height)
    ) {
      onMove()
    }

    prevRect = rect

    if (performance.now() < stopTime) {
      rafId = requestAnimationFrame(step)
    }
  })

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
}
