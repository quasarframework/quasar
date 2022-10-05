import { client } from '../plugins/Platform.js'

import { createDirective } from '../utils/private/create.js'
import { getModifierDirections, shouldStart } from '../utils/private/touch.js'
import { addEvt, cleanEvt, position, leftClick, prevent, stop, stopAndPrevent, preventDraggable, noop } from '../utils/event.js'
import { clearSelection } from '../utils/private/selection.js'
import getSSRProps from '../utils/private/noop-ssr-directive-transform.js'

function getChanges (evt, ctx, isFinal) {
  const pos = position(evt)
  let
    dir,
    distX = pos.left - ctx.event.x,
    distY = pos.top - ctx.event.y,
    absX = Math.abs(distX),
    absY = Math.abs(distY)

  const direction = ctx.direction

  if (direction.horizontal === true && direction.vertical !== true) {
    dir = distX < 0 ? 'left' : 'right'
  }
  else if (direction.horizontal !== true && direction.vertical === true) {
    dir = distY < 0 ? 'up' : 'down'
  }
  else if (direction.up === true && distY < 0) {
    dir = 'up'
    if (absX > absY) {
      if (direction.left === true && distX < 0) {
        dir = 'left'
      }
      else if (direction.right === true && distX > 0) {
        dir = 'right'
      }
    }
  }
  else if (direction.down === true && distY > 0) {
    dir = 'down'
    if (absX > absY) {
      if (direction.left === true && distX < 0) {
        dir = 'left'
      }
      else if (direction.right === true && distX > 0) {
        dir = 'right'
      }
    }
  }
  else if (direction.left === true && distX < 0) {
    dir = 'left'
    if (absX < absY) {
      if (direction.up === true && distY < 0) {
        dir = 'up'
      }
      else if (direction.down === true && distY > 0) {
        dir = 'down'
      }
    }
  }
  else if (direction.right === true && distX > 0) {
    dir = 'right'
    if (absX < absY) {
      if (direction.up === true && distY < 0) {
        dir = 'up'
      }
      else if (direction.down === true && distY > 0) {
        dir = 'down'
      }
    }
  }

  let synthetic = false

  if (dir === void 0 && isFinal === false) {
    if (ctx.event.isFirst === true || ctx.event.lastDir === void 0) {
      return {}
    }

    dir = ctx.event.lastDir
    synthetic = true

    if (dir === 'left' || dir === 'right') {
      pos.left -= distX
      absX = 0
      distX = 0
    }
    else {
      pos.top -= distY
      absY = 0
      distY = 0
    }
  }

  return {
    synthetic,
    payload: {
      evt,
      touch: ctx.event.mouse !== true,
      mouse: ctx.event.mouse === true,
      position: pos,
      direction: dir,
      isFirst: ctx.event.isFirst,
      isFinal: isFinal === true,
      duration: Date.now() - ctx.event.time,
      distance: {
        x: absX,
        y: absY
      },
      offset: {
        x: distX,
        y: distY
      },
      delta: {
        x: pos.left - ctx.event.lastX,
        y: pos.top - ctx.event.lastY
      }
    }
  }
}

let uid = 0

