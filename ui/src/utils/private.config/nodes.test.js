import { describe, test, expect, afterEach } from 'vitest'

import { createGlobalNode, removeGlobalNode, changeGlobalNodesTarget } from './nodes.js'
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
        const el = createGlobalNode('first')

        expect(el).toBeInstanceOf(Element)
        expect(el.getAttribute('id')).toBe('first')
        expect(el.getAttribute('class')).toBeNull()
        expect(el.parentNode).toBe(document.body)
      })

      test('createGlobalNode(id) + globalNodes.class', () => {
        globalConfig.globalNodes = { class: 'some-class' }

        const el = createGlobalNode('some-id')

        expect(el).toBeInstanceOf(Element)
        expect(el.getAttribute('id')).toBe('some-id')
        expect(el.getAttribute('class')).toBe('some-class')
        expect(el.parentNode).toBe(document.body)
      })

      test('createGlobalNode(id, portalType)', () => {
        const el = createGlobalNode('port1', 'portType')

        expect(el).toBeInstanceOf(Element)
        expect(el.getAttribute('id')).toMatch(/^q-portal--portType--\d+$/)
        expect(el.getAttribute('class')).toBeNull()
        expect(el.parentNode).toBe(document.body)
      })

      test('createGlobalNode(id, portalType) + globalNodes.class', () => {
        globalConfig.globalNodes = { class: 'port-class' }

        const el = createGlobalNode('port1', 'portType')

        expect(el).toBeInstanceOf(Element)
        expect(el.getAttribute('id')).toMatch(/^q-portal--portType--\d+$/)
        expect(el.getAttribute('class')).toBe('port-class')
        expect(el.parentNode).toBe(document.body)
      })
    })

    describe('[(function)removeGlobalNode]', () => {
      test('has correct return value', () => {
        const el = createGlobalNode('rem')

        expect(
          removeGlobalNode(el)
        ).toBeUndefined()

        expect(el.parentNode).toBeNull()
      })

      test('does not error out when removing non-existing el', () => {
        const localEl = document.createElement('div')
        expect(
          removeGlobalNode(localEl)
        ).toBeUndefined()
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
          expect(
            node.parentElement === document.body
          ).toBe(true)
        })

        const newTargetEl = document.createElement('div')
        newTargetEl.setAttribute('id', 'new-target')
        document.body.appendChild(newTargetEl)

        expect(
          changeGlobalNodesTarget(newTargetEl)
        ).toBeUndefined()

        elList.forEach(node => {
          expect(
            node.parentElement
          ).toBe(newTargetEl)
        })
      })
    })
  })
})
