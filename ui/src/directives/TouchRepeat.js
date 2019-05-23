import Platform from '../plugins/Platform.js'
import { position, leftClick, stopAndPrevent, prevent, listenOpts } from '../utils/event.js'
import { setObserver, removeObserver } from '../utils/touch.js'
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

const docEvtOpts = listenOpts.notPassiveCapture

export default {
  name: 'touch-repeat',

  bind (el, { modifiers, value, arg }) {
    if (el.__qtouchrepeat) {
      el.__qtouchrepeat_old = el.__qtouchrepeat
    }

    const keyboard = Object.keys(modifiers).reduce((acc, key) => {
      if (keyRegex.test(key)) {
        const keyCode = parseInt(key, 10)
        acc.push(keyCode || keyCodes[key.toLowerCase()])
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
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseMove, docEvtOpts)
          document.addEventListener('mouseup', ctx.mouseEnd, docEvtOpts)
          document.addEventListener('click', ctx.mouseEnd, docEvtOpts)

          ctx.start(evt, true)
        }
      },

      mouseMove (evt) {
        ctx.event !== void 0 && shouldEnd(evt, ctx.origin) === true && ctx.mouseEnd(evt)
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove, docEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, docEvtOpts)
        document.removeEventListener('click', ctx.mouseEnd, docEvtOpts)

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

          document.addEventListener('keyup', ctx.keyboardEnd, docEvtOpts)
          ctx.start(evt, false, true)
        }
      },

      keyboardEnd (evt) {
        document.removeEventListener('keyup', ctx.keyboardEnd, docEvtOpts)
        ctx.end(evt)
      },

      start (evt, mouseEvent, keyboardEvent) {
        removeObserver(ctx)
        if (mouseEvent !== true && keyboardEvent !== true) {
          setObserver(el, evt, ctx)
        }

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

        removeObserver(ctx)

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

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, modifiers.mouseCapture)
    }

    if (keyboard.length > 0) {
      el.addEventListener('keydown', ctx.keyboardStart, modifiers.keyCapture)
    }

    if (Platform.has.touch === true) {
      const opts = listenOpts['notPassive' + (modifiers.capture === true ? 'Capture' : '')]

      el.addEventListener('touchstart', ctx.start, opts)
      el.addEventListener('touchmove', ctx.move, opts)
      el.addEventListener('touchcancel', ctx.end, opts)
      el.addEventListener('touchend', ctx.end, opts)
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
      removeObserver(ctx)
      clearTimeout(ctx.timer)

      if (Platform.is.mobile === true || (ctx.event !== void 0 && ctx.event.repeatCount > 0)) {
        document.documentElement.style.cursor = ''
        document.body.classList.remove('non-selectable')
      }

      ctx.timer = void 0
      ctx.event = void 0

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, modifiers.mouseCapture)
        document.removeEventListener('mousemove', ctx.mouseMove, docEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, docEvtOpts)
        document.removeEventListener('click', ctx.mouseEnd, docEvtOpts)
      }

      if (ctx.keyboard.length > 0) {
        el.removeEventListener('keydown', ctx.keyboardStart, modifiers.keyCapture)
        document.removeEventListener('keyup', ctx.keyboardEnd, docEvtOpts)
      }

      if (Platform.has.touch === true) {
        const opts = listenOpts['notPassive' + (modifiers.capture === true ? 'Capture' : '')]

        el.removeEventListener('touchstart', ctx.start, opts)
        el.removeEventListener('touchmove', ctx.move, opts)
        el.removeEventListener('touchcancel', ctx.end, opts)
        el.removeEventListener('touchend', ctx.end, opts)
      }

      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