export default createDirective(__QUASAR_SSR_SERVER__
  ? { name: 'touch-pan', getSSRProps }
  : {
      name: 'touch-pan',

      beforeMount (el, { value, modifiers }) {
        // early return, we don't need to do anything
        if (modifiers.mouse !== true && client.has.touch !== true) {
          return
        }

        function handleEvent (evt, mouseEvent) {
          if (modifiers.mouse === true && mouseEvent === true) {
            stopAndPrevent(evt)
          }
          else {
            modifiers.stop === true && stop(evt)
            modifiers.prevent === true && prevent(evt)
          }
        }

        const ctx = {
          uid: 'qvtp_' + (uid++),
          handler: value,
          modifiers,
          direction: getModifierDirections(modifiers),

          noop,

          mouseStart (evt) {
            if (shouldStart(evt, ctx) && leftClick(evt)) {
              addEvt(ctx, 'temp', [
                [ document, 'mousemove', 'move', 'notPassiveCapture' ],
                [ document, 'mouseup', 'end', 'passiveCapture' ]
              ])

              ctx.start(evt, true)
            }
          },

          touchStart (evt) {
            if (shouldStart(evt, ctx)) {
              const target = evt.target

              addEvt(ctx, 'temp', [
                [ target, 'touchmove', 'move', 'notPassiveCapture' ],
                [ target, 'touchcancel', 'end', 'passiveCapture' ],
                [ target, 'touchend', 'end', 'passiveCapture' ]
              ])

              ctx.start(evt)
            }
          },

          start (evt, mouseEvent) {
            client.is.firefox === true && preventDraggable(el, true)
            ctx.lastEvt = evt

            /*
            * Stop propagation so possible upper v-touch-pan don't catch this as well;
            * If we're not the target (based on modifiers), we'll re-emit the event later
            */
            if (mouseEvent === true || modifiers.stop === true) {
              /*
              * are we directly switching to detected state?
              * clone event only otherwise
              */
              if (
                ctx.direction.all !== true
                // account for UMD too where modifiers will be lowercased to work
                && (mouseEvent !== true || (ctx.modifiers.mouseAllDir !== true && ctx.modifiers.mousealldir !== true))
              ) {
                const clone = evt.type.indexOf('mouse') > -1
                  ? new MouseEvent(evt.type, evt)
                  : new TouchEvent(evt.type, evt)

                evt.defaultPrevented === true && prevent(clone)
                evt.cancelBubble === true && stop(clone)

                Object.assign(clone, {
                  qKeyEvent: evt.qKeyEvent,
                  qClickOutside: evt.qClickOutside,
                  qAnchorHandled: evt.qAnchorHandled,
                  qClonedBy: evt.qClonedBy === void 0
                    ? [ ctx.uid ]
                    : evt.qClonedBy.concat(ctx.uid)
                })

                ctx.initialEvent = {
                  target: evt.target,
                  event: clone
                }
              }

              stop(evt)
            }

            const { left, top } = position(evt)

            ctx.event = {
              x: left,
              y: top,
              time: Date.now(),
              mouse: mouseEvent === true,
              detected: false,
              isFirst: true,
              isFinal: false,
              lastX: left,
              lastY: top
            }
          },

          move (evt) {
            if (ctx.event === void 0) {
              return
            }

            const
              pos = position(evt),
              distX = pos.left - ctx.event.x,
              distY = pos.top - ctx.event.y

            // prevent buggy browser behavior (like Blink-based engine ones on Windows)
            // where the mousemove event occurs even if there's no movement after mousedown
            // https://bugs.chromium.org/p/chromium/issues/detail?id=161464
            // https://bugs.chromium.org/p/chromium/issues/detail?id=721341
            // https://github.com/quasarframework/quasar/issues/10721
            if (distX === 0 && distY === 0) {
              return
            }

            ctx.lastEvt = evt

            const isMouseEvt = ctx.event.mouse === true
            const start = () => {
              handleEvent(evt, isMouseEvt)

              let cursor
              if (modifiers.preserveCursor !== true && modifiers.preservecursor !== true) {
                cursor = document.documentElement.style.cursor || ''
                document.documentElement.style.cursor = 'grabbing'
              }

              isMouseEvt === true && document.body.classList.add('no-pointer-events--children')
              document.body.classList.add('non-selectable')
              clearSelection()

              ctx.styleCleanup = withDelayedFn => {
                ctx.styleCleanup = void 0

                if (cursor !== void 0) {
                  document.documentElement.style.cursor = cursor
                }

                document.body.classList.remove('non-selectable')

                if (isMouseEvt === true) {
                  const remove = () => {
                    document.body.classList.remove('no-pointer-events--children')
                  }

                  if (withDelayedFn !== void 0) {
                    setTimeout(() => {
                      remove()
                      withDelayedFn()
                    }, 50)
                  }
                  else { remove() }
                }
                else if (withDelayedFn !== void 0) {
                  withDelayedFn()
                }
              }
            }

            if (ctx.event.detected === true) {
              ctx.event.isFirst !== true && handleEvent(evt, ctx.event.mouse)

              const { payload, synthetic } = getChanges(evt, ctx, false)

              if (payload !== void 0) {
                if (ctx.handler(payload) === false) {
                  ctx.end(evt)
                }
                else {
                  if (ctx.styleCleanup === void 0 && ctx.event.isFirst === true) {
                    start()
                  }

                  ctx.event.lastX = payload.position.left
                  ctx.event.lastY = payload.position.top
                  ctx.event.lastDir = synthetic === true ? void 0 : payload.direction
                  ctx.event.isFirst = false
                }
              }

              return
            }

            if (
              ctx.direction.all === true
              // account for UMD too where modifiers will be lowercased to work
              || (isMouseEvt === true && (ctx.modifiers.mouseAllDir === true || ctx.modifiers.mousealldir === true))
            ) {
              start()
              ctx.event.detected = true
              ctx.move(evt)
              return
            }

            const
              absX = Math.abs(distX),
              absY = Math.abs(distY)

            if (absX !== absY) {
              if (
                (ctx.direction.horizontal === true && absX > absY)
                || (ctx.direction.vertical === true && absX < absY)
                || (ctx.direction.up === true && absX < absY && distY < 0)
                || (ctx.direction.down === true && absX < absY && distY > 0)
                || (ctx.direction.left === true && absX > absY && distX < 0)
                || (ctx.direction.right === true && absX > absY && distX > 0)
              ) {
                ctx.event.detected = true
                ctx.move(evt)
              }
              else {
                ctx.end(evt, true)
              }
            }
          },

          end (evt, abort) {
            if (ctx.event === void 0) {
              return
            }

            cleanEvt(ctx, 'temp')
            client.is.firefox === true && preventDraggable(el, false)

            if (abort === true) {
              ctx.styleCleanup !== void 0 && ctx.styleCleanup()

              if (ctx.event.detected !== true && ctx.initialEvent !== void 0) {
                ctx.initialEvent.target.dispatchEvent(ctx.initialEvent.event)
              }
            }
            else if (ctx.event.detected === true) {
              ctx.event.isFirst === true && ctx.handler(getChanges(evt === void 0 ? ctx.lastEvt : evt, ctx).payload)

              const { payload } = getChanges(evt === void 0 ? ctx.lastEvt : evt, ctx, true)
              const fn = () => { ctx.handler(payload) }

              if (ctx.styleCleanup !== void 0) {
                ctx.styleCleanup(fn)
              }
              else {
                fn()
              }
            }

            ctx.event = void 0
            ctx.initialEvent = void 0
            ctx.lastEvt = void 0
          }
        }

        el.__qtouchpan = ctx

        if (modifiers.mouse === true) {
          // account for UMD too where modifiers will be lowercased to work
          const capture = modifiers.mouseCapture === true || modifiers.mousecapture === true
            ? 'Capture'
            : ''

          addEvt(ctx, 'main', [
            [ el, 'mousedown', 'mouseStart', `passive${ capture }` ]
          ])
        }

        client.has.touch === true && addEvt(ctx, 'main', [
          [ el, 'touchstart', 'touchStart', `passive${ modifiers.capture === true ? 'Capture' : '' }` ],
          [ el, 'touchmove', 'noop', 'notPassiveCapture' ] // cannot be passive (ex: iOS scroll)
        ])
      },

      updated (el, bindings) {
        const ctx = el.__qtouchpan

        if (ctx !== void 0) {
          if (bindings.oldValue !== bindings.value) {
            typeof value !== 'function' && ctx.end()
            ctx.handler = bindings.value
          }

          ctx.direction = getModifierDirections(bindings.modifiers)
        }
      },

      beforeUnmount (el) {
        const ctx = el.__qtouchpan

        if (ctx !== void 0) {
          // emit the end event when the directive is destroyed while active
          // this is only needed in TouchPan because the rest of the touch directives do not emit an end event
          // the condition is also checked in the start of function but we avoid the call
          ctx.event !== void 0 && ctx.end()

          cleanEvt(ctx, 'main')
          cleanEvt(ctx, 'temp')

          client.is.firefox === true && preventDraggable(el, false)
          ctx.styleCleanup !== void 0 && ctx.styleCleanup()

          delete el.__qtouchpan
        }
      }
    }
)
