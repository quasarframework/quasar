import Platform from '../plugins/Platform.js'
import { position, leftClick, stopAndPrevent, listenOpts } from '../utils/event.js'
import { setObserver, removeObserver } from '../utils/touch.js'
import { clearSelection } from '../utils/selection.js'

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
    if (el.__qtouchhold) {
      el.__qtouchhold_old = el.__qtouchhold
    }

    // early return, we don't need to do anything
    if (modifiers.mouse !== true && Platform.has.touch !== true) {
      return
    }

    const ctx = {
      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseMove, true)
          document.addEventListener('click', ctx.mouseEnd, true)
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
        document.removeEventListener('mousemove', ctx.mouseMove, true)
        document.removeEventListener('click', ctx.mouseEnd, true)
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        removeObserver(ctx)
        mouseEvent !== true && setObserver(el, evt, ctx)

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

      move (evt) {
        const { top, left } = position(evt)
        if (
          Math.abs(left - ctx.origin.left) >= ctx.touchSensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.touchSensitivity
        ) {
          ctx.end(evt)
        }
      },

      end (evt) {
        removeObserver(ctx)
        document.body.classList.remove('non-selectable')

        if (ctx.triggered === true) {
          stopAndPrevent(evt)
        }
        else {
          clearTimeout(ctx.timer)
        }
      }
    }

    el.__qtouchhold = ctx
    update(el, rest)

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, modifiers.mouseCapture)
    }

    if (Platform.has.touch === true) {
      const opts = listenOpts['notPassive' + (modifiers.capture === true ? 'Capture' : '')]

      el.addEventListener('touchstart', ctx.start, opts)
      el.addEventListener('touchmove', ctx.move, opts)
      el.addEventListener('touchcancel', ctx.end, opts)
      el.addEventListener('touchend', ctx.end, opts)
    }
  },

  update,

  unbind (el, { modifiers }) {
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      removeObserver(ctx)
      clearTimeout(ctx.timer)
      document.body.classList.remove('non-selectable')

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, modifiers.mouseCapture)
        document.removeEventListener('mousemove', ctx.mouseMove, true)
        document.removeEventListener('click', ctx.mouseEnd, true)
      }

      if (Platform.has.touch === true) {
        const opts = listenOpts['notPassive' + (modifiers.capture === true ? 'Capture' : '')]

        el.removeEventListener('touchstart', ctx.start, opts)
        el.removeEventListener('touchmove', ctx.move, opts)
        el.removeEventListener('touchcancel', ctx.end, opts)
        el.removeEventListener('touchend', ctx.end, opts)
      }

      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
