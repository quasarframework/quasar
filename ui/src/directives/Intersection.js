import { isDeepEqual } from '../utils/is.js'

const defaultCfg = {
  threshold: 0,
  root: null,
  rootMargin: '0px'
}

function update (el, ctx, { modifiers, value }) {
  ctx.once = modifiers.once

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
      if (typeof ctx.handler === 'function') {
        // if observed element is part of a vue transition
        // then we need to be careful...
        if (
          entry.rootBounds === null &&
          (el.__vue__ !== void 0 ? el.__vue__._inactive !== true : document.body.contains(el) === true)
        ) {
          ctx.observer.unobserve(el)
          ctx.observer.observe(el)
          return
        }

        const res = ctx.handler(entry, ctx.observer)

        if (
          res === false ||
          (ctx.once === true && entry.isIntersecting === true)
        ) {
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
