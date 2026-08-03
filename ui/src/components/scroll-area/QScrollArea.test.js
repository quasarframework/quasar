import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QScrollArea from './QScrollArea.js'

function mountScrollArea(props = {}, slots = {}) {
  return mount(QScrollArea, { props, slots })
}

/**
 * A real 100x100 viewport holding real 500x500 content, so that the
 * container element can actually be scrolled.
 */
function mountScrollableArea() {
  return mount(QScrollArea, {
    attrs: { style: 'width: 100px; height: 100px' },
    slots: {
      default: () => h('div', { style: 'width: 500px; height: 500px' })
    }
  })
}

function getContainer(wrapper) {
  return wrapper.get('.q-scrollarea__container')
}

function getContent(wrapper) {
  return wrapper.get('.q-scrollarea__content')
}

function getVerticalThumb(wrapper) {
  return wrapper.get('.q-scrollarea__thumb--v')
}

function getHorizontalThumb(wrapper) {
  return wrapper.get('.q-scrollarea__thumb--h')
}

function getVerticalBar(wrapper) {
  return wrapper.get('.q-scrollarea__bar--v')
}

function getHorizontalBar(wrapper) {
  return wrapper.get('.q-scrollarea__bar--h')
}

/**
 * The component learns about its sizes exclusively through the two
 * QResizeObserver instances that it renders: the first one lives inside
 * of the content (so it reports the scrollable size) while the second
 * one wraps the container (so it reports the visible size).
 */
async function setScrollSize(wrapper, { height = 0, width = 0 } = {}) {
  wrapper
    .findAllComponents({ name: 'QResizeObserver' })[0]
    .vm.$emit('resize', { height, width })
  await nextTick()
}

async function setContainerSize(wrapper, { height = 0, width = 0 } = {}) {
  wrapper
    .findAllComponents({ name: 'QResizeObserver' })[1]
    .vm.$emit('resize', { height, width })
  await nextTick()
}

async function setScrollPosition(wrapper, { top = 0, left = 0 } = {}) {
  wrapper
    .getComponent({ name: 'QScrollObserver' })
    .vm.$emit('scroll', { position: { top, left } })
  await nextTick()
}

/**
 * Brings the component into a state where both scrollbars are relevant:
 * a 100x100 viewport holding a 500x500 content.
 */
