import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { Transition, defineComponent, h, ref } from 'vue'

import useSlideTransition from './use-slide-transition.js'

// a Transition fed the hooks directly, the way QStep uses them
function mountHarness({ duration = 300, emit, visible = true } = {}) {
  const durationRef = ref(duration)
  const hooks = {}

  const wrapper = mount(
    defineComponent({
      data: () => ({ visible }),
      setup() {
        Object.assign(
          hooks,
          useSlideTransition(() => durationRef.value, emit)
        )
      },
      render() {
        return h(Transition, { css: false, ...hooks }, () =>
          this.visible === true
            ? h('div', { class: 'content' }, 'content')
            : null
        )
      }
    }),
    { global: { stubs: { transition: false } } }
  )

  return { wrapper, hooks, durationRef }
}

describe('[useSlideTransition API]', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const { hooks } = mountHarness()

        expect(hooks.onEnter).toBeTypeOf('function')
        expect(hooks.onLeave).toBeTypeOf('function')
      })

      test('animates the height of the entering and leaving element', async () => {
        const { wrapper } = mountHarness({ visible: false })

        await wrapper.setData({ visible: true })

        const content = wrapper.get('.content')
        expect(content.element.style.transition).toContain('height 300ms')
        expect(content.element.style.overflowY).toBe('hidden')

        await vi.runAllTimersAsync()

        expect(content.element.style.transition).toBe('')
        expect(content.element.style.height).toBe('')

        await wrapper.setData({ visible: false })

        expect(content.element.style.height).toBe('0px')
      })

      test('reads the duration at every run', async () => {
        const { wrapper, durationRef } = mountHarness({ visible: false })

        await wrapper.setData({ visible: true })

        // the leaving element outlives the wrapper's view of the tree
        const content = wrapper.get('.content').element
        expect(content.style.transition).toContain('300ms')

        await vi.runAllTimersAsync()

        durationRef.value = 450

        await wrapper.setData({ visible: false })

        expect(content.isConnected).toBe(true)
        expect(content.style.transition).toContain('450ms')
      })

      test('reports show and hide through the given emit', async () => {
        const emit = vi.fn()
        const { wrapper } = mountHarness({ emit, visible: false })

        await wrapper.setData({ visible: true })
        await vi.runAllTimersAsync()

        expect(emit).toHaveBeenLastCalledWith('show')

        await wrapper.setData({ visible: false })
        await vi.runAllTimersAsync()

        expect(emit).toHaveBeenLastCalledWith('hide')
        expect(emit).toHaveBeenCalledTimes(2)
      })

      test('works without an emit', async () => {
        const { wrapper } = mountHarness({ visible: false })

        await wrapper.setData({ visible: true })
        await vi.runAllTimersAsync()
        await wrapper.setData({ visible: false })
        await vi.runAllTimersAsync()

        expect(wrapper.find('.content').exists()).toBe(false)
      })
    })
  })
})
