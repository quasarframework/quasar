import { client } from '../plugins/Platform.js'
import { addEvt, cleanEvt, getTouchTarget } from '../utils/touch.js'
import { position, leftClick, stopAndPrevent } from '../utils/event.js'
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

  bind (el, binding) {
    const { modifiers } = binding

    // early return, we don't need to do anything
    if (modifiers.mouse !== true && client.has.touch !== true) {
      return
    }

    const ctx = {
      mouseStart (evt) {
        if (leftClick(evt) === true) {
          addEvt(ctx, 'temp', [
            [ document, 'mousemove', 'mouseMove', 'notPassiveCapture' ],
            [ document, 'click', 'end', 'notPassiveCapture' ]
          ])
          ctx.start(evt, true)
        }
      },

      mouseMove (evt) {
        const { top, left } = position(evt)
        if (
          Math.abs(left - ctx.origin.left) >= ctx.mouseSensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.mouseSensitivity
        ) {
          ctx.end(evt)
        }
      },

      start (evt, mouseEvent) {
        ctx.origin = position(evt)

        const startTime = Date.now()

        if (client.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()
        }

        ctx.triggered = false

        ctx.timer = setTimeout(() => {
          clearSelection()
          ctx.triggered = true

          ctx.handler({
            evt,
            touch: mouseEvent !== true,
            mouse: mouseEvent === true,
            position: ctx.origin,
            duration: Date.now() - startTime
          })
        }, ctx.duration)
      },

      end (evt) {
        cleanEvt(ctx, 'temp')

        if (ctx.triggered === true) {
          if (client.is.mobile === true) {
            clearSelection()
            // delay needed otherwise selection still occurs
            setTimeout(() => {
              document.body.classList.remove('non-selectable')
            }, 10)
          }
          stopAndPrevent(evt)
        }
        else {
          client.is.mobile === true && document.body.classList.remove('non-selectable')
          clearTimeout(ctx.timer)
        }
      },

      touchStart (evt) {
        if (evt.target !== void 0) {
          const target = getTouchTarget(evt.target)
          addEvt(ctx, 'temp', [
            [ target, 'touchmove', 'touchMove', 'notPassiveCapture' ],
            [ target, 'touchcancel', 'end', 'notPassiveCapture' ],
            [ target, 'touchend', 'end', 'notPassiveCapture' ]
          ])
          ctx.start(evt)
        }
      },

      touchMove (evt) {
        const { top, left } = position(evt)
        if (
          Math.abs(left - ctx.origin.left) >= ctx.touchSensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.touchSensitivity
        ) {
          ctx.end(evt)
        }
      }
    }

    if (el.__qtouchhold) {
      el.__qtouchhold_old = el.__qtouchhold
    }

    el.__qtouchhold = ctx

    update(el, binding)

    modifiers.mouse === true && addEvt(ctx, 'main', [
      [ el, 'mousedown', 'mouseStart', `passive${modifiers.mouseCapture === true ? 'Capture' : ''}` ]
    ])

    client.has.touch === true && addEvt(ctx, 'main', [
      [ el, 'touchstart', 'touchStart', `passive${modifiers.capture === true ? 'Capture' : ''}` ]
    ])
  },

  update,

  unbind (el) {
    const ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      cleanEvt(ctx, 'main')
      cleanEvt(ctx, 'temp')

      clearTimeout(ctx.timer)
      client.is.mobile === true && document.body.classList.remove('non-selectable')

      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
