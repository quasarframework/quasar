
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

// This is especially important (not the main reason, but important)
// for TouchSwipe directive running on Firefox
// because text selection on such elements cannot be determined
// without additional work (on top of getSelection() API)
// https://bugzilla.mozilla.org/show_bug.cgi?id=85686
const avoidNodeNamesList = [ 'INPUT', 'TEXTAREA' ]

export function shouldStart (evt, ctx) {
  return ctx.event === void 0
    && evt.target !== void 0
    && evt.target.draggable !== true
    && typeof ctx.handler === 'function'
    && avoidNodeNamesList.includes(evt.target.nodeName.toUpperCase()) === false
    && (evt.qClonedBy === void 0 || evt.qClonedBy.indexOf(ctx.uid) === -1)
}
