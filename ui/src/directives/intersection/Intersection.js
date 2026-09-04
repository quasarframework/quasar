import { createDirective } from '../../utils/private.create/create.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

// one IntersectionObserver per distinct (root, rootMargin, threshold),
// shared by every element observed with it: the browser charges each
// observer its own pass per frame, so N single-element observers scale
// far worse than one observer with N targets
const pools = new Map() // root -> Map<key, pool>

function sameThreshold(a, b) {
  if (a === b) return true
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }

  return true
}

function onEntries(entries, observer) {
  for (const entry of entries) {
    const el = entry.target
    const ctx = el.__qvisible

    // unlike MutationObserver, disconnect()/unobserve() do not drop the
    // entries an observer already queued, so a disabled, re-configured or
    // destroyed element can still receive entries from its former observer
    if (ctx === void 0 || ctx.pool?.observer !== observer) continue

    // if observed element is part of a vue transition
    // then we need to be careful...
    if (entry.rootBounds === null && document.body.contains(el)) {
      observer.unobserve(el)
      observer.observe(el)
      continue
    }

    // the handler runs first: with once, the intersecting entry that
    // retires the element is the one it must see
    if (ctx.handler(entry) === false || (ctx.once && entry.isIntersecting)) {
      destroy(el)
    }
  }
}

function acquire(el, ctx, root, rootMargin, threshold) {
  let byKey = pools.get(root)
  if (byKey === void 0) {
    byKey = new Map()
    pools.set(root, byKey)
  }

  const key = `${rootMargin}|${threshold}`
  let pool = byKey.get(key)
  if (pool === void 0) {
    pool = {
      root,
      rootMargin,
      threshold,
      key,
      count: 0,
      observer: new IntersectionObserver(onEntries, {
        root,
        rootMargin,
        threshold
      })
    }
    byKey.set(key, pool)
  }

  pool.count++
  pool.observer.observe(el)
  ctx.pool = pool
}

function release(el, ctx) {
  const pool = ctx.pool
  if (pool === void 0) return

  ctx.pool = void 0

  if (--pool.count === 0) {
    pool.observer.disconnect()

    const byKey = pools.get(pool.root)
    byKey.delete(pool.key)
    if (byKey.size === 0) pools.delete(pool.root)
  } else {
    pool.observer.unobserve(el)
  }
}

function update(el, ctx, value) {
  // undefined disables too, matching the touch directives,
  // so a gated value never throws
  if (value === false || value === void 0) {
    release(el, ctx)
    ctx.handler = void 0
    return
  }

  let root = null
  let rootMargin = '0px'
  let threshold = 0

  if (typeof value === 'function') {
    ctx.handler = value
  } else {
    ctx.handler = value.handler

    const cfg = value.cfg
    if (cfg !== void 0) {
      root = cfg.root ?? null
      rootMargin = cfg.rootMargin ?? '0px'
      threshold = cfg.threshold ?? 0
    }
  }

  const pool = ctx.pool
  if (pool !== void 0) {
    if (
      pool.root === root &&
      pool.rootMargin === rootMargin &&
      sameThreshold(pool.threshold, threshold)
    ) {
      return
    }

    release(el, ctx)
  }

  acquire(el, ctx, root, rootMargin, threshold)
}

function destroy(el) {
  const ctx = el.__qvisible

  if (ctx !== void 0) {
    release(el, ctx)
    el.__qvisible = void 0
  }
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'intersection', getSSRProps }
    : {
        name: 'intersection',

        mounted(el, { modifiers, value }) {
          const ctx = {
            once: modifiers.once === true,
            handler: void 0,
            pool: void 0
          }

          update(el, ctx, value)

          el.__qvisible = ctx
        },

        updated(el, binding) {
          const ctx = el.__qvisible
          if (ctx !== void 0) update(el, ctx, binding.value)
        },

        beforeUnmount: destroy
      }
)
