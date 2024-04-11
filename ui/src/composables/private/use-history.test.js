import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import { computed, defineComponent } from 'vue'

import useHistory from './use-history.js'

describe('[useHistory API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const showing = computed(() => false)
              const hide = () => {}
              const hideOnRouteChange = computed(() => false)
              const result = useHistory(showing, hide, hideOnRouteChange)
              return { result }
            }
          })
        )

        expect(
          wrapper.vm.result
        ).toStrictEqual({
          removeFromHistory: expect.any(Function),
          addToHistory: expect.any(Function)
        })

        wrapper.unmount()
      })

      test('can add and remove', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const showing = computed(() => false)
              const hide = () => {}
              const hideOnRouteChange = computed(() => false)
              return useHistory(showing, hide, hideOnRouteChange)
            }
          })
        )

        expect(
          () => wrapper.vm.removeFromHistory()
        ).not.toThrow()

        expect(
          wrapper.vm.addToHistory()
        ).toBeUndefined()

        expect(
          wrapper.vm.removeFromHistory()
        ).toBeUndefined()

        expect(
          () => wrapper.vm.removeFromHistory()
        ).not.toThrow()
      })

      test('does not throw on unmount with showing=true', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const showing = computed(() => true)
              const hide = () => {}
              const hideOnRouteChange = computed(() => false)
              return useHistory(showing, hide, hideOnRouteChange)
            }
          })
        )

        expect(
          () => wrapper.unmount()
        ).not.toThrow()
      })

      /*
       * Needs Capacitor or Cordova
       *

      test('hide handler is called on route change', async () => {
        const router = await getRouter('/home')

        const hide = vi.fn()

        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const showing = computed(() => false)
              const hideOnRouteChange = computed(() => true)
              return useHistory(showing, hide, hideOnRouteChange)
            }
          }, {
            global: {
              plugins: [ router ]
            }
          })
        )

        await router.push('/home')

        // trigger BACK button

        expect(hide).toHaveBeenCalledTimes(1)
        expect(hide).toHaveBeenCalledWith()
      })
      */
    })
  })
})
