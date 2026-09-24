import { createDirective } from '../../utils/private.create/create.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

function clearTimer(ctx) {
  if (ctx.timer !== null) {
    clearTimeout(ctx.timer)
    ctx.timer = null
  }
}

function measure(el, ctx) {
  clearTimer(ctx)

  if (ctx.observer === void 0) return

  const { offsetWidth: width, offsetHeight: height } = el

  if (width !== ctx.size.width || height !== ctx.size.height) {
    ctx.size = { width, height }

    const res = ctx.handler(ctx.size)
    if (res === false || ctx.once === true) {
      destroy(el)
    }
  }
}

// at most one measurement per debounce window; the observer reports
// per frame anyway, so a 0 debounce is not a hot path
function schedule(el, ctx) {
  if (ctx.debounce > 0) {
    if (ctx.timer === null) {
      ctx.timer = setTimeout(() => {
        measure(el, ctx)
      }, ctx.debounce)
    }
  } else {
    measure(el, ctx)
  }
}

function update(el, ctx, value) {
  // a non-function value (false, undefined) disables in place: the observer
  // is dropped until a handler is supplied again, and a handler swap only
  // replaces the callback target instead of rebuilding the observer
  if (typeof value !== 'function') {
    ctx.handler = void 0
    clearTimer(ctx)
    if (ctx.observer !== void 0) {
      ctx.observer.disconnect()
      ctx.observer = void 0
    }
    return
  }

  ctx.handler = value

  if (ctx.observer !== void 0) return

  // no handler guard needed here (unlike v-intersection): disconnect()
  // empties the record queue, so the callback only ever runs while armed
  ctx.observer = new ResizeObserver(() => {
    schedule(el, ctx)
  })
  // the reported size is offsetWidth/offsetHeight (the border box), so
  // observe that box too: a padding or border change on the element
  // itself leaves the default content box untouched and would go
  // unnoticed until an unrelated resize
  ctx.observer.observe(el, { box: 'border-box' })
  measure(el, ctx)
}

function destroy(el) {
  const ctx = el.__qresize

  if (ctx !== void 0) {
    clearTimer(ctx)
    ctx.observer?.disconnect()
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
            debounce: Number(arg) || 0,
            once: modifiers.once === true,
            observer: void 0,
            timer: null,
            // -1 so that the first measurement always reports, even a 0x0 box
            size: { width: -1, height: -1 }
          }

          // set before the first measurement: a `once` handler (or one
          // returning false) retires the directive from inside it
          el.__qresize = ctx
          update(el, ctx, value)
        },

        updated(el, { arg, oldValue, value }) {
          const ctx = el.__qresize

          if (ctx !== void 0) {
            // a dynamic arg applies from the next change
            ctx.debounce = Number(arg) || 0

            if (oldValue !== value) {
              update(el, ctx, value)
            }
          }
        },

        beforeUnmount: destroy
      }
)
