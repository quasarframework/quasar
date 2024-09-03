import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBadge from './QBadge.js'

describe('[QBadge API]', () => {
  describe('[Props]', () => {
    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

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
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

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

    describe('[(prop)floating]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

        expect(
          target.classes()
        ).not.toContain('q-badge--floating')

        await wrapper.setProps({ floating: true })
        await flushPromises()

        expect(
          wrapper.classes()
        ).toContain('q-badge--floating')

        expect(
          wrapper.get('.q-badge')
            .$computedStyle('position')
        ).toBe('absolute')
      })
    })

    describe('[(prop)transparent]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

        expect(
          target.classes()
        ).not.toContain('q-badge--transparent')

        await wrapper.setProps({ transparent: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-badge--transparent')

        expect(
          target.$computedStyle('opacity')
        ).not.toBe('1')
      })
    })

    describe('[(prop)multi-line]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

        expect(
          target.classes()
        ).not.toContain('q-badge--multi-line')

        await wrapper.setProps({ multiLine: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-badge--multi-line')

        expect(
          target.$computedStyle('word-break')
        ).toBe('break-all')
      })
    })

    describe('[(prop)label]', () => {
      test.each([
        [ 'String', 'John Doe' ],
        [ 'Number', 22 ]
      ])('type %s has effect', async (_, propVal) => {
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

        expect(
          target.text()
        ).not.toContain(propVal)

        await wrapper.setProps({ label: propVal })
        await flushPromises()

        expect(
          target.text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)align]', () => {
      test.each([
        [ 'top' ],
        [ 'middle' ],
        [ 'bottom' ]
      ])('value "%s" has effect', async propVal => {
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

        expect(
          target.$style('vertical-align')
        ).not.toBe(propVal)

        await wrapper.setProps({ align: propVal })
        await flushPromises()

        expect(
          target.$style('vertical-align')
        ).toBe(propVal)
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

        expect(
          target.classes()
        ).not.toContain('q-badge--outline')

        await wrapper.setProps({ outline: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-badge--outline')

        expect(
          target.$computedStyle('border')
        ).toContain('1px solid')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBadge)
        const target = wrapper.get('.q-badge')

        expect(
          target.classes()
        ).not.toContain('q-badge--rounded')

        await wrapper.setProps({ rounded: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-badge--rounded')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('1em')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBadge, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
