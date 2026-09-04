import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

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
        render: () => withDirectives(h('div'), [[ClosePopup, true]])
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qclosepopup).toBe(1)

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
        render: () => withDirectives(h('div'), [[ClosePopup, 10]])
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qclosepopup).toBe(10)

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
        render: () => withDirectives(h('div'), [[ClosePopup, 'some-string']])
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qclosepopup).toBe(0)

      await wrapper.trigger('click')
      vi.runAllTimers()

      expect(portalMocks.closePortals).not.toHaveBeenCalled()
    })

    test('resolves the directive element when a descendant is clicked', async () => {
      const TestComponent = defineComponent({
        render: () =>
          withDirectives(h('div', [h('span', [h('i', 'leaf')])]), [
            [ClosePopup, true]
          ])
      })

      const wrapper = mount(TestComponent)

      await wrapper.find('i').trigger('click')
      vi.runAllTimers()

      expect(portalMocks.getPortalProxy).toHaveBeenCalledTimes(1)
      expect(portalMocks.getPortalProxy).toHaveBeenCalledWith(wrapper.element)
      expect(portalMocks.closePortals).toHaveBeenCalledWith(
        { name: 'portal' },
        expect.any(Event),
        1
      )
    })

    test('reacts to value changes in place', async () => {
      const depth = ref(2)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[ClosePopup, depth.value]])
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qclosepopup).toBe(2)

      depth.value = false
      await wrapper.vm.$nextTick()

      expect(wrapper.element.__qclosepopup).toBe(0)

      await wrapper.trigger('click')
      vi.runAllTimers()

      expect(portalMocks.closePortals).not.toHaveBeenCalled()

      depth.value = -1
      await wrapper.vm.$nextTick()

      await wrapper.trigger('click')
      vi.runAllTimers()

      expect(portalMocks.closePortals).toHaveBeenCalledWith(
        { name: 'portal' },
        expect.any(Event),
        -1
      )

      wrapper.unmount()

      expect(wrapper.element.__qclosepopup).toBeUndefined()
    })
  })
})
