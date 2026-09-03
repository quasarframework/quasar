import { createDirective } from '../../utils/private.create/create.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const defaultCfg = {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true,
  attributeOldValue: true,
  characterDataOldValue: true
}

function update(el, ctx, value) {
  // a non-function value (false, undefined) disables in place: the observer
  // is dropped until a handler is supplied again, and a handler swap only
  // replaces the callback target instead of rebuilding the observer
  if (typeof value !== 'function') {
    ctx.handler = void 0
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
  ctx.observer = new MutationObserver(list => {
    const res = ctx.handler(list)
    if (res === false || ctx.once === true) {
      destroy(el)
    }
  })

  ctx.observer.observe(el, ctx.opts)
}

function destroy(el) {
  const ctx = el.__qmutation

  if (ctx !== void 0) {
    ctx.observer?.disconnect()
    delete el.__qmutation
  }
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'mutation', getSSRProps }
    : {
        name: 'mutation',

        mounted(el, { modifiers: { once, ...mod }, value }) {
          const ctx = {
            once,
            opts: Object.keys(mod).length === 0 ? defaultCfg : mod
          }

          update(el, ctx, value)

          el.__qmutation = ctx
        },

        updated(el, { oldValue, value }) {
          const ctx = el.__qmutation
          if (ctx !== void 0 && oldValue !== value) {
            update(el, ctx, value)
          }
        },

        beforeUnmount: destroy
      }
)
