const partsFirst = ['top', 'center', 'bottom'],
  partsSecond = ['left', 'middle', 'right', 'start', 'end']

/**
 * Decides which of the two positioning engines drives a popup:
 * anchor-engine.js (native CSS anchor positioning, zero
 * listeners) where this returns true, fallback-engine.js
 * (measure + pixel top/left, scroll listeners) everywhere else.
 *
 * The native path is deliberately gated to Chromium engines (identified
 * through the Chromium-only userAgentData API): it is the only family
 * where the anchor engine was validated, while the fresh Gecko/WebKit
 * implementations (Baseline newly available 2026) stay on the battle
 * tested JS engine, like every browser without the feature.
 *
 * A function instead of a module-level constant on purpose: it is the
 * seam the component tests re-mock to force the fallback engine per
 * test (a mocked constant gets flattened to its initial value).
 */
let cssAnchorSupport = null

export function supportsCssAnchor() {
  if (cssAnchorSupport === null) {
    cssAnchorSupport =
      __QUASAR_SSR_SERVER__ ||
      (typeof CSS !== 'undefined' &&
        navigator.userAgentData?.brands?.some(
          entry => entry.brand === 'Chromium'
        ) === true &&
        CSS.supports('position-anchor: --q') &&
        CSS.supports('justify-self: anchor-center'))
  }

  return cssAnchorSupport
}

export function validatePosition(pos) {
  const parts = pos.split(' ')
  if (parts.length !== 2) return false

  if (!partsFirst.includes(parts[0])) {
    console.error(
      'Anchor/Self position must start with one of top/center/bottom'
    )
    return false
  }
  if (!partsSecond.includes(parts[1])) {
    console.error(
      'Anchor/Self position must end with one of left/middle/right/start/end'
    )
    return false
  }

  return true
}

export function validateOffset(val) {
  if (!val) return true
  if (val.length !== 2) return false
  if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
    return false
  }

  return true
}

const horizontalPos = {
  'start#ltr': 'left',
  'start#rtl': 'right',
  'end#ltr': 'right',
  'end#rtl': 'left'
}

;['left', 'middle', 'right'].forEach(pos => {
  horizontalPos[`${pos}#ltr`] = pos
  horizontalPos[`${pos}#rtl`] = pos
})

// bounded keyspace (validated positions x ltr/rtl) of shared, read-only
// origin objects — the engines never mutate them
const positionCache = new Map()

export function parsePosition(pos, rtl) {
  const key = `${pos}#${rtl ? 'rtl' : 'ltr'}`
  let res = positionCache.get(key)

  if (res === void 0) {
    const parts = pos.split(' ')
    res = {
      vertical: parts[0],
      horizontal: horizontalPos[`${parts[1]}#${rtl ? 'rtl' : 'ltr'}`]
    }
    positionCache.set(key, res)
  }

  return res
}

/**
 * The placement decision both engines share: whether the intended
 * placement fits the viewport, measured once per show (and on demand
 * through updatePosition()). A placement that overflows gets its
 * origins mirrored towards the roomier side — the anchor's expanded box
 * edges swap sides — unless the intended side has at least as much room
 * (the room is measured from the anchor line each placement would use,
 * not from the anchor's edge against the viewport middle, which used
 * to flip an anchor straddling the middle towards the SMALLER side,
 * #16443) and a max size capped to that space, whether or not its
 * natural size already fit there: content can grow after this pass,
 * and the flipped side has already anchored the popup's far edge, so a
 * popup left uncapped there would grow past the opposite viewport edge
 * with no scroll position able to reveal the overflow (#18536). The cap
 * is the fractional space itself (getBoundingClientRect), never the
 * popup's own measured size, so it never rounds a fractional natural
 * size down (offsetWidth/offsetHeight are integers) and wraps or
 * scrolls content that fit before the flip. How the returned
 * origins/caps are then EXPRESSED is the engines'
 * business: anchor() insets on the native engine, pixel top/left on the
 * fallback; either way the popup keeps tracking its anchor and only the
 * flip/cap decision itself is frozen at measure time. The element does
 * leave the pass already at the decided caps though: measuring lifts
 * them, content that then fits has its scroll offset clamped to 0 by
 * layout, and the engines restore the offset right after the pass
 * (#18534), which needs the popup scrollable again by then (the native
 * engine's own expression of the caps only lands on the next render).
 *
 * A "center"/"middle" self origin axis is skipped: when its anchor line
 * is centered too it clamps at the viewport edges instead (natively via
 * anchor-center, mirrored by the fallback engine), otherwise it is a
 * niche combination not worth the handling.
 */
