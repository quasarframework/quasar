import { client } from '../plugins/Platform.js'
import { addEvt, cleanEvt } from '../utils/touch.js'
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

        const startTime = new Date().getTime()

        if (client.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()
        }

        ctx.triggered = false

        ctx.timer = setTimeout(() => {
          if (client.is.mobile !== true) {
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
        cleanEvt(ctx, 'temp')
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
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      cleanEvt(ctx, 'main')
      cleanEvt(ctx, 'temp')

      clearTimeout(ctx.timer)
      document.body.classList.remove('non-selectable')

      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
