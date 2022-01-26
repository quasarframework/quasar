const modifiersAll = {
  left: true,
  right: true,
  up: true,
  down: true,
  horizontal: true,
  vertical: true
}

const directionList = Object.keys(modifiersAll)

modifiersAll.all = true

export function getModifierDirections (mod) {
  const dir = {}

  for (const direction of directionList) {
    if (mod[ direction ] === true) {
      dir[ direction ] = true
    }
  }

  if (Object.keys(dir).length === 0) {
    return modifiersAll
  }

  if (dir.horizontal === true) {
    dir.left = dir.right = true
  }
  else if (dir.left === true && dir.right === true) {
    dir.horizontal = true
  }

  if (dir.vertical === true) {
    dir.up = dir.down = true
  }
  else if (dir.up === true && dir.down === true) {
    dir.vertical = true
  }

  if (dir.horizontal === true && dir.vertical === true) {
    dir.all = true
  }

  return dir
}

export function shouldStart (evt, ctx) {
  return ctx.event === void 0
    && evt.target !== void 0
    && evt.target.draggable !== true
    && typeof ctx.handler === 'function'
    && evt.target.nodeName.toUpperCase() !== 'INPUT'
    && (evt.qClonedBy === void 0 || evt.qClonedBy.indexOf(ctx.uid) === -1)
}
