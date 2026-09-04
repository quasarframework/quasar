import { createDirective } from '../../utils/private.create/create.js'
import {
  observe,
  unobserve
} from '../../utils/private.intersection/intersection.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

function update(el, ctx, value) {
  // undefined disables too, matching the touch directives,
  // so a gated value never throws
  if (value === false || value === void 0) {
    unobserve(el)
    ctx.handler = void 0
    return
  }

  let handler
  let root = null
  let rootMargin = '0px'
  let threshold = 0

  if (typeof value === 'function') {
    handler = value
  } else {
    handler = value.handler

    const cfg = value.cfg
    if (cfg !== void 0) {
      root = cfg.root ?? null
      rootMargin = cfg.rootMargin ?? '0px'
      threshold = cfg.threshold ?? 0
    }
  }

  ctx.handler = handler
  observe(el, ctx, root, rootMargin, threshold)
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'intersection', getSSRProps }
    : {
        name: 'intersection',

        mounted(el, { modifiers, value }) {
          // the pool subscriber; it also carries the disabled state
          // (mounted but not observed) between updates
          const ctx = {
            handler: void 0,
            once: modifiers.once === true,
            pool: void 0,
            done: false
          }

          el.__qvisible = ctx
          update(el, ctx, value)
        },

        updated(el, binding) {
          update(el, el.__qvisible, binding.value)
        },

        beforeUnmount(el) {
          unobserve(el)
          el.__qvisible = void 0
        }
      }
)
