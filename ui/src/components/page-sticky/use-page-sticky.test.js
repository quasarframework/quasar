import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { layoutKey } from '../../utils/private.symbols/symbols.js'
import usePageSticky, { usePageStickyProps } from './use-page-sticky.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

// only the offsets of the four layout sides are read by the composable
function createLayout({ header = 0, right = 0, footer = 0, left = 0 } = {}) {
  return {
    header: { offset: header },
    right: { offset: right },
    footer: { offset: footer },
    left: { offset: left }
  }
}

function mountSticky({ props = {}, layout = createLayout(), slots } = {}) {
  let api

  wrapper = mount(
    defineComponent({
      props: usePageStickyProps,
      setup(_, { slots: componentSlots }) {
        api = usePageSticky()
        return () => api.getStickyContent(componentSlots)
      }
    }),
    {
      props,
      slots,
      global: { provide: { [layoutKey]: layout } }
    }
  )

  return api
}

describe('[usePageSticky API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)usePageStickyProps]', () => {
      test('is defined correctly', () => {
        expect(usePageStickyProps).$props()
      })

      test('only accepts the documented positions', () => {
        const { validator, default: defaultValue } = usePageStickyProps.position

        expect(validator(defaultValue)).toBe(true)
        ;['top', 'right', 'bottom', 'left'].forEach(pos => {
          expect(validator(pos)).toBe(true)
        })
        ;['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(
          pos => {
            expect(validator(pos)).toBe(true)
          }
        )
        expect(validator('center')).toBe(false)
      })

      test('only accepts an offset of exactly two values', () => {
        const { validator } = usePageStickyProps.offset

        expect(validator([10, 20])).toBe(true)
        expect(validator([10])).toBe(false)
        expect(validator([])).toBe(false)
        expect(validator([1, 2, 3])).toBe(false)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('requires a QLayout parent', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        let result

        wrapper = mount(
          defineComponent({
            props: usePageStickyProps,
            setup() {
              result = usePageSticky()
              return () => h('div')
            }
          })
        )

        // bails out with the shared empty render function
        expect(result).toBeTypeOf('function')
        expect(result.getStickyContent).toBeUndefined()

        expect(errorSpy).toHaveBeenCalledTimes(1)
        expect(errorSpy.mock.calls[0][0]).toContain('QLayout')
      })

      test('returns the layout it is attached to along with its renderer', () => {
        const layout = createLayout()
        const api = mountSticky({ layout })

        expect(api.$layout).toBe(layout)
        expect(api.getStickyContent).toBeTypeOf('function')
      })

      test('renders the content wrapped in a positioned container', () => {
        mountSticky({ slots: { default: () => 'Sticky content' } })

        expect(wrapper.classes()).toContain('q-page-sticky')
        expect(wrapper.classes()).toContain('fixed-bottom-right')
        expect(wrapper.classes()).toContain('q-page-sticky--shrink')
        expect(wrapper.text()).toBe('Sticky content')
      })

      test('reflects the position prop in the classes', async () => {
        mountSticky({ props: { position: 'top-left' } })

        expect(wrapper.classes()).toContain('fixed-top-left')

        await wrapper.setProps({ position: 'left' })
        expect(wrapper.classes()).toContain('fixed-left')
      })

      test('expands the content instead of wrapping it', () => {
        mountSticky({
          props: { expand: true },
          slots: { default: () => h('span', { class: 'my-content' }) }
        })

        expect(wrapper.classes()).toContain('q-page-sticky--expand')
        // no intermediate div when expanding
        expect(
          wrapper.element.firstElementChild.classList.contains('my-content')
        ).toBe(true)
      })

      test('wraps the content in an extra div when shrinking', () => {
        mountSticky({
          slots: { default: () => h('span', { class: 'my-content' }) }
        })

        expect(wrapper.element.firstElementChild.tagName).toBe('DIV')
        expect(wrapper.get('.my-content').element.parentElement).toBe(
          wrapper.element.firstElementChild
        )
      })

      test('does not translate when the layout has no offsets', () => {
        mountSticky()

        expect(wrapper.element.style.transform).toBe('translate(0, 0)')
      })

      test('translates away from the header and the left drawer', () => {
        mountSticky({
          props: { position: 'top-left' },
          layout: createLayout({ header: 50, left: 30 })
        })

        expect(wrapper.element.style.transform).toBe('translate(30px, 50px)')
      })

      test('translates away from the footer and the right drawer', () => {
        mountSticky({
          props: { position: 'bottom-right' },
          layout: createLayout({ footer: 50, right: 30 })
        })

        expect(wrapper.element.style.transform).toBe('translate(-30px, -50px)')
      })

      test('ignores the offsets of the sides it is not attached to', () => {
        mountSticky({
          props: { position: 'top-left' },
          layout: createLayout({ footer: 50, right: 30 })
        })

        expect(wrapper.element.style.transform).toBe('translate(0, 0)')
      })

      test('applies the offset prop as a margin', () => {
        mountSticky({ props: { offset: [10, 20] } })

        // the offset is [ x, y ] but a margin is "vertical horizontal"
        expect(wrapper.element.style.margin).toBe('20px 10px')
      })

      test('pushes a vertically attached sticky aside of the drawers', () => {
        mountSticky({
          props: { position: 'bottom' },
          layout: createLayout({ left: 30, right: 40 })
        })

        expect(wrapper.element.style.left).toBe('30px')
        expect(wrapper.element.style.right).toBe('40px')
      })

      test('pushes a horizontally attached sticky away from header and footer', () => {
        mountSticky({
          props: { position: 'left' },
          layout: createLayout({ header: 30, footer: 40 })
        })

        expect(wrapper.element.style.top).toBe('30px')
        expect(wrapper.element.style.bottom).toBe('40px')
      })
    })
  })
})
