import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QBtnGroup from './QBtnGroup.js'

async function expectBooleanClass(prop, className) {
  const wrapper = mount(QBtnGroup)
  const target = wrapper.get('.q-btn-group')

  expect(target.classes()).not.toContain(className)

  await wrapper.setProps({ [prop]: true })

  expect(target.classes()).toContain(className)
}

describe('[QBtnGroup API]', () => {
  describe('[Props]', () => {
    describe('[(prop)spread]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtnGroup)
        const target = wrapper.get('.q-btn-group')

        expect(target.classes()).toContain('inline')
        expect(target.classes()).not.toContain('q-btn-group--spread')

        await wrapper.setProps({ spread: true })

        expect(target.classes()).not.toContain('inline')
        expect(target.classes()).toContain('q-btn-group--spread')
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('outline', 'q-btn-group--outline')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('flat', 'q-btn-group--flat')
      })
    })

    describe('[(prop)unelevated]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('unelevated', 'q-btn-group--unelevated')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('rounded', 'q-btn-group--rounded')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('square', 'q-btn-group--square')
      })
    })

    describe('[(prop)push]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('push', 'q-btn-group--push')
      })
    })

    describe('[(prop)stretch]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('stretch', 'q-btn-group--stretch')
      })
    })

    describe('[(prop)glossy]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('glossy', 'q-btn-group--glossy')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBtnGroup, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-btn-group').text()).toContain(slotContent)
      })
    })
  })
})
