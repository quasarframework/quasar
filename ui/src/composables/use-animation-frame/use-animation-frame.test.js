import { afterEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useAnimationFrame from './use-animation-frame.js'

let wrapper

afterEach(() => {
  if (wrapper !== null) {
    wrapper.unmount()
    wrapper = null
  }
})

function nextAnimationFrame() {
  const { promise, resolve } = Promise.withResolvers()
  requestAnimationFrame(resolve)
  return promise
}

describe('[useAnimationFrame API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('correctly registers an animation frame', async () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup() {
              const { registerAnimationFrame } = useAnimationFrame()

              registerAnimationFrame(fn)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        await nextAnimationFrame()
        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('removeAnimationFrame works correctly', async () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup() {
              const { registerAnimationFrame, removeAnimationFrame } =
                useAnimationFrame()

              registerAnimationFrame(fn)
              return { registerAnimationFrame, removeAnimationFrame }
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        wrapper.vm.removeAnimationFrame()

        await nextAnimationFrame()
        expect(fn).not.toHaveBeenCalled()
      })

      test('unmount stops animation frame', async () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup() {
              const { registerAnimationFrame } = useAnimationFrame()

              registerAnimationFrame(fn)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()

        wrapper.unmount()
        wrapper = null

        await nextAnimationFrame()

        expect(fn).not.toHaveBeenCalled()
      })

      test('can override animation frame', async () => {
        const fn1 = vi.fn()
        const fn2 = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup() {
              const { registerAnimationFrame } = useAnimationFrame()
              return { registerAnimationFrame }
            }
          })
        )

        expect(fn1).not.toHaveBeenCalled()
        wrapper.vm.registerAnimationFrame(fn1)
        expect(fn1).not.toHaveBeenCalled()

        wrapper.vm.registerAnimationFrame(fn2)
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).not.toHaveBeenCalled()

        await nextAnimationFrame()

        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledTimes(1)
      })
    })
  })
})
