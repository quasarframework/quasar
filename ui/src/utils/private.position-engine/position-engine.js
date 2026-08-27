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
