const directions = ['left', 'right', 'up', 'down', 'horizontal', 'vertical']

const modifiersAll = {
  left: true,
  right: true,
  up: true,
  down: true,
  horizontal: true,
  vertical: true,
  all: true
}

export function getModifierDirections (mod) {
  let dir = {}

  directions.forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true
    }
  })

  if (Object.keys(dir).length === 0) {
    return modifiersAll
  }

  if (dir.horizontal === true) {
    dir.left = dir.right = true
  }
  if (dir.vertical === true) {
    dir.up = dir.down = true
  }
  if (dir.left === true && dir.right === true) {
    dir.horizontal = true
  }
  if (dir.up === true && dir.down === true) {
    dir.vertical = true
  }
  if (dir.horizontal === true && dir.vertical === true) {
    dir.all = true
  }

  return dir
}

export function updateModifiers (ctx, { oldValue, value, modifiers }) {
  if (oldValue !== value) {
    ctx.handler = value
  }

  if (directions.some(direction => modifiers[direction] !== ctx.modifiers[direction])) {
    ctx.modifiers = modifiers
    ctx.direction = getModifierDirections(modifiers)
  }
}

export function setObserver (el, evt, ctx) {
  const target = evt.target
  ctx.touchTargetObserver = new MutationObserver(() => {
    el.contains(target) === false && ctx.end(evt)
  })
  ctx.touchTargetObserver.observe(el, { childList: true, subtree: true })
}

export function removeObserver (ctx) {
  if (ctx.touchTargetObserver !== void 0) {
    ctx.touchTargetObserver.disconnect()
    ctx.touchTargetObserver = void 0
  }
}
