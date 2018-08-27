export const listenOpts = {}
Object.defineProperty(listenOpts, 'passive', {
  configurable: true,
  get () {
    let passive

    try {
      var opts = Object.defineProperty({}, 'passive', {
        get () {
          passive = { passive: true }
        }
      })
      window.addEventListener('qtest', null, opts)
      window.removeEventListener('qtest', null, opts)
    }
    catch (e) {}

    listenOpts.passive = passive
    return passive
  },
  set (val) {
    Object.defineProperty(this, 'passive', {
      value: val
    })
  }
})

export function leftClick (e) {
  return e.button === 0
}

export function middleClick (e) {
  return e.button === 1
}

export function rightClick (e) {
  return e.button === 2
}

export function getEventKey (e) {
  return e.which || e.keyCode
}

export function position (e) {
  let posx, posy

  if (e.touches && e.touches[0]) {
    e = e.touches[0]
  }
  else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0]
  }

  if (e.clientX || e.clientY) {
    posx = e.clientX
    posy = e.clientY
  }
  else if (e.pageX || e.pageY) {
    posx = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft
    posy = e.pageY - document.body.scrollTop - document.documentElement.scrollTop
  }
  else {
    const offset = targetElement(e).getBoundingClientRect()
    posx = ((offset.right - offset.left) / 2) + offset.left
    posy = ((offset.bottom - offset.top) / 2) + offset.top
  }

  return {
    top: posy,
    left: posx
  }
}

export function targetElement (e) {
  let target

  if (e.target) {
    target = e.target
  }
  else if (e.srcElement) {
    target = e.srcElement
  }

  // defeat Safari bug
  if (target.nodeType === 3) {
    target = target.parentNode
  }

  return target
}

export function getEventPath (e) {
  if (e.path) {
    return e.path
  }
  if (e.composedPath) {
    return e.composedPath()
  }

  const path = []
  let el = e.target

  while (el) {
    path.push(el)

    if (el.tagName === 'HTML') {
      path.push(document)
      path.push(window)
      return path
    }

    el = el.parentElement
  }
}

// Reasonable defaults
const
  LINE_HEIGHT = 40,
  PAGE_HEIGHT = 800

export function getMouseWheelDistance (e) {
  let x = e.deltaX, y = e.deltaY

  if ((x || y) && e.deltaMode) {
    const multiplier = e.deltaMode === 1 ? LINE_HEIGHT : PAGE_HEIGHT
    x *= multiplier
    y *= multiplier
  }

  if (e.shiftKey && !x) {
    [y, x] = [x, y]
  }

  return { x, y }
}

export function stopAndPrevent (e) {
  e.preventDefault()
  e.stopPropagation()
}

export default {
  listenOpts,
  leftClick,
  middleClick,
  rightClick,
  getEventKey,
  position,
  targetElement,
  getEventPath,
  getMouseWheelDistance,
  stopAndPrevent
}
