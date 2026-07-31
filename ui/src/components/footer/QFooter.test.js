import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import { layoutKey } from '../../utils/private.symbols/symbols.js'

import QFooter from './QFooter.js'

function createLayout() {
  const layout = {
    instances: {},
    view: ref('hhh lpr fff'),
    isContainer: ref(true),
    height: ref(2000),
    containerHeight: ref(500),
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

function mountFooter(props = {}, slots = {}) {
  const layout = createLayout()
  const wrapper = mount(QFooter, {
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

describe('[QFooter API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountFooter({ modelValue: false })

        expect(wrapper.classes()).toContain('q-footer--hidden')
        expect(wrapper.classes()).toContain('q-layout--prevent-focus')
        expect(wrapper.classes()).toContain('hidden')
      })
    })

    describe('[(prop)reveal]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountFooter({ reveal: true })

        expect(wrapper.classes()).toContain('fixed-bottom')
        expect(wrapper.classes()).not.toContain('absolute-bottom')
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountFooter({ bordered: true })

        expect(wrapper.classes()).toContain('q-footer--bordered')
      })
    })

    describe('[(prop)elevated]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountFooter({ elevated: true })

        expect(wrapper.find('.q-layout__shadow').exists()).toBe(true)
      })
    })

    describe('[(prop)height-hint]', () => {
      test('type Number has effect', () => {
        const { layout } = mountFooter({ heightHint: 72 })

        expect(layout.update).toHaveBeenCalledWith('footer', 'size', 72)
      })

      test('type String has effect', () => {
        const { layout } = mountFooter({ heightHint: '84' })

        expect(layout.update).toHaveBeenCalledWith('footer', 'size', 84)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Footer content'
        const { wrapper } = mountFooter({}, { default: () => slotContent })

        expect(wrapper.text()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)reveal]', () => {
      test('is emitting', async () => {
        const { layout, wrapper } = mountFooter({ reveal: true })

        layout.scroll.value = {
          position: 500,
          direction: 'down',
          inflectionPoint: 0
        }
        await nextTick()

        expect(wrapper.emitted('reveal')).toEqual([[false]])
      })
    })
  })
})
