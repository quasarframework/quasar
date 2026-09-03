/**
 * The native positioning engine: expresses a popup's placement through
 * CSS anchor positioning (position-anchor + anchor()/anchor-size()
 * insets), so the browser keeps it glued to its anchor through any
 * scroll, layout shift, resize or animation with zero listeners.
 *
 * Only used where core.js' supportsCssAnchor() says so;
 * every other browser runs fallback-engine.js instead.
 */

import { computed, ref } from 'vue'

import {
  applyBoundary,
  applyPointBoundary,
  pointOffset,
  restoreScroll
} from './core.js'

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
    const top = point.top + pointOffset(selfOrigin.vertical, oy),
      left = point.left + pointOffset(selfOrigin.horizontal, ox)

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
 * Native CSS anchor positioning: the browser owns the tracking and JS
 * only decides the placement (once per show, on demand through
 * updatePosition() and on screen/placement-prop changes).
 */
export function useCssAnchorEngine(
  props,
  { anchorEl, innerRef, anchorOrigin, selfOrigin }
) {
  let namedAnchorEl = null

  const anchorName = ref('')
  // set while the popup is anchored to a coordinate (touch position /
  // context menu / cursor position) instead of the anchor's box:
  // { top, left } relative to the anchor's top-left corner
  const anchorPoint = ref(null)
  // overflow correction for point mode, measured on first paint
  const pointSelf = ref(null)
  // overflow correction for box mode (flip/cap), measured on first
  // paint; the popup stays invisible until the first pass ran
  const boundary = ref(null)
  const positioned = ref(false)

  const positionStyle = computed(() => {
    if (anchorName.value === '') return ''

    const b = anchorPoint.value === null ? boundary.value : null

    const style = getPositionStyle({
      anchorName: anchorName.value,
      anchorOrigin: b !== null ? b.anchorOrigin : anchorOrigin.value,
      selfOrigin:
        anchorPoint.value !== null
          ? (pointSelf.value ?? selfOrigin.value)
          : b !== null
            ? b.selfOrigin
            : selfOrigin.value,
      offset: props.offset,
      point: anchorPoint.value ?? void 0,
      fit: props.fit,
      cover: props.cover,
      maxHeight: props.maxHeight,
      maxWidth: props.maxWidth
    })

    if (b !== null) {
      if (b.maxHeight !== null) style.maxHeight = b.maxHeight
      if (b.maxWidth !== null) style.maxWidth = b.maxWidth
    }

    if (!positioned.value) {
      // hidden until the first boundary pass; lifted synchronously
      // there so a focus handoff never targets a hidden node
      style.visibility = 'hidden'
    }

    return style
  })

  const updatePosition = () => {
    const el = innerRef.value
    if (el === null || anchorEl.value === null) return

    if (anchorPoint.value === null) {
      // the pass measures with the caps lifted, which clamps the scroll
      // offset of content that fits meanwhile (#18534)
      const { scrollTop, scrollLeft } = el

      boundary.value = applyBoundary({
        el,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        offset: props.offset,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      })

      restoreScroll(el, scrollTop, scrollLeft)
    } else {
      // point mode mirrors or shifts around the pointer instead of the
      // anchor's box
      el.style.visibility = ''

      const res = applyPointBoundary({
        el,
        anchorEl: anchorEl.value,
        point: anchorPoint.value,
        selfOrigin: pointSelf.value ?? selfOrigin.value,
        offset: props.offset
      })

      if (res !== null) {
        pointSelf.value = res.selfOrigin
        anchorPoint.value = res.point
      }
    }

    positioned.value = true
  }

  const releaseAnchor = hidingInProgress => {
    // hidingInProgress keeps the anchor name until the leave transition
    // is done (the popup would lose its position mid-animation)
    if (!hidingInProgress) {
      if (namedAnchorEl !== null) {
        removeAnchorName(namedAnchorEl)
        namedAnchorEl = null
      }
      anchorName.value = ''
    }
  }

  return {
    positionStyle,

    updatePosition,
    handleTick: updatePosition,
    releaseAnchor,
    setAnchorPoint(point) {
      anchorPoint.value = point
    },
    handleShow() {
      anchorPoint.value = null
      pointSelf.value = null
      boundary.value = null
      positioned.value = false

      // a rapid re-show can land while the previous hide transition
      // still holds the name; reuse it instead of acquiring twice
      if (namedAnchorEl !== anchorEl.value) {
        releaseAnchor(false)
        namedAnchorEl = anchorEl.value
        anchorName.value = setAnchorName(namedAnchorEl)
      }
    }
  }
}
