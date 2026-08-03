import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, onBeforeMount, ref } from 'vue'

import {
  commonVirtScrollPropsList,
  useVirtualScroll,
  useVirtualScrollProps
} from './use-virtual-scroll.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
  vi.useRealTimers()
})

/** The animations frames the composable schedules are run right away. */
function runFramesSynchronously() {
  return vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
    cb(0)
    return 0
  })
}

/**
 * Mounts a minimal virtual scroller: a scrolling container holding the
 * padding/content structure that padVirtualScroll() builds.
 *
 * The container gets an explicit 96px height (4 default-sized items) and
 * every item is sized to virtualScrollItemSize, so the slice math out of
 * the real browser layout stays deterministic.
 */
function mountVirtualScroll({ length = 100, tag = 'div', ...props } = {}) {
  let virtualScroll

  wrapper = mount(
    defineComponent({
      props: {
        ...useVirtualScrollProps,
        length: { type: Number, default: 0 }
      },

      emits: ['virtualScroll'],

      setup(componentProps) {
        const rootRef = ref(null)
        const virtualScrollLength = computed(() => componentProps.length)

        virtualScroll = useVirtualScroll({
          virtualScrollLength,
          getVirtualScrollTarget: () => rootRef.value,
          getVirtualScrollEl: () => rootRef.value
        })

        // this is what every consumer of the composable does
        onBeforeMount(() => {
          virtualScroll.localResetVirtualScroll()
        })

        return () => {
          const { from, to } = virtualScroll.virtualScrollSliceRange.value
          const items = []

          for (let i = from; i < to; i++) {
            items.push(
              h(
                tag === 'tbody' ? 'tr' : 'div',
                {
                  key: i,
                  class: 'my-item',
                  style: { height: `${componentProps.virtualScrollItemSize}px` }
                },
                [tag === 'tbody' ? h('td', `item ${i}`) : `item ${i}`]
              )
            )
          }

          return h(
            'div',
            {
              ref: rootRef,
              class: 'scroll-target',
              style: { height: '96px', overflow: 'auto' }
            },
            virtualScroll.padVirtualScroll(tag, items)
          )
        }
      }
    }),
    { props: { length, ...props } }
  )

  return virtualScroll
}

function getPaddings() {
  return wrapper.findAll('.q-virtual-scroll__padding')
}

