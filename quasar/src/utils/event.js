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

export function position (e) {
  if (e.touches && e.touches[0]) {
    e = e.touches[0]
  }
  else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0]
  }

  return {
    top: e.clientY,
    left: e.clientX
  }
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

export function stop (e) {
  e.stopPropagation()
}

export function prevent (e) {
  e.preventDefault()
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
  position,
  getEventPath,
  getMouseWheelDistance,
  stop,
  prevent,
  stopAndPrevent
}
