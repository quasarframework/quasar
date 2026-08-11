import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QTimeline from './QTimeline.js'
import QTimelineEntry from './QTimelineEntry.js'

describe('[QTimeline API]', () => {
  describe('[Props]', () => {
    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { color: 'secondary' },
          slots: {
            default: () => h(QTimelineEntry)
          }
        })

        expect(wrapper.get('.q-timeline__dot').classes()).toContain(
          'text-secondary'
        )
      })
    })

    describe('[(prop)side]', () => {
      test('value "left" has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { side: 'left' }
        })

        expect(wrapper.classes()).toContain('q-timeline--dense--left')
      })

      test('value "right" has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { side: 'right' }
        })

        expect(wrapper.classes()).toContain('q-timeline--dense--right')
      })
    })

    describe('[(prop)layout]', () => {
      test('value "dense" has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { layout: 'dense' }
        })

        expect(wrapper.classes()).toContain('q-timeline--dense')
      })

      test('value "comfortable" has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { layout: 'comfortable' }
        })

        expect(wrapper.classes()).toContain('q-timeline--comfortable')
      })

      test('value "loose" has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { layout: 'loose' }
        })

        expect(wrapper.classes()).toContain('q-timeline--loose')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { dark: true }
        })

        expect(wrapper.classes()).toContain('q-timeline--dark')
      })

      test('type null has effect', () => {
        const wrapper = mount(QTimeline, {
          props: { dark: null }
        })

        expect(wrapper.classes()).not.toContain('q-timeline--dark')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Timeline content'
        const wrapper = mount(QTimeline, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
