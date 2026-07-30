import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QTimeline from './QTimeline.js'
import QTimelineEntry from './QTimelineEntry.js'

function mountTimelineEntry(props = {}, slots = {}, timelineProps = {}) {
  return mount(QTimeline, {
    props: timelineProps,
    slots: {
      default: () => h(QTimelineEntry, props, slots)
    }
  })
}

describe('[QTimelineEntry API]', () => {
  describe('[Props]', () => {
    describe('[(prop)heading]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountTimelineEntry({ heading: true })

        expect(wrapper.find('.q-timeline__entry').exists()).toBe(false)
        expect(wrapper.get('.q-timeline__heading').exists()).toBe(true)
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mountTimelineEntry({
          heading: true,
          tag: 'h4'
        })

        expect(wrapper.get('.q-timeline__heading-title').element.tagName).toBe(
          'H4'
        )
      })
    })

    describe('[(prop)side]', () => {
      test('value "left" has effect', () => {
        const wrapper = mountTimelineEntry({ side: 'left' })

        expect(wrapper.get('.q-timeline__entry').classes()).toContain(
          'q-timeline__entry--left'
        )
      })

      test('value "right" has effect', () => {
        const wrapper = mountTimelineEntry({ side: 'right' })

        expect(wrapper.get('.q-timeline__entry').classes()).toContain(
          'q-timeline__entry--right'
        )
      })

      test('comfortable left timeline reverses the entry content order', () => {
        const wrapper = mountTimelineEntry(
          {
            title: 'December party',
            subtitle: 'All invited',
            body: 'Timeline body content'
          },
          {},
          {
            layout: 'comfortable',
            side: 'left'
          }
        )

        expect(
          Array.from(
            wrapper.get('.q-timeline__entry').element.children,
            element => element.classList[0]
          )
        ).toStrictEqual([
          'q-timeline__content',
          'q-timeline__dot',
          'q-timeline__subtitle'
        ])
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountTimelineEntry({ icon: 'map' })

        expect(wrapper.get('.q-timeline__entry').classes()).toContain(
          'q-timeline__entry--icon'
        )
        expect(wrapper.get('.q-timeline__dot .q-icon').text()).toBe('map')
      })
    })

    describe('[(prop)avatar]', () => {
      test('type String has effect', () => {
        const avatar = 'https://example.test/avatar.png'
        const wrapper = mountTimelineEntry({ avatar })

        expect(wrapper.get('.q-timeline__entry').classes()).toContain(
          'q-timeline__entry--icon'
        )
        expect(wrapper.get('.q-timeline__dot-img').attributes('src')).toBe(
          avatar
        )
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountTimelineEntry({ color: 'accent' })

        expect(wrapper.get('.q-timeline__dot').classes()).toContain(
          'text-accent'
        )
      })
    })

    describe('[(prop)title]', () => {
      test('type String has effect', () => {
        const wrapper = mountTimelineEntry({ title: 'December party' })

        expect(wrapper.get('.q-timeline__title').text()).toBe('December party')
      })
    })

    describe('[(prop)subtitle]', () => {
      test('type String has effect', () => {
        const wrapper = mountTimelineEntry({ subtitle: 'All invited' })

        expect(wrapper.get('.q-timeline__subtitle').text()).toBe('All invited')
      })
    })

    describe('[(prop)body]', () => {
      test('type String has effect', () => {
        const body = 'Timeline body content'
        const wrapper = mountTimelineEntry({ body })

        expect(wrapper.get('.q-timeline__content').text()).toContain(body)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Default timeline content'
        const wrapper = mountTimelineEntry({}, { default: () => slotContent })

        expect(wrapper.get('.q-timeline__content').text()).toContain(
          slotContent
        )
      })
    })

    describe('[(slot)title]', () => {
      test('renders the content', () => {
        const slotContent = 'Custom timeline title'
        const wrapper = mountTimelineEntry({}, { title: () => slotContent })

        expect(wrapper.get('.q-timeline__title').text()).toBe(slotContent)
      })
    })

    describe('[(slot)subtitle]', () => {
      test('renders the content', () => {
        const slotContent = 'Custom timeline subtitle'
        const wrapper = mountTimelineEntry({}, { subtitle: () => slotContent })

        expect(wrapper.get('.q-timeline__subtitle').text()).toBe(slotContent)
      })
    })
  })
})