export function applyBoundary({
  el,
  anchorEl,
  anchorOrigin,
  selfOrigin,
  offset,
  cover,
  maxHeight,
  maxWidth
}) {
  // natural size: lift a previous pass' caps before measuring, while
  // the max-height/max-width props legitimately bound the natural size;
  // also the initial render is kept invisible until this pass ran.
  // The popups' `width: max-content` CSS keeps the measurement honest
  // while an inset is already live (an anchor() or pixel left/top from
  // the intended placement): a shrink-to-fit box would squeeze into the
  // inset-modified containing block near the far viewport edge and the
  // squeezed width would then be frozen as the cap (#18533)
  el.style.maxHeight = maxHeight || ''
  el.style.maxWidth = maxWidth || ''
  el.style.visibility = ''

  const { offsetWidth: width, offsetHeight: height } = el
  const rect = anchorEl.getBoundingClientRect()
  const [ox, oy] = offset !== void 0 && cover !== true ? offset : [0, 0]

  // the offset-expanded anchor box
  const A = {
    top: rect.top - oy,
    bottom: rect.bottom + oy,
    center: rect.top + (rect.bottom - rect.top) / 2,
    left: rect.left - ox,
    right: rect.right + ox,
    middle: rect.left + (rect.right - rect.left) / 2
  }
  const { clientWidth: VW, clientHeight: VH } = document.documentElement

  const res = {
    anchorOrigin,
    selfOrigin,
    maxHeight: null,
    maxWidth: null
  }
  let av = anchorOrigin.vertical,
    sv = selfOrigin.vertical,
    ah = anchorOrigin.horizontal,
    sh = selfOrigin.horizontal,
    changed = false

  if (sv !== 'center') {
    const top = A[av] - (sv === 'bottom' ? height : 0)

    if (top < 0 || top + height > VH) {
      changed = true

      // the two placements of this axis: popup top edge at the "below"
      // line or popup bottom edge at the "above" line (one of them is
      // the intended placement); the roomier one wins, the intended
      // one on a tie (#16443)
      const [avBelow, avAbove] =
        av === 'center'
          ? ['center', 'center']
          : av === sv
            ? ['top', 'bottom']
            : ['bottom', 'top']
      const spaceBelow = VH - Math.max(0, A[avBelow])
      const spaceAbove = Math.min(VH, A[avAbove])
      let space

      if (sv === 'top' ? spaceBelow >= spaceAbove : spaceBelow > spaceAbove) {
        av = avBelow
        sv = 'top'
        space = spaceBelow
      } else {
        av = avAbove
        sv = 'bottom'
        space = spaceAbove
      }

      // combined through CSS min(), never JS, so a smaller caller maxHeight
      // prop stays in force instead of being widened back to `space` (#18536)
      res.maxHeight = maxHeight ? `min(${space}px, ${maxHeight})` : `${space}px`
    }
  }

  if (sh !== 'middle') {
    const left = A[ah] - (sh === 'right' ? width : 0)

    if (left < 0 || left + width > VW) {
      changed = true

      const [ahRight, ahLeft] =
        ah === 'middle'
          ? ['middle', 'middle']
          : ah === sh
            ? ['left', 'right']
            : ['right', 'left']
      const spaceRight = VW - Math.max(0, A[ahRight])
      const spaceLeft = Math.min(VW, A[ahLeft])
      let space

      if (sh === 'left' ? spaceRight >= spaceLeft : spaceRight > spaceLeft) {
        ah = ahRight
        sh = 'left'
        space = spaceRight
      } else {
        ah = ahLeft
        sh = 'right'
        space = spaceLeft
      }

      res.maxWidth = maxWidth ? `min(${space}px, ${maxWidth})` : `${space}px`
    }
  }

  if (changed) {
    res.anchorOrigin = { vertical: av, horizontal: ah }
    res.selfOrigin = { vertical: sv, horizontal: sh }
  }

  if (res.maxHeight !== null) el.style.maxHeight = res.maxHeight
  if (res.maxWidth !== null) el.style.maxWidth = res.maxWidth

  return res
}

