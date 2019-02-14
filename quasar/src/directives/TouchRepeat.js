import { position, leftClick, stopAndPrevent } from '../utils/event.js'
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

export default {
  name: 'touch-repeat',

  bind (el, binding) {
    const
      keyboard = Object.keys(binding.modifiers).reduce((acc, key) => {
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
      handler: binding.value,

      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseAbort, true)
          document.addEventListener('click', ctx.mouseAbort, true)
          ctx.start(evt)
        }
      },

      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbort, true)
        document.removeEventListener('click', ctx.mouseAbort, true)
        ctx.abort(evt)
      },

      keyboardStart (evt) {
        if (ctx.event !== void 0) {
          stopAndPrevent(evt)
          return
        }

        if (keyboard.includes(evt.keyCode)) {
          document.addEventListener('keyup', ctx.keyboardAbort, true)
          ctx.start(evt, true)
        }
      },

      keyboardAbort (evt) {
        document.removeEventListener('keyup', ctx.keyboardAbort, true)
        ctx.abort(evt)
      },

      start (evt, keyboard) {
        ctx.event = {
          keyboard: keyboard === true,
          startTime: new Date().getTime(),
          repeatCount: 0
        }

        const fn = () => {
          if (ctx.event && ctx.event.repeatCount === 0) {
            ctx.event.evt = evt
            ctx.event.position = position(evt)
            document.documentElement.style.cursor = 'pointer'
            clearSelection()
            document.body.classList.add('non-selectable')
          }

          ctx.event.duration = new Date().getTime() - ctx.event.startTime
          ctx.event.repeatCount += 1

          ctx.handler(ctx.event)

          const index = durationsLast < ctx.event.repeatCount
            ? durationsLast
            : ctx.event.repeatCount

          ctx.timer = setTimeout(fn, durations[index])
        }

        if (keyboard && durations[0] === 0) {
          stopAndPrevent(evt)
          fn()
        }
        else {
          ctx.timer = setTimeout(fn, durations[0])
        }
      },

      abort (evt) {
        if (ctx.event && ctx.event.repeatCount > 0) {
          stopAndPrevent(evt)
          document.documentElement.style.cursor = ''
          document.body.classList.remove('non-selectable')
          clearSelection()
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
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.abort)
    el.addEventListener('touchend', ctx.abort)
  },

  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchrepeat.handler = binding.value
    }
  },

  unbind (el) {
    let ctx = el.__qtouchrepeat_old || el.__qtouchrepeat
    if (ctx !== void 0) {
      if (ctx.event !== void 0) {
        clearTimeout(ctx.timer)
        document.body.classList.remove('non-selectable')
      }
      el.removeEventListener('touchstart', ctx.start)
      el.removeEventListener('touchend', ctx.abort)
      el.removeEventListener('touchmove', ctx.abort)
      el.removeEventListener('mousedown', ctx.mouseStart)
      el.removeEventListener('keydown', ctx.keyboardStart)
      document.removeEventListener('mousemove', ctx.mouseAbort, true)
      document.removeEventListener('click', ctx.mouseAbort, true)
      document.removeEventListener('keyup', ctx.keyboardAbort, true)
      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
