import { ref } from 'vue'

import useElementResize from '../../composables/use-element-resize/use-element-resize.js'
import { createDirective } from '../../utils/private.create/create.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

function update(ctx, value) {
  // a non-function value (false, undefined) disables in place: the
  // element stops being observed until a handler is supplied again, and
  // a handler swap only replaces the callback target
  if (typeof value !== 'function') {
    ctx.handler = void 0
    ctx.armed.value = false
    return
  }

  ctx.handler = value
  ctx.armed.value = true
}

function destroy(el) {
  const ctx = el.__qresize

  if (ctx !== void 0) {
    ctx.stop()
    el.__qresize = void 0
  }
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'resize', getSSRProps }
    : {
        name: 'resize',

        mounted(el, { arg, modifiers, value }) {
          const ctx = {
            handler: void 0,
            armed: ref(false),
            debounce: ref(Number(arg) || 0),
            once: modifiers.once === true
          }

          // set before the first measurement: a `once` handler (or one
          // returning false) retires the directive from inside it
          el.__qresize = ctx

          // the directive hook runs outside of any component instance, so
          // the composable takes the instance-free path (nothing is
          // released on its own; destroy() does it)
          ctx.stop = useElementResize(() => ({
            target: el,
            debounce: ctx.debounce.value,
            disabled: !ctx.armed.value,
            onResize(size) {
              const res = ctx.handler(size)
              if (res === false || ctx.once) {
                destroy(el)
              }
            }
          })).stop

          update(ctx, value)
        },

        updated(el, { arg, oldValue, value }) {
          const ctx = el.__qresize

          if (ctx !== void 0) {
            // a dynamic arg applies from the next change
            ctx.debounce.value = Number(arg) || 0

            if (oldValue !== value) {
              update(ctx, value)
            }
          }
        },

        beforeUnmount: destroy
      }
)
