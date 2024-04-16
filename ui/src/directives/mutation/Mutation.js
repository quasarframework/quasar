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

function update (el, ctx, value) {
  ctx.handler = value
  ctx.observer !== void 0 && ctx.observer.disconnect()

  ctx.observer = new MutationObserver(list => {
    if (typeof ctx.handler === 'function') {
      const res = ctx.handler(list)
      if (res === false || ctx.once === true) {
        destroy(el)
      }
    }
  })

  ctx.observer.observe(el, ctx.opts)
}

function destroy (el) {
  const ctx = el.__qmutation

  if (ctx !== void 0) {
    ctx.observer !== void 0 && ctx.observer.disconnect()
    delete el.__qmutation
  }
}

export default createDirective(__QUASAR_SSR_SERVER__
  ? { name: 'mutation', getSSRProps }
  : {
      name: 'mutation',

      mounted (el, { modifiers: { once, ...mod }, value }) {
        const ctx = {
          once,
          opts: Object.keys(mod).length === 0
            ? defaultCfg
            : mod
        }

        update(el, ctx, value)

        el.__qmutation = ctx
      },

      updated (el, { oldValue, value }) {
        const ctx = el.__qmutation
        if (ctx !== void 0 && oldValue !== value) {
          update(el, ctx, value)
        }
      },

      beforeUnmount: destroy
    }
)
