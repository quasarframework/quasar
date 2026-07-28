import { afterEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, reactive } from 'vue'

import { listenOpts } from '../../utils/event/event.js'
import useScrollTarget from './use-scroll-target.js'

describe('[useScrollTarget API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      afterEach(() => {
        vi.restoreAllMocks()
      })

      test('configures, updates, and removes scroll listeners', async () => {
        const props = reactive({ noParentEvent: false })
        const configureScrollTarget = vi.fn()
        let result

        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup() {
              result = useScrollTarget(props, configureScrollTarget)
            }
          })
        )

        const scrollTarget = document.createElement('div')
        const handler = vi.fn()
        const targetAddEventListener = vi.spyOn(
          scrollTarget,
          'addEventListener'
        )
        const targetRemoveEventListener = vi.spyOn(
          scrollTarget,
          'removeEventListener'
        )
        const windowAddEventListener = vi.spyOn(window, 'addEventListener')
        const windowRemoveEventListener = vi.spyOn(
          window,
          'removeEventListener'
        )

        result.localScrollTarget.value = scrollTarget
        result.changeScrollEvent(scrollTarget, handler)

        expect(targetAddEventListener).toHaveBeenCalledWith(
          'scroll',
          handler,
          listenOpts.passive
        )
        expect(windowAddEventListener).toHaveBeenCalledWith(
          'scroll',
          handler,
          listenOpts.passive
        )

        result.unconfigureScrollTarget()

        expect(targetRemoveEventListener).toHaveBeenCalledWith(
          'scroll',
          handler,
          listenOpts.passive
        )
        expect(windowRemoveEventListener).toHaveBeenCalledWith(
          'scroll',
          handler,
          listenOpts.passive
        )
        expect(result.localScrollTarget.value).toBeNull()

        windowAddEventListener.mockClear()
        windowRemoveEventListener.mockClear()
        result.localScrollTarget.value = window
        result.changeScrollEvent(window, handler)

        expect(windowAddEventListener).toHaveBeenCalledExactlyOnceWith(
          'scroll',
          handler,
          listenOpts.passive
        )

        result.unconfigureScrollTarget()

        expect(windowRemoveEventListener).toHaveBeenCalledExactlyOnceWith(
          'scroll',
          handler,
          listenOpts.passive
        )
        expect(result.localScrollTarget.value).toBeNull()

        targetRemoveEventListener.mockClear()
        windowRemoveEventListener.mockClear()
        result.localScrollTarget.value = scrollTarget
        result.changeScrollEvent(scrollTarget, handler)

        props.noParentEvent = true
        await nextTick()

        expect(targetRemoveEventListener).toHaveBeenCalledWith(
          'scroll',
          handler,
          listenOpts.passive
        )
        expect(windowRemoveEventListener).toHaveBeenCalledWith(
          'scroll',
          handler,
          listenOpts.passive
        )
        expect(configureScrollTarget).toHaveBeenCalledOnce()
        expect(result.localScrollTarget.value).toBeNull()

        wrapper.unmount()
      })
    })
  })
})
