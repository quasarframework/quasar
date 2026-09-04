/*
 * One IntersectionObserver per distinct (root, rootMargin, threshold),
 * shared by every element observed with it: the browser charges each
 * observer its own pass per frame, so N single-element observers scale
 * far worse than one observer with N targets.
 *
 * A subscriber is a plain object the caller owns:
 *   handler(entry)  called for every delivered entry;
 *                   returning false retires the element
 *   once            retire the element on its first intersecting entry
 *
 * The pool writes `pool` on it while its element is observed and `done`
 * once it retired the element; a done subscriber is never observed again.
 * A subscriber observes one element at a time.
 */

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
    const sub = el.__qintersection

    // unlike MutationObserver, disconnect()/unobserve() do not drop the
    // entries an observer already queued, so an element that left or
    // moved to another observer can still receive entries from this one
    if (sub === void 0 || sub.pool.observer !== observer) continue

    // the handler runs first: with once, the intersecting entry that
    // retires the element is the one it must see
    if (
      sub.handler(entry) === false ||
      (sub.once === true && entry.isIntersecting)
    ) {
      sub.done = true
      unobserve(el)
    }
  }
}

export function observe(
  el,
  sub,
  root = null,
  rootMargin = '0px',
  threshold = 0
) {
  if (sub.done === true) return

  const current = sub.pool
  if (current !== void 0) {
    if (
      current.root === root &&
      current.rootMargin === rootMargin &&
      sameThreshold(current.threshold, threshold)
    ) {
      return
    }

    unobserve(el)
  }

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
  sub.pool = pool
  el.__qintersection = sub
  pool.observer.observe(el)
}

// an observer only reports changes, so a state that holds through a
// layout change is never delivered again; observing anew delivers it
export function reobserve(el) {
  const sub = el.__qintersection
  if (sub === void 0) return

  const { observer } = sub.pool
  observer.unobserve(el)
  observer.observe(el)
}

export function unobserve(el) {
  const sub = el.__qintersection
  if (sub === void 0) return

  const pool = sub.pool
  sub.pool = void 0
  el.__qintersection = void 0

  if (--pool.count === 0) {
    pool.observer.disconnect()

    const byKey = pools.get(pool.root)
    byKey.delete(pool.key)
    if (byKey.size === 0) pools.delete(pool.root)
  } else {
    pool.observer.unobserve(el)
  }
}
