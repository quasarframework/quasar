import { afterEach, describe, expect, test } from 'vitest'

import {
  changeGlobalNodesTarget,
  createGlobalNode,
  removeGlobalNode
} from './nodes.js'
import { globalConfig } from './instance-config.js'

let el = null

afterEach(() => {
  delete globalConfig.globalNodes
  delete globalConfig.teleportTarget

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

      test('uses configured selector target', () => {
        const target = document.createElement('div')
        target.id = 'teleport-target'
        document.body.append(target)
        globalConfig.teleportTarget = '#teleport-target'

        el = createGlobalNode('configured-target')

        expect(el.parentNode).toBe(target)
        target.remove()
      })

      test('uses configured ShadowRoot target', () => {
        const host = document.createElement('div')
        document.body.append(host)
        const shadowRoot = host.attachShadow({ mode: 'open' })
        globalConfig.teleportTarget = () => shadowRoot

        el = createGlobalNode('shadow-target')

        expect(el.parentNode).toBe(shadowRoot)
        host.remove()
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

      test('preserves target for subsequently created nodes', () => {
        const configuredTarget = document.createElement('div')
        const fullscreenTarget = document.createElement('div')
        document.body.append(configuredTarget, fullscreenTarget)

        globalConfig.teleportTarget = configuredTarget
        changeGlobalNodesTarget(configuredTarget)

        const firstNode = createGlobalNode('before-fullscreen')
        let secondNode

        try {
          expect(firstNode.parentElement).toBe(configuredTarget)

          changeGlobalNodesTarget(fullscreenTarget)
          secondNode = createGlobalNode('during-fullscreen')

          expect(firstNode.parentElement).toBe(fullscreenTarget)
          expect(secondNode.parentElement).toBe(fullscreenTarget)
        } finally {
          changeGlobalNodesTarget(document.body)
          removeGlobalNode(firstNode)
          if (secondNode !== void 0) {
            removeGlobalNode(secondNode)
          }
          configuredTarget.remove()
          fullscreenTarget.remove()
        }
      })
    })
  })
})