/**
 * The offset a point-mode axis applies: unlike box mode, where the
 * offset expands the anchor's box, here it displaces the popup from the
 * point in the direction the popup grows, so it clears the pointer on
 * whichever side it opens. A centered axis straddles the point and has
 * no growth direction, so it takes the positive one, where a cursor
 * glyph's body sits relative to its hotspot.
 */
export function pointOffset(self, offset) {
  return self === 'bottom' || self === 'right' ? -offset : offset
}

/**
 * Point-mode companion of applyBoundary, for a popup opening from a
 * coordinate inside its anchor (touch position / cursor position /
 * context menu): an overflowing side mirrors around the point, which
 * stays put because the offset re-signs itself with the flipped origin.
 * A center/middle self origin axis has no other side to mirror to and
 * shifts to stay inside the viewport instead, mirroring what
 * applyBoundary's centered axes get natively from anchor-center.
 * Returns null while the placement needs no correction, otherwise the
 * resolved selfOrigin plus the point (only a centered axis moves it).
 */
export function applyPointBoundary({
  el,
  anchorEl,
  point,
  selfOrigin,
  offset
}) {
  const { offsetWidth: width, offsetHeight: height } = el
  const rect = anchorEl.getBoundingClientRect()
  const { clientWidth: VW, clientHeight: VH } = document.documentElement
  const [ox = 0, oy = 0] = offset ?? []
  let { vertical, horizontal } = selfOrigin
  const res = { top: point.top, left: point.left }
  let changed = false

  const lineY = rect.top + point.top + pointOffset(vertical, oy)

  if (vertical === 'center') {
    const top = lineY - height / 2
    const shift = Math.max(0, Math.min(top, VH - height)) - top

    if (shift !== 0) {
      res.top += shift
      changed = true
    }
  } else if (vertical === 'top' && lineY + height > VH) {
    vertical = 'bottom'
    changed = true
  } else if (vertical === 'bottom' && lineY - height < 0) {
    vertical = 'top'
    changed = true
  }

  const lineX = rect.left + point.left + pointOffset(horizontal, ox)

  if (horizontal === 'middle') {
    const left = lineX - width / 2
    const shift = Math.max(0, Math.min(left, VW - width)) - left

    if (shift !== 0) {
      res.left += shift
      changed = true
    }
  } else if (horizontal === 'left' && lineX + width > VW) {
    horizontal = 'right'
    changed = true
  } else if (horizontal === 'right' && lineX - width < 0) {
    horizontal = 'left'
    changed = true
  }

  return changed ? { selfOrigin: { vertical, horizontal }, point: res } : null
}

/**
 * Both engines' boundary pass measures with the size caps lifted, which
 * clamps the scroll offset of content that fits meanwhile (#18534);
 * they put it back right after.
 */
export function restoreScroll(el, scrollTop, scrollLeft) {
  if (el.scrollTop !== scrollTop) el.scrollTop = scrollTop
  if (el.scrollLeft !== scrollLeft) el.scrollLeft = scrollLeft
}
