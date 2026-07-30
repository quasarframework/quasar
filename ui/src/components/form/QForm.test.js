import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import QForm from './QForm.js'

function createValidationComponent(overrides = {}) {
  return {
    $: {},
    validate: vi.fn(() => true),
    resetValidation: vi.fn(),
    focus: vi.fn(),
    ...overrides
  }
}

function register(wrapper, ...components) {
  wrapper.vm.getValidationComponents().push(...components)
}

describe('[QForm API]', () => {
  describe('[Props]', () => {
    describe('[(prop)autofocus]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QForm, {
          props: { autofocus: true },
          slots: {
            default: '<input data-autofocus tabindex="0">'
          },
          attachTo: document.body
        })

        expect(document.activeElement).toBe(wrapper.get('input').element)

        wrapper.unmount()
      })
    })

    describe('[(prop)no-error-focus]', () => {
      test('type Boolean has effect', async () => {
        const invalid = createValidationComponent({
          validate: vi.fn(() => false)
        })
        const wrapper = mount(QForm, {
          props: { noErrorFocus: true }
        })
        register(wrapper, invalid)

        expect(await wrapper.vm.validate()).toBe(false)
        expect(invalid.focus).not.toHaveBeenCalled()
      })
    })

    describe('[(prop)no-reset-focus]', () => {
      test('type Boolean has effect', async () => {
        const outside = document.createElement('button')
        document.body.append(outside)

        const wrapper = mount(QForm, {
          props: {
            autofocus: true,
            noResetFocus: true
          },
          slots: {
            default: '<input data-autofocus tabindex="0">'
          },
          attachTo: document.body
        })

        outside.focus()
        await wrapper.trigger('reset')
        await flushPromises()

        expect(document.activeElement).toBe(outside)

        wrapper.unmount()
        outside.remove()
      })
    })

    describe('[(prop)greedy]', () => {
      test('type Boolean has effect', async () => {
        const first = createValidationComponent({
          validate: vi.fn(() => false)
        })
        const second = createValidationComponent()
        const wrapper = mount(QForm)
        register(wrapper, first, second)

        expect(await wrapper.vm.validate(false)).toBe(false)
        expect(second.validate).not.toHaveBeenCalled()

        await wrapper.setProps({ greedy: true })

        expect(await wrapper.vm.validate(false)).toBe(false)
        expect(second.validate).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QForm, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)submit]', () => {
      test('is emitting', async () => {
        const wrapper = mount(QForm, {
          props: { onSubmit: vi.fn() }
        })
        const event = new Event('submit', { cancelable: true })

        wrapper.vm.submit(event)
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('submit')
        expect(eventList.submit).toHaveLength(1)

        const [evt] = eventList.submit[0]
        expect(evt).toBe(event)
        expect(event.defaultPrevented).toBe(true)
      })
    })

    describe('[(event)reset]', () => {
      test('is emitting', async () => {
        const wrapper = mount(QForm)

        await wrapper.trigger('reset')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('reset')
        expect(eventList.reset).toHaveLength(1)
        expect(eventList.reset[0]).toHaveLength(0)
      })
    })

    describe('[(event)validation-success]', () => {
      test('is emitting', async () => {
        const wrapper = mount(QForm)

        expect(await wrapper.vm.validate()).toBe(true)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('validationSuccess')
        expect(eventList.validationSuccess).toHaveLength(1)
        expect(eventList.validationSuccess[0]).toHaveLength(1)
        expect(eventList.validationSuccess[0][0]).toBeUndefined()
      })
    })

    describe('[(event)validation-error]', () => {
      test('is emitting', async () => {
        const invalid = createValidationComponent({
          validate: vi.fn(() => false)
        })
        const wrapper = mount(QForm)
        register(wrapper, invalid)

        expect(await wrapper.vm.validate(false)).toBe(false)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('validationError')
        expect(eventList.validationError).toHaveLength(1)

        const [ref] = eventList.validationError[0]
        expect(ref).toBe(invalid)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)focus]', () => {
      test('should be callable', () => {
        const wrapper = mount(QForm, {
          slots: {
            default: '<button data-autofocus>Focus target</button>'
          },
          attachTo: document.body
        })

        expect(wrapper.vm.focus()).toBeUndefined()
        expect(document.activeElement).toBe(wrapper.get('button').element)

        wrapper.unmount()
      })
    })

    describe('[(method)validate]', () => {
      test('should be callable', async () => {
        const component = createValidationComponent()
        const wrapper = mount(QForm)
        register(wrapper, component)

        const result = wrapper.vm.validate(true)

        expect(result).toBeInstanceOf(Promise)
        await expect(result).resolves.toBe(true)
        expect(component.validate).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(method)resetValidation]', () => {
      test('should be callable', () => {
        const component = createValidationComponent()
        const wrapper = mount(QForm)
        register(wrapper, component)

        expect(wrapper.vm.resetValidation()).toBeUndefined()
        expect(component.resetValidation).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(method)submit]', () => {
      test('should be callable', async () => {
        const onSubmit = vi.fn()
        const wrapper = mount(QForm, {
          props: { onSubmit }
        })
        const event = new Event('submit', { cancelable: true })

        expect(wrapper.vm.submit(event)).toBeUndefined()
        await flushPromises()

        expect(event.defaultPrevented).toBe(true)
        expect(onSubmit).toHaveBeenCalledWith(event)
      })
    })

    describe('[(method)reset]', () => {
      test('should be callable', async () => {
        const component = createValidationComponent()
        const wrapper = mount(QForm)
        register(wrapper, component)
        const event = new Event('reset', { cancelable: true })

        expect(wrapper.vm.reset(event)).toBeUndefined()
        await flushPromises()

        expect(event.defaultPrevented).toBe(true)
        expect(wrapper.emitted('reset')).toHaveLength(1)
        expect(component.resetValidation).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(method)getValidationComponents]', () => {
      test('should be callable', () => {
        const component = createValidationComponent()
        const wrapper = mount(QForm)
        register(wrapper, component)

        expect(Array.isArray(wrapper.vm.getValidationComponents())).toBe(true)
        expect(wrapper.vm.getValidationComponents()).toStrictEqual([component])
      })
    })
  })
})
