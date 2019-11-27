import { client } from '../plugins/Platform.js'
import { addEvt, cleanEvt, getTouchTarget } from '../utils/touch.js'
import { position, leftClick, stopAndPrevent } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'
import { isKeyCode } from '../utils/key-composition.js'

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
    'delete': [8, 46]
  },
  keyRegex = new RegExp(`^([\\d+]+|${Object.keys(keyCodes).join('|')})$`, 'i')

function shouldEnd (evt, origin) {
  const { top, left } = position(evt)

  return Math.abs(left - origin.left) >= 7 ||
    Math.abs(top - origin.top) >= 7
}

export default {
  name: 'touch-repeat',

  bind (el, { modifiers, value, arg }) {
    const keyboard = Object.keys(modifiers).reduce((acc, key) => {
      if (keyRegex.test(key) === true) {
        const keyCode = isNaN(parseInt(key, 10)) ? keyCodes[key.toLowerCase()] : parseInt(key, 10)
        keyCode >= 0 && acc.push(keyCode)
      }
      return acc
    }, [])

    // early return, we don't need to do anything
    if (
      modifiers.mouse !== true &&
      client.has.touch !== true &&
      keyboard.length === 0
    ) {
      return
    }

    const durations = typeof arg === 'string' && arg.length > 0
      ? arg.split(':').map(val => parseInt(val, 10))
      : [0, 600, 300]

    const durationsLast = durations.length - 1

    const ctx = {
      keyboard,
      handler: value,

      // needed by addEvt / cleanEvt
      stopAndPrevent,

      mouseStart (evt) {
        if (ctx.skipMouse === true) {
          // touch actions finally generate this event
          // so we need to avoid it
          ctx.skipMouse = false
        }
        else if (ctx.event === void 0 && leftClick(evt) === true) {
          addEvt(ctx, 'temp', [
            [ document, 'mousemove', 'move', 'passiveCapture' ],
            [ document, 'mouseup', 'end', 'passiveCapture' ]
          ])
          ctx.start(evt, true)
        }
      },

      keyboardStart (evt) {
        if (isKeyCode(evt, keyboard) === true) {
          if (durations[0] === 0 || ctx.event !== void 0) {
            stopAndPrevent(evt)
            el.focus()
            if (ctx.event !== void 0) {
              return
            }
          }

          addEvt(ctx, 'temp', [
            [ document, 'keyup', 'end', 'passiveCapture' ]
          ])
          ctx.start(evt, false, true)
        }
      },

      touchStart (evt) {
        if (evt.target !== void 0) {
          const target = getTouchTarget(evt.target)
          addEvt(ctx, 'temp', [
            [ target, 'touchmove', 'move', 'passiveCapture' ],
            [ target, 'touchcancel', 'touchEnd', 'passiveCapture' ],
            [ target, 'touchend', 'touchEnd', 'passiveCapture' ],
            [ document, 'contextmenu', 'stopAndPrevent', 'notPassiveCapture' ]
          ])
          ctx.start(evt)
        }
      },

      touchEnd (evt) {
        if (ctx.event !== void 0) {
          ctx.skipMouse = true
          ctx.end(evt)
        }
      },

      start (evt, mouseEvent, keyboardEvent) {
        if (keyboardEvent !== true) {
          ctx.origin = position(evt)
        }

        if (client.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()
        }

        ctx.event = {
          touch: mouseEvent !== true && keyboardEvent !== true,
          mouse: mouseEvent === true,
          keyboard: keyboardEvent === true,
          startTime: Date.now(),
          repeatCount: 0
        }

        const fn = () => {
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
            }
          }

          ctx.event.duration = Date.now() - ctx.event.startTime
          ctx.event.repeatCount += 1

          ctx.handler(ctx.event)

          const index = durationsLast < ctx.event.repeatCount
            ? durationsLast
            : ctx.event.repeatCount

          ctx.timer = setTimeout(fn, durations[index])
        }

        if (durations[0] === 0) {
          fn()
        }
        else {
          ctx.timer = setTimeout(fn, durations[0])
        }
      },

      move (evt) {
        if (ctx.event !== void 0 && shouldEnd(evt, ctx.origin) === true) {
          if (ctx.event.touch === true) {
            ctx.touchEnd(evt)
          }
          else {
            ctx.end(evt)
          }
        }
      },

      end () {
        if (ctx.event === void 0) {
          return
        }

        const triggered = ctx.event.repeatCount > 0

        if (client.is.mobile === true || triggered === true) {
          document.documentElement.style.cursor = ''
          clearSelection()
          // delay needed otherwise selection still occurs
          setTimeout(() => {
            document.body.classList.remove('non-selectable')
          }, 10)
        }

        cleanEvt(ctx, 'temp')
        clearTimeout(ctx.timer)

        ctx.timer = void 0
        ctx.event = void 0
      }
    }

    if (el.__qtouchrepeat) {
      el.__qtouchrepeat_old = el.__qtouchrepeat
    }

    el.__qtouchrepeat = ctx

    modifiers.mouse === true && addEvt(ctx, 'main', [
      [ el, 'mousedown', 'mouseStart', `passive${modifiers.mouseCapture === true ? 'Capture' : ''}` ]
    ])

    client.has.touch === true && addEvt(ctx, 'main', [
      [ el, 'touchstart', 'touchStart', `passive${modifiers.capture === true ? 'Capture' : ''}` ]
    ])

    keyboard.length > 0 && addEvt(ctx, 'main', [
      [ el, 'keydown', 'keyboardStart', `notPassive${modifiers.keyCapture === true ? 'Capture' : ''}` ]
    ])
  },

  update (el, binding) {
    const ctx = el.__qtouchrepeat

    if (ctx !== void 0 && binding.oldValue !== binding.value) {
      ctx.handler = binding.value
    }
  },

  unbind (el) {
    const ctx = el.__qtouchrepeat_old || el.__qtouchrepeat

    if (ctx !== void 0) {
      clearTimeout(ctx.timer)

      cleanEvt(ctx, 'main')
      cleanEvt(ctx, 'temp')

      if (client.is.mobile === true || (ctx.event !== void 0 && ctx.event.repeatCount > 0)) {
        document.documentElement.style.cursor = ''
        document.body.classList.remove('non-selectable')
      }

      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
