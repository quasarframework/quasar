import { getScrollbarWidth } from '../scroll.js'
import { client } from '../../plugins/Platform.js'

let vpLeft, vpTop

export function validatePosition (pos) {
  const parts = pos.split(' ')
  if (parts.length !== 2) {
    return false
  }
  if ([ 'top', 'center', 'bottom' ].includes(parts[0]) !== true) {
    console.error('Anchor/Self position must start with one of top/center/bottom')
    return false
  }
  if ([ 'left', 'middle', 'right', 'start', 'end' ].includes(parts[1]) !== true) {
    console.error('Anchor/Self position must end with one of left/middle/right/start/end')
    return false
  }
  return true
}

export function validateOffset (val) {
  if (!val) { return true }
  if (val.length !== 2) { return false }
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

;[ 'left', 'middle', 'right' ].forEach(pos => {
  horizontalPos[`${pos}#ltr`] = pos
  horizontalPos[`${pos}#rtl`] = pos
})

export function parsePosition (pos, rtl) {
  const parts = pos.split(' ')
  return {
    vertical: parts[0],
    horizontal: horizontalPos[`${parts[1]}#${rtl === true ? 'rtl' : 'ltr'}`]
  }
}

export function getAnchorProps (el, offset) {
  let { top, left, right, bottom, width, height } = el.getBoundingClientRect()

  if (offset !== void 0) {
    top -= offset[1]
    left -= offset[0]
    bottom += offset[1]
    right += offset[0]

    width += offset[0]
    height += offset[1]
  }

  return {
    top, bottom, height,
    left, right, width,
    middle: left + (right - left) / 2,
    center: top + (bottom - top) / 2
  }
}

function getAbsoluteAnchorProps (el, absoluteOffset, offset) {
  let { top, left } = el.getBoundingClientRect()

  top += absoluteOffset.top
  left += absoluteOffset.left

  if (offset !== void 0) {
    top += offset[ 1 ]
    left += offset[ 0 ]
  }

  return {
    top, bottom: top + 1, height: 1,
    left, right: left + 1, width: 1,
    middle: left,
    center: top
  }
}

export function getTargetProps (el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  }
}

function getTopLeftProps (anchorProps, targetProps, cfg) {
  return {
    top: anchorProps[ cfg.anchorOrigin.vertical ] - targetProps[ cfg.selfOrigin.vertical ],
    left: anchorProps[ cfg.anchorOrigin.horizontal ] - targetProps[ cfg.selfOrigin.horizontal ]
  }
}

