import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QResizeObserver from './QResizeObserver.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('[QResizeObserver API]', () => {
  describe('[Props]', () => {
    describe('[(prop)debounce]', () => {
      test('type String has effect', () => {
        const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
        const wrapper = mount(QResizeObserver, {
          props: { debounce: '530' }
        })

        wrapper.vm.trigger()

        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), '530')
      })

      test('type Number has effect', () => {
        const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
        const wrapper = mount(QResizeObserver, {
          props: { debounce: 100 }
        })

        wrapper.vm.trigger()

        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)resize]', () => {
      test('is emitting', async () => {
        const wrapper = mount(QResizeObserver)

        await nextTick()

        // the initial emission, done when the observed parent is picked up
        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('resize')
        expect(eventList.resize).toHaveLength(1)

        // resize the observed parent element
        wrapper.vm.$el.parentNode.style.cssText = 'width: 120px; height: 80px;'

        // a real ResizeObserver notifies asynchronously
        await vi.waitFor(() => {
          expect(eventList.resize).toHaveLength(2)
        })

        const [size] = eventList.resize.at(-1)
        expect(size).toStrictEqual({
          height: 80,
          width: 120
        })
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)trigger]', () => {
      test('should be callable', async () => {
        const wrapper = mount(QResizeObserver)

        await nextTick()

        expect(wrapper.vm.trigger(true)).toBeUndefined()
        expect(wrapper.emitted('resize')).toHaveLength(1)
      })
    })
  })

  describe('[Generic]', () => {
    test('tracks a padding-only change of the observed parent', async () => {
      const wrapper = mount(QResizeObserver, {
        attachTo: document.body
      })

      await nextTick()

      const eventList = wrapper.emitted()
      expect(eventList.resize).toHaveLength(1)

      const parent = wrapper.vm.$el.parentNode
      parent.style.cssText =
        'box-sizing: content-box; width: 120px; height: 80px;'

      await vi.waitFor(() => {
        expect(eventList.resize).toHaveLength(2)
      })

      // padding grows the border box but leaves the content box untouched
      parent.style.padding = '10px 5px'

      await vi.waitFor(() => {
        expect(eventList.resize).toHaveLength(3)
      })

      const [size] = eventList.resize.at(-1)
      expect(size).toStrictEqual({
        height: parent.offsetHeight,
        width: parent.offsetWidth
      })
      expect(size).toStrictEqual({ height: 100, width: 130 })

      wrapper.unmount()
    })
  })
})
