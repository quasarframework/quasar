import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

import Scroll from './Scroll.js'

let addEventListener
let removeEventListener

beforeEach(() => {
  addEventListener = vi.spyOn(window, 'addEventListener')
  removeEventListener = vi.spyOn(window, 'removeEventListener')

  Object.defineProperties(window, {
    pageXOffset: {
      configurable: true,
      value: 12
    },
    pageYOffset: {
      configurable: true,
      value: 45
    }
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('[Scroll API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const handler = vi.fn()
      const TestComponent = defineComponent({
        template: '<div v-scroll="handler" />',
        directives: { Scroll },
        setup() {
          return { handler }
        }
      })

      const wrapper = mount(TestComponent)

      expect(addEventListener).toHaveBeenCalledWith(
        'scroll',
        wrapper.element.__qscroll.scroll,
        expect.anything()
      )

      window.dispatchEvent(new Event('scroll'))

      expect(handler).toHaveBeenCalledWith(45, 12)

      wrapper.unmount()

      expect(removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        expect.anything()
      )
    })

    test('as undefined', () => {
      const TestComponent = defineComponent({
        template: '<div v-scroll />',
        directives: { Scroll }
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qscroll.handler).toBeUndefined()
      expect(removeEventListener).toHaveBeenCalledWith(
        'scroll',
        wrapper.element.__qscroll.scroll,
        expect.anything()
      )
    })
  })
})
