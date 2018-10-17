// TODO v1: remove, obsolete

import { getScrollbarWidth } from './scroll.js'
// import { position } from './event.js'

export function getAnchorPosition (el, offset) {
  let
    {top, left, right, bottom} = el.getBoundingClientRect(),
    a = {
      top,
      left,
      width: el.offsetWidth,
      height: el.offsetHeight
    }

  if (offset) {
    a.top -= offset[1]
    a.left -= offset[0]
    if (bottom) {
      bottom += offset[1]
    }
    if (right) {
      right += offset[0]
    }
    a.width += offset[0]
    a.height += offset[1]
  }

  a.right = right || a.left + a.width
  a.bottom = bottom || a.top + a.height
  a.middle = a.left + ((a.right - a.left) / 2)
  a.center = a.top + ((a.bottom - a.top) / 2)

  return a
}

export function getTargetPosition (el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  }
}

export function repositionIfNeeded (anchor, target, selfOrigin, anchorOrigin, targetPosition) {
  const margin = getScrollbarWidth()
  let { innerHeight, innerWidth } = window
  // don't go bellow scrollbars
  innerHeight -= margin
  innerWidth -= margin

  if (targetPosition.top < 0 || targetPosition.top + target.bottom > innerHeight) {
    if (selfOrigin.vertical === 'center') {
      targetPosition.top = anchor[selfOrigin.vertical] > innerHeight / 2 ? innerHeight - target.bottom : 0
      targetPosition.maxHeight = Math.min(target.bottom, innerHeight) + 'px'
    }
    else if (anchor[selfOrigin.vertical] > innerHeight / 2) {
      const
        anchorY = Math.min(innerHeight, anchorOrigin.vertical === 'center' ? anchor.center : (anchorOrigin.vertical === selfOrigin.vertical ? anchor.bottom : anchor.top)),
        maxHeight = Math.min(target.bottom, anchorY)
      targetPosition.maxHeight = `${maxHeight}px`
      targetPosition.top = Math.max(0, anchorY - targetPosition.maxHeight)
    }
    else {
      targetPosition.top = anchorOrigin.vertical === 'center' ? anchor.center : (anchorOrigin.vertical === selfOrigin.vertical ? anchor.top : anchor.bottom)
      targetPosition.maxHeight = Math.min(target.bottom, innerHeight - targetPosition.top) + 'px'
    }
  }

  if (targetPosition.left < 0 || targetPosition.left + target.right > innerWidth) {
    targetPosition.maxWidth = Math.min(target.right, innerWidth) + 'px'
    if (selfOrigin.horizontal === 'middle') {
      targetPosition.left = anchor[selfOrigin.horizontal] > innerWidth / 2 ? innerWidth - target.right : 0
    }
    else if (anchor[selfOrigin.horizontal] > innerWidth / 2) {
      const
        anchorX = Math.min(innerWidth, anchorOrigin.horizontal === 'middle' ? anchor.center : (anchorOrigin.horizontal === selfOrigin.horizontal ? anchor.right : anchor.left)),
        maxWidth = Math.min(target.right, anchorX)
      targetPosition.maxWidth = `${maxWidth}px`
      targetPosition.left = Math.max(0, anchorX - targetPosition.maxWidth)
    }
    else {
      targetPosition.left = anchorOrigin.horizontal === 'middle' ? anchor.center : (anchorOrigin.horizontal === selfOrigin.horizontal ? anchor.left : anchor.right)
      targetPosition.maxWidth = Math.min(target.right, innerWidth - targetPosition.left) + 'px'
    }
  }
}

export function parseHorizTransformOrigin (pos) {
  return pos === 'middle' ? 'center' : pos
}

export function setPosition ({ el, anchorEl, anchorOrigin, selfOrigin, offset, maxHeight = 'none', maxWidth = 'none' }) {
  let anchor

  anchor = getAnchorPosition(anchorEl, offset)

  let target = getTargetPosition(el)
  let targetPosition = {
    top: anchor[anchorOrigin.vertical] - target[selfOrigin.vertical],
    left: anchor[anchorOrigin.horizontal] - target[selfOrigin.horizontal],
    maxHeight,
    maxWidth
  }

  repositionIfNeeded(anchor, target, selfOrigin, anchorOrigin, targetPosition)

  el.style.top = Math.max(0, targetPosition.top) + 'px'
  el.style.left = Math.max(0, targetPosition.left) + 'px'
  el.style.maxHeight = targetPosition.maxHeight
  el.style.maxWidth = targetPosition.maxWidth
}

export function positionValidator (pos) {
  let parts = pos.split(' ')
  if (parts.length !== 2) {
    return false
  }
  if (!['top', 'center', 'bottom'].includes(parts[0])) {
    console.error('Anchor/Self position must start with one of top/center/bottom')
    return false
  }
  if (!['left', 'middle', 'right'].includes(parts[1])) {
    console.error('Anchor/Self position must end with one of left/middle/right')
    return false
  }
  return true
}

export function offsetValidator (val) {
  if (!val) { return true }
  if (val.length !== 2) { return false }
  if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
    return false
  }
  return true
}

export function parsePosition (pos) {
  let parts = pos.split(' ')
  return {vertical: parts[0], horizontal: parts[1]}
}
