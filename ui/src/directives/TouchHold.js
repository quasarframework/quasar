import Platform from '../plugins/Platform.js'
import { position, leftClick, stopAndPrevent, listenOpts } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

const { notPassiveCapture } = listenOpts

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

export default {
  name: 'touch-hold',

  bind (el, { modifiers, ...rest }) {
    // early return, we don't need to do anything
    if (modifiers.mouse !== true && Platform.has.touch !== true) {
      return
    }

    const ctx = {
      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseMove, notPassiveCapture)
          document.addEventListener('click', ctx.mouseEnd, notPassiveCapture)
          ctx.start(evt, true)
        }
      },

      mouseMove (evt) {
        const { top, left } = position(evt)
        if (
          Math.abs(left - ctx.origin.left) >= ctx.mouseSensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.mouseSensitivity
        ) {
          ctx.mouseEnd(evt)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove, notPassiveCapture)
        document.removeEventListener('click', ctx.mouseEnd, notPassiveCapture)
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        ctx.origin = position(evt)

        const startTime = new Date().getTime()

        if (Platform.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()
        }

        ctx.triggered = false

        ctx.timer = setTimeout(() => {
          if (Platform.is.mobile !== true) {
            document.body.classList.add('non-selectable')
            clearSelection()
          }
          ctx.triggered = true

          ctx.handler({
            evt,
            touch: mouseEvent !== true,
            mouse: mouseEvent === true,
            position: ctx.origin,
            duration: new Date().getTime() - startTime
          })
        }, ctx.duration)
      },

      end (evt) {
        document.body.classList.remove('non-selectable')

        if (ctx.triggered === true) {
          stopAndPrevent(evt)
        }
        else {
          clearTimeout(ctx.timer)
        }
      },

      touchStart (evt) {
        const target = evt.target
        if (target !== void 0) {
          ctx.touchTarget = target
          target.addEventListener('touchmove', ctx.touchMove, notPassiveCapture)
          target.addEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          target.addEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          ctx.start(evt)
        }
      },

      touchMove (evt) {
        const { top, left } = position(evt)
        if (
          Math.abs(left - ctx.origin.left) >= ctx.touchSensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.touchSensitivity
        ) {
          ctx.touchEnd(evt)
        }
      },

      touchEnd (evt) {
        const target = ctx.touchTarget
        if (target !== void 0) {
          target.removeEventListener('touchmove', ctx.touchMove, notPassiveCapture)
          target.removeEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          target.removeEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          ctx.touchTarget = void 0
        }
        ctx.end(evt)
      }
    }

    if (el.__qtouchhold) {
      el.__qtouchhold_old = el.__qtouchhold
    }

    el.__qtouchhold = ctx
    update(el, rest)

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, listenOpts['passive' + (modifiers.mouseCapture === true ? 'Capture' : '')])
    }

    if (Platform.has.touch === true) {
      el.addEventListener('touchstart', ctx.touchStart, listenOpts['passive' + (modifiers.capture === true ? 'Capture' : '')])
    }
  },

  update,

  unbind (el, { modifiers }) {
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      clearTimeout(ctx.timer)
      document.body.classList.remove('non-selectable')

      if (modifiers.mouse === true) {
        el.addEventListener('mousedown', ctx.mouseStart, listenOpts['passive' + (modifiers.mouseCapture === true ? 'Capture' : '')])
        document.removeEventListener('mousemove', ctx.mouseMove, notPassiveCapture)
        document.removeEventListener('click', ctx.mouseEnd, notPassiveCapture)
      }

      if (Platform.has.touch === true) {
        el.removeEventListener('touchstart', ctx.touchStart, listenOpts['passive' + (modifiers.capture === true ? 'Capture' : '')])

        const target = ctx.touchTarget
        if (target !== void 0) {
          target.removeEventListener('touchmove', ctx.touchMove, notPassiveCapture)
          target.removeEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          target.removeEventListener('touchend', ctx.touchEnd, notPassiveCapture)
        }
      }

      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
