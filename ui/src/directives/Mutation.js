import { isDeepEqual } from '../utils/is.js'

const defaultCfg = {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true,
  attributeOldValue: true,
  characterDataOldValue: true
}

function update (el, ctx, { modifiers: { once, ...mod }, value }) {
  let changed

  ctx.once = once

  if (ctx.handler !== value) {
    changed = true
    ctx.handler = value
  }

  if (ctx.opts === void 0 || isDeepEqual(mod, ctx.mod) === false) {
    changed = true
    ctx.mod = mod
    ctx.opts = Object.keys(mod).length === 0
      ? defaultCfg
      : mod
  }

  if (changed === true) {
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
}

function destroy (el) {
  const ctx = el.__qmutation

  if (ctx !== void 0) {
    ctx.observer !== void 0 && ctx.observer.disconnect()
    delete el.__qmutation
  }
}

export default {
  name: 'mutation',

  inserted (el, binding) {
    const ctx = {}
    update(el, ctx, binding)
    el.__qmutation = ctx
  },

  update (el, binding) {
    const ctx = el.__qmutation
    ctx !== void 0 && update(el, ctx, binding)
  },

  unbind: destroy
}
