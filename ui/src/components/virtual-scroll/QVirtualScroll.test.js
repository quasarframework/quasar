import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'

import QVirtualScroll from './QVirtualScroll.js'

const items = Array.from({ length: 500 }, (_, index) => `Item ${index}`)

const defaultSlot = ({ item, index }) =>
  h('div', { class: 'my-item', 'data-index': index }, item)

/**
 * The slice range is only committed on the next animation frame,
 * so every content assertion has to wait for one.
 */
async function settle() {
  await new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
  await flushPromises()
}

async function mountVirtualScroll(props = {}, slots = {}, mountOptions = {}) {
  const wrapper = mount(QVirtualScroll, {
    props: { items, ...props },
    slots: { default: defaultSlot, ...slots },
    attachTo: document.body,
    ...mountOptions
  })

  // jsdom reports no viewport size, so the first slice needs a nudge
  wrapper.vm.scrollTo(0)
  await settle()

  return wrapper
}

async function scrollTo(wrapper, index, edge) {
  wrapper.vm.scrollTo(index, edge)
  await settle()
}

function getRenderedIndexes(wrapper) {
  return wrapper
    .findAll('.my-item')
    .map(el => Number(el.attributes('data-index')))
}

function getPaddings(wrapper) {
  return wrapper.findAll('.q-virtual-scroll__padding')
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('[QVirtualScroll API]', () => {
  describe('[Props]', () => {
    describe('[(prop)virtual-scroll-horizontal]', () => {
      test('type Boolean has effect', async () => {
        const vertical = await mountVirtualScroll()
        expect(vertical.classes()).toContain('q-virtual-scroll--vertical')

        const wrapper = await mountVirtualScroll({
          virtualScrollHorizontal: true
        })

        expect(wrapper.classes()).toContain('q-virtual-scroll--horizontal')
        expect(wrapper.classes()).not.toContain('q-virtual-scroll--vertical')
      })

      test('pads along the horizontal axis', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollHorizontal: true
        })

        const style = getPaddings(wrapper)[0].attributes('style')
        expect(style).toContain('width')
        expect(style).toContain('--q-virtual-scroll-item-width')
      })
    })

    describe('[(prop)virtual-scroll-slice-size]', () => {
      test('type Number has effect', async () => {
        const small = await mountVirtualScroll({ virtualScrollSliceSize: 3 })
        const large = await mountVirtualScroll({ virtualScrollSliceSize: 60 })

        expect(getRenderedIndexes(large).length).toBeGreaterThan(
          getRenderedIndexes(small).length
        )
      })

      test('type String has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollSliceSize: '60'
        })

        const rendered = getRenderedIndexes(wrapper)
        expect(rendered.length).toBeGreaterThan(0)
        expect(rendered.length).toBeLessThan(items.length)
      })
    })

    describe('[(prop)virtual-scroll-slice-ratio-before]', () => {
      test('type Number has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollSliceSize: 12,
          virtualScrollSliceRatioBefore: 5
        })

        await scrollTo(wrapper, 250, 'start-force')

        // a bigger "before" ratio keeps more rendered above the index
        expect(getRenderedIndexes(wrapper)[0]).toBeLessThan(250)
      })

      test('type String has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollSliceSize: 12,
          virtualScrollSliceRatioBefore: '5'
        })

        await scrollTo(wrapper, 250, 'start-force')

        expect(getRenderedIndexes(wrapper)[0]).toBeLessThan(250)
      })
    })

    describe('[(prop)virtual-scroll-slice-ratio-after]', () => {
      test('type Number has effect', async () => {
        const small = await mountVirtualScroll({
          virtualScrollSliceSize: 12,
          virtualScrollSliceRatioAfter: 0
        })
        const large = await mountVirtualScroll({
          virtualScrollSliceSize: 12,
          virtualScrollSliceRatioAfter: 5
        })

        expect(getRenderedIndexes(large).at(-1)).toBeGreaterThan(
          getRenderedIndexes(small).at(-1)
        )
      })

      test('type String has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollSliceSize: 12,
          virtualScrollSliceRatioAfter: '5'
        })

        expect(getRenderedIndexes(wrapper).at(-1)).toBeGreaterThan(0)
      })
    })

    describe('[(prop)virtual-scroll-item-size]', () => {
      test('type Number has effect', async () => {
        const wrapper = await mountVirtualScroll({ virtualScrollItemSize: 50 })

        expect(getPaddings(wrapper)[0].attributes('style')).toContain(
          '--q-virtual-scroll-item-height: 50px'
        )
      })

      test('type String has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollItemSize: '50'
        })

        expect(getPaddings(wrapper)[0].attributes('style')).toContain(
          '--q-virtual-scroll-item-height: 50px'
        )
      })

      test('sizes the padding out of the unrendered items', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollItemSize: 50,
          virtualScrollSliceSize: 12
        })

        const rendered = getRenderedIndexes(wrapper).length
        const after = getPaddings(wrapper)[1]

        expect(Number.parseInt(after.element.style.height, 10)).toBe(
          (items.length - rendered) * 50
        )
      })
    })

    describe('[(prop)virtual-scroll-sticky-size-start]', () => {
      test('type Number has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollStickySizeStart: 30
        })

        expect(getRenderedIndexes(wrapper).length).toBeGreaterThan(0)
      })

      test('type String has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollStickySizeStart: '30'
        })

        expect(getRenderedIndexes(wrapper).length).toBeGreaterThan(0)
      })
    })

    describe('[(prop)virtual-scroll-sticky-size-end]', () => {
      test('type Number has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollStickySizeEnd: 30
        })

        expect(getRenderedIndexes(wrapper).length).toBeGreaterThan(0)
      })

      test('type String has effect', async () => {
        const wrapper = await mountVirtualScroll({
          virtualScrollStickySizeEnd: '30'
        })

        expect(getRenderedIndexes(wrapper).length).toBeGreaterThan(0)
      })
    })

    describe('[(prop)table-colspan]', () => {
      test('type Number has effect', async () => {
        const wrapper = await mountVirtualScroll({
          type: 'table',
          tableColspan: 7
        })

        expect(getPaddings(wrapper)[0].get('td').attributes('colspan')).toBe(
          '7'
        )
      })

      test('type String has effect', async () => {
        const wrapper = await mountVirtualScroll({
          type: 'table',
          tableColspan: '7'
        })

        expect(getPaddings(wrapper)[0].get('td').attributes('colspan')).toBe(
          '7'
        )
      })
    })

    describe('[(prop)type]', () => {
      test('type String has effect', async () => {
        const list = await mountVirtualScroll()
        expect(list.classes()).toContain('q-list')

        const wrapper = await mountVirtualScroll({ type: 'table' })

        expect(wrapper.classes()).toContain('q-markup-table')
        expect(wrapper.find('tbody.q-virtual-scroll__content').exists()).toBe(
          true
        )
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QVirtualScroll.props.type

        expect(validator('list')).toBe(true)
        expect(validator('table')).toBe(true)
        expect(validator('__qtable')).toBe(true)
        expect(validator('grid')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })
    })

    describe('[(prop)items]', () => {
      test('type Array has effect', async () => {
        const wrapper = await mountVirtualScroll({ items: ['a', 'b'] })

        expect(wrapper.findAll('.my-item').map(el => el.text())).toStrictEqual([
          'a',
          'b'
        ])
      })

      test('renders nothing for an empty list', async () => {
        const wrapper = await mountVirtualScroll({ items: [] })

        expect(wrapper.findAll('.my-item')).toHaveLength(0)
      })
    })

    describe('[(prop)items-size]', () => {
      test('type Number has effect', async () => {
        const wrapper = await mountVirtualScroll({
          items: [],
          itemsSize: 3,
          itemsFn: (from, size) =>
            Array.from({ length: size }, (_, i) => `Fn ${from + i}`)
        })

        expect(wrapper.findAll('.my-item').map(el => el.text())).toStrictEqual([
          'Fn 0',
          'Fn 1',
          'Fn 2'
        ])
      })
    })

    describe('[(prop)items-fn]', () => {
      test('type Function has effect', async () => {
        const itemsFn = vi.fn((from, size) =>
          Array.from({ length: size }, (_, i) => `Fn ${from + i}`)
        )

        const wrapper = await mountVirtualScroll({
          items: [],
          itemsSize: 5,
          itemsFn
        })

        expect(itemsFn).toHaveBeenCalled()
        expect(wrapper.findAll('.my-item')).toHaveLength(5)
      })

      test('still supplies the content without itemsSize', async () => {
        const itemsFn = vi.fn(() => ['from-fn'])
        const wrapper = await mountVirtualScroll({ items: ['a'], itemsFn })

        // only the length keeps coming from "items"
        expect(wrapper.findAll('.my-item')).toHaveLength(1)
        expect(wrapper.get('.my-item').text()).toBe('from-fn')
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type String has effect', async () => {
        const target = document.createElement('div')
        target.id = 'my-scroll-target'
        target.classList.add('scroll')
        document.body.append(target)

        const addSpy = vi.spyOn(target, 'addEventListener')

        const wrapper = await mountVirtualScroll(
          { scrollTarget: '#my-scroll-target' },
          {},
          { attachTo: target }
        )

        expect(addSpy).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
        // it no longer scrolls itself
        expect(wrapper.classes()).not.toContain('scroll')
        expect(wrapper.attributes('tabindex')).toBeUndefined()
      })

      test('type Element has effect', async () => {
        const target = document.createElement('div')
        target.classList.add('scroll')
        document.body.append(target)

        const addSpy = vi.spyOn(target, 'addEventListener')

        await mountVirtualScroll(
          { scrollTarget: target },
          {},
          { attachTo: target }
        )

        expect(addSpy).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })

      test('scrolls itself without it', async () => {
        const wrapper = await mountVirtualScroll()

        expect(wrapper.classes()).toContain('scroll')
        expect(wrapper.attributes('tabindex')).toBe('0')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)before]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-before-content'
        const wrapper = await mountVirtualScroll(
          {},
          { before: () => slotContent }
        )

        expect(wrapper.text()).toContain(slotContent)
        expect(wrapper.element.firstChild.textContent).toBe(slotContent)
      })
    })

    describe('[(slot)after]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-after-content'
        const wrapper = await mountVirtualScroll(
          {},
          { after: () => slotContent }
        )

        expect(wrapper.text()).toContain(slotContent)
        expect(wrapper.element.lastChild.textContent).toBe(slotContent)
      })
    })

    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const wrapper = await mountVirtualScroll({ items: ['only'] })

        expect(wrapper.get('.my-item').text()).toBe('only')
      })

      test('receives the item along with its index', async () => {
        const slot = vi.fn(defaultSlot)
        await mountVirtualScroll({ items: ['a', 'b'] }, { default: slot })

        expect(slot.mock.calls.map(([scope]) => scope)).toStrictEqual([
          { item: 'a', index: 0 },
          { item: 'b', index: 1 }
        ])
      })

      test('is required for rendering', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        // it reports the problem instead of rendering, and stays on
        // its feet even without a root element to hook the scrolling onto
        const wrapper = mount(QVirtualScroll, { props: { items } })

        expect(errorSpy).toHaveBeenCalledTimes(1)
        expect(errorSpy.mock.calls[0][0]).toContain('default scoped slot')
        expect(wrapper.find('.my-item').exists()).toBe(false)

        expect(() => wrapper.unmount()).not.toThrow()
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)virtual-scroll]', () => {
      test('is emitting', async () => {
        const onVirtualScroll = vi.fn()
        const wrapper = await mountVirtualScroll({ onVirtualScroll })

        onVirtualScroll.mockClear()
        await scrollTo(wrapper, 100)

        expect(onVirtualScroll).toHaveBeenCalledTimes(1)

        const [details] = onVirtualScroll.mock.calls[0]
        expect(details).toStrictEqual({
          index: 100,
          from: expect.any(Number),
          to: expect.any(Number),
          direction: 'increase',
          ref: wrapper.vm
        })
      })

      test('reports the direction of the move', async () => {
        const onVirtualScroll = vi.fn()
        const wrapper = await mountVirtualScroll({ onVirtualScroll })

        await scrollTo(wrapper, 100)
        await scrollTo(wrapper, 10)

        expect(onVirtualScroll.mock.calls.at(-1)[0].direction).toBe('decrease')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)scrollTo]', () => {
      test('should be callable', async () => {
        const wrapper = await mountVirtualScroll({ virtualScrollSliceSize: 12 })

        expect(wrapper.vm.scrollTo(300)).toBeUndefined()
        await settle()

        expect(getRenderedIndexes(wrapper)).toContain(300)
      })

      test('accepts an edge alignment', async () => {
        const wrapper = await mountVirtualScroll({ virtualScrollSliceSize: 12 })

        expect(wrapper.vm.scrollTo(300, 'center-force')).toBeUndefined()
        await settle()

        const rendered = getRenderedIndexes(wrapper)
        expect(rendered).toContain(300)
        // centered means there is about as much before as after
        expect(rendered[0]).toBeLessThan(300)
        expect(rendered.at(-1)).toBeGreaterThan(300)
      })

      test('clamps an out of range index', async () => {
        const wrapper = await mountVirtualScroll({ virtualScrollSliceSize: 12 })

        wrapper.vm.scrollTo(items.length + 10)
        await settle()

        expect(getRenderedIndexes(wrapper).at(-1)).toBe(items.length - 1)
      })
    })

    describe('[(method)reset]', () => {
      test('should be callable', async () => {
        const wrapper = await mountVirtualScroll({ virtualScrollSliceSize: 12 })

        await scrollTo(wrapper, 300)
        expect(getRenderedIndexes(wrapper)[0]).toBeGreaterThan(0)

        expect(wrapper.vm.reset()).toBeUndefined()
        await settle()
        await scrollTo(wrapper, 0)

        expect(getRenderedIndexes(wrapper)[0]).toBe(0)
      })
    })

    describe('[(method)refresh]', () => {
      test('should be callable', async () => {
        const wrapper = await mountVirtualScroll({ virtualScrollSliceSize: 12 })

        expect(wrapper.vm.refresh()).toBeUndefined()
        await settle()

        expect(getRenderedIndexes(wrapper).length).toBeGreaterThan(0)
      })

      test('accepts an index to refresh towards', async () => {
        const wrapper = await mountVirtualScroll({ virtualScrollSliceSize: 12 })

        expect(wrapper.vm.refresh(120)).toBeUndefined()
        await settle()
        await settle()

        expect(getRenderedIndexes(wrapper)).toContain(120)
      })
    })
  })
})
