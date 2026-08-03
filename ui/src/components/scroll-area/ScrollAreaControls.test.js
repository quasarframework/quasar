import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'

import ScrollAreaControls from './ScrollAreaControls.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

function createAxisStore(axis) {
  return {
    ref: ref(null),
    barClass: ref(`q-scrollarea__bar q-scrollarea__bar--${axis}`),
    thumbClass: ref(`q-scrollarea__thumb q-scrollarea__thumb--${axis}`),
    style: ref({ top: '0px', height: '20px' })
  }
}

function mountControls(props = {}) {
  const directiveCalls = []
  const testDirective = {
    mounted(el, binding) {
      directiveCalls.push({ el, binding })
    }
  }

  const store = {
    scroll: {
      vertical: createAxisStore('v'),
      horizontal: createAxisStore('h')
    },

    thumbVertDir: [[testDirective, 'vertical']],
    thumbHorizDir: [[testDirective, 'horizontal']],

    onVerticalMousedown: vi.fn(),
    onHorizontalMousedown: vi.fn()
  }

  wrapper = mount(ScrollAreaControls, {
    props: { store, ...props }
  })

  const [verticalBar, horizontalBar, verticalThumb, horizontalThumb] =
    wrapper.findAll('div')

  return {
    store,
    directiveCalls,
    verticalBar,
    horizontalBar,
    verticalThumb,
    horizontalThumb
  }
}

describe('[ScrollAreaControls API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)default]', () => {
      test('is defined correctly', () => {
        expect(ScrollAreaControls).toBeTypeOf('object')
        expect(ScrollAreaControls.setup).toBeTypeOf('function')
        expect(ScrollAreaControls.props).$arrayValues(expect.any(String))
      })

      test('renders a bar and a thumb for each axis', () => {
        const { verticalBar, horizontalBar, verticalThumb, horizontalThumb } =
          mountControls()

        expect(wrapper.findAll('div')).toHaveLength(4)

        expect(verticalBar.classes()).toContain('q-scrollarea__bar--v')
        expect(horizontalBar.classes()).toContain('q-scrollarea__bar--h')
        expect(verticalThumb.classes()).toContain('q-scrollarea__thumb--v')
        expect(horizontalThumb.classes()).toContain('q-scrollarea__thumb--h')

        // none of them should be reachable by assistive technology
        wrapper.findAll('div').forEach(el => {
          expect(el.attributes('aria-hidden')).toBe('true')
        })
      })

      test('merges the generic bar style with the per-axis one', () => {
        const { verticalBar, horizontalBar } = mountControls({
          barStyle: { opacity: '0.2' },
          verticalBarStyle: { width: '10px' },
          horizontalBarStyle: { height: '8px' }
        })

        expect(verticalBar.$style('opacity')).toBe('0.2')
        expect(verticalBar.$style('width')).toBe('10px')
        expect(horizontalBar.$style('opacity')).toBe('0.2')
        expect(horizontalBar.$style('height')).toBe('8px')
      })

      test('applies the thumb style coming from the store', () => {
        const { verticalThumb } = mountControls()

        expect(verticalThumb.$style('height')).toBe('20px')
      })

      test('delegates the bar mousedown handling to the store', async () => {
        const { store, verticalBar, horizontalBar } = mountControls()

        await verticalBar.trigger('mousedown')
        await horizontalBar.trigger('mousedown')

        expect(store.onVerticalMousedown).toHaveBeenCalledOnce()
        expect(store.onHorizontalMousedown).toHaveBeenCalledOnce()
      })

      test('binds the store directives and refs to the thumbs', () => {
        const { store, directiveCalls, verticalThumb, horizontalThumb } =
          mountControls()

        expect(store.scroll.vertical.ref.value).toBe(verticalThumb.element)
        expect(store.scroll.horizontal.ref.value).toBe(horizontalThumb.element)

        expect(directiveCalls).toStrictEqual([
          {
            el: verticalThumb.element,
            binding: expect.objectContaining({ value: 'vertical' })
          },
          {
            el: horizontalThumb.element,
            binding: expect.objectContaining({ value: 'horizontal' })
          }
        ])
      })

      test('reacts to store updates', async () => {
        const { store } = mountControls()

        store.scroll.vertical.thumbClass.value = 'q-scrollarea__thumb--moved'
        store.scroll.vertical.style.value = { height: '55px' }
        await wrapper.vm.$nextTick()

        const verticalThumb = wrapper.findAll('div')[2]

        expect(verticalThumb.classes()).toContain('q-scrollarea__thumb--moved')
        expect(verticalThumb.$style('height')).toBe('55px')
      })
    })
  })
})
