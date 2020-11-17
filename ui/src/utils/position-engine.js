import { client } from '../plugins/Platform.js'

let vpLeft, vpTop

export function validatePosition (pos) {
  const parts = pos.split(' ')
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

export function validateOffset (val) {
  if (val !== true) { return true }
  if (val.length !== 2) { return false }
  if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
    return false
  }
  return true
}

export function parsePosition (pos) {
  const parts = pos.split(' ')
  return { vertical: parts[0], horizontal: parts[1] }
}

export function validateCover (val) {
  if (val === true || val === false) { return true }
  return validatePosition(val)
}

export function getAnchorProps (el, offset) {
  let { top, left, right, bottom, width, height } = el.getBoundingClientRect()

  if (width === 0) {
    width = el.offsetWidth
  }
  if (height === 0) {
    height = el.offsetHeight
  }

  if (offset !== void 0) {
    left -= offset[0]
    right += offset[0]
    top -= offset[1]
    bottom += offset[1]
  }

  return {
    left,
    middle: left + (right - left) / 2,
    right,

    top,
    center: top + (bottom - top) / 2,
    bottom,

    leftRev: right,
    middleRev: left + (right - left) / 2,
    rightRev: left,

    topRev: bottom,
    centerRev: top + (bottom - top) / 2,
    bottomRev: top,

    width,
    height
  }
}

export function getTargetProps (el) {
  let { width, height } = el.getBoundingClientRect()

  if (width === 0) {
    width = el.offsetWidth
  }
  if (height === 0) {
    height = el.offsetHeight
  }

  return {
    width,
    height
  }
}

