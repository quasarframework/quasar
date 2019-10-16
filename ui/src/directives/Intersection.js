import { isDeepEqual } from '../utils/is.js'

const defaultCfg = {
  threshold: 0,
  root: null,
  rootMargin: '0px'
}

function update (el, ctx, { modifiers, value }) {
  if (modifiers !== void 0 && modifiers.once !== ctx.once) {
    ctx.once = modifiers.once
  }

  let handler, cfg, changed

  if (typeof value === 'function') {
    handler = value
    cfg = defaultCfg
    changed = ctx.cfg === void 0
  }
  else {
    handler = value.handler
    cfg = Object.assign({}, defaultCfg, value.cfg)
    changed = ctx.cfg === void 0 || isDeepEqual(ctx.cfg, cfg) === false
  }

  if (ctx.handler !== handler) {
    ctx.handler = handler
  }

  if (changed === true) {
    ctx.cfg = cfg
    ctx.observer !== void 0 && ctx.observer.unobserve(el)

    ctx.observer = new IntersectionObserver(([ entry ]) => {
      if (ctx.once === true && entry.isIntersecting === true) {
        ctx.handler(entry, ctx.observer)
        destroy(el)
      }
      else {
        if (ctx.handler(entry, ctx.observer) === false) {
          destroy(el)
        }
      }
    }, cfg)

    ctx.observer.observe(el)
  }
}

function destroy (el) {
  const ctx = el.__qvisible

  if (ctx !== void 0) {
    ctx.observer !== void 0 && ctx.observer.unobserve(el)
    delete el.__qvisible
  }
}

export default {
  name: 'intersection',

  inserted (el, binding) {
    const ctx = {}
    update(el, ctx, binding)
    el.__qvisible = ctx
  },

  update (el, binding) {
    const ctx = el.__qvisible
    ctx !== void 0 && update(el, ctx, binding)
  },

  unbind: destroy
}
