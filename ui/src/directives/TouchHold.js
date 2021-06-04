import { client } from '../plugins/Platform.js'
import { addEvt, cleanEvt, position, leftClick, stopAndPrevent, noop } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

function destroy (el) {
  const ctx = el.__qtouchhold
  if (ctx !== void 0) {
    cleanEvt(ctx, 'main')
    cleanEvt(ctx, 'temp')

    clearTimeout(ctx.timer)
    ctx.styleCleanup !== void 0 && ctx.styleCleanup()

    delete el.__qtouchhold
  }
}

export default {
  name: 'touch-hold',

  bind (el, binding) {
    if (el.__qtouchhold !== void 0) {
      destroy(el)
      el.__qtouchhold_destroyed = true
    }

    const { modifiers } = binding

    // early return, we don't need to do anything
    if (modifiers.mouse !== true && client.has.touch !== true) {
      return
    }

    const ctx = {
      handler: binding.value,
      noop,

      mouseStart (evt) {
        if (typeof ctx.handler === 'function' && leftClick(evt) === true) {
          addEvt(ctx, 'temp', [
            [ document, 'mousemove', 'move', 'passiveCapture' ],
            [ document, 'click', 'end', 'notPassiveCapture' ]
          ])
          ctx.start(evt, true)
        }
      },

      touchStart (evt) {
        if (evt.target !== void 0 && typeof ctx.handler === 'function') {
          const target = evt.target
          addEvt(ctx, 'temp', [
            [ target, 'touchmove', 'move', 'passiveCapture' ],
            [ target, 'touchcancel', 'end', 'notPassiveCapture' ],
            [ target, 'touchend', 'end', 'notPassiveCapture' ]
          ])
          ctx.start(evt)
        }
      },

      start (evt, mouseEvent) {
        ctx.origin = position(evt)

        const startTime = Date.now()

        if (client.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()

          ctx.styleCleanup = withDelay => {
            ctx.styleCleanup = void 0

            const remove = () => {
              document.body.classList.remove('non-selectable')
            }

            if (withDelay === true) {
              clearSelection()
              setTimeout(remove, 10)
            }
            else { remove() }
          }
        }

        ctx.triggered = false
        ctx.sensitivity = mouseEvent === true
          ? ctx.mouseSensitivity
          : ctx.touchSensitivity

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

      move (evt) {
        const { top, left } = position(evt)
        if (
          Math.abs(left - ctx.origin.left) >= ctx.sensitivity ||
          Math.abs(top - ctx.origin.top) >= ctx.sensitivity
        ) {
          clearTimeout(ctx.timer)
        }
      },

      end (evt) {
        cleanEvt(ctx, 'temp')

        // delay needed otherwise selection still occurs
        ctx.styleCleanup !== void 0 && ctx.styleCleanup(ctx.triggered)

        if (ctx.triggered === true) {
          evt !== void 0 && stopAndPrevent(evt)
        }
        else {
          clearTimeout(ctx.timer)
        }
      }
    }

    // duration in ms, touch in pixels, mouse in pixels
    const data = [600, 5, 7]

    if (typeof binding.arg === 'string' && binding.arg.length > 0) {
      binding.arg.split(':').forEach((val, index) => {
        const v = parseInt(val, 10)
        v && (data[index] = v)
      })
    }

    [ ctx.duration, ctx.touchSensitivity, ctx.mouseSensitivity ] = data

    el.__qtouchhold = ctx

    modifiers.mouse === true && addEvt(ctx, 'main', [
      [ el, 'mousedown', 'mouseStart', `passive${modifiers.mouseCapture === true ? 'Capture' : ''}` ]
    ])

    client.has.touch === true && addEvt(ctx, 'main', [
      [ el, 'touchstart', 'touchStart', `passive${modifiers.capture === true ? 'Capture' : ''}` ],
      [ el, 'touchend', 'noop', 'notPassiveCapture' ]
    ])
  },

  update (el, binding) {
    const ctx = el.__qtouchhold
    if (ctx !== void 0 && binding.oldValue !== binding.value) {
      typeof binding.value !== 'function' && ctx.end()
      ctx.handler = binding.value
    }
  },

  unbind (el) {
    if (el.__qtouchhold_destroyed === void 0) {
      destroy(el)
    }
    else {
      delete el.__qtouchhold_destroyed
    }
  }
}
