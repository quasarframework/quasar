/**
 * The native positioning engine: expresses a popup's placement through
 * CSS anchor positioning (position-anchor + anchor()/anchor-size()
 * insets), so the browser keeps it glued to its anchor through any
 * scroll, layout shift, resize or animation with zero listeners.
 *
 * Only used where position-engine.js' supportsCssAnchor() says so;
 * every other browser runs fallback-position-engine.js instead.
 */

/**
 * The browser tracks a CSS anchor for us, but `anchor-name` must live on
 * the anchor element itself, which is app-owned DOM. Popups therefore
 * borrow the element through this refcounted registry: the first popup
 * on an element names it, later ones reuse the name, and the last one
 * out restores whatever inline value the app had there.
 */
const anchorNames = new Map()
let anchorUid = 0

export function setAnchorName(el) {
  let entry = anchorNames.get(el)

  if (entry === void 0) {
    entry = {
      name: `--q-pe-${++anchorUid}`,
      count: 0,
      prev: el.style.getPropertyValue('anchor-name')
    }
    anchorNames.set(el, entry)
    el.style.setProperty('anchor-name', entry.name)
  }

  entry.count++
  return entry.name
}

export function removeAnchorName(el) {
  const entry = anchorNames.get(el)
  if (entry === void 0) return

  entry.count--
  if (entry.count === 0) {
    anchorNames.delete(el)

    if (entry.prev === '') {
      el.style.removeProperty('anchor-name')
    } else {
      el.style.setProperty('anchor-name', entry.prev)
    }
  }
}

const anchorLine = {
  top: 'top',
  center: 'center',
  bottom: 'bottom',
  left: 'left',
  middle: 'center',
  right: 'right'
}

function calcExpr(line, delta) {
  return delta === 0
    ? `anchor(${line})`
    : `calc(anchor(${line}) ${delta > 0 ? '+' : '-'} ${Math.abs(delta)}px)`
}

/**
 * One axis of the positioning recipe. Writing the primary inset from the
 * axis start (top/left) makes the box grow towards the axis end and vice
 * versa; a "center" self origin with a matching "center" anchor line uses
 * native clamped centering (anchor-center), while a "center" self on an
 * edge line falls back to a -50% translate.
 *
 * `offset` pushes the anchor line outwards, exactly like the fallback
 * engine's virtual anchor-rect expansion: edge lines move by the offset,
 * center lines don't move at all.
 */
function applyAxis(style, { line, self, offset, start, end, alignProp }) {
  if (self === 'center' || self === 'middle') {
    if (line === 'center' || line === 'middle') {
      style[start] = '0px'
      style[end] = '0px'
      style[alignProp] = 'anchor-center'
      return false
    }

    style[start] = calcExpr(anchorLine[line], 0)
    return true
  }

  const growsFromStart = self === 'top' || self === 'left'
  const edgeDelta =
    line === 'center' || line === 'middle'
      ? 0
      : // the line sits on the axis-start side of the anchor when it
        // matches the axis-start keyword; outwards means towards the
        // axis start there and towards the axis end on the other side
        (line === 'top' || line === 'left' ? -1 : 1) * offset

  if (growsFromStart) {
    style[start] = calcExpr(anchorLine[line], edgeDelta)
  } else {
    // in an end inset the coordinate system runs the other way
    style[end] = calcExpr(anchorLine[line], -edgeDelta)
  }

  return false
}

/**
 * Computes the CSS for a popup positioned through native CSS anchor
 * positioning. The returned styles are static: from here on the browser
 * keeps the popup glued to its anchor through any scroll, layout shift
 * or resize with no listeners involved. Whether the placement FITS is
 * decided separately (applyBoundary) and fed back in through the
 * origins/max caps.
 *
 * `point` positions relative to a coordinate inside the anchor (touch
 * position / context menu) instead of the anchor's box.
 */
export function getPositionStyle({
  anchorName,
  anchorOrigin,
  selfOrigin,
  offset,
  point,
  fit,
  cover,
  maxHeight,
  maxWidth
}) {
  const style = {
    positionAnchor: anchorName,
    top: null,
    right: null,
    bottom: null,
    left: null,
    translate: null,
    alignSelf: null,
    justifySelf: null,
    minWidth: null,
    minHeight: null,
    maxWidth: maxWidth || null,
    maxHeight: maxHeight || null
  }

  const ox = offset !== void 0 && !cover ? offset[0] : 0
  const oy = offset !== void 0 && !cover ? offset[1] : 0

  if (fit || cover) {
    style.minWidth =
      maxWidth !== null && maxWidth !== void 0
        ? `min(anchor-size(width), ${maxWidth})`
        : 'anchor-size(width)'

    if (cover) {
      style.minHeight =
        maxHeight !== null && maxHeight !== void 0
          ? `min(anchor-size(height), ${maxHeight})`
          : 'anchor-size(height)'
    }
  }

  if (point !== void 0) {
    const top = point.top + oy,
      left = point.left + ox

    if (selfOrigin.vertical === 'bottom') {
      style.bottom = calcExpr('top', -top)
    } else {
      style.top = calcExpr('top', top)
    }
    if (selfOrigin.horizontal === 'right') {
      style.right = calcExpr('left', -left)
    } else {
      style.left = calcExpr('left', left)
    }

    if (
      selfOrigin.horizontal === 'middle' ||
      selfOrigin.vertical === 'center'
    ) {
      style.translate =
        `${selfOrigin.horizontal === 'middle' ? '-50%' : '0px'}` +
        ` ${selfOrigin.vertical === 'center' ? '-50%' : '0px'}`
    }

    return style
  }

  const vTranslate = applyAxis(style, {
    line: anchorOrigin.vertical,
    self: selfOrigin.vertical,
    offset: oy,
    start: 'top',
    end: 'bottom',
    alignProp: 'alignSelf'
  })
  const hTranslate = applyAxis(style, {
    line: anchorOrigin.horizontal,
    self: selfOrigin.horizontal,
    offset: ox,
    start: 'left',
    end: 'right',
    alignProp: 'justifySelf'
  })

  if (vTranslate || hTranslate) {
    style.translate = `${hTranslate ? '-50%' : '0px'} ${vTranslate ? '-50%' : '0px'}`
  }

  return style
}

/**
 * The one JS decision the browser cannot make for us: whether the
 * intended placement fits the viewport, measured once per show (and on
 * demand through updatePosition()). A placement that overflows gets its
 * origins mirrored towards the roomier side — the anchor's expanded box
 * edges swap exactly like the fallback engine flips them — and a max
 * size capped to the space that placement has. The returned origins/caps
 * are still expressed through anchor() afterwards, so the browser keeps
 * tracking the anchor; only the flip/cap decision itself is frozen at
 * measure time.
 *
 * A "center"/"middle" self origin axis is skipped: when its anchor line
 * is centered too it already clamps natively (anchor-center), otherwise
 * it is a niche combination not worth the handling.
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

  // the offset-expanded anchor box, same as the fallback engine's
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
