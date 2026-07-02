import { client } from '../../plugins/platform/Platform.js'

import { createDirective } from '../../utils/private.create/create.js'
import {
  addEvt,
  cleanEvt,
  leftClick,
  noop,
  position,
  stopAndPrevent
} from '../../utils/event/event.js'
import { clearSelection } from '../../utils/private.selection/selection.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

function removeBodyNonSelectable() {
  document.body.classList.remove('non-selectable')
}

/**
 * @api directive
 * @docsUrl https://v2.quasar.dev/vue-directives/touch-hold
 */
export default createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'touch-hold', getSSRProps }
    : {
        name: 'touch-hold',

        beforeMount(el, binding) {
          const { modifiers } = binding

          // early return, we don't need to do anything
          if (!modifiers.mouse && !client.has.touch) return

          const ctx = {
            handler: binding.value,
            noop,

            mouseStart(evt) {
              if (typeof ctx.handler === 'function' && leftClick(evt)) {
                addEvt(ctx, 'temp', [
                  [document, 'mousemove', 'move', 'passiveCapture'],
                  [document, 'click', 'end', 'notPassiveCapture']
                ])
                ctx.start(evt, true)
              }
            },

            touchStart(evt) {
              if (evt.target !== void 0 && typeof ctx.handler === 'function') {
                const target = evt.target
                addEvt(ctx, 'temp', [
                  [target, 'touchmove', 'move', 'passiveCapture'],
                  [target, 'touchcancel', 'end', 'notPassiveCapture'],
                  [target, 'touchend', 'end', 'notPassiveCapture']
                ])
                ctx.start(evt)
              }
            },

            start(evt, mouseEvent) {
              ctx.origin = position(evt)

              const startTime = Date.now()

              if (client.is.mobile) {
                document.body.classList.add('non-selectable')
                clearSelection()

                ctx.styleCleanup = withDelay => {
                  ctx.styleCleanup = void 0

                  if (withDelay === true) {
                    clearSelection()
                    setTimeout(removeBodyNonSelectable, 10)
                  } else {
                    removeBodyNonSelectable()
                  }
                }
              }

              ctx.triggered = false
              ctx.sensitivity = mouseEvent
                ? ctx.mouseSensitivity
                : ctx.touchSensitivity

              ctx.timer = setTimeout(() => {
                ctx.timer = void 0
                clearSelection()
                ctx.triggered = true

                ctx.handler({
                  evt,
                  touch: !mouseEvent,
                  mouse: mouseEvent === true,
                  position: ctx.origin,
                  duration: Date.now() - startTime
                })
              }, ctx.duration)
            },

            move(evt) {
              const { top, left } = position(evt)
              if (
                ctx.timer !== void 0 &&
                (Math.abs(left - ctx.origin.left) >= ctx.sensitivity ||
                  Math.abs(top - ctx.origin.top) >= ctx.sensitivity)
              ) {
                clearTimeout(ctx.timer)
                ctx.timer = void 0
              }
            },

            end(evt) {
              cleanEvt(ctx, 'temp')

              // delay needed otherwise selection still occurs
              ctx.styleCleanup?.(ctx.triggered)

              if (ctx.triggered) {
                if (evt !== void 0) stopAndPrevent(evt)
              } else if (ctx.timer !== void 0) {
                clearTimeout(ctx.timer)
                ctx.timer = void 0
              }
            }
          }

          // duration in ms, touch in pixels, mouse in pixels
          const data = [600, 5, 7]

          if (typeof binding.arg === 'string' && binding.arg.length !== 0) {
            binding.arg.split(':').forEach((val, index) => {
              const v = Number.parseInt(val, 10)
              if (v) data[index] = v
            })
          }

          ;[ctx.duration, ctx.touchSensitivity, ctx.mouseSensitivity] = data

          el.__qtouchhold = ctx

          if (modifiers.mouse) {
            // account for UMD too where modifiers will be lowercased to work
            const capture =
              modifiers.mouseCapture || modifiers.mousecapture ? 'Capture' : ''

            addEvt(ctx, 'main', [
              [el, 'mousedown', 'mouseStart', `passive${capture}`]
            ])
          }

          if (client.has.touch) {
            addEvt(ctx, 'main', [
              [
                el,
                'touchstart',
                'touchStart',
                `passive${modifiers.capture ? 'Capture' : ''}`
              ],
              [el, 'touchend', 'noop', 'notPassiveCapture']
            ])
          }
        },

        updated(el, binding) {
          const ctx = el.__qtouchhold

          if (ctx !== void 0 && binding.oldValue !== binding.value) {
            if (typeof binding.value !== 'function') ctx.end()
            ctx.handler = binding.value
          }
        },

        beforeUnmount(el) {
          const ctx = el.__qtouchhold

          if (ctx !== void 0) {
            cleanEvt(ctx, 'main')
            cleanEvt(ctx, 'temp')

            if (ctx.timer !== void 0) clearTimeout(ctx.timer)
            ctx.styleCleanup?.()

            delete el.__qtouchhold
          }
        }
      }
)
