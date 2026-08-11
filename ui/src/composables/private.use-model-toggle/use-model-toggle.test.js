import { afterEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'

import useModelToggle, {
  useModelToggleEmits,
  useModelToggleProps
} from './use-model-toggle.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

function mountModelToggle({ componentProps = {}, global, options = {} } = {}) {
  const { showing = ref(false), ...toggleOptions } = options
  let controls

  wrapper = mount(
    defineComponent({
      props: {
        ...useModelToggleProps,
        disable: Boolean
      },
      emits: [...useModelToggleEmits, 'update:modelValue'],

      setup() {
        controls = useModelToggle({
          showing,
          ...toggleOptions
        })

        return () => h('div')
      }
    }),
    {
      global,
      props: componentProps
    }
  )

  return { controls, showing }
}

describe('[useModelToggle API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useModelToggleProps]', () => {
      test('is defined correctly', () => {
        expect(useModelToggleProps).$props()
      })
    })

    describe('[(variable)useModelToggleEmits]', () => {
      test('is defined correctly', () => {
        expect(useModelToggleEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('shows, hides, and toggles an uncontrolled component', () => {
        const { controls, showing } = mountModelToggle()
        const showEvent = { type: 'show' }
        const hideEvent = { type: 'hide' }

        expect(controls).toStrictEqual({
          show: expect.any(Function),
          hide: expect.any(Function),
          toggle: expect.any(Function)
        })
        expect(wrapper.vm.show).toBe(controls.show)
        expect(wrapper.vm.hide).toBe(controls.hide)
        expect(wrapper.vm.toggle).toBe(controls.toggle)

        controls.show(showEvent)

        expect(showing.value).toBe(true)
        expect(wrapper.emitted('beforeShow')).toStrictEqual([[showEvent]])
        expect(wrapper.emitted('show')).toStrictEqual([[showEvent]])

        controls.hide(hideEvent)

        expect(showing.value).toBe(false)
        expect(wrapper.emitted('beforeHide')).toStrictEqual([[hideEvent]])
        expect(wrapper.emitted('hide')).toStrictEqual([[hideEvent]])

        controls.toggle()
        expect(showing.value).toBe(true)
      })

      test('waits for a controlled model to change', async () => {
        const onUpdateModelValue = vi.fn()
        const { controls, showing } = mountModelToggle({
          componentProps: {
            modelValue: false,
            'onUpdate:modelValue': onUpdateModelValue
          }
        })

        controls.show()

        expect(onUpdateModelValue).toHaveBeenCalledExactlyOnceWith(true)
        expect(showing.value).toBe(false)

        await wrapper.setProps({ modelValue: true })

        expect(showing.value).toBe(true)

        controls.hide()

        expect(onUpdateModelValue).toHaveBeenLastCalledWith(false)
        expect(showing.value).toBe(true)

        await wrapper.setProps({ modelValue: false })

        expect(showing.value).toBe(false)
      })

      test('honors show guards and delegates transition handling', async () => {
        const canShow = vi.fn(() => false)
        const handleShow = vi.fn()
        const handleHide = vi.fn()
        const { controls, showing } = mountModelToggle({
          options: {
            canShow,
            handleShow,
            handleHide
          }
        })
        const event = { type: 'pointerdown' }

        controls.show(event)

        expect(showing.value).toBe(false)
        expect(canShow).toHaveBeenCalledExactlyOnceWith(event)

        canShow.mockReturnValue(true)
        controls.show({ qAnchorHandled: true })

        expect(showing.value).toBe(false)
        expect(canShow).toHaveBeenCalledOnce()

        await wrapper.setProps({ disable: true })
        controls.show(event)

        expect(showing.value).toBe(false)

        await wrapper.setProps({ disable: false })
        controls.show(event)

        expect(showing.value).toBe(true)
        expect(handleShow).toHaveBeenCalledExactlyOnceWith(event)
        expect(wrapper.emitted('show')).toBeUndefined()

        controls.hide(event)

        expect(showing.value).toBe(false)
        expect(handleHide).toHaveBeenCalledExactlyOnceWith(event)
        expect(wrapper.emitted('hide')).toBeUndefined()
      })

      test('processes the initial model when requested', () => {
        const { showing } = mountModelToggle({
          componentProps: { modelValue: true },
          options: { processOnMount: true }
        })

        expect(showing.value).toBe(true)
        expect(wrapper.emitted('beforeShow')).toStrictEqual([[void 0]])
        expect(wrapper.emitted('show')).toStrictEqual([[void 0]])
      })

      test('hides on route changes when configured', async () => {
        const route = reactive({ fullPath: '/first' })
        const showing = ref(true)
        const hideOnRouteChange = ref(true)
        const handleRouteChange = vi.fn()

        mountModelToggle({
          global: {
            config: {
              globalProperties: {
                $route: route,
                $router: {}
              }
            }
          },
          options: {
            showing,
            hideOnRouteChange,
            handleRouteChange
          }
        })

        route.fullPath = '/second'
        await nextTick()

        expect(handleRouteChange).toHaveBeenCalledOnce()
        expect(showing.value).toBe(false)
        expect(wrapper.emitted('beforeHide')).toStrictEqual([[void 0]])
        expect(wrapper.emitted('hide')).toStrictEqual([[void 0]])
      })

      test('repairs an enabled controlled model when disabled', async () => {
        const onUpdateModelValue = vi.fn()

        mountModelToggle({
          componentProps: {
            modelValue: false,
            'onUpdate:modelValue': onUpdateModelValue
          }
        })

        await wrapper.setProps({
          disable: true,
          modelValue: true
        })

        expect(onUpdateModelValue).toHaveBeenCalledExactlyOnceWith(false)
      })
    })
  })
})
