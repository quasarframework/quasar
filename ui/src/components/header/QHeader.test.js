import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import { layoutKey } from '../../utils/private.symbols/symbols.js'

import QHeader from './QHeader.js'

function createLayout() {
  const layout = {
    instances: {},
    view: ref('hhh lpr fff'),
    isContainer: ref(true),
    height: ref(1800),
    containerHeight: ref(600),
    rows: ref({
      top: ['h', 'h', 'h'],
      middle: ['l', 'p', 'r'],
      bottom: ['f', 'f', 'f']
    }),
    header: { size: 0, offset: 0, space: false },
    right: { size: 240, offset: 0, space: false },
    footer: { size: 0, offset: 0, space: false },
    left: { size: 200, offset: 0, space: false },
    scroll: ref({
      position: 0,
      direction: 'down',
      inflectionPoint: 0
    }),
    animate: vi.fn()
  }

  layout.update = vi.fn((part, prop, value) => {
    layout[part][prop] = value
  })

  return layout
}

function mountHeader(props = {}, slots = {}) {
  const layout = createLayout()
  const wrapper = mount(QHeader, {
    props,
    slots,
    global: {
      provide: {
        [layoutKey]: layout
      }
    }
  })

  return { layout, wrapper }
}

describe('[QHeader API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountHeader({ modelValue: false })

        expect(wrapper.classes()).toContain('q-header--hidden')
        expect(wrapper.classes()).toContain('q-layout--prevent-focus')
      })
    })

    describe('[(prop)reveal]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountHeader({ reveal: true })

        expect(wrapper.classes()).toContain('fixed-top')
        expect(wrapper.classes()).not.toContain('absolute-top')
      })
    })

    describe('[(prop)reveal-offset]', () => {
      test('type Number has effect', async () => {
        const { layout, wrapper } = mountHeader({
          reveal: true,
          revealOffset: 100
        })

        layout.scroll.value = {
          position: 150,
          direction: 'down',
          inflectionPoint: 0
        }
        await nextTick()

        expect(wrapper.classes()).toContain('q-header--hidden')
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountHeader({ bordered: true })

        expect(wrapper.classes()).toContain('q-header--bordered')
      })
    })

    describe('[(prop)elevated]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountHeader({ elevated: true })

        expect(wrapper.find('.q-layout__shadow').exists()).toBe(true)
      })
    })

    describe('[(prop)height-hint]', () => {
      test('type Number has effect', () => {
        const { layout } = mountHeader({ heightHint: 72 })

        expect(layout.update).toHaveBeenCalledWith('header', 'size', 72)
      })

      test('type String has effect', () => {
        const { layout } = mountHeader({ heightHint: '84' })

        expect(layout.update).toHaveBeenCalledWith('header', 'size', 84)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Header content'
        const { wrapper } = mountHeader({}, { default: () => slotContent })

        expect(wrapper.text()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)reveal]', () => {
      test('is emitting', async () => {
        const { layout, wrapper } = mountHeader({
          reveal: true,
          revealOffset: 100
        })

        layout.scroll.value = {
          position: 200,
          direction: 'down',
          inflectionPoint: 0
        }
        await nextTick()

        expect(wrapper.emitted('reveal')).toEqual([[false]])
      })
    })
  })
})
