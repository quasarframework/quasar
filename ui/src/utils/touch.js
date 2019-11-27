import { isSSR, client } from '../plugins/Platform.js'
import { listenOpts } from './event.js'

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

export function addEvt (ctx, target, events) {
  target += 'Evt'

  if (ctx[target] !== void 0) {
    ctx[target] = ctx[target].concat(events)
  }
  else {
    ctx[target] = events
  }

  events.forEach(evt => {
    evt[0].addEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]])
  })
}

export function cleanEvt (ctx, target) {
  target += 'Evt'

  if (ctx[target] !== void 0) {
    ctx[target].forEach(evt => {
      evt[0].removeEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]])
    })
    ctx[target] = void 0
  }
}

export const getTouchTarget = isSSR === false && (
  client.is.ios === true ||
  (client.is.mac === true && client.has.touch === true) || // is desktop view requested iOS
  window.navigator.vendor.toLowerCase().indexOf('apple') > -1
)
  ? () => document
  : target => target
