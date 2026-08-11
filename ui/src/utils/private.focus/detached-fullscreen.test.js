import { afterEach, describe, expect, test } from 'vitest'

import {
  addDetachedFullscreen,
  focusIsInDetachedFullscreen,
  removeDetachedFullscreen
} from './detached-fullscreen.js'

let nodeList = []
let fillerList = []

afterEach(() => {
  fillerList.forEach(fillerNode => {
    removeDetachedFullscreen(fillerNode)
  })

  nodeList.forEach(node => {
    node.remove()
  })

  fillerList = []
  nodeList = []
})

function createNode(tag = 'div') {
  const node = document.createElement(tag)
  document.body.append(node)
  nodeList.push(node)
  return node
}

/**
 * Reproduces what useFullscreen() does: leave a filler behind at the original
 * position inside originEl, then move the element itself to <body>.
 */
function detach(originEl) {
  const fillerNode = document.createElement('span')
  const movedEl = document.createElement('section')
  const targetEl = document.createElement('input')

  movedEl.append(targetEl)
  originEl.append(fillerNode)
  document.body.append(movedEl)

  nodeList.push(movedEl)
  fillerList.push(fillerNode)

  addDetachedFullscreen(fillerNode, { $el: movedEl })

  return { fillerNode, movedEl, targetEl }
}

describe('[detachedFullscreen API]', () => {
  describe('[Functions]', () => {
    describe('[(function)addDetachedFullscreen]', () => {
      test('has correct return value', () => {
        const rootEl = createNode()
        const fillerNode = document.createElement('span')
        const movedEl = createNode('section')

        rootEl.append(fillerNode)
        fillerList.push(fillerNode)

        expect(
          addDetachedFullscreen(fillerNode, { $el: movedEl })
        ).toBeUndefined()
      })

      test('makes the moved element a logical child of the original parent', () => {
        const rootEl = createNode()
        const { movedEl, targetEl } = detach(rootEl)

        expect(rootEl.contains(targetEl)).toBe(false)
        expect(movedEl.parentElement).toBe(document.body)
        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(true)
      })

      test('reads the current root of the registered vm', () => {
        const rootEl = createNode()
        const fillerNode = document.createElement('span')
        const firstEl = createNode('section')
        const secondEl = createNode('section')
        const targetEl = document.createElement('input')

        secondEl.append(targetEl)
        rootEl.append(fillerNode)
        fillerList.push(fillerNode)

        const vm = { $el: firstEl }
        addDetachedFullscreen(fillerNode, vm)

        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(false)

        vm.$el = secondEl

        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(true)
      })
    })

    describe('[(function)removeDetachedFullscreen]', () => {
      test('has correct return value', () => {
        const rootEl = createNode()
        const { fillerNode, targetEl } = detach(rootEl)

        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(true)

        expect(removeDetachedFullscreen(fillerNode)).toBeUndefined()

        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(false)
      })

      test('does not error out if filler is not registered', () => {
        expect(
          removeDetachedFullscreen(document.createElement('span'))
        ).toBeUndefined()
      })
    })

    describe('[(function)focusIsInDetachedFullscreen]', () => {
      test('has correct return value', () => {
        const rootEl = createNode()
        const { movedEl, targetEl } = detach(rootEl)

        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(true)
        expect(focusIsInDetachedFullscreen(rootEl, movedEl)).toBe(true)
      })

      test('returns false for an unrelated root', () => {
        const rootEl = createNode()
        const otherEl = createNode()
        const { targetEl } = detach(rootEl)

        expect(focusIsInDetachedFullscreen(otherEl, targetEl)).toBe(false)
      })

      test('returns false for a nullish root', () => {
        const rootEl = createNode()
        const { targetEl } = detach(rootEl)

        // unlike childHasFocus(), which treats a nullish root as containing
        // everything -- a gone root cannot own a detached element
        expect(focusIsInDetachedFullscreen(null, targetEl)).toBe(false)
        expect(focusIsInDetachedFullscreen(void 0, targetEl)).toBe(false)
      })

      test('returns false when nothing is detached', () => {
        const rootEl = createNode()
        const targetEl = createNode('input')

        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(false)
        expect(focusIsInDetachedFullscreen(rootEl, rootEl)).toBe(false)
      })

      test('follows a chain of nested detached elements', () => {
        const rootEl = createNode()
        const outer = detach(rootEl)
        const inner = detach(outer.movedEl)

        // the inner filler sits inside the outer moved element, which is
        // itself no longer inside rootEl -- a single hop cannot resolve this
        expect(rootEl.contains(inner.fillerNode)).toBe(false)
        expect(outer.movedEl.contains(inner.targetEl)).toBe(false)

        expect(focusIsInDetachedFullscreen(rootEl, inner.targetEl)).toBe(true)
      })

      test('treats a sibling of the root as owning the filler', () => {
        const rootEl = createNode()
        const siblingEl = createNode()
        const { targetEl } = detach(siblingEl)

        // childHasFocus() considers next siblings of the root to be owned by
        // it, so that portal chaining keeps working; this agrees with it
        expect(rootEl.nextElementSibling).toBe(siblingEl)
        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(true)
      })

      test('terminates on a stale cyclic registration', () => {
        // created before the root so that no next sibling of the root can
        // claim either filler -- the walk itself is what is under test here
        const movedA = createNode('section')
        const movedB = createNode('section')
        const rootEl = createNode()

        const fillerA = document.createElement('span')
        const fillerB = document.createElement('span')
        const targetEl = document.createElement('input')

        // each moved element holds the other's filler, which cannot happen
        // through useFullscreen() but would hang the walk without a guard
        movedA.append(fillerB, targetEl)
        movedB.append(fillerA)

        fillerList.push(fillerA, fillerB)
        addDetachedFullscreen(fillerA, { $el: movedA })
        addDetachedFullscreen(fillerB, { $el: movedB })

        expect(focusIsInDetachedFullscreen(rootEl, targetEl)).toBe(false)
      })
    })
  })
})
