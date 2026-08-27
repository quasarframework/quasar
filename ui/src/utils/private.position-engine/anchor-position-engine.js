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