// cfg: { el, anchorEl, anchorOrigin, selfOrigin, offset, absoluteOffset, cover, fit, maxHeight, maxWidth }
export function setPosition (cfg) {
  if (client.is.ios === true && window.visualViewport !== void 0) {
    // uses the q-position-engine CSS class

    const el = document.body.style
    const { offsetLeft: left, offsetTop: top } = window.visualViewport

    if (left !== vpLeft) {
      el.setProperty('--q-pe-left', left + 'px')
      vpLeft = left
    }
    if (top !== vpTop) {
      el.setProperty('--q-pe-top', top + 'px')
      vpTop = top
    }
  }

  // scroll position might change
  // if max-height/-width changes, so we
  // need to restore it after we calculate
  // the new positioning
  const { scrollLeft, scrollTop } = cfg.el

  const anchorProps = cfg.absoluteOffset === void 0
    ? getAnchorProps(cfg.anchorEl, cfg.cover === true ? [ 0, 0 ] : cfg.offset)
    : getAbsoluteAnchorProps(cfg.anchorEl, cfg.absoluteOffset, cfg.offset)

  let elStyle = {
    maxHeight: cfg.maxHeight,
    maxWidth: cfg.maxWidth,
    visibility: 'visible'
  }

  if (cfg.fit === true || cfg.cover === true) {
    elStyle.minWidth = anchorProps.width + 'px'
    if (cfg.cover === true) {
      elStyle.minHeight = anchorProps.height + 'px'
    }
  }

  Object.assign(cfg.el.style, elStyle)

  const targetProps = getTargetProps(cfg.el)
  let props = getTopLeftProps(anchorProps, targetProps, cfg)

  if (cfg.absoluteOffset === void 0 || cfg.offset === void 0) {
    applyBoundaries(props, anchorProps, targetProps, cfg.anchorOrigin, cfg.selfOrigin)
  }
  else { // we have touch position or context menu with offset
    const { top, left } = props // cache initial values

    // apply initial boundaries
    applyBoundaries(props, anchorProps, targetProps, cfg.anchorOrigin, cfg.selfOrigin)

    let hasChanged = false

    // did it flip vertically?
    if (props.top !== top) {
      hasChanged = true
      const offsetY = 2 * cfg.offset[ 1 ]
      anchorProps.center = anchorProps.top -= offsetY
      anchorProps.bottom -= offsetY + 2
    }

    // did it flip horizontally?
    if (props.left !== left) {
      hasChanged = true
      const offsetX = 2 * cfg.offset[ 0 ]
      anchorProps.middle = anchorProps.left -= offsetX
      anchorProps.right -= offsetX + 2
    }

    if (hasChanged === true) {
      // re-calculate props with the new anchor
      props = getTopLeftProps(anchorProps, targetProps, cfg)

      // and re-apply boundaries
      applyBoundaries(props, anchorProps, targetProps, cfg.anchorOrigin, cfg.selfOrigin)
    }
  }

  elStyle = {
    top: props.top + 'px',
    left: props.left + 'px'
  }

  if (props.maxHeight !== void 0) {
    elStyle.maxHeight = props.maxHeight + 'px'

    if (anchorProps.height > props.maxHeight) {
      elStyle.minHeight = elStyle.maxHeight
    }
  }
  if (props.maxWidth !== void 0) {
    elStyle.maxWidth = props.maxWidth + 'px'

    if (anchorProps.width > props.maxWidth) {
      elStyle.minWidth = elStyle.maxWidth
    }
  }

  Object.assign(cfg.el.style, elStyle)

  // restore scroll position
  if (cfg.el.scrollTop !== scrollTop) {
    cfg.el.scrollTop = scrollTop
  }
  if (cfg.el.scrollLeft !== scrollLeft) {
    cfg.el.scrollLeft = scrollLeft
  }
}

function applyBoundaries (props, anchorProps, targetProps, anchorOrigin, selfOrigin) {
  const
    currentHeight = targetProps.bottom,
    currentWidth = targetProps.right,
    margin = getScrollbarWidth(),
    innerHeight = window.innerHeight - margin,
    innerWidth = document.body.clientWidth

  if (props.top < 0 || props.top + currentHeight > innerHeight) {
    if (selfOrigin.vertical === 'center') {
      props.top = anchorProps[anchorOrigin.vertical] > innerHeight / 2
        ? Math.max(0, innerHeight - currentHeight)
        : 0
      props.maxHeight = Math.min(currentHeight, innerHeight)
    }
    else if (anchorProps[anchorOrigin.vertical] > innerHeight / 2) {
      const anchorY = Math.min(
        innerHeight,
        anchorOrigin.vertical === 'center'
          ? anchorProps.center
          : (anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.bottom : anchorProps.top)
      )
      props.maxHeight = Math.min(currentHeight, anchorY)
      props.top = Math.max(0, anchorY - currentHeight)
    }
    else {
      props.top = Math.max(0, anchorOrigin.vertical === 'center'
        ? anchorProps.center
        : (anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.top : anchorProps.bottom)
      )
      props.maxHeight = Math.min(currentHeight, innerHeight - props.top)
    }
  }

  if (props.left < 0 || props.left + currentWidth > innerWidth) {
    props.maxWidth = Math.min(currentWidth, innerWidth)
    if (selfOrigin.horizontal === 'middle') {
      props.left = anchorProps[anchorOrigin.horizontal] > innerWidth / 2
        ? Math.max(0, innerWidth - currentWidth)
        : 0
    }
    else if (anchorProps[anchorOrigin.horizontal] > innerWidth / 2) {
      const anchorX = Math.min(
        innerWidth,
        anchorOrigin.horizontal === 'middle'
          ? anchorProps.middle
          : (anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.right : anchorProps.left)
      )
      props.maxWidth = Math.min(currentWidth, anchorX)
      props.left = Math.max(0, anchorX - props.maxWidth)
    }
    else {
      props.left = Math.max(0, anchorOrigin.horizontal === 'middle'
        ? anchorProps.middle
        : (anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.left : anchorProps.right)
      )
      props.maxWidth = Math.min(currentWidth, innerWidth - props.left)
    }
  }
}
