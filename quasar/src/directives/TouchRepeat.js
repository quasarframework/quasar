import { position, leftClick, stopAndPrevent } from '../utils/event.js'
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
        if (ctx.touchTargetObserver !== void 0) {
          ctx.touchTargetObserver.disconnect()
          ctx.touchTargetObserver = void 0
        }
        const target = evt.target
        ctx.touchTargetObserver = new MutationObserver(() => {
          if (el.contains(target) === false) {
            if (keyboardEvent) {
              ctx.keyboardEnd(evt)
            }
            else if (mouseEvent) {
              ctx.mouseEnd(evt)
            }
            else {
              ctx.end(evt)
            }
          }
        })
        ctx.touchTargetObserver.observe(el, { childList: true, subtree: true })

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
          if (ctx.event && ctx.event.repeatCount === 0) {
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

      end () {
        if (ctx.touchTargetObserver !== void 0) {
          ctx.touchTargetObserver.disconnect()
          ctx.touchTargetObserver = void 0
        }

        if (Platform.is.mobile === true || (ctx.event !== void 0 && ctx.event.repeatCount > 0)) {
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
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.end)
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
      if (ctx.touchTargetObserver !== void 0) {
        ctx.touchTargetObserver.disconnect()
        ctx.touchTargetObserver = void 0
      }

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
      el.removeEventListener('touchstart', ctx.start)
      el.removeEventListener('touchmove', ctx.end)
      el.removeEventListener('touchcancel', ctx.end)
      el.removeEventListener('touchend', ctx.end)

      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