async function setupScrollableArea(wrapper) {
  await setContainerSize(wrapper, { height: 100, width: 100 })
  await setScrollSize(wrapper, { height: 500, width: 500 })
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('[QScrollArea API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountScrollArea()

        expect(wrapper.classes()).not.toContain('q-scrollarea--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-scrollarea--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountScrollArea({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-scrollarea--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-scrollarea--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)vertical-offset]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountScrollArea({ visible: true })
        await setupScrollableArea(wrapper)

        // the vertical thumb starts right at the top of the container
        // while the horizontal thumb sits on the container's bottom edge
        expect(getVerticalThumb(wrapper).$style('top')).toBe('0px')
        expect(getHorizontalThumb(wrapper).$style('bottom')).toBe('0px')

        await wrapper.setProps({ verticalOffset: [10, 20] })

        expect(getVerticalThumb(wrapper).$style('top')).toBe('10px')
        expect(getHorizontalThumb(wrapper).$style('bottom')).toBe('20px')
      })
    })

    describe('[(prop)horizontal-offset]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountScrollArea({ visible: true })
        await setupScrollableArea(wrapper)

        expect(getHorizontalThumb(wrapper).$style('left')).toBe('0px')
        expect(getVerticalThumb(wrapper).$style('right')).toBe('0px')

        await wrapper.setProps({ horizontalOffset: [10, 20] })

        expect(getHorizontalThumb(wrapper).$style('left')).toBe('10px')
        expect(getVerticalThumb(wrapper).$style('right')).toBe('20px')
      })
    })

    describe('[(prop)bar-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountScrollArea({ barStyle: 'color: red' })

        expect(getVerticalBar(wrapper).$style('color')).toBe('red')
        expect(getHorizontalBar(wrapper).$style('color')).toBe('red')
      })

      test('type Array has effect', () => {
        const wrapper = mountScrollArea({
          barStyle: ['color: red', { backgroundColor: 'blue' }]
        })

        for (const bar of [
          getVerticalBar(wrapper),
          getHorizontalBar(wrapper)
        ]) {
          expect(bar.$style('color')).toBe('red')
          expect(bar.$style('backgroundColor')).toBe('blue')
        }
      })

      test('type Object has effect', () => {
        const wrapper = mountScrollArea({
          barStyle: { borderRadius: '5px', background: 'red', opacity: 1 }
        })

        for (const bar of [
          getVerticalBar(wrapper),
          getHorizontalBar(wrapper)
        ]) {
          expect(bar.$style('borderRadius')).toBe('5px')
          expect(bar.$style('background')).toBe('red')
          expect(bar.$style('opacity')).toBe('1')
        }
      })
    })

    describe('[(prop)vertical-bar-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountScrollArea({ verticalBarStyle: 'color: red' })

        expect(getVerticalBar(wrapper).$style('color')).toBe('red')
        expect(getHorizontalBar(wrapper).$style('color')).toBe('')
      })

      test('type Array has effect', () => {
        const wrapper = mountScrollArea({
          verticalBarStyle: ['color: red', { backgroundColor: 'blue' }]
        })

        expect(getVerticalBar(wrapper).$style('color')).toBe('red')
        expect(getVerticalBar(wrapper).$style('backgroundColor')).toBe('blue')
        expect(getHorizontalBar(wrapper).$style('backgroundColor')).toBe('')
      })

      test('type Object has effect', () => {
        const wrapper = mountScrollArea({
          verticalBarStyle: { right: '4px', background: 'red', width: '10px' }
        })

        expect(getVerticalBar(wrapper).$style('right')).toBe('4px')
        expect(getVerticalBar(wrapper).$style('background')).toBe('red')
        expect(getVerticalBar(wrapper).$style('width')).toBe('10px')
        expect(getHorizontalBar(wrapper).$style('background')).toBe('')
      })
    })

    describe('[(prop)horizontal-bar-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountScrollArea({ horizontalBarStyle: 'color: red' })

        expect(getHorizontalBar(wrapper).$style('color')).toBe('red')
        expect(getVerticalBar(wrapper).$style('color')).toBe('')
      })

      test('type Array has effect', () => {
        const wrapper = mountScrollArea({
          horizontalBarStyle: ['color: red', { backgroundColor: 'blue' }]
        })

        expect(getHorizontalBar(wrapper).$style('color')).toBe('red')
        expect(getHorizontalBar(wrapper).$style('backgroundColor')).toBe('blue')
        expect(getVerticalBar(wrapper).$style('backgroundColor')).toBe('')
      })

      test('type Object has effect', () => {
        const wrapper = mountScrollArea({
          horizontalBarStyle: {
            bottom: '4px',
            background: 'red',
            height: '10px'
          }
        })

        expect(getHorizontalBar(wrapper).$style('bottom')).toBe('4px')
        expect(getHorizontalBar(wrapper).$style('background')).toBe('red')
        expect(getHorizontalBar(wrapper).$style('height')).toBe('10px')
        expect(getVerticalBar(wrapper).$style('background')).toBe('')
      })
    })

    describe('[(prop)thumb-style]', () => {
      test('type Object has effect', () => {
        const wrapper = mountScrollArea({
          thumbStyle: { borderRadius: '5px', background: 'red', opacity: 1 }
        })

        for (const thumb of [
          getVerticalThumb(wrapper),
          getHorizontalThumb(wrapper)
        ]) {
          expect(thumb.$style('borderRadius')).toBe('5px')
          expect(thumb.$style('background')).toBe('red')
          expect(thumb.$style('opacity')).toBe('1')
        }
      })
    })

    describe('[(prop)vertical-thumb-style]', () => {
      test('type Object has effect', () => {
        const wrapper = mountScrollArea({
          verticalThumbStyle: { borderRadius: '5px', background: 'red' }
        })

        expect(getVerticalThumb(wrapper).$style('borderRadius')).toBe('5px')
        expect(getVerticalThumb(wrapper).$style('background')).toBe('red')
        expect(getHorizontalThumb(wrapper).$style('background')).toBe('')
      })
    })

    describe('[(prop)horizontal-thumb-style]', () => {
      test('type Object has effect', () => {
        const wrapper = mountScrollArea({
          horizontalThumbStyle: { borderRadius: '5px', background: 'red' }
        })

        expect(getHorizontalThumb(wrapper).$style('borderRadius')).toBe('5px')
        expect(getHorizontalThumb(wrapper).$style('background')).toBe('red')
        expect(getVerticalThumb(wrapper).$style('background')).toBe('')
      })
    })

    describe('[(prop)content-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountScrollArea({ contentStyle: 'color: red' })

        expect(getContent(wrapper).$style('color')).toBe('red')
      })

      test('type Array has effect', () => {
        const wrapper = mountScrollArea({
          contentStyle: ['color: red', { backgroundColor: 'blue' }]
        })

        expect(getContent(wrapper).$style('color')).toBe('red')
        expect(getContent(wrapper).$style('backgroundColor')).toBe('blue')
      })

      test('type Object has effect', async () => {
        const wrapper = mountScrollArea({
          contentStyle: { backgroundColor: '#c0c0c0' }
        })

        expect(getContent(wrapper).$style('backgroundColor')).toBe(
          'rgb(192, 192, 192)'
        )

        // it only applies while the thumbs are not showing
        await wrapper.setProps({ visible: true })
        await setupScrollableArea(wrapper)

        expect(getContent(wrapper).$style('backgroundColor')).toBe('')
      })
    })

    describe('[(prop)content-active-style]', () => {
      test('type String has effect', async () => {
        const wrapper = mountScrollArea({
          visible: true,
          contentActiveStyle: 'color: red'
        })

        expect(getContent(wrapper).$style('color')).toBe('')

        await setupScrollableArea(wrapper)

        expect(getContent(wrapper).$style('color')).toBe('red')
      })

      test('type Array has effect', async () => {
        const wrapper = mountScrollArea({
          visible: true,
          contentActiveStyle: ['color: red', { backgroundColor: 'blue' }]
        })
        await setupScrollableArea(wrapper)

        expect(getContent(wrapper).$style('color')).toBe('red')
        expect(getContent(wrapper).$style('backgroundColor')).toBe('blue')
      })

      test('type Object has effect', async () => {
        const wrapper = mountScrollArea({
          visible: true,
          contentActiveStyle: { backgroundColor: 'white' }
        })
        await setupScrollableArea(wrapper)

        expect(getContent(wrapper).$style('backgroundColor')).toBe('white')
      })
    })

    describe('[(prop)visible]', () => {
      test('type Boolean has effect', async () => {
        vi.useFakeTimers()

        const wrapper = mountScrollArea({ visible: false })
        await setupScrollableArea(wrapper)

        // let the "temporarily showing" state (caused by the size
        // changes above) expire
        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).toContain(
          'q-scrollarea__thumb--invisible'
        )
        expect(getVerticalBar(wrapper).classes()).toContain(
          'q-scrollarea__bar--invisible'
        )

        await wrapper.setProps({ visible: true })

        expect(getVerticalThumb(wrapper).classes()).not.toContain(
          'q-scrollarea__thumb--invisible'
        )
        expect(getHorizontalThumb(wrapper).classes()).not.toContain(
          'q-scrollarea__thumb--invisible'
        )
        expect(getVerticalBar(wrapper).classes()).not.toContain(
          'q-scrollarea__bar--invisible'
        )
      })

      test('type null has effect', async () => {
        vi.useFakeTimers()

        const wrapper = mountScrollArea({ visible: null })
        await setupScrollableArea(wrapper)

        // let the "temporarily showing" state expire
        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).toContain(
          'q-scrollarea__thumb--invisible'
        )

        // with a null value, hovering decides the visibility
        await wrapper.trigger('mouseenter')
        vi.advanceTimersByTime(1)
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).not.toContain(
          'q-scrollarea__thumb--invisible'
        )

        await wrapper.trigger('mouseleave')
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).toContain(
          'q-scrollarea__thumb--invisible'
        )
      })
    })

    describe('[(prop)delay]', () => {
      test('type Number has effect', async () => {
        vi.useFakeTimers()

        const wrapper = mountScrollArea({ delay: 500 })
        await setupScrollableArea(wrapper)

        // any size/position change temporarily shows the thumbs
        expect(getVerticalThumb(wrapper).classes()).not.toContain(
          'q-scrollarea__thumb--invisible'
        )

        vi.advanceTimersByTime(499)
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).not.toContain(
          'q-scrollarea__thumb--invisible'
        )

        vi.advanceTimersByTime(1)
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).toContain(
          'q-scrollarea__thumb--invisible'
        )
      })

      test('type String has effect', async () => {
        vi.useFakeTimers()

        const wrapper = mountScrollArea({ delay: '500' })
        await setupScrollableArea(wrapper)

        vi.advanceTimersByTime(499)
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).not.toContain(
          'q-scrollarea__thumb--invisible'
        )

        vi.advanceTimersByTime(1)
        await nextTick()

        expect(getVerticalThumb(wrapper).classes()).toContain(
          'q-scrollarea__thumb--invisible'
        )
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountScrollArea()

        expect(getContainer(wrapper).attributes('tabindex')).toBeUndefined()

        await wrapper.setProps({ tabindex: 100 })

        expect(getContainer(wrapper).attributes('tabindex')).toBe('100')
      })

      test('type String has effect', () => {
        const wrapper = mountScrollArea({ tabindex: '0' })

        expect(getContainer(wrapper).attributes('tabindex')).toBe('0')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountScrollArea({}, { default: () => slotContent })

        expect(getContent(wrapper).text()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)scroll]', () => {
      test('is emitting', async () => {
        vi.useFakeTimers()

        const wrapper = mountScrollArea({ onScroll: () => {} })

        await setContainerSize(wrapper, { height: 100, width: 100 })
        await setScrollSize(wrapper, { height: 500, width: 500 })
        await setScrollPosition(wrapper, { top: 100, left: 200 })

        // the emission is debounced so that all the listeners
        // above result in a single event
        vi.advanceTimersByTime(1)
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('scroll')
        expect(eventList.scroll).toHaveLength(1)

        const [info] = eventList.scroll[0]
        expect(info).toStrictEqual({
          ref: wrapper.vm,
          verticalPosition: 100,
          verticalPercentage: 0.25,
          verticalSize: 500,
          verticalContainerSize: 100,
          verticalContainerInnerSize: 100,
          horizontalPosition: 200,
          horizontalPercentage: 0.5,
          horizontalSize: 500,
          horizontalContainerSize: 100,
          horizontalContainerInnerSize: 100
        })
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)getScrollTarget]', () => {
      test('should be callable', () => {
        const wrapper = mountScrollArea()

        expect(wrapper.vm.getScrollTarget()).toBeInstanceOf(Element)
        expect(wrapper.vm.getScrollTarget()).toBe(getContainer(wrapper).element)
      })
    })

    describe('[(method)getScroll]', () => {
      test('should be callable', async () => {
        // starts out as a real 0x0 element so that the initial
        // snapshot below reports zero sizes
        const wrapper = mount(QScrollArea, {
          props: {
            verticalOffset: [10, 10],
            horizontalOffset: [20, 20]
          },
          attrs: { style: 'width: 0; height: 0' }
        })

        expect(wrapper.vm.getScroll()).toStrictEqual({
          verticalPosition: 0,
          verticalPercentage: 0,
          verticalSize: 0,
          verticalContainerSize: 0,
          verticalContainerInnerSize: -20,
          horizontalPosition: 0,
          horizontalPercentage: 0,
          horizontalSize: 0,
          horizontalContainerSize: 0,
          horizontalContainerInnerSize: -40
        })

        await setupScrollableArea(wrapper)
        await setScrollPosition(wrapper, { top: 100, left: 200 })

        expect(wrapper.vm.getScroll()).toStrictEqual({
          verticalPosition: 100,
          verticalPercentage: 0.25,
          verticalSize: 500,
          verticalContainerSize: 100,
          verticalContainerInnerSize: 80,
          horizontalPosition: 200,
          horizontalPercentage: 0.5,
          horizontalSize: 500,
          horizontalContainerSize: 100,
          horizontalContainerInnerSize: 60
        })
      })
    })

    describe('[(method)getScrollPosition]', () => {
      test('should be callable', async () => {
        const wrapper = mountScrollArea()

        expect(wrapper.vm.getScrollPosition()).toStrictEqual({
          top: 0,
          left: 0
        })

        await setupScrollableArea(wrapper)
        await setScrollPosition(wrapper, { top: 30, left: 40 })

        expect(wrapper.vm.getScrollPosition()).toStrictEqual({
          top: 30,
          left: 40
        })
      })
    })

    describe('[(method)getScrollPercentage]', () => {
      test('should be callable', async () => {
        const wrapper = mountScrollArea()

        expect(wrapper.vm.getScrollPercentage()).toStrictEqual({
          top: 0,
          left: 0
        })

        await setupScrollableArea(wrapper)
        await setScrollPosition(wrapper, { top: 100, left: 300 })

        expect(wrapper.vm.getScrollPercentage()).toStrictEqual({
          top: 0.25,
          left: 0.75
        })
      })
    })

    describe('[(method)setScrollPosition]', () => {
      test('should be callable', async () => {
        const wrapper = mountScrollableArea()
        await setupScrollableArea(wrapper)

        const target = wrapper.vm.getScrollTarget()

        expect(wrapper.vm.setScrollPosition('vertical', 10)).toBeUndefined()
        expect(target.scrollTop).toBe(10)

        expect(wrapper.vm.setScrollPosition('horizontal', 20)).toBeUndefined()
        expect(target.scrollLeft).toBe(20)

        // an unknown axis is reported instead of being silently ignored
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(wrapper.vm.setScrollPosition('diagonal', 30)).toBeUndefined()

        expect(errorSpy).toHaveBeenCalledTimes(1)
        expect(errorSpy.mock.calls[0][0]).toContain('setScrollPosition')

        expect(target.scrollTop).toBe(10)
        expect(target.scrollLeft).toBe(20)
      })
    })

    describe('[(method)setScrollPercentage]', () => {
      test('should be callable', async () => {
        const wrapper = mountScrollableArea()
        await setupScrollableArea(wrapper)

        const target = wrapper.vm.getScrollTarget()

        // the percentage refers to the scrollable distance (500 - 100)
        expect(wrapper.vm.setScrollPercentage('vertical', 0.25)).toBeUndefined()
        expect(target.scrollTop).toBe(100)

        expect(
          wrapper.vm.setScrollPercentage('horizontal', 0.5)
        ).toBeUndefined()
        expect(target.scrollLeft).toBe(200)

        // an unknown axis is reported, just like for setScrollPosition
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(wrapper.vm.setScrollPercentage('diagonal', 0.75)).toBeUndefined()

        expect(errorSpy).toHaveBeenCalledTimes(1)
        expect(errorSpy.mock.calls[0][0]).toContain('setScrollPercentage')

        expect(target.scrollTop).toBe(100)
        expect(target.scrollLeft).toBe(200)
      })
    })
  })
})
