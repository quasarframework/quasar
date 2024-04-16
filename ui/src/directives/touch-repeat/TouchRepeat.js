import { client } from '../../plugins/platform/Platform.js'

import { createDirective } from '../../utils/private.create/create.js'
import { addEvt, cleanEvt, position, leftClick, stopAndPrevent, noop } from '../../utils/event/event.js'
import { clearSelection } from '../../utils/private.selection/selection.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const
  keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    delete: [ 8, 46 ]
  },
  keyRegex = new RegExp(`^([\\d+]+|${ Object.keys(keyCodes).join('|') })$`, 'i')

function shouldEnd (evt, origin) {
  const { top, left } = position(evt)

  return Math.abs(left - origin.left) >= 7
    || Math.abs(top - origin.top) >= 7
}

export default createDirective(__QUASAR_SSR_SERVER__
  ? { name: 'touch-repeat', getSSRProps }
  : {
      name: 'touch-repeat',

      beforeMount (el, { modifiers, value, arg }) {
        const keyboard = Object.keys(modifiers).reduce((acc, key) => {
          if (keyRegex.test(key) === true) {
            const keyCode = isNaN(parseInt(key, 10)) ? keyCodes[ key.toLowerCase() ] : parseInt(key, 10)
            keyCode >= 0 && acc.push(keyCode)
          }
          return acc
        }, [])

        // early return, we don't need to do anything
        if (
          modifiers.mouse !== true
          && client.has.touch !== true
          && keyboard.length === 0
        ) {
          return
        }

        const durations = typeof arg === 'string' && arg.length !== 0
          ? arg.split(':').map(val => parseInt(val, 10))
          : [ 0, 600, 300 ]

        const durationsLast = durations.length - 1

        const ctx = {
          keyboard,
          handler: value,

          noop,

          mouseStart (evt) {
            if (ctx.event === void 0 && typeof ctx.handler === 'function' && leftClick(evt) === true) {
              addEvt(ctx, 'temp', [
                [ document, 'mousemove', 'move', 'passiveCapture' ],
                [ document, 'click', 'end', 'notPassiveCapture' ]
              ])
              ctx.start(evt, true)
            }
          },

          keyboardStart (evt) {
            if (typeof ctx.handler === 'function' && isKeyCode(evt, keyboard) === true) {
              if (durations[ 0 ] === 0 || ctx.event !== void 0) {
                stopAndPrevent(evt)
                el.focus()
                if (ctx.event !== void 0) {
                  return
                }
              }

              addEvt(ctx, 'temp', [
                [ document, 'keyup', 'end', 'notPassiveCapture' ],
                [ document, 'click', 'end', 'notPassiveCapture' ]
              ])
              ctx.start(evt, false, true)
            }
          },

          touchStart (evt) {
            if (evt.target !== void 0 && typeof ctx.handler === 'function') {
              const target = evt.target
              addEvt(ctx, 'temp', [
                [ target, 'touchmove', 'move', 'passiveCapture' ],
                [ target, 'touchcancel', 'end', 'notPassiveCapture' ],
                [ target, 'touchend', 'end', 'notPassiveCapture' ]
              ])
              ctx.start(evt)
            }
          },

          start (evt, mouseEvent, keyboardEvent) {
            if (keyboardEvent !== true) {
              ctx.origin = position(evt)
            }

            function styleCleanup (withDelay) {
              ctx.styleCleanup = void 0

              document.documentElement.style.cursor = ''

              const remove = () => {
                document.body.classList.remove('non-selectable')
              }

              if (withDelay === true) {
                clearSelection()
                setTimeout(remove, 10)
              }
              else { remove() }
            }

            if (client.is.mobile === true) {
              document.body.classList.add('non-selectable')
              clearSelection()
              ctx.styleCleanup = styleCleanup
            }

            ctx.event = {
              touch: mouseEvent !== true && keyboardEvent !== true,
              mouse: mouseEvent === true,
              keyboard: keyboardEvent === true,
              startTime: Date.now(),
              repeatCount: 0
            }

            const fn = () => {
              ctx.timer = void 0

              if (ctx.event === void 0) {
                return
              }

              if (ctx.event.repeatCount === 0) {
                ctx.event.evt = evt

                if (keyboardEvent === true) {
                  ctx.event.keyCode = evt.keyCode
                }
                else {
                  ctx.event.position = position(evt)
                }

                if (client.is.mobile !== true) {
                  document.documentElement.style.cursor = 'pointer'
                  document.body.classList.add('non-selectable')
                  clearSelection()
                  ctx.styleCleanup = styleCleanup
                }
              }

              ctx.event.duration = Date.now() - ctx.event.startTime
              ctx.event.repeatCount += 1

              ctx.handler(ctx.event)

              const index = durationsLast < ctx.event.repeatCount
                ? durationsLast
                : ctx.event.repeatCount

              ctx.timer = setTimeout(fn, durations[ index ])
            }

            if (durations[ 0 ] === 0) {
              fn()
            }
            else {
              ctx.timer = setTimeout(fn, durations[ 0 ])
            }
          },

          move (evt) {
            if (ctx.event !== void 0 && ctx.timer !== void 0 && shouldEnd(evt, ctx.origin) === true) {
              clearTimeout(ctx.timer)
              ctx.timer = void 0
            }
          },

          end (evt) {
            if (ctx.event === void 0) {
              return
            }

            ctx.styleCleanup !== void 0 && ctx.styleCleanup(true)
            evt !== void 0 && ctx.event.repeatCount > 0 && stopAndPrevent(evt)

            cleanEvt(ctx, 'temp')

            if (ctx.timer !== void 0) {
              clearTimeout(ctx.timer)
              ctx.timer = void 0
            }

            ctx.event = void 0
          }
        }

        el.__qtouchrepeat = ctx

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
          [ el, 'touchend', 'noop', 'passiveCapture' ]
        ])

        if (keyboard.length !== 0) {
          // account for UMD too where modifiers will be lowercased to work
          const capture = modifiers.keyCapture === true || modifiers.keycapture === true
            ? 'Capture'
            : ''

          addEvt(ctx, 'main', [
            [ el, 'keydown', 'keyboardStart', `notPassive${ capture }` ]
          ])
        }
      },

      updated (el, { oldValue, value }) {
        const ctx = el.__qtouchrepeat

        if (ctx !== void 0 && oldValue !== value) {
          typeof value !== 'function' && ctx.end()
          ctx.handler = value
        }
      },

      beforeUnmount (el) {
        const ctx = el.__qtouchrepeat

        if (ctx !== void 0) {
          ctx.timer !== void 0 && clearTimeout(ctx.timer)

          cleanEvt(ctx, 'main')
          cleanEvt(ctx, 'temp')

          ctx.styleCleanup !== void 0 && ctx.styleCleanup()

          delete el.__qtouchrepeat
        }
      }
    }
)
