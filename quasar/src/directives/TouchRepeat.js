import { position, leftClick, stopAndPrevent, listenOpts } from '../utils/event.js'
import { setObserver, removeObserver } from '../utils/touch-observer.js'
import { clearSelection } from '../utils/selection.js'
import Platform from '../plugins/Platform.js'

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

export default {
  name: 'touch-repeat',

  bind (el, binding) {
    const keyboard = Object.keys(binding.modifiers).reduce((acc, key) => {
      if (keyRegex.test(key)) {
        const keyCode = parseInt(key, 10)
        acc.push(keyCode || keyCodes[key.toLowerCase()])
      }

      return acc
    }, [])

    const durations = typeof binding.arg === 'string' && binding.arg.length
      ? binding.arg.split(':').map(val => parseInt(val, 10))
      : [0, 600, 300]

    const durationsLast = durations.length - 1

    let ctx = {
      keyboard,
      handler: binding.value,

      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseEnd, true)
          document.addEventListener('click', ctx.mouseEnd, true)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseEnd, true)
        document.removeEventListener('click', ctx.mouseEnd, true)
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

          document.addEventListener('keyup', ctx.keyboardEnd, true)
          ctx.start(evt, false, true)
        }
      },

      keyboardEnd (evt) {
        document.removeEventListener('keyup', ctx.keyboardEnd, true)
        ctx.end(evt)
      },

      start (evt, mouseEvent, keyboardEvent) {
        removeObserver(ctx)
        if (mouseEvent !== true && keyboardEvent !== true) {
          setObserver(el, evt, ctx)
        }

        if (Platform.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()
        }

        ctx.event = {
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
            ctx.event.position = position(evt)
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

        ctx.timer = setTimeout(fn, durations[0])
      },

      end (evt) {
        if (ctx.event === void 0) {
          return
        }

        removeObserver(ctx)

        const triggered = ctx.event.repeatCount > 0

        triggered === true && stopAndPrevent(evt)

        if (Platform.is.mobile === true || triggered === true) {
          document.documentElement.style.cursor = ''
          document.body.classList.remove('non-selectable')
        }

        clearTimeout(ctx.timer)
        ctx.timer = void 0
        ctx.event = void 0
      }
    }

    if (el.__qtouchrepeat) {
      el.__qtouchrepeat_old = el.__qtouchrepeat
    }

    el.__qtouchrepeat = ctx

    if (binding.modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart)
    }
    if (keyboard.length > 0) {
      el.addEventListener('keydown', ctx.keyboardStart)
    }
    el.addEventListener('touchstart', ctx.start, listenOpts.notPassive)
    el.addEventListener('touchmove', ctx.end, listenOpts.notPassive)
    el.addEventListener('touchcancel', ctx.end)
    el.addEventListener('touchend', ctx.end)
  },

  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchrepeat.handler = binding.value
    }
  },

  unbind (el, binding) {
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

      if (binding.modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart)
        document.removeEventListener('mousemove', ctx.mouseEnd, true)
        document.removeEventListener('click', ctx.mouseEnd, true)
      }
      if (ctx.keyboard.length > 0) {
        el.removeEventListener('keydown', ctx.keyboardStart)
        document.removeEventListener('keyup', ctx.keyboardEnd, true)
      }
      el.removeEventListener('touchstart', ctx.start, listenOpts.notPassive)
      el.removeEventListener('touchmove', ctx.end, listenOpts.notPassive)
      el.removeEventListener('touchcancel', ctx.end)
      el.removeEventListener('touchend', ctx.end)

      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
