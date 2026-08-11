import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, defineComponent, ref } from 'vue'

import { tabsKey } from '../../utils/private.symbols/symbols.js'
import useTab, { useTabEmits, useTabProps } from './use-tab.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

// stands in for what QTabs provides to its children
function createTabs({ currentModel = null, tabProps = {} } = {}) {
  return {
    currentModel: ref(currentModel),
    tabProps: computed(() => tabProps),
    hasFocus: ref(false),
    hasActiveTab: ref(false),
    avoidRouteWatcher: false,
    updateModel: vi.fn(),
    registerTab: vi.fn(),
    unregisterTab: vi.fn(),
    onKbdNavigate: vi.fn(() => false)
  }
}

function mountTab({
  props = {},
  $tabs = createTabs(),
  slots,
  tag = 'div'
} = {}) {
  let api

  wrapper = mount(
    defineComponent({
      props: useTabProps,
      emits: useTabEmits,
      setup(componentProps, { slots: componentSlots, emit }) {
        api = useTab(componentProps, componentSlots, emit)
        return () => api.renderTab(tag)
      }
    }),
    {
      props,
      slots,
      global: { provide: { [tabsKey]: $tabs } }
    }
  )

  return { ...api, $tabs }
}

describe('[useTab API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTabEmits]', () => {
      test('is defined correctly', () => {
        expect(useTabEmits).$emits()
      })
    })

    describe('[(variable)useTabProps]', () => {
      test('is defined correctly', () => {
        expect(useTabProps).$props()
      })

      test('generates a unique name for each tab', () => {
        const { default: getName } = useTabProps.name

        expect(getName()).toBeTypeOf('string')
        expect(getName()).not.toBe(getName())
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('requires a QTabs parent', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        let result

        wrapper = mount(
          defineComponent({
            props: useTabProps,
            emits: useTabEmits,
            setup(componentProps, { slots, emit }) {
              result = useTab(componentProps, slots, emit)
              return () => null
            }
          })
        )

        // bails out with the shared empty render function
        expect(result).toBeTypeOf('function')
        expect(result.renderTab).toBeUndefined()

        expect(errorSpy).toHaveBeenCalledTimes(1)
        expect(errorSpy.mock.calls[0][0]).toContain('QTabs')
      })

      test('returns the tab renderer along with the QTabs it belongs to', () => {
        const $tabs = createTabs()
        const api = mountTab({ $tabs })

        expect(api.renderTab).toBeTypeOf('function')
        expect(api.$tabs).toBe($tabs)
      })

      test('renders a tab with the requested tag', () => {
        mountTab({ props: { name: 'one' }, tag: 'a' })

        expect(wrapper.element.tagName).toBe('A')
        expect(wrapper.classes()).toContain('q-tab')
        expect(wrapper.attributes('role')).toBe('tab')
      })

      test('merges the custom render data', () => {
        let api

        wrapper = mount(
          defineComponent({
            props: useTabProps,
            emits: useTabEmits,
            setup(componentProps, { slots, emit }) {
              api = useTab(componentProps, slots, emit)
              return () => api.renderTab('div', { 'data-custom': 'yes' })
            }
          }),
          { global: { provide: { [tabsKey]: createTabs() } } }
        )

        expect(wrapper.attributes('data-custom')).toBe('yes')
      })

      test('marks the tab matching the current model as active', () => {
        mountTab({
          props: { name: 'one' },
          $tabs: createTabs({ currentModel: 'one' })
        })

        expect(wrapper.classes()).toContain('q-tab--active')
        expect(wrapper.classes()).not.toContain('q-tab--inactive')
        expect(wrapper.attributes('aria-selected')).toBe('true')
      })

      test('marks the other tabs as inactive', () => {
        mountTab({
          props: { name: 'two' },
          $tabs: createTabs({ currentModel: 'one' })
        })

        expect(wrapper.classes()).toContain('q-tab--inactive')
        expect(wrapper.attributes('aria-selected')).toBe('false')
      })

      test('applies the active classes and colors coming from QTabs', () => {
        mountTab({
          props: { name: 'one' },
          $tabs: createTabs({
            currentModel: 'one',
            tabProps: {
              activeClass: 'my-active',
              activeColor: 'red',
              activeBgColor: 'blue'
            }
          })
        })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['my-active', 'text-red', 'bg-blue'])
        )
      })

      test('renders the icon, the label and the alert badge', () => {
        mountTab({
          props: { icon: 'add', label: 'Create', alert: true }
        })

        expect(wrapper.find('.q-tab__icon').exists()).toBe(true)
        expect(wrapper.get('.q-tab__label').text()).toBe('Create')
        expect(wrapper.find('.q-tab__alert').exists()).toBe(true)
      })

      test('colors the alert badge', () => {
        mountTab({ props: { alert: 'red' } })

        expect(wrapper.get('.q-tab__alert').classes()).toContain('text-red')
      })

      test('renders an alert icon instead of the badge', () => {
        mountTab({ props: { alert: true, alertIcon: 'warning' } })

        expect(wrapper.find('.q-tab__alert-icon').exists()).toBe(true)
        expect(wrapper.find('.q-tab__alert').exists()).toBe(false)
      })

      test('renders the default slot next to the generated content', () => {
        mountTab({
          props: { label: 'Create' },
          slots: { default: () => 'Extra' }
        })

        expect(wrapper.get('.q-tab__content').text()).toContain('Create')
        expect(wrapper.get('.q-tab__content').text()).toContain('Extra')
      })

      test('appends the custom content class', () => {
        mountTab({ props: { contentClass: 'my-content' } })

        expect(wrapper.get('.q-tab__content').classes()).toContain('my-content')
      })

      test('renders the indicator last unless QTabs wants it narrow', () => {
        mountTab({})
        expect(
          wrapper.element.lastElementChild.classList.contains(
            'q-tab__indicator'
          )
        ).toBe(true)

        wrapper.unmount()

        mountTab({ $tabs: createTabs({ tabProps: { narrowIndicator: true } }) })
        expect(wrapper.get('.q-tab__content .q-tab__indicator').exists()).toBe(
          true
        )
      })

      test('registers itself with QTabs while mounted', () => {
        const $tabs = createTabs()
        mountTab({ props: { name: 'one' }, $tabs })

        expect($tabs.registerTab).toHaveBeenCalledTimes(1)
        expect($tabs.registerTab.mock.calls[0][0]).toMatchObject({
          name: expect.$ref('one'),
          routeData: void 0
        })

        wrapper.unmount()
        wrapper = void 0

        expect($tabs.unregisterTab).toHaveBeenCalledTimes(1)
      })

      test('selects itself and emits on click', async () => {
        const $tabs = createTabs()
        mountTab({ props: { name: 'one' }, $tabs })

        await wrapper.trigger('click')

        expect($tabs.updateModel).toHaveBeenCalledWith({ name: 'one' })
        expect(wrapper.emitted('click')).toHaveLength(1)
      })

      test('does nothing on click when disabled', async () => {
        const $tabs = createTabs()
        mountTab({ props: { name: 'one', disable: true }, $tabs })

        await wrapper.trigger('click')

        expect($tabs.updateModel).not.toHaveBeenCalled()
        expect(wrapper.emitted('click')).toBeUndefined()
      })

      test.each([[13], [32]])(
        'selects itself when pressing keyCode %i',
        async keyCode => {
          const $tabs = createTabs()
          mountTab({ props: { name: 'one' }, $tabs })

          await wrapper.trigger('keydown', { keyCode })

          expect($tabs.updateModel).toHaveBeenCalledWith({ name: 'one' })
          expect(wrapper.emitted('keydown')).toHaveLength(1)
        }
      )

      test('delegates the navigation keys to QTabs', async () => {
        const $tabs = createTabs()
        $tabs.onKbdNavigate.mockReturnValue(true)
        mountTab({ props: { name: 'one' }, $tabs })

        // 39 is the right arrow
        await wrapper.trigger('keydown', { keyCode: 39 })

        expect($tabs.onKbdNavigate).toHaveBeenCalledTimes(1)
        expect($tabs.onKbdNavigate.mock.calls[0][0]).toBe(39)
        expect($tabs.updateModel).not.toHaveBeenCalled()
      })

      test('ignores the keys QTabs does not handle', async () => {
        const $tabs = createTabs()
        mountTab({ props: { name: 'one' }, $tabs })

        await wrapper.trigger('keydown', { keyCode: 65 })

        expect($tabs.onKbdNavigate).not.toHaveBeenCalled()
        expect($tabs.updateModel).not.toHaveBeenCalled()
        expect(wrapper.emitted('keydown')).toHaveLength(1)
      })

      test('keeps a disabled tab out of the tab order', () => {
        mountTab({ props: { disable: true } })

        expect(wrapper.attributes('tabindex')).toBe('-1')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(wrapper.classes()).toContain('disabled')
      })

      test('honors the tabindex prop', () => {
        mountTab({ props: { tabindex: 3 } })

        expect(wrapper.attributes('tabindex')).toBe('3')
      })

      test('drops the inactive tabs out of the tab order once one is active', () => {
        const $tabs = createTabs({ currentModel: 'one' })
        $tabs.hasActiveTab.value = true

        mountTab({ props: { name: 'two' }, $tabs })
        expect(wrapper.attributes('tabindex')).toBe('-1')

        wrapper.unmount()

        mountTab({ props: { name: 'one' }, $tabs })
        expect(wrapper.attributes('tabindex')).toBe('0')
      })
    })
  })
})
