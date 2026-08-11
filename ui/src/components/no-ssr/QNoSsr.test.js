import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import QNoSsr from './QNoSsr.js'

const hydration = vi.hoisted(() => ({ value: true }))

vi.mock('../../composables/use-hydration/use-hydration.js', () => ({
  default: () => ({ isHydrated: hydration })
}))

beforeEach(() => {
  hydration.value = true
})

describe('[QNoSsr API]', () => {
  describe('[Props]', () => {
    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QNoSsr, {
          props: { tag: 'section' },
          slots: {
            default: () => [h('span', 'First node'), h('span', 'Second node')]
          }
        })

        expect(wrapper.element.tagName).toBe('SECTION')
      })
    })

    describe('[(prop)placeholder]', () => {
      test('type String has effect', () => {
        hydration.value = false
        const wrapper = mount(QNoSsr, {
          props: { placeholder: 'Server placeholder' }
        })

        expect(wrapper.classes()).toContain('q-no-ssr-placeholder')
        expect(wrapper.text()).toBe('Server placeholder')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Client-only content'
        const wrapper = mount(QNoSsr, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })

    describe('[(slot)placeholder]', () => {
      test('renders the content', () => {
        hydration.value = false
        const slotContent = 'Slotted server placeholder'
        const wrapper = mount(QNoSsr, {
          props: { placeholder: 'Prop placeholder' },
          slots: {
            placeholder: () => [
              h('span', slotContent),
              h('span', 'Second placeholder node')
            ]
          }
        })

        expect(wrapper.classes()).toContain('q-no-ssr-placeholder')
        expect(wrapper.text()).toContain(slotContent)
        expect(wrapper.text()).not.toContain('Prop placeholder')
      })
    })
  })
})
