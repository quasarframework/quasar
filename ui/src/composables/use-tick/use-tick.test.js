import { describe, test, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useTick from './use-tick.js'

let wrapper

afterEach(() => {
  if (wrapper !== null) {
    wrapper.unmount()
    wrapper = null
  }
})

describe('[useTick API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('correctly registers a tick', async () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { registerTick } = useTick()

              registerTick(fn)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        await flushPromises()
        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('removeTick works correctly', async () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const {
                registerTick,
                removeTick
              } = useTick()

              registerTick(fn)
              return { registerTick, removeTick }
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        wrapper.vm.removeTick()

        await flushPromises()
        expect(fn).not.toHaveBeenCalled()
      })

      test('unmount stops tick', async () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { registerTick } = useTick()

              registerTick(fn)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()

        wrapper.unmount()
        wrapper = null

        await flushPromises()

        expect(fn).not.toHaveBeenCalled()
      })

      test('can override tick', async () => {
        const fn1 = vi.fn()
        const fn2 = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { registerTick } = useTick()
              return { registerTick }
            }
          })
        )

        expect(fn1).not.toHaveBeenCalled()
        wrapper.vm.registerTick(fn1)
        expect(fn1).not.toHaveBeenCalled()

        wrapper.vm.registerTick(fn2)
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).not.toHaveBeenCalled()

        await flushPromises()

        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledTimes(1)
      })
    })
  })
})
