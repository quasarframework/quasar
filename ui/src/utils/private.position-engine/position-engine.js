const partsFirst = ['top', 'center', 'bottom'],
  partsSecond = ['left', 'middle', 'right', 'start', 'end']

/**
 * Decides which of the two positioning engines drives a popup:
 * anchor-position-engine.js (native CSS anchor positioning, zero
 * listeners) where this returns true, fallback-position-engine.js
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
 * edges swap sides — and a max size capped to the space that placement
 * has. How the returned origins/caps are then EXPRESSED is the engines'
 * business: anchor() insets on the native engine, pixel top/left on the
 * fallback; either way the popup keeps tracking its anchor and only the
 * flip/cap decision itself is frozen at measure time.
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
  // also the initial render is kept invisible until this pass ran
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

      if (A[av] > VH / 2) {
        // roomier above: popup bottom edge at the mirrored line
        av = av === 'center' ? 'center' : av === sv ? 'bottom' : 'top'
        sv = 'bottom'
        res.maxHeight = Math.min(height, Math.min(VH, A[av])) + 'px'
      } else {
        // roomier below: popup top edge at the mirrored line
        av = av === 'center' ? 'center' : av === sv ? 'top' : 'bottom'
        sv = 'top'
        res.maxHeight = Math.min(height, VH - Math.max(0, A[av])) + 'px'
      }
    }
  }

  if (sh !== 'middle') {
    const left = A[ah] - (sh === 'right' ? width : 0)

    if (left < 0 || left + width > VW) {
      changed = true

      if (A[ah] > VW / 2) {
        ah = ah === 'middle' ? 'middle' : ah === sh ? 'right' : 'left'
        sh = 'right'
        res.maxWidth = Math.min(width, Math.min(VW, A[ah])) + 'px'
      } else {
        ah = ah === 'middle' ? 'middle' : ah === sh ? 'left' : 'right'
        sh = 'left'
        res.maxWidth = Math.min(width, VW - Math.max(0, A[ah])) + 'px'
      }
    }
  }

  if (changed) {
    res.anchorOrigin = { vertical: av, horizontal: ah }
    res.selfOrigin = { vertical: sv, horizontal: sh }
  }

  return res
}

/**
 * Point-mode companion of applyBoundary, for a popup opening from a
 * coordinate inside its anchor (touch position / context menu): an
 * overflowing side mirrors around the point, which itself moves by
 * twice the offset so the popup clears the pointer on the other side
 * too. Returns null while the current sides fit, otherwise the flipped
 * selfOrigin plus the adjusted point. A center/middle self origin axis
 * is left alone, like applyBoundary does.
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

  const lineY = rect.top + point.top + oy

  if (vertical === 'top' && lineY + height > VH) {
    vertical = 'bottom'
    res.top -= 2 * oy
    changed = true
  } else if (vertical === 'bottom' && lineY - height < 0) {
    vertical = 'top'
    res.top += 2 * oy
    changed = true
  }

  const lineX = rect.left + point.left + ox

  if (horizontal === 'left' && lineX + width > VW) {
    horizontal = 'right'
    res.left -= 2 * ox
    changed = true
  } else if (horizontal === 'right' && lineX - width < 0) {
    horizontal = 'left'
    res.left += 2 * ox
    changed = true
  }

  return changed ? { selfOrigin: { vertical, horizontal }, point: res } : null
}
