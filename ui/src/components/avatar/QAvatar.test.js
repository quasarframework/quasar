import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QAvatar from './QAvatar.js'
import { useSizeDefaults } from 'quasar/src/composables/private.use-size/use-size.js'

describe('[QAvatar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QAvatar)
        const target = wrapper.get('.q-avatar')

        expect(
          target.$style('font-size')
        ).toBe('')

        await wrapper.setProps({ size: '100px' })
        await flushPromises()

        expect(
          target.$style('font-size')
        ).toContain('100px')

        await wrapper.setProps({ size: 'sm' })
        await flushPromises()

        expect(
          target.$style('font-size')
        ).toBe(`${ useSizeDefaults.sm }px`)
      })
    })

    describe('[(prop)font-size]', () => {
      test('type String has effect', async () => {
        const size = '200px'
        const fontSize = '100px'

        const wrapper = mount(QAvatar)

        expect(
          wrapper.get('.q-avatar')
            .$style('font-size')
        ).not.toBe(size)

        expect(
          wrapper.get('.q-avatar__content')
            .$style('font-size')
        ).not.toBe(fontSize)

        await wrapper.setProps({
          size,
          fontSize
        })
        await flushPromises()

        expect(
          wrapper.get('.q-avatar')
            .$style('font-size')
        ).toBe(size)

        expect(
          wrapper.get('.q-avatar__content')
            .$style('font-size')
        ).toBe(fontSize)
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mount(QAvatar)
        const target = wrapper.get('.q-avatar')

        expect(
          target.classes()
        ).not.toContain(`bg-${ propVal }`)

        expect(
          target.classes()
        ).not.toContain(`text-${ propVal }`)

        await wrapper.setProps({ color: propVal })
        await flushPromises()

        expect(
          target.classes()
        ).toContain(`bg-${ propVal }`)

        expect(
          target.classes()
        ).not.toContain(`text-${ propVal }`)
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mount(QAvatar)
        const target = wrapper.get('.q-avatar')

        expect(
          target.classes()
        ).not.toContain(`bg-${ propVal }`)

        expect(
          target.classes()
        ).not.toContain(`text-${ propVal }`)

        await wrapper.setProps({ textColor: propVal })
        await flushPromises()

        expect(
          target.classes()
        ).toContain(`text-${ propVal }`)

        expect(
          target.classes()
        ).not.toContain(`bg-${ propVal }`)
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QAvatar)

        expect(
          wrapper.get('.q-avatar')
            .find('.q-icon')
            .exists()
        ).toBe(false)

        await wrapper.setProps({ icon: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-avatar')
            .get('.q-icon')
            .text()
        ).toContain(`${ propVal }`)
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QAvatar)
        const target = wrapper.get('.q-avatar')

        expect(
          target.classes()
        ).not.toContain('q-avatar--square')

        await wrapper.setProps({ square: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-avatar--square')

        expect(
          target.$computedStyle('border-radius')
        ).not.toBe('0px')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QAvatar)
        const target = wrapper.get('.q-avatar')

        expect(
          target.classes()
        ).not.toContain('rounded-borders')

        await wrapper.setProps({ rounded: true })
        await flushPromises()

        expect(
          target.$computedStyle('border-radius')
        ).toBe('4px')

        expect(
          target.classes()
        ).toContain('rounded-borders')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QAvatar, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
