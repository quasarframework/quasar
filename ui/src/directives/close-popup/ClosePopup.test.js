import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

import ClosePopup from './ClosePopup.js'

const portalMocks = vi.hoisted(() => ({
  closePortals: vi.fn(),
  getPortalProxy: vi.fn()
}))

vi.mock('../../utils/private.portal/portal.js', () => portalMocks)

beforeEach(() => {
  vi.useFakeTimers()
  portalMocks.closePortals.mockReset()
  portalMocks.getPortalProxy.mockReset()
  portalMocks.getPortalProxy.mockReturnValue({ name: 'portal' })
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('[ClosePopup API]', () => {
  describe('[Value]', () => {
    test('as Boolean', async () => {
      const TestComponent = defineComponent({
        template: '<div v-close-popup="val" />',
        directives: { ClosePopup },
        setup() {
          return {
            val: true
          }
        }
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qclosepopup.depth).toBe(1)

      await wrapper.trigger('click')
      vi.runAllTimers()

      expect(portalMocks.closePortals).toHaveBeenCalledWith(
        { name: 'portal' },
        expect.any(Event),
        1
      )
    })

    test('as Number', async () => {
      const TestComponent = defineComponent({
        template: '<div v-close-popup="val" />',
        directives: { ClosePopup },
        setup() {
          return {
            val: 10
          }
        }
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qclosepopup.depth).toBe(10)

      await wrapper.trigger('keyup', { keyCode: 13 })
      vi.runAllTimers()

      expect(portalMocks.closePortals).toHaveBeenCalledWith(
        { name: 'portal' },
        expect.any(Event),
        10
      )
    })

    test('as String', async () => {
      const TestComponent = defineComponent({
        template: '<div v-close-popup="val" />',
        directives: { ClosePopup },
        setup() {
          return {
            val: 'some-string'
          }
        }
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qclosepopup.depth).toBe(0)

      await wrapper.trigger('click')
      vi.runAllTimers()

      expect(portalMocks.closePortals).not.toHaveBeenCalled()
    })
  })
})
