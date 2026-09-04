import { nextTick } from 'vue'

import { client } from '../../../plugins/platform/Platform.js'
import {
  addDetachedFullscreenListener,
  removeDetachedFullscreenListener
} from '../../../utils/private.focus/detached-fullscreen.js'
import {
  addScrollTracking,
  removeScrollTracking
} from '../../../utils/private.scroll-tracking/scroll-tracking.js'
import {
  applyBoundary,
  applyPointBoundary,
  pointOffset,
  restoreScroll
} from './core.js'

/**
 * The JS positioning engine: expresses a placement decided by the
 * shared boundary pass (core.js) through pixel insets, written from
 * the edge the self origin anchors (top or bottom, left or right) like
 * the native engine's anchor() insets, so content that grows between
 * two passes grows away from the anchor line instead of over it; a
 * centered self origin straddles its line through a -50% translate
 * (anchor-center / translate natively).
 * A written position is only valid for the moment it was
 * computed, so its callers re-express the SAME frozen placement
 * (applyPosition) on every scroll step (private.scroll-tracking) and
 * on anchor motion (trackAnchorMotion) — the popup stays glued to its
 * anchor and scrolls off-screen with it, exactly like the native
 * engine's; only viewport/placement-prop changes re-open the decision.
 *
 * Serves every browser outside core.js' supportsCssAnchor()
 * gate; the ones inside it run anchor-engine.js instead.
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
  if (client.is.ios) {
    // uses the q-position-engine CSS class; no visualViewport (an
    // iOS-simulating test environment) degrades to the CSS vars'
    // built-in 0 defaults

    const bodyStyle = document.body.style
    const { offsetLeft: left = 0, offsetTop: top = 0 } =
      window.visualViewport ?? {}

    if (left !== vpLeft) {
      bodyStyle.setProperty('--q-pe-left', left + 'px')
      vpLeft = left
    }
    if (top !== vpTop) {
      bodyStyle.setProperty('--q-pe-top', top + 'px')
      vpTop = top
    }
  }

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
  let lineY, lineX

  if (point !== void 0) {
    lineY = rect.top + point.top + pointOffset(selfOrigin.vertical, oy)
    lineX = rect.left + point.left + pointOffset(selfOrigin.horizontal, ox)
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

    lineY = A[anchorOrigin.vertical]
    lineX = A[anchorOrigin.horizontal]
  }

  // one inset per axis, from the edge the self origin anchors; the
  // other edge is cleared so a re-decided origin never leaves both set
  const pos = { top: '', bottom: '', left: '', right: '' }
  let tx = '0',
    ty = '0'

  if (selfOrigin.vertical === 'center') {
    if (point === void 0 && anchorOrigin.vertical === 'center') {
      const top = lineY - height / 2

      shift.top =
        centerShift !== null
          ? centerShift.top
          : Math.max(0, Math.min(top, VH - height)) - top
    }

    pos.top = lineY + shift.top + 'px'
    ty = '-50%'
  } else if (selfOrigin.vertical === 'bottom') {
    pos.bottom = VH - lineY + 'px'
  } else {
    pos.top = lineY + 'px'
  }

  if (selfOrigin.horizontal === 'middle') {
    if (point === void 0 && anchorOrigin.horizontal === 'middle') {
      const left = lineX - width / 2

      shift.left =
        centerShift !== null
          ? centerShift.left
          : Math.max(0, Math.min(left, VW - width)) - left
    }

    pos.left = lineX + shift.left + 'px'
    tx = '-50%'
  } else if (selfOrigin.horizontal === 'right') {
    pos.right = VW - lineX + 'px'
  } else {
    pos.left = lineX + 'px'
  }

  pos.translate = tx === '0' && ty === '0' ? '' : `${tx} ${ty}`
  Object.assign(el.style, pos)

  return shift
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

/**
 * The JS fallback: pixel insets, re-expressed on every scroll step
 * and anchor move; the placement decision itself has the same
 * lifecycle as the native engine's.
 */
