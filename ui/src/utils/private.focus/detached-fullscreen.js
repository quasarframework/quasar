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

/**
 * Registry-change listeners. An anchored popup that is open while its anchor's
 * subtree gets detached (or restored) has stale geometry and a stale scroll
 * target; it subscribes here to know when to re-measure (#18513). Listeners
 * run synchronously, before the exit path restores the element -- schedule any
 * DOM measurement instead of measuring inside the listener. Notification runs
 * over a snapshot, so a listener may safely un/subscribe from within.
 */
const listeners = []

export function addDetachedFullscreenListener(fn) {
  listeners.push(fn)
}

export function removeDetachedFullscreenListener(fn) {
  const index = listeners.indexOf(fn)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}

function notifyListeners() {
  // snapshot: a listener may un/subscribe from within its own notification
  // (prefer-spread's autofix would turn this into a spread, which
  // no-useless-spread then rejects)
  // oxlint-disable-next-line unicorn/prefer-spread
  for (const fn of listeners.slice()) {
    fn()
  }
}

export function addDetachedFullscreen(fillerNode, vm) {
  detachedMap.set(fillerNode, vm)
  notifyListeners()
}

export function removeDetachedFullscreen(fillerNode) {
  if (detachedMap.delete(fillerNode)) {
    notifyListeners()
  }
}

function fillerNodeFor(el) {
  for (const [fillerNode, vm] of detachedMap) {
    if (vm.$el.contains(el) === true) return fillerNode
  }
}

/**
 * Tells if el sits inside an element that was detached from somewhere within
 * rootEl, which makes it a logical -- but no longer physical -- child. The
 * `owns` test decides whether a filler node belongs to rootEl, so that each
 * variant below agrees with the physical containment test it complements at
 * its call sites.
 *
 * Walks the filler chain instead of testing a single hop, so that an element
 * detached from inside another detached element resolves as well.
 */
function isInDetachedFullscreen(rootEl, el, owns) {
  // the ownership test may treat a nullish root as containing everything
  // (childHasFocus() does); a root that no longer exists cannot logically
  // own a detached element
  if (rootEl === void 0 || rootEl === null) return false

  // Each hop moves to the filler of a strictly outer detached element, and
  // every detached element is a direct child of <body>, so the chain cannot
  // cycle. The guard only defends against a stale entry left behind by a
  // consumer that failed to unregister -- a hang here would freeze the
  // document-level listeners these predicates run under.
  const visited = new Set()

  for (
    let node = fillerNodeFor(el);
    node !== void 0 && !visited.has(node);
    node = fillerNodeFor(node)
  ) {
    if (owns(rootEl, node) === true) return true
    visited.add(node)
  }

  return false
}

/**
 * Focus-trap variant (QDialog trap, QMenu focusout recapture): ownership via
 * childHasFocus(), which also owns later siblings -- matching how those traps
 * treat sibling portal nodes. A false positive only makes a trap fire less.
 */
export function focusIsInDetachedFullscreen(rootEl, focusedEl) {
  return isInDetachedFullscreen(rootEl, focusedEl, childHasFocus)
}

function strictlyContains(rootEl, node) {
  return rootEl.contains(node)
}

/**
 * Pointer variant (click-outside, #18512): ownership via strict containment,
 * matching click-outside's own anchorEl/innerRef .contains() tests. The
 * sibling widening above must not leak here: an element detached from a later
 * *sibling* of a popup is genuinely outside it, and a click inside that
 * element still has to close the popup.
 */
export function clickIsInDetachedFullscreen(rootEl, targetEl) {
  return isInDetachedFullscreen(rootEl, targetEl, strictlyContains)
}
