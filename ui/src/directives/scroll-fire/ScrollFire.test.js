import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

import ScrollFire from './ScrollFire.js'

let removeEventListener

beforeEach(() => {
  vi.useFakeTimers()
  removeEventListener = vi.spyOn(window, 'removeEventListener')
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('[ScrollFire API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const handler = vi.fn()
      const TestComponent = defineComponent({
        template: '<div v-scroll-fire="handler" />',
        directives: { ScrollFire },
        setup() {
          return { handler }
        }
      })

      const wrapper = mount(TestComponent)
      wrapper.element.getBoundingClientRect = () => ({
        bottom: 100
      })

      vi.advanceTimersByTime(25)

      expect(handler).toHaveBeenCalledWith(wrapper.element)
      expect(removeEventListener).toHaveBeenCalledWith(
        'scroll',
        wrapper.element.__qscrollfire.scroll,
        expect.anything()
      )
    })

    test('as undefined', () => {
      const TestComponent = defineComponent({
        template: '<div v-scroll-fire />',
        directives: { ScrollFire }
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qscrollfire.handler).toBeUndefined()
      expect(removeEventListener).toHaveBeenCalledWith(
        'scroll',
        wrapper.element.__qscrollfire.scroll,
        expect.anything()
      )

      vi.runAllTimers()
    })
  })
})