export function useFallbackEngine(
  props,
  { anchorEl, innerRef, showing, anchorOrigin, selfOrigin, trackContent }
) {
  let observer,
    stopAnchorTracking,
    // set while the popup is anchored to a coordinate (touch position /
    // context menu / cursor position) instead of the anchor's box:
    // { top, left } relative to the anchor's top-left corner
    anchorPoint = null,
    // overflow correction for point mode (mirror/shift), decided on
    // first paint; like `boundary`, re-derived from the intended
    // placement on every pass
    pointBoundary = null,
    // overflow correction for box mode (flip/cap), decided on first
    // paint; the popup stays invisible until the first pass ran
    boundary = null,
    // the anchor-center viewport shift, frozen at decision time like
    // the native engine freezes it at layout time
    centerShift = null,
    retries = 0

  // re-expresses the frozen placement against the anchor's current
  // rect: cheap enough to run on every scroll step and anchor move
  const track = () => {
    if (innerRef.value === null || anchorEl.value === null) return

    const b = anchorPoint === null ? boundary : null
    const p = anchorPoint !== null ? pointBoundary : null

    centerShift = applyPosition({
      targetEl: innerRef.value,
      anchorEl: anchorEl.value,
      anchorOrigin: b !== null ? b.anchorOrigin : anchorOrigin.value,
      selfOrigin:
        p !== null
          ? p.selfOrigin
          : b !== null
            ? b.selfOrigin
            : selfOrigin.value,
      offset: props.offset,
      point: p !== null ? p.point : (anchorPoint ?? void 0),
      fit: props.fit,
      cover: props.cover,
      maxHeight: props.maxHeight,
      maxWidth: props.maxWidth,
      capHeight: b !== null ? b.maxHeight : null,
      capWidth: b !== null ? b.maxWidth : null,
      centerShift
    })
  }

  const updatePosition = () => {
    const el = innerRef.value
    if (el === null || anchorEl.value === null) return

    // some browsers report zero size when measuring too early
    if (el.offsetWidth === 0 || el.offsetHeight === 0) {
      if (retries < 5) {
        retries++
        setTimeout(updatePosition, 10)
      }
      return
    }
    retries = 0

    // a first pass at the intended placement also applies the fit/cover
    // min sizes the decision measures with; both passes run with the
    // caps lifted, which clamps the scroll offset of content that fits
    // meanwhile (#18534)
    const { scrollTop, scrollLeft } = el

    if (anchorPoint === null) {
      boundary = null
      centerShift = null
      track()
      boundary = applyBoundary({
        el,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        offset: props.offset,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      })
    } else {
      pointBoundary = null
      centerShift = null
      track()
      pointBoundary = applyPointBoundary({
        el,
        anchorEl: anchorEl.value,
        point: anchorPoint,
        selfOrigin: selfOrigin.value,
        offset: props.offset
      })
    }

    // the pass the frozen placement (boundary verdict + anchor-center
    // shift) is taken from
    centerShift = null
    track()

    restoreScroll(el, scrollTop, scrollLeft)
  }

  const onScroll = evt => {
    // a scroll inside the popup itself never moves its anchor; the iOS
    // visual viewport events carry a non-node target
    if (
      innerRef.value !== null &&
      (!(evt.target instanceof Node) || !innerRef.value.contains(evt.target))
    ) {
      track()
    }
  }

  const onDetachedFullscreenChange = () => {
    // useFullscreen() moved a subtree to <body> (or moved it back); if
    // the anchor traveled with it, the position written at show time is
    // stale (#18513) and no scroll event announces the move. The
    // notification fires before the DOM settles (enter: before the
    // fullscreen styles apply; exit: before the element is restored),
    // so re-express the placement only after the move and the re-render
    // are done. The native engine keeps tracking the anchor wherever it
    // travels.
    nextTick(() => {
      requestAnimationFrame(() => {
        if (
          showing.value &&
          anchorEl.value !== null &&
          anchorEl.value.isConnected
        ) {
          track()
        }
      })
    })
  }

  return {
    positionStyle: { value: '' },

    track,
    updatePosition,
    setAnchorPoint(point) {
      anchorPoint = point
      pointBoundary = null
    },
    handleShow() {
      anchorPoint = null
      pointBoundary = null
      boundary = null
      centerShift = null
      retries = 0

      addDetachedFullscreenListener(onDetachedFullscreenChange)
      addScrollTracking(onScroll)
    },
    handleTick() {
      if (trackContent) {
        observer?.disconnect()
        observer = void 0

        if (innerRef.value !== null) {
          // content changes re-express the placement (the native engine
          // gets this through its live anchor()/translate expressions)
          observer = new MutationObserver(track)
          observer.observe(innerRef.value, {
            attributes: false,
            childList: true,
            characterData: true,
            subtree: true
          })
        }
      }

      updatePosition()

      // the anchor itself may still be animating when the popup opens
      // (a push QBtn springing back from :active after the click that
      // opened it, focus/hover styles moving it, an entering parent),
      // so follow it while the enter transition plays out; otherwise a
      // transition-end re-expression lands as a visible snap, and a
      // popup without one stays permanently offset
      stopAnchorTracking = trackAnchorMotion(
        () => anchorEl.value,
        track,
        props.transitionDuration
      )
    },
    releaseAnchor(hidingInProgress) {
      if (observer !== void 0) {
        observer.disconnect()
        observer = void 0
      }

      if (stopAnchorTracking !== void 0) {
        stopAnchorTracking()
        stopAnchorTracking = void 0
      }

      removeDetachedFullscreenListener(onDetachedFullscreenChange)

      // hidingInProgress keeps the scroll tracking until the leave
      // transition is done (the popup would lose its position
      // mid-animation), like the native engine holds its anchor name
      if (!hidingInProgress) {
        removeScrollTracking(onScroll)
        anchorPoint = null
        pointBoundary = null
        boundary = null
        centerShift = null
      }
    }
  }
}