describe('[useVirtualScroll API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)commonVirtScrollPropsList]', () => {
      test('is defined correctly', () => {
        expect(commonVirtScrollPropsList).$arrayValues(expect.any(String))
        expect(commonVirtScrollPropsList).not.toHaveLength(0)

        // every listed name must be an actual shared prop
        commonVirtScrollPropsList.forEach(name => {
          expect(useVirtualScrollProps[name]).toBeDefined()
        })
      })
    })

    describe('[(variable)useVirtualScrollProps]', () => {
      test('is defined correctly', () => {
        expect(useVirtualScrollProps).$props()

        // the list is a strict subset, the rest being local to the scroller
        expect(Object.keys(useVirtualScrollProps)).toStrictEqual(
          expect.arrayContaining([
            ...commonVirtScrollPropsList,
            'virtualScrollHorizontal',
            'onVirtualScroll'
          ])
        )
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useVirtualScroll]', () => {
      test('has correct return value', () => {
        const virtualScroll = mountVirtualScroll()

        expect(virtualScroll).toStrictEqual({
          virtualScrollSliceRange: expect.$ref({ from: 0, to: 0 }),
          virtualScrollSliceSizeComputed: expect.$ref(expect.any(Object)),

          setVirtualScrollSize: expect.any(Function),
          onVirtualScrollEvt: expect.any(Function),
          localResetVirtualScroll: expect.any(Function),
          padVirtualScroll: expect.any(Function),

          scrollTo: expect.any(Function),
          reset: expect.any(Function),
          refresh: expect.any(Function)
        })
      })

      test('exposes the navigation methods on the component', () => {
        const virtualScroll = mountVirtualScroll()

        expect(wrapper.vm.scrollTo).toBe(virtualScroll.scrollTo)
        expect(wrapper.vm.reset).toBe(virtualScroll.reset)
        expect(wrapper.vm.refresh).toBe(virtualScroll.refresh)
      })

      test.each([
        ['the defaults', {}, { total: 12, start: 4, center: 6, end: 8 }],
        [
          'a bigger slice',
          { virtualScrollSliceSize: 30 },
          { total: 30, start: 10, center: 15, end: 20 }
        ],
        [
          'no surrounding slices',
          { virtualScrollSliceRatioBefore: 0, virtualScrollSliceRatioAfter: 0 },
          { total: 10, start: 0, center: 5, end: 10 }
        ],
        [
          'a wider slice before',
          { virtualScrollSliceRatioBefore: 3, virtualScrollSliceRatioAfter: 0 },
          { total: 12, start: 9, center: 11, end: 12 }
        ]
      ])('sizes the slice out of %s', (_, props, expected) => {
        const virtualScroll = mountVirtualScroll(props)

        expect(
          virtualScroll.virtualScrollSliceSizeComputed.value
        ).toStrictEqual({ ...expected, view: 1 })
      })

      test('resizes the slice when the ratios change', async () => {
        const virtualScroll = mountVirtualScroll()

        await wrapper.setProps({
          virtualScrollSliceRatioBefore: 0,
          virtualScrollSliceRatioAfter: 0
        })

        expect(virtualScroll.virtualScrollSliceSizeComputed.value.total).toBe(
          10
        )
      })

      test('recomputes the slice size on demand', () => {
        const virtualScroll = mountVirtualScroll({ virtualScrollItemSize: 20 })

        virtualScroll.setVirtualScrollSize(200)

        expect(
          virtualScroll.virtualScrollSliceSizeComputed.value
        ).toStrictEqual({ total: 30, start: 10, center: 15, end: 20, view: 10 })
      })

      test('renders a padding before, the content and a padding after', () => {
        mountVirtualScroll({ length: 100, virtualScrollItemSize: 24 })

        const paddings = getPaddings()

        expect(paddings).toHaveLength(2)
        expect(wrapper.findAll('.q-virtual-scroll__content')).toHaveLength(1)
        expect(
          wrapper.get('.q-virtual-scroll__content').attributes('tabindex')
        ).toBe('-1')

        // nothing is rendered yet, so the whole list is padding
        expect(paddings[0].$style('height')).toBe('0px')
        expect(paddings[1].$style('height')).toBe(`${100 * 24}px`)
      })

      test.each([
        ['vertically', {}, 'height', '--q-virtual-scroll-item-height'],
        [
          'horizontally',
          { virtualScrollHorizontal: true },
          'width',
          '--q-virtual-scroll-item-width'
        ]
      ])('pads %s', (_, props, sizeProp, cssVar) => {
        mountVirtualScroll({ virtualScrollItemSize: 30, ...props })

        const [before] = getPaddings()

        expect(before.$style(sizeProp)).toBe('0px')
        expect(before.element.style.getPropertyValue(cssVar)).toBe('30px')
      })

      test('pads a table with a full-width cell', () => {
        mountVirtualScroll({ tag: 'tbody', tableColspan: 5 })

        const [before, after] = getPaddings()

        expect(before.element.tagName).toBe('TBODY')
        expect(before.get('td').attributes('colspan')).toBe('5')
        expect(after.get('td').attributes('colspan')).toBe('5')
      })

      test('defaults the table colspan', () => {
        mountVirtualScroll({ tag: 'tbody' })

        expect(getPaddings()[0].get('td').attributes('colspan')).toBe('100')
      })

      test('renders the slice and pads for the rest', async () => {
        runFramesSynchronously()
        const virtualScroll = mountVirtualScroll({
          length: 100,
          virtualScrollItemSize: 24
        })

        virtualScroll.localResetVirtualScroll(0)
        await nextTick()
        await nextTick()

        expect(virtualScroll.virtualScrollSliceRange.value).toStrictEqual({
          from: 0,
          to: 12
        })
        expect(wrapper.findAll('.my-item')).toHaveLength(12)

        const [before, after] = getPaddings()

        expect(before.$style('height')).toBe('0px')
        // the 88 items that are not rendered
        expect(after.$style('height')).toBe(`${88 * 24}px`)
      })

      test('never slices past the end of the list', async () => {
        runFramesSynchronously()
        const virtualScroll = mountVirtualScroll({ length: 5 })

        virtualScroll.localResetVirtualScroll(0)
        await nextTick()
        await nextTick()

        expect(virtualScroll.virtualScrollSliceRange.value).toStrictEqual({
          from: 0,
          to: 5
        })
      })

      test('reports the scrolling to whoever listens', async () => {
        runFramesSynchronously()
        const onVirtualScroll = vi.fn()
        const virtualScroll = mountVirtualScroll({
          length: 100,
          onVirtualScroll
        })

        virtualScroll.scrollTo(30)
        await nextTick()

        expect(wrapper.emitted('virtualScroll')?.at(-1)).toStrictEqual([
          {
            index: 30,
            from: expect.any(Number),
            to: expect.any(Number),
            direction: 'increase',
            ref: wrapper.vm
          }
        ])
      })

      test('stays quiet without a listener', async () => {
        runFramesSynchronously()
        const virtualScroll = mountVirtualScroll({ length: 100 })

        virtualScroll.scrollTo(30)
        await nextTick()

        expect(wrapper.emitted('virtualScroll')).toBeUndefined()
      })

      test.each([
        ['past the end', 500, 99],
        ['before the start', -5, 0],
        ['not a number', 'nope', 0]
      ])('clamps a scroll request %s', async (_, toIndex, expected) => {
        runFramesSynchronously()
        const onVirtualScroll = vi.fn()
        const virtualScroll = mountVirtualScroll({
          length: 100,
          onVirtualScroll
        })

        virtualScroll.scrollTo(toIndex)
        await nextTick()

        expect(wrapper.emitted('virtualScroll').at(-1)[0].index).toBe(expected)
      })

      test.each([
        ['there is no target', () => null],
        ['the target is a comment node', () => document.createComment('x')]
      ])('does nothing when %s', (_, getTarget) => {
        let virtualScroll

        wrapper = mount(
          defineComponent({
            props: useVirtualScrollProps,
            setup() {
              virtualScroll = useVirtualScroll({
                virtualScrollLength: computed(() => 100),
                getVirtualScrollTarget: getTarget,
                getVirtualScrollEl: getTarget
              })
              onBeforeMount(() => {
                virtualScroll.localResetVirtualScroll()
              })
              return () => h('div')
            }
          })
        )

        expect(() => virtualScroll.scrollTo(10)).not.toThrow()
        expect(virtualScroll.virtualScrollSliceRange.value).toStrictEqual({
          from: 0,
          to: 0
        })
      })

      test('resets when the item size changes', async () => {
        runFramesSynchronously()
        const virtualScroll = mountVirtualScroll({
          length: 100,
          virtualScrollItemSize: 24
        })

        virtualScroll.localResetVirtualScroll(0)
        await nextTick()
        await nextTick()

        expect(getPaddings()[1].$style('height')).toBe(`${88 * 24}px`)

        await wrapper.setProps({ virtualScrollItemSize: 50 })
        await nextTick()

        expect(getPaddings()[1].$style('height')).toBe(`${88 * 50}px`)
      })

      test('refreshes around the last known index', async () => {
        runFramesSynchronously()
        const onVirtualScroll = vi.fn()
        const virtualScroll = mountVirtualScroll({
          length: 100,
          onVirtualScroll
        })

        virtualScroll.scrollTo(40)
        await nextTick()

        virtualScroll.refresh()
        await nextTick()
        await nextTick()

        expect(wrapper.emitted('virtualScroll').at(-1)[0].index).toBe(40)
      })

      test('debounces the scroll handling and drops it when unmounted', async () => {
        vi.useFakeTimers()
        runFramesSynchronously()
        const virtualScroll = mountVirtualScroll({ length: 100 })
        const cancel = vi.spyOn(virtualScroll.onVirtualScrollEvt, 'cancel')

        virtualScroll.onVirtualScrollEvt()
        virtualScroll.onVirtualScrollEvt()

        expect(virtualScroll.virtualScrollSliceRange.value).toStrictEqual({
          from: 0,
          to: 0
        })

        vi.advanceTimersByTime(35)
        await nextTick()

        expect(virtualScroll.virtualScrollSliceRange.value.to).toBe(12)

        wrapper.unmount()
        wrapper = void 0

        expect(cancel).toHaveBeenCalledOnce()
      })
    })
  })
})
