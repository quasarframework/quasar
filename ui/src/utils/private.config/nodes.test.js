import { afterEach, describe, expect, test } from 'vitest'

import {
  bringGlobalNodesToFront,
  changeGlobalNodesTarget,
  createGlobalNode,
  removeGlobalNode
} from './nodes.js'
import { globalConfig } from './instance-config.js'

let el = null

afterEach(() => {
  delete globalConfig.globalNodes

  if (el !== null) {
    removeGlobalNode(el)
    el = null
  }
})

describe('[nodes API]', () => {
  describe('[Functions]', () => {
    describe('[(function)createGlobalNode]', () => {
      test('createGlobalNode(id)', () => {
        const element = createGlobalNode('first')

        expect(element).toBeInstanceOf(Element)
        expect(element.getAttribute('id')).toBe('first')
        expect(element.getAttribute('class')).toBeNull()
        expect(element.parentNode).toBe(document.body)
      })

      test('createGlobalNode(id) + globalNodes.class', () => {
        globalConfig.globalNodes = { class: 'some-class' }

        const element = createGlobalNode('some-id')

        expect(element).toBeInstanceOf(Element)
        expect(element.getAttribute('id')).toBe('some-id')
        expect(element.getAttribute('class')).toBe('some-class')
        expect(element.parentNode).toBe(document.body)
      })

      test('createGlobalNode(id, portalType)', () => {
        const element = createGlobalNode('port1', 'portType')

        expect(element).toBeInstanceOf(Element)
        expect(element.getAttribute('id')).toMatch(/^q-portal--portType--\d+$/)
        expect(element.getAttribute('class')).toBeNull()
        expect(element.parentNode).toBe(document.body)
      })

      test('createGlobalNode(id, portalType) + globalNodes.class', () => {
        globalConfig.globalNodes = { class: 'port-class' }

        const element = createGlobalNode('port1', 'portType')

        expect(element).toBeInstanceOf(Element)
        expect(element.getAttribute('id')).toMatch(/^q-portal--portType--\d+$/)
        expect(element.getAttribute('class')).toBe('port-class')
        expect(element.parentNode).toBe(document.body)
      })
    })

    describe('[(function)removeGlobalNode]', () => {
      test('has correct return value', () => {
        const element = createGlobalNode('rem')

        expect(removeGlobalNode(element)).toBeUndefined()

        expect(element.parentNode).toBeNull()
      })

      test('does not error out when removing non-existing el', () => {
        const localEl = document.createElement('div')
        expect(removeGlobalNode(localEl)).toBeUndefined()
      })
    })

    describe('[(function)bringGlobalNodesToFront]', () => {
      test('has correct return value', () => {
        expect(bringGlobalNodesToFront()).toBeUndefined()
      })

      test('re-appends the tracked nodes after a later body child, in order', () => {
        const first = createGlobalNode('front1')
        const second = createGlobalNode('front2', 'ptype')

        // what the fullscreen mixin does: append its element after the portals
        const fullscreenEl = document.createElement('div')
        document.body.append(fullscreenEl)

        bringGlobalNodesToFront()

        // both portals paint above the appended element again...
        expect(
          fullscreenEl.compareDocumentPosition(first) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()
        // ...and keep their relative order
        expect(
          first.compareDocumentPosition(second) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()

        removeGlobalNode(first)
        removeGlobalNode(second)
        fullscreenEl.remove()
      })

      test('keeps the focus held inside a moved node', () => {
        const node = createGlobalNode('front-focus')
        const input = document.createElement('input')
        node.append(input)
        input.focus()

        bringGlobalNodesToFront()

        expect(document.activeElement).toBe(input)

        removeGlobalNode(node)
      })

      test('leaves nodes created under an explicit parent alone', () => {
        const parentEl = document.createElement('div')
        document.body.append(parentEl)
        const node = createGlobalNode('front-nested', void 0, parentEl)

        bringGlobalNodesToFront()

        expect(node.parentElement).toBe(parentEl)

        removeGlobalNode(node)
        parentEl.remove()
      })
    })

    describe('[(function)changeGlobalNodesTarget]', () => {
      test('has correct return value', () => {
        const elList = [
          createGlobalNode('node1'),
          createGlobalNode('node2'),
          createGlobalNode('node3', 'ptype')
        ]

        elList.forEach(node => {
          expect(node.parentElement === document.body).toBe(true)
        })

        const newTargetEl = document.createElement('div')
        newTargetEl.setAttribute('id', 'new-target')
        document.body.append(newTargetEl)

        expect(changeGlobalNodesTarget(newTargetEl)).toBeUndefined()

        elList.forEach(node => {
          expect(node.parentElement).toBe(newTargetEl)
        })
      })
      test('removeGlobalNode ignores an untracked element', () => {
        const tracked = createGlobalNode('tracked-node')
        const stray = document.createElement('div')

        removeGlobalNode(stray) // untracked -> must not evict a tracked node

        const newTarget = document.createElement('div')
        document.body.append(newTarget)
        changeGlobalNodesTarget(newTarget)
        expect(tracked.parentElement).toBe(newTarget)

        removeGlobalNode(tracked)
        changeGlobalNodesTarget(document.body)
        newTarget.remove()
      })
    })
  })
})
