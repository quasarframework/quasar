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

        Object.defineProperties(wrapper.element, {
          offsetHeight: {
            configurable: true,
            value: 80
          },
          offsetWidth: {
            configurable: true,
            value: 120
          }
        })

        await nextTick()
        wrapper.vm.trigger(true)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('resize')
        expect(eventList.resize).toHaveLength(1)

        const [size] = eventList.resize[0]
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
})
