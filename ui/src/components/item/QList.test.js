import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QList from './QList.js'

describe('[QList API]', () => {
  describe('[Props]', () => {
    describe('[default attributes]', () => {
      test('has a role="list" attribute with a div', async () => {
        const wrapper = mount(QList)

        const target = wrapper.get('.q-list')

        expect(target.element.getAttribute('role')).toBe('list')
      })

      test('does not have a role="list" attribute with a ol', async () => {
        const wrapper = mount(QList, { props: { tag: 'ol' } })

        const target = wrapper.get('.q-list')

        expect(target.element.getAttribute('role')).toBe(null)
      })

      test('does not have a role="list" attribute with a ul', async () => {
        const wrapper = mount(QList, { props: { tag: 'ul' } })

        const target = wrapper.get('.q-list')

        expect(target.element.getAttribute('role')).toBe(null)
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QList)

        const target = wrapper.get('.q-list')

        expect(target.classes()).not.toContain('q-list--bordered')

        await wrapper.setProps({ bordered: true })
        await flushPromises()

        expect(target.classes()).toContain('q-list--bordered')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QList)

        const target = wrapper.get('.q-list')

        expect(target.classes()).not.toContain('q-list--dense')

        await wrapper.setProps({ dense: true })
        await flushPromises()

        expect(target.classes()).toContain('q-list--dense')
      })
    })

    describe('[(prop)separator]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QList)

        const target = wrapper.get('.q-list')

        expect(target.classes()).not.toContain('q-list--separator')

        await wrapper.setProps({ separator: true })
        await flushPromises()

        expect(target.classes()).toContain('q-list--separator')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QList)
        await wrapper.setProps({ dark: false })

        const target = wrapper.get('.q-list')

        expect(target.classes()).not.toContain('q-list--dark')

        await wrapper.setProps({ dark: true })
        await flushPromises()

        expect(target.classes()).toContain('q-list--dark')

        await wrapper.setProps({ dark: false })
        await wrapper.vm.$q.dark.set(true)
        await flushPromises()

        expect(target.classes()).not.toContain('q-list--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QList)
        await wrapper.vm.$q.dark.set(false)

        const target = wrapper.get('.q-list')
        expect(target.classes()).not.toContain('q-list--dark')

        await wrapper.setProps({ dark: null })
        await flushPromises()

        expect(target.classes()).not.toContain('q-list--dark')

        await wrapper.vm.$q.dark.set(true)

        expect(target.classes()).toContain('q-list--dark')
      })
    })

    describe('[(prop)padding]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QList)

        const target = wrapper.get('.q-list')

        expect(target.classes()).not.toContain('q-list--padding')

        await wrapper.setProps({ padding: true })
        await flushPromises()

        expect(target.classes()).toContain('q-list--padding')
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QList, { props: { tag: 'ol' } })

        const target = wrapper.get('.q-list')

        expect(
          target.element.tagName.toLowerCase()
        ).toBe('ol')
      })

      test('default tag is div', async () => {
        const wrapper = mount(QList)

        const target = wrapper.get('.q-list')

        expect(
          target.element.tagName.toLowerCase()
        ).toBe('div')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QList, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
