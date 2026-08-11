import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'

import { layoutKey } from '../../utils/private.symbols/symbols.js'

import QPageScroller from './QPageScroller.js'

const targets = []

afterEach(() => {
  targets.splice(0).forEach(target => target.remove())
})

function mountScroller(props = {}, slots = {}, layoutOverrides = {}) {
  const target = document.createElement('div')
  target.classList.add('scroll')
  target.scrollTop = 500
  document.body.append(target)
  targets.push(target)

  const layout = {
    header: { offset: 60 },
    right: { offset: 24 },
    footer: { offset: 40 },
    left: { offset: 16 },
    height: ref(3000),
    containerHeight: ref(1000),
    isContainer: ref(true),
    rootRef: ref(target),
    scroll: ref({
      position: 2000,
      direction: 'down',
      inflectionPoint: 0
    }),
    ...layoutOverrides
  }

  const wrapper = mount(QPageScroller, {
    props,
    slots,
    global: {
      provide: {
        [layoutKey]: layout
      }
    }
  })

  return { layout, target, wrapper }
}

function expectPosition(position) {
  const { wrapper } = mountScroller({ position })

  expect(wrapper.get('.q-page-sticky').classes()).toContain(`fixed-${position}`)
}

describe('[QPageScroller API]', () => {
  describe('[Props]', () => {
    describe('[(prop)position]', () => {
      test('value "top-right" has effect', () => {
        expectPosition('top-right')
      })

      test('value "top-left" has effect', () => {
        expectPosition('top-left')
      })

      test('value "bottom-right" has effect', () => {
        expectPosition('bottom-right')
      })

      test('value "bottom-left" has effect', () => {
        expectPosition('bottom-left')
      })

      test('value "top" has effect', () => {
        expectPosition('top')
      })

      test('value "right" has effect', () => {
        expectPosition('right')
      })

      test('value "bottom" has effect', () => {
        expectPosition('bottom')
      })

      test('value "left" has effect', () => {
        expectPosition('left')
      })
    })

    describe('[(prop)offset]', () => {
      test('type Array has effect', () => {
        const { wrapper } = mountScroller({ offset: [12, 8] })

        expect(wrapper.get('.q-page-sticky').attributes('style')).toContain(
          'margin: 8px 12px'
        )
      })
    })

    describe('[(prop)expand]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountScroller({ expand: true })

        expect(wrapper.get('.q-page-sticky').classes()).toContain(
          'q-page-sticky--expand'
        )
      })
    })

    describe('[(prop)scroll-offset]', () => {
      test('type Number has effect', () => {
        const { wrapper } = mountScroller(
          { scrollOffset: 400 },
          {},
          {
            scroll: ref({
              position: 500,
              direction: 'down',
              inflectionPoint: 0
            })
          }
        )

        expect(wrapper.find('.q-page-scroller').exists()).toBe(true)
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountScroller(
          { reverse: true },
          {},
          {
            scroll: ref({
              position: 100,
              direction: 'down',
              inflectionPoint: 0
            })
          }
        )

        expect(wrapper.find('.q-page-scroller').exists()).toBe(true)
      })
    })

    describe('[(prop)duration]', () => {
      test('type Number has effect', async () => {
        const { target, wrapper } = mountScroller(
          { duration: 0 },
          {},
          { isContainer: ref(false) }
        )

        await wrapper.get('.q-page-scroller').trigger('click')

        expect(target.scrollTop).toBe(0)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Page scroller content'
        const { wrapper } = mountScroller({}, { default: () => slotContent })

        expect(wrapper.get('.q-page-sticky').text()).toBe(slotContent)
      })
    })
  })
})
