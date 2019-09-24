import Platform from '../plugins/Platform.js'
import { position, leftClick, stopAndPrevent, prevent, listenOpts } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

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

const { notPassiveCapture } = listenOpts

export default {
  name: 'touch-repeat',

  bind (el, { modifiers, value, arg }) {
    if (el.__qtouchrepeat) {
      el.__qtouchrepeat_old = el.__qtouchrepeat
    }

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
      Platform.has.touch !== true &&
      keyboard.length === 0
    ) {
      return
    }

    const durations = typeof arg === 'string' && arg.length
      ? arg.split(':').map(val => parseInt(val, 10))
      : [0, 600, 300]

    const durationsLast = durations.length - 1

    let ctx = {
      keyboard,
      handler: value,

      mouseStart (evt) {
        if (ctx.skipMouse === true) {
          ctx.skipMouse = false
        }
        else if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseMove, notPassiveCapture)
          document.addEventListener('mouseup', ctx.mouseEnd, notPassiveCapture)
          document.addEventListener('click', ctx.mouseEnd, notPassiveCapture)
          ctx.start(evt, true)
        }
      },

      mouseMove (evt) {
        ctx.event !== void 0 && shouldEnd(evt, ctx.origin) === true && ctx.mouseEnd(evt)
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove, notPassiveCapture)
        document.removeEventListener('mouseup', ctx.mouseEnd, notPassiveCapture)
        document.removeEventListener('click', ctx.mouseEnd, notPassiveCapture)
        ctx.end(evt)
      },

      keyboardStart (evt) {
        if (keyboard.includes(evt.keyCode)) {
          if (durations[0] === 0 || ctx.event !== void 0) {
            stopAndPrevent(evt)
            el.focus()
            if (ctx.event !== void 0) {
              return
            }
          }

          document.addEventListener('keyup', ctx.keyboardEnd, notPassiveCapture)
          ctx.start(evt, false, true)
        }
      },

      keyboardEnd (evt) {
        document.removeEventListener('keyup', ctx.keyboardEnd, notPassiveCapture)
        ctx.end(evt)
      },

      touchStart (evt) {
        const target = evt.target
        if (target !== void 0) {
          ctx.touchTarget = target
          target.addEventListener('touchmove', ctx.move, notPassiveCapture)
          target.addEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          target.addEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          document.addEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
          ctx.start(evt)
        }
      },

      touchEnd (evt) {
        const target = ctx.touchTarget
        if (target !== void 0) {
          target.removeEventListener('touchmove', ctx.move, notPassiveCapture)
          target.removeEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          target.removeEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          ctx.skipMouse = true
          document.removeEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
          ctx.touchTarget = void 0
          ctx.end(evt)
        }
      },

      start (evt, mouseEvent, keyboardEvent) {
        if (keyboardEvent !== true) {
          ctx.origin = position(evt)
        }

        if (Platform.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()
        }

        ctx.event = {
          touch: mouseEvent !== true && keyboardEvent !== true,
          mouse: mouseEvent === true,
          keyboard: keyboardEvent === true,
          startTime: new Date().getTime(),
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

            if (Platform.is.mobile !== true) {
              document.documentElement.style.cursor = 'pointer'
              document.body.classList.add('non-selectable')
              clearSelection()
            }
          }

          ctx.event.duration = new Date().getTime() - ctx.event.startTime
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
        ctx.event !== void 0 && shouldEnd(evt, ctx.origin) === true && ctx.end(evt)
      },

      end (evt) {
        if (ctx.event === void 0) {
          return
        }

        const triggered = ctx.event.repeatCount > 0

        triggered === true && prevent(evt)

        if (Platform.is.mobile === true || triggered === true) {
          document.documentElement.style.cursor = ''
          document.body.classList.remove('non-selectable')
        }

        clearTimeout(ctx.timer)
        ctx.timer = void 0
        ctx.event = void 0
      }
    }

    el.__qtouchrepeat = ctx

    if (Platform.has.touch === true) {
      el.addEventListener('touchstart', ctx.touchStart, listenOpts[`notPassive${modifiers.capture === true ? 'Capture' : ''}`])
    }

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, listenOpts[`notPassive${modifiers.mouseCapture === true ? 'Capture' : ''}`])
    }

    if (keyboard.length > 0) {
      el.addEventListener('keydown', ctx.keyboardStart, listenOpts[`notPassive${modifiers.keyCapture === true ? 'Capture' : ''}`])
    }
  },

  update (el, binding) {
    let ctx = el.__qtouchrepeat

    if (ctx !== void 0 && binding.oldValue !== binding.value) {
      ctx.handler = binding.value
    }
  },

  unbind (el, { modifiers }) {
    let ctx = el.__qtouchrepeat_old || el.__qtouchrepeat

    if (ctx !== void 0) {
      clearTimeout(ctx.timer)

      if (Platform.is.mobile === true || (ctx.event !== void 0 && ctx.event.repeatCount > 0)) {
        document.documentElement.style.cursor = ''
        document.body.classList.remove('non-selectable')
      }

      ctx.timer = void 0
      ctx.event = void 0

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, listenOpts[`notPassive${modifiers.mouseCapture === true ? 'Capture' : ''}`])
        document.removeEventListener('mousemove', ctx.mouseMove, notPassiveCapture)
        document.removeEventListener('mouseup', ctx.mouseEnd, notPassiveCapture)
        document.removeEventListener('click', ctx.mouseEnd, notPassiveCapture)
      }

      if (ctx.keyboard.length > 0) {
        el.removeEventListener('keydown', ctx.keyboardStart, listenOpts[`notPassive${modifiers.keyCapture === true ? 'Capture' : ''}`])
        document.removeEventListener('keyup', ctx.keyboardEnd, notPassiveCapture)
      }

      if (Platform.has.touch === true) {
        el.removeEventListener('touchstart', ctx.touchStart, listenOpts[`notPassive${modifiers.capture === true ? 'Capture' : ''}`])
        const target = ctx.touchTarget
        if (target !== void 0) {
          target.removeEventListener('touchmove', ctx.move, notPassiveCapture)
          target.removeEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          target.removeEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          document.removeEventListener('mousedown', stopAndPrevent, notPassiveCapture)
          document.removeEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
        }
      }

      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
