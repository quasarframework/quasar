import { childHasFocus } from '../dom/dom.js'

/**
 * Registry of elements that have been detached from their original DOM
 * position. Currently only useFullscreen() does this: it moves the element
 * to <body> so that the fullscreen mixin can escape ancestor overflow,
 * transform and stacking contexts.
 *
 * The key is the filler node that the mover leaves behind at the original
 * position -- once the element is gone it is the only stable handle to where
 * the element logically belongs. The value is the component proxy rather than
 * a captured $el, so that the component's current root is read at test time
 * instead of a possibly stale reference.
 */
const detachedMap = new Map()

export function addDetachedFullscreen(fillerNode, vm) {
  detachedMap.set(fillerNode, vm)
}

export function removeDetachedFullscreen(fillerNode) {
  detachedMap.delete(fillerNode)
}

function fillerNodeFor(el) {
  for (const [fillerNode, vm] of detachedMap) {
    if (vm.$el.contains(el) === true) return fillerNode
  }
}

/**
 * Tells if focusedEl sits inside an element that was detached from somewhere
 * within rootEl, which makes it a logical -- but no longer physical -- child.
 *
 * Walks the filler chain instead of testing a single hop, so that an element
 * detached from inside another detached element resolves as well.
 *
 * Ownership of each filler is decided with childHasFocus() so that this
 * agrees with the physical containment test it complements at the call sites.
 */
export function focusIsInDetachedFullscreen(rootEl, focusedEl) {
  // childHasFocus() treats a nullish root as containing everything; here a
  // root that no longer exists cannot logically own a detached element
  if (rootEl === void 0 || rootEl === null) return false

  // Each hop moves to the filler of a strictly outer detached element, and
  // every detached element is a direct child of <body>, so the chain cannot
  // cycle. The guard only defends against a stale entry left behind by a
  // consumer that failed to unregister -- a hang here would freeze focusin.
  const visited = new Set()

  for (
    let node = fillerNodeFor(focusedEl);
    node !== void 0 && visited.has(node) === false;
    node = fillerNodeFor(node)
  ) {
    if (childHasFocus(rootEl, node) === true) return true
    visited.add(node)
  }

  return false
}
