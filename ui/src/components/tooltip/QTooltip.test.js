import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QTooltip from './QTooltip.js'

let wrapper

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0

  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('[QTooltip API]', () => {
  describe('[Generic]', () => {
    test('shows when a focus-visible descendant receives focus', async () => {
      wrapper = mount({
        components: { QTooltip },
        template: `
          <div data-test="anchor">
            <button data-test="focus-target">Focus target</button>
            <q-tooltip>Tooltip content</q-tooltip>
          </div>
        `
      })

      const anchor = wrapper.get('[data-test="anchor"]')
      const focusTarget = wrapper.get('[data-test="focus-target"]')

      vi.spyOn(anchor.element, 'matches').mockReturnValue(false)
      vi.spyOn(focusTarget.element, 'matches').mockReturnValue(true)

      await focusTarget.trigger('focusin')
      await vi.runAllTimersAsync()
      await flushPromises()

      expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)
    })
  })
})
