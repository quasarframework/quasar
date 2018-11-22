import { position, leftClick } from '../utils/event.js'

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

function updateBinding (el, binding) {
  const ctx = el.__qtouchrepeat

  ctx.durations = ((typeof binding.arg === 'string' && binding.arg.length ? binding.arg : '0:600:300').split(':')).map(val => parseInt(val, 10))
  ctx.durationsLast = ctx.durations.length - 1

  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value
  }
}

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
      }, []),
      stopPropagation = binding.modifiers.stop,
      preventDefault = binding.modifiers.prevent

    let ctx = {
      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseAbort)
          document.addEventListener('click', ctx.mouseAbort, true)
          ctx.start(evt)
        }
      },

      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbort)
        document.removeEventListener('click', ctx.mouseAbort, true)
        ctx.abort(evt)
      },

      keyboardStart (evt) {
        if (keyboard.includes(evt.keyCode)) {
          el.removeEventListener('keydown', ctx.keyboardStart)
          document.addEventListener('keyup', ctx.keyboardAbort, true)
          ctx.start(evt, true)
        }
      },

      keyboardAbort (evt) {
        ctx.event && ctx.event.keyboard && keyboard.length && el.addEventListener('keydown', ctx.keyboardStart)
        document.removeEventListener('keyup', ctx.keyboardAbort, true)
        ctx.abort(evt)
      },

      start (evt, keyboard) {
        ctx.event = {
          keyboard,
          startTime: new Date().getTime(),
          repeatCount: 0
        }

        const timer = () => {
          if (!ctx.event.repeatCount) {
            ctx.event.evt = evt
            ctx.event.position = position(evt)

            stopPropagation && evt.stopPropagation()
            preventDefault && evt.preventDefault()
          }

          ctx.event.duration = new Date().getTime() - ctx.event.startTime
          ctx.event.repeatCount += 1

          ctx.handler(ctx.event)

          ctx.timer = setTimeout(timer, ctx.durations[ctx.durationsLast < ctx.event.repeatCount ? ctx.durationsLast : ctx.event.repeatCount])
        }

        ctx.timer = setTimeout(timer, ctx.durations[0])
      },

      abort (evt) {
        if (ctx.event && ctx.event.repeatCount) {
          stopPropagation && evt.stopPropagation()
          preventDefault && evt.preventDefault()
        }

        clearTimeout(ctx.timer)
        ctx.timer = null
        ctx.event = {}
      }
    }

    if (el.__qtouchrepeat) {
      el.__qtouchrepeat_old = el.__qtouchrepeat
    }

    el.__qtouchrepeat = ctx
    updateBinding(el, binding)

    if (binding.modifiers.noMouse !== true) {
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
    updateBinding(el, binding)
  },

  unbind (el) {
    let ctx = el.__qtouchrepeat_old || el.__qtouchrepeat
    if (ctx !== void 0) {
      el.removeEventListener('touchstart', ctx.start)
      el.removeEventListener('touchend', ctx.abort)
      el.removeEventListener('touchmove', ctx.abort)
      el.removeEventListener('mousedown', ctx.mouseStart)
      el.removeEventListener('keydown', ctx.keyboardStart)
      document.removeEventListener('mousemove', ctx.mouseAbort)
      document.removeEventListener('click', ctx.mouseAbort, true)
      document.removeEventListener('keyup', ctx.keyboardAbort, true)
      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
