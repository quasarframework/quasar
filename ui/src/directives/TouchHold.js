import Platform from '../plugins/Platform.js'
import { position, leftClick, stopAndPrevent, listenOpts } from '../utils/event.js'

function update (el, binding) {
  const ctx = el.__qtouchhold

  if (ctx !== void 0) {
    if (binding.oldValue !== binding.value) {
      ctx.handler = binding.value
    }

    // duration in ms, touch in pixels, mouse in pixels
    const data = [600, 5, 7]

    if (typeof binding.arg === 'string' && binding.arg.length) {
      binding.arg.split(':').forEach((val, index) => {
        const v = parseInt(val, 10)
        v && (data[index] = v)
      })
    }

    [ ctx.duration, ctx.touchSensitivity, ctx.mouseSensitivity ] = data
  }
}

const { passiveCapture, notPassiveCapture } = listenOpts

export default {
  name: 'touch-hold',

  bind (el, { modifiers, ...rest }) {
    // early return, we don't need to do anything
    if (modifiers.mouse !== true && Platform.has.touch !== true) {
      return
    }

    const
      touchEvtOpts = listenOpts['passive' + (modifiers.capture === true ? 'Capture' : '')],
      mouseEvtOpts = listenOpts['passive' + (modifiers.mouseCapture === true ? 'Capture' : '')]

    const ctx = {
      mouseStart (evt) {
        if (ctx.skipNextMouse === true) {
          ctx.skipNextMouse = void 0
          return
        }
        if (ctx.eventStarter === void 0 && leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseMove, mouseEvtOpts)
          document.addEventListener('mouseup', ctx.mouseEnd, passiveCapture)
          ctx.start(evt, true)
        }
      },

      mouseMove (evt) {
        const { top, left } = position(evt)
        if (
          ctx.origin === void 0 ||
          Math.abs(left - ctx.origin.left) >= ctx.mouseSensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.mouseSensitivity
        ) {
          clearTimeout(ctx.timer)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove, mouseEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, passiveCapture)
        ctx.end(evt)
      },

      touchStart (evt) {
        const touchTarget = evt.target
        if (ctx.eventStarter === void 0 && touchTarget !== void 0) {
          ctx.touchTarget = touchTarget
          ctx.skipNextMouse = true
          touchTarget.addEventListener('touchmove', ctx.touchMove, touchEvtOpts)
          touchTarget.addEventListener('touchcancel', ctx.touchEnd, passiveCapture)
          touchTarget.addEventListener('touchend', ctx.touchEnd, passiveCapture)
          ctx.start(evt)
        }
      },

      touchMove (evt) {
        const { top, left } = position(evt)
        if (
          ctx.origin === void 0 ||
          Math.abs(left - ctx.origin.left) >= ctx.touchSensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.touchSensitivity
        ) {
          clearTimeout(ctx.timer)
        }
      },

      touchEnd (evt) {
        const touchTarget = ctx.touchTarget
        if (touchTarget !== void 0) {
          touchTarget.removeEventListener('touchmove', ctx.touchMove, touchEvtOpts)
          touchTarget.removeEventListener('touchcancel', ctx.touchEnd, passiveCapture)
          touchTarget.removeEventListener('touchend', ctx.touchEnd, passiveCapture)
        }
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        const startTime = new Date().getTime()

        ctx.origin = position(evt)
        ctx.triggered = false
        ctx.eventStarter = mouseEvent === true ? 'mouse' : 'touch'

        ctx.eventStarter === 'touch' && document.body.classList.add('non-selectable')

        ctx.timer = setTimeout(() => {
          ctx.triggered = true

          document.addEventListener('click', stopAndPrevent, notPassiveCapture)
          ctx.eventStarter === 'touch' && document.addEventListener('contextmenu', stopAndPrevent, notPassiveCapture)

          ctx.handler({
            evt,
            touch: mouseEvent !== true,
            mouse: mouseEvent === true,
            position: ctx.origin,
            duration: new Date().getTime() - startTime
          })
        }, ctx.duration)
      },

      end () {
        const { eventStarter } = ctx

        eventStarter === 'touch' && document.body.classList.remove('non-selectable')

        if (ctx.triggered === true) {
          setTimeout(() => {
            document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
            eventStarter === 'touch' && document.removeEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
          }, 50)
        }
        else {
          clearTimeout(ctx.timer)
        }

        setTimeout(() => {
          ctx.origin = void 0
          ctx.eventStarter = void 0
          ctx.triggered = void 0
          ctx.touchTarget = void 0
        }, 0)
      }
    }

    if (el.__qtouchhold) {
      el.__qtouchhold_old = el.__qtouchhold
    }

    el.__qtouchhold = ctx
    update(el, rest)

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, mouseEvtOpts)
    }

    if (Platform.has.touch === true) {
      el.addEventListener('touchstart', ctx.touchStart, touchEvtOpts)
    }
  },

  update,

  unbind (el, { modifiers }) {
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      const
        touchEvtOpts = listenOpts['passive' + (modifiers.capture === true ? 'Capture' : '')],
        mouseEvtOpts = listenOpts['passive' + (modifiers.mouseCapture === true ? 'Capture' : '')]

      clearTimeout(ctx.timer)

      ctx.eventStarter === 'touch' && document.body.classList.remove('non-selectable')

      if (ctx.triggered === true) {
        document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
        ctx.eventStarter === 'touch' && document.removeEventListener('contextmenu', stopAndPrevent, notPassiveCapture)
      }

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, mouseEvtOpts)
      }

      if (Platform.has.touch === true) {
        el.removeEventListener('touchstart', ctx.touchStart, touchEvtOpts)
      }

      if (ctx.eventStarter === 'mouse') {
        document.removeEventListener('mousemove', ctx.mouseMove, mouseEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, passiveCapture)
      }
      else if (ctx.eventStarter === 'touch') {
        const touchTarget = ctx.touchTarget
        if (touchTarget !== void 0) {
          touchTarget.removeEventListener('touchmove', ctx.touchMove, touchEvtOpts)
          touchTarget.removeEventListener('touchcancel', ctx.touchEnd, passiveCapture)
          touchTarget.removeEventListener('touchend', ctx.touchEnd, passiveCapture)
        }
      }

      ctx.origin = void 0
      ctx.eventStarter = void 0
      ctx.triggered = void 0
      ctx.touchTarget = void 0
      ctx.skipNextMouse = void 0

      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
