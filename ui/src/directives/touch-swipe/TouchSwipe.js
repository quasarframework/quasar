import { client } from '../../plugins/platform/Platform.js'

import { createDirective } from '../../utils/private.create/create.js'
import {
  getModifierDirections,
  shouldStart
} from '../../utils/private.touch/touch.js'
import {
  addEvt,
  cleanEvt,
  leftClick,
  noop,
  position,
  preventDraggable,
  stopAndPrevent
} from '../../utils/event/event.js'
import { clearSelection } from '../../utils/private.selection/selection.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

function parseArg(arg) {
  // delta (min velocity -- dist / time)
  // mobile min distance on first move
  // desktop min distance until deciding if it's a swipe or not
  const data = [0.06, 6, 50]

  if (typeof arg === 'string' && arg.length !== 0) {
    arg.split(':').forEach((val, index) => {
      const v = Number.parseFloat(val)
      if (v) data[index] = v
    })
  }

  return data
}

function removeBodyChildrenNoPointerEvents() {
  document.body.classList.remove('no-pointer-events--children')
}

export default createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'touch-swipe', getSSRProps }
    : {
        name: 'touch-swipe',

        beforeMount(el, { value, arg, modifiers }) {
          // early return, we don't need to do anything
          if (!modifiers.mouse && !client.has.touch) return

          const mouseCapture =
            // account for UMD too where modifiers will be lowercased to work
            modifiers.mouseCapture || modifiers.mousecapture ? 'Capture' : ''

          const ctx = {
            handler: value,
            sensitivity: parseArg(arg),
            direction: getModifierDirections(modifiers),

            noop,

            mouseStart(evt) {
              if (shouldStart(evt, ctx) && leftClick(evt)) {
                addEvt(ctx, 'temp', [
                  [document, 'mousemove', 'move', `notPassive${mouseCapture}`],
                  [document, 'mouseup', 'end', 'notPassiveCapture']
                ])
                ctx.start(evt, true)
              }
            },

            touchStart(evt) {
              if (shouldStart(evt, ctx)) {
                const target = evt.target
                addEvt(ctx, 'temp', [
                  [target, 'touchmove', 'move', 'notPassiveCapture'],
                  [target, 'touchcancel', 'end', 'notPassiveCapture'],
                  [target, 'touchend', 'end', 'notPassiveCapture']
                ])
                ctx.start(evt)
              }
            },

            start(evt, mouseEvent) {
              if (client.is.firefox) preventDraggable(el, true)

              const pos = position(evt)

              ctx.event = {
                x: pos.left,
                y: pos.top,
                time: Date.now(),
                mouse: mouseEvent === true,
                dir: false
              }
            },

            move(evt) {
              if (ctx.event === void 0) return

              if (ctx.event.dir !== false) {
                stopAndPrevent(evt)
                return
              }

              const time = Date.now() - ctx.event.time

              if (time === 0) return

              const pos = position(evt),
                distX = pos.left - ctx.event.x,
                absX = Math.abs(distX),
                distY = pos.top - ctx.event.y,
                absY = Math.abs(distY)

              if (!ctx.event.mouse) {
                if (absX < ctx.sensitivity[1] && absY < ctx.sensitivity[1]) {
                  ctx.end(evt)
                  return
                }
              }
              // is user trying to select text?
              // if so, then something should be reported here
              // (previous selection, if any, was discarded when swipe started)
              else if (window.getSelection().toString() !== '') {
                ctx.end(evt)
                return
              } else if (
                absX < ctx.sensitivity[2] &&
                absY < ctx.sensitivity[2]
              ) {
                return
              }

              const velX = absX / time,
                velY = absY / time

              if (
                ctx.direction.vertical &&
                absX < absY &&
                absX < 100 &&
                velY > ctx.sensitivity[0]
              ) {
                ctx.event.dir = distY < 0 ? 'up' : 'down'
              }

              if (
                ctx.direction.horizontal &&
                absX > absY &&
                absY < 100 &&
                velX > ctx.sensitivity[0]
              ) {
                ctx.event.dir = distX < 0 ? 'left' : 'right'
              }

              if (
                ctx.direction.up &&
                absX < absY &&
                distY < 0 &&
                absX < 100 &&
                velY > ctx.sensitivity[0]
              ) {
                ctx.event.dir = 'up'
              }

              if (
                ctx.direction.down &&
                absX < absY &&
                distY > 0 &&
                absX < 100 &&
                velY > ctx.sensitivity[0]
              ) {
                ctx.event.dir = 'down'
              }

              if (
                ctx.direction.left &&
                absX > absY &&
                distX < 0 &&
                absY < 100 &&
                velX > ctx.sensitivity[0]
              ) {
                ctx.event.dir = 'left'
              }

              if (
                ctx.direction.right &&
                absX > absY &&
                distX > 0 &&
                absY < 100 &&
                velX > ctx.sensitivity[0]
              ) {
                ctx.event.dir = 'right'
              }

              if (ctx.event.dir !== false) {
                stopAndPrevent(evt)

                if (ctx.event.mouse) {
                  document.body.classList.add(
                    'no-pointer-events--children',
                    'non-selectable'
                  )
                  clearSelection()

                  ctx.styleCleanup = () => {
                    ctx.styleCleanup = void 0
                    document.body.classList.remove('non-selectable')

                    // The class must NOT be kept around after the gesture ended
                    // (#18496): while it's set, nothing in the page can be
                    // hit-tested, so a mousedown that follows shortly after
                    // resolves to the document element instead of the element
                    // the user actually pressed on.
                    removeBodyChildrenNoPointerEvents()
                  }
                }

                ctx.handler({
                  evt,
                  touch: ctx.event.mouse !== true,
                  mouse: ctx.event.mouse,
                  direction: ctx.event.dir,
                  duration: time,
                  distance: {
                    x: absX,
                    y: absY
                  }
                })
              } else {
                ctx.end(evt)
              }
            },

            end(evt) {
              if (ctx.event === void 0) return

              cleanEvt(ctx, 'temp')
              if (client.is.firefox) preventDraggable(el, false)
              ctx.styleCleanup?.()
              if (evt !== void 0 && ctx.event.dir !== false) stopAndPrevent(evt)

              ctx.event = void 0
            }
          }

          el.__qtouchswipe = ctx

          if (modifiers.mouse) {
            // account for UMD too where modifiers will be lowercased to work
            const capture =
              modifiers.mouseCapture || modifiers.mousecapture ? 'Capture' : ''

            addEvt(ctx, 'main', [
              [el, 'mousedown', 'mouseStart', `passive${capture}`]
            ])
          }

          if (client.has.touch) {
            addEvt(ctx, 'main', [
              [
                el,
                'touchstart',
                'touchStart',
                `passive${modifiers.capture ? 'Capture' : ''}`
              ],
              [el, 'touchmove', 'noop', 'notPassiveCapture'] // cannot be passive (ex: iOS scroll)
            ])
          }
        },

        updated(el, bindings) {
          const ctx = el.__qtouchswipe

          if (ctx !== void 0) {
            if (bindings.oldValue !== bindings.value) {
              if (typeof bindings.value !== 'function') ctx.end()
              ctx.handler = bindings.value
            }

            ctx.direction = getModifierDirections(bindings.modifiers)
          }
        },

        beforeUnmount(el) {
          const ctx = el.__qtouchswipe

          if (ctx !== void 0) {
            cleanEvt(ctx, 'main')
            cleanEvt(ctx, 'temp')

            if (client.is.firefox) preventDraggable(el, false)
            ctx.styleCleanup?.()

            delete el.__qtouchswipe
          }
        }
      }
)
