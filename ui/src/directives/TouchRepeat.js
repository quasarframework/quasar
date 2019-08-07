import Platform from '../plugins/Platform.js'
import { position, leftClick, stopAndPrevent, listenOpts } from '../utils/event.js'

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

const { passiveCapture, notPassiveCapture } = listenOpts

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
      Platform.has.touch !== true &&
      keyboard.length === 0
    ) {
      return
    }

    const
      durations = typeof arg === 'string' && arg.length
        ? arg.split(':').map(val => parseInt(val, 10))
        : [0, 600, 300],
      durationsLast = durations.length - 1,
      touchEvtOpts = listenOpts['passive' + (modifiers.capture === true ? 'Capture' : '')],
      mouseEvtOpts = listenOpts['passive' + (modifiers.mouseCapture === true ? 'Capture' : '')]

    const ctx = {
      keyboard,
      handler: value,

      mouseStart (evt) {
        if (ctx.skipNextMouse === true) {
          ctx.skipNextMouse = void 0
          return
        }
        if (ctx.eventStarter === void 0 && leftClick(evt)) {
          document.addEventListener('mousemove', ctx.move, mouseEvtOpts)
          document.addEventListener('mouseup', ctx.mouseEnd, passiveCapture)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.move, mouseEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, passiveCapture)
        ctx.end(evt)
      },

      touchStart (evt) {
        const touchTarget = evt.target
        if (ctx.eventStarter === void 0 && touchTarget !== void 0) {
          ctx.touchTarget = touchTarget
          ctx.skipNextMouse = true
          touchTarget.addEventListener('touchmove', ctx.move, touchEvtOpts)
          touchTarget.addEventListener('touchcancel', ctx.touchEnd, passiveCapture)
          touchTarget.addEventListener('touchend', ctx.touchEnd, passiveCapture)
          ctx.start(evt)
        }
      },

      touchEnd (evt) {
        const touchTarget = ctx.touchTarget
        if (touchTarget !== void 0) {
          touchTarget.removeEventListener('touchmove', ctx.move, touchEvtOpts)
          touchTarget.removeEventListener('touchcancel', ctx.touchEnd, passiveCapture)
          touchTarget.removeEventListener('touchend', ctx.touchEnd, passiveCapture)
        }
        ctx.end(evt)
      },

      keyboardStart (evt) {
        if (ctx.eventStarter === void 0 && keyboard.includes(evt.keyCode)) {
          el.focus()
          el.addEventListener('blur', ctx.keyboardEnd, passiveCapture)
          document.addEventListener('keyup', ctx.keyboardEnd, passiveCapture)
          ctx.start(evt, false, true)
        }
      },

      keyboardEnd (evt) {
        el.removeEventListener('blur', ctx.keyboardEnd, passiveCapture)
        document.removeEventListener('keyup', ctx.keyboardEnd, passiveCapture)
        ctx.end(evt)
      },

      start (evt, mouseEvent, keyboardEvent) {
        ctx.origin = keyboardEvent === true ? void 0 : position(evt)
        ctx.eventStarter = mouseEvent === true ? 'mouse' : (keyboardEvent === true ? 'keyboard' : 'touch')

        ctx.event = {
          touch: mouseEvent !== true && keyboardEvent !== true,
          mouse: mouseEvent === true,
          keyboard: keyboardEvent === true,
          startTime: new Date().getTime(),
          repeatCount: 0
        }

        ctx.eventStarter === 'touch' && document.body.classList.add('non-selectable')
        ctx.eventStarter === 'mouse' && (document.documentElement.style.cursor = 'pointer')

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

            document.addEventListener('click', stopAndPrevent, notPassiveCapture)
            ctx.eventStarter === 'touch' && document.addEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
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
        if (
          ctx.origin === void 0 ||
          shouldEnd(evt, ctx.origin) === true
        ) {
          clearTimeout(ctx.timer)
        }
      },

      end () {
        const { eventStarter } = ctx

        clearTimeout(ctx.timer)

        eventStarter === 'touch' && document.body.classList.remove('non-selectable')
        eventStarter === 'mouse' && (document.documentElement.style.cursor = '')

        if (ctx.event !== void 0 && ctx.event.repeatCount > 0) {
          setTimeout(() => {
            document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
            eventStarter === 'touch' && document.removeEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
          }, 50)
        }

        setTimeout(() => {
          ctx.origin = void 0
          ctx.eventStarter = void 0
          ctx.event = void 0
          ctx.touchTarget = void 0
        }, 0)
      }
    }

    if (el.__qtouchrepeat) {
      el.__qtouchrepeat_old = el.__qtouchrepeat
    }

    el.__qtouchrepeat = ctx

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, mouseEvtOpts)
    }

    if (Platform.has.touch === true) {
      el.addEventListener('touchstart', ctx.touchStart, touchEvtOpts)
    }

    if (keyboard.length > 0) {
      el.addEventListener('keydown', ctx.keyboardStart, listenOpts['passive' + (modifiers.keyCapture === true ? 'Capture' : '')])
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
      const
        touchEvtOpts = listenOpts['passive' + (modifiers.capture === true ? 'Capture' : '')],
        mouseEvtOpts = listenOpts['passive' + (modifiers.mouseCapture === true ? 'Capture' : '')]

      clearTimeout(ctx.timer)

      ctx.eventStarter === 'touch' && document.body.classList.remove('non-selectable')
      ctx.eventStarter === 'mouse' && (document.documentElement.style.cursor = '')

      if (ctx.event !== void 0 && ctx.event.repeatCount > 0) {
        document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
        ctx.eventStarter === 'touch' && document.removeEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
      }

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, mouseEvtOpts)
      }

      if (Platform.has.touch === true) {
        el.removeEventListener('touchstart', ctx.touchStart, touchEvtOpts)
      }

      if (ctx.keyboard.length > 0) {
        el.removeEventListener('keydown', ctx.keyboardStart, listenOpts['passive' + (modifiers.keyCapture === true ? 'Capture' : '')])
      }

      if (ctx.eventStarter === 'mouse') {
        document.removeEventListener('mousemove', ctx.move, mouseEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, passiveCapture)
      }
      else if (ctx.eventStarter === 'touch') {
        const touchTarget = ctx.touchTarget
        if (touchTarget !== void 0) {
          touchTarget.removeEventListener('touchmove', ctx.move, touchEvtOpts)
          touchTarget.removeEventListener('touchcancel', ctx.touchEnd, passiveCapture)
          touchTarget.removeEventListener('touchend', ctx.touchEnd, passiveCapture)
        }
      }
      else if (ctx.eventStarter === 'keyboard') {
        document.removeEventListener('keyup', ctx.keyboardEnd, passiveCapture)
      }

      ctx.origin = void 0
      ctx.eventStarter = void 0
      ctx.event = void 0
      ctx.touchTarget = void 0
      ctx.skipNextMouse = void 0

      delete el[el.__qtouchrepeat_old ? '__qtouchrepeat_old' : '__qtouchrepeat']
    }
  }
}