// cfg: { el, anchorEl, anchorOrigin, selfOrigin, offset, absoluteOffset, cover, fit, maxHeight, maxWidth }
export function setPosition (cfg) {
  if (client.is.ios === true && window.visualViewport !== void 0) {
    // uses the q-position-engine CSS class

    const { style } = document.body
    const { offsetLeft, offsetTop } = window.visualViewport

    if (offsetLeft !== vpLeft) {
      style.setProperty('--q-pe-left', (offsetLeft || 0) + 'px')
      vpLeft = offsetLeft
    }
    if (offsetTop !== vpTop) {
      style.setProperty('--q-pe-top', (offsetTop || 0) + 'px')
      vpTop = offsetTop
    }
  }

  let anchorProps, elStyle

  // scroll position might change
  // if max-height/-width changes, so we
  // need to restore it after we calculate
  // the new positioning
  const
    extEl = cfg.el,
    intEl = extEl.children[0],
    { scrollLeft, scrollTop } = intEl,
    innerWidth = document.body.clientWidth,
    innerHeight = document.scrollingElement.clientHeight

  if (cfg.absoluteOffset === void 0) {
    anchorProps = getAnchorProps(cfg.anchorEl, cfg.cover === true ? [0, 0] : cfg.offset)
  }
  else {
    const
      { top: anchorTop, left: anchorLeft } = cfg.anchorEl.getBoundingClientRect(),
      top = anchorTop + (cfg.cover === true ? 0 : cfg.absoluteOffset.top),
      left = anchorLeft + (cfg.cover === true || cfg.fit === true ? 0 : cfg.absoluteOffset.left)

    anchorProps = {
      left,
      middle: left,
      right: left,

      top,
      center: top,
      bottom: top,

      leftRev: left,
      middleRev: left,
      rightRev: left,

      topRev: top,
      centerRev: top,
      bottomRev: top,

      width: 0,
      height: 0
    }
  }

  elStyle = {
    position: 'absolute',
    whiteSpace: 'nowrap',
    minWidth: null,
    minHeight: null,
    maxWidth: cfg.maxWidth || null,
    maxHeight: cfg.maxHeight || null
  }

  if (cfg.fit === true || cfg.cover === true) {
    elStyle.minWidth = anchorProps.width + 'px'
    if (cfg.cover === true) {
      elStyle.minHeight = anchorProps.height + 'px'
    }
  }

  Object.assign(intEl.style, elStyle)

  const targetProps = getTargetProps(intEl)

  Object.assign(intEl.style, {
    position: 'static',
    whiteSpace: null
  })

  elStyle = {
    visibility: 'visible',
    left: '4px',
    right: '4px',
    top: '4px',
    bottom: '4px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }

  if (cfg.selfOrigin.horizontal === 'left') {
    if (
      targetProps.width + 4 > innerWidth - anchorProps[cfg.anchorOrigin.horizontal] &&
      anchorProps[cfg.anchorOrigin.horizontal + 'Rev'] > innerWidth - anchorProps[cfg.anchorOrigin.horizontal]
    ) {
      elStyle.right = (innerWidth - anchorProps[cfg.anchorOrigin.horizontal + 'Rev']) + 'px'
      elStyle.alignItems = 'flex-end'
    }
    else {
      elStyle.left = anchorProps[cfg.anchorOrigin.horizontal] + 'px'
    }
  }
  else if (cfg.selfOrigin.horizontal === 'right') {
    if (
      targetProps.width + 4 > anchorProps[cfg.anchorOrigin.horizontal] &&
      innerWidth - anchorProps[cfg.anchorOrigin.horizontal + 'Rev'] > anchorProps[cfg.anchorOrigin.horizontal]
    ) {
      elStyle.left = anchorProps[cfg.anchorOrigin.horizontal + 'Rev'] + 'px'
    }
    else {
      elStyle.right = (innerWidth - anchorProps[cfg.anchorOrigin.horizontal]) + 'px'
      elStyle.alignItems = 'flex-end'
    }
  }
  else {
    elStyle.alignItems = 'center'

    const
      width = Math.min(anchorProps[cfg.anchorOrigin.horizontal], innerWidth - anchorProps[cfg.anchorOrigin.horizontal]),
      widthRev = Math.min(anchorProps[cfg.anchorOrigin.horizontal + 'Rev'], innerWidth - anchorProps[cfg.anchorOrigin.horizontal + 'Rev']),
      widthHalf = innerWidth / 2

    if (targetProps.width + 8 > 2 * width) {
      if (targetProps.width + 8 <= 2 * widthRev) {
        elStyle.left = (anchorProps[cfg.anchorOrigin.horizontal + 'Rev'] - widthHalf) + 'px'
        elStyle.right = (widthHalf - anchorProps[cfg.anchorOrigin.horizontal + 'Rev']) + 'px'
      }
      else if (anchorProps[cfg.anchorOrigin.horizontal] < widthHalf) {
        elStyle.left = Math.min(4, width + 4) + 'px'
        elStyle.alignItems = 'flex-start'
      }
      else {
        elStyle.right = Math.min(4, width + 4) + 'px'
        elStyle.alignItems = 'flex-end'
      }
    }
    else {
      elStyle.left = (anchorProps[cfg.anchorOrigin.horizontal] - widthHalf) + 'px'
      elStyle.right = (widthHalf - anchorProps[cfg.anchorOrigin.horizontal]) + 'px'
    }
  }

  if (cfg.selfOrigin.vertical === 'top') {
    if (
      targetProps.height + 4 > innerHeight - anchorProps[cfg.anchorOrigin.vertical] &&
      anchorProps[cfg.anchorOrigin.vertical + 'Rev'] > innerHeight - anchorProps[cfg.anchorOrigin.vertical]
    ) {
      elStyle.bottom = (innerHeight - anchorProps[cfg.anchorOrigin.vertical + 'Rev']) + 'px'
      elStyle.justifyContent = 'flex-end'
    }
    else {
      elStyle.top = anchorProps[cfg.anchorOrigin.vertical] + 'px'
    }
  }
  else if (cfg.selfOrigin.vertical === 'bottom') {
    if (
      targetProps.height + 4 > anchorProps[cfg.anchorOrigin.vertical] &&
      innerHeight - anchorProps[cfg.anchorOrigin.vertical + 'Rev'] > anchorProps[cfg.anchorOrigin.vertical]
    ) {
      elStyle.top = anchorProps[cfg.anchorOrigin.vertical + 'Rev'] + 'px'
    }
    else {
      elStyle.bottom = (innerHeight - anchorProps[cfg.anchorOrigin.vertical]) + 'px'
      elStyle.justifyContent = 'flex-end'
    }
  }
  else {
    elStyle.justifyContent = 'center'

    const
      height = Math.min(anchorProps[cfg.anchorOrigin.vertical], innerHeight - anchorProps[cfg.anchorOrigin.vertical]),
      heightRev = Math.min(anchorProps[cfg.anchorOrigin.vertical + 'Rev'], innerHeight - anchorProps[cfg.anchorOrigin.vertical + 'Rev']),
      heightHalf = innerHeight / 2

    if (targetProps.height + 8 > 2 * height) {
      if (targetProps.height + 8 <= 2 * heightRev) {
        elStyle.top = (anchorProps[cfg.anchorOrigin.vertical + 'Rev'] - heightHalf) + 'px'
        elStyle.bottom = (heightHalf - anchorProps[cfg.anchorOrigin.vertical + 'Rev']) + 'px'
      }
      else if (anchorProps[cfg.anchorOrigin.vertical] < heightHalf) {
        elStyle.top = Math.min(4, height + 4) + 'px'
        elStyle.justifyContent = 'flex-start'
      }
      else {
        elStyle.bottom = Math.min(4, height + 4) + 'px'
        elStyle.justifyContent = 'flex-end'
      }
    }
    else {
      elStyle.top = (anchorProps[cfg.anchorOrigin.vertical] - heightHalf) + 'px'
      elStyle.bottom = (heightHalf - anchorProps[cfg.anchorOrigin.vertical]) + 'px'
    }
  }

  Object.assign(extEl.style, elStyle)

  // restore scroll position
  if (intEl.scrollTop !== scrollTop) {
    intEl.scrollTop = scrollTop
  }
  if (intEl.scrollLeft !== scrollLeft) {
    intEl.scrollLeft = scrollLeft
  }
}
