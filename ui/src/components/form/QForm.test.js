import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'

import QInput from '../input/QInput.js'
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

/** A validate() that stays pending until its deferred resolver is called */
function createDeferredValidation() {
  const resolvers = []
  const component = createValidationComponent({
    validate: vi.fn(
      () =>
        new Promise(resolve => {
          resolvers.push(resolve)
        })
    )
  })

  return { component, resolvers }
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
            default: () => h('input', { 'data-autofocus': '', tabindex: '0' })
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

      test('an explicit validate(true) overrides it', async () => {
        const invalid = createValidationComponent({
          validate: vi.fn(() => false)
        })
        const wrapper = mount(QForm, {
          props: { noErrorFocus: true }
        })
        register(wrapper, invalid)

        expect(await wrapper.vm.validate(true)).toBe(false)
        expect(invalid.focus).toHaveBeenCalledTimes(1)
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
            default: () => h('input', { 'data-autofocus': '', tabindex: '0' })
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

        const [compRef] = eventList.validationError[0]
        expect(compRef).toBe(invalid)
      })

      test('focuses the first failing component by default', async () => {
        const invalid = createValidationComponent({
          validate: vi.fn(() => false)
        })
        const wrapper = mount(QForm)
        register(wrapper, invalid)

        expect(await wrapper.vm.validate()).toBe(false)
        expect(invalid.focus).toHaveBeenCalledTimes(1)
      })

      test('skips failing components that cannot receive focus', async () => {
        const focusless = createValidationComponent({
          validate: vi.fn(() => false),
          focus: void 0
        })
        const unmounted = createValidationComponent({
          validate: vi.fn(() => false),
          $: { isUnmounted: true }
        })
        const focusable = createValidationComponent({
          validate: vi.fn(() => false)
        })
        const wrapper = mount(QForm, {
          props: { greedy: true }
        })
        register(wrapper, focusless, unmounted, focusable)

        expect(await wrapper.vm.validate()).toBe(false)

        // the event still reports the FIRST failing component...
        expect(wrapper.emitted('validationError')[0][0]).toBe(focusless)
        // ...but the focus lands on the first one able to take it
        expect(unmounted.focus).not.toHaveBeenCalled()
        expect(focusable.focus).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)focus]', () => {
      test('should be callable', () => {
        const wrapper = mount(QForm, {
          slots: {
            default: () => h('button', { 'data-autofocus': '' }, 'Focus target')
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

      test('validates async fields one at a time when not greedy', async () => {
        const first = createDeferredValidation()
        const second = createDeferredValidation()
        const wrapper = mount(QForm)
        register(wrapper, first.component, second.component)

        const outcome = wrapper.vm.validate(false)
        await flushPromises()

        // the second field waits for the first to settle
        expect(first.component.validate).toHaveBeenCalledTimes(1)
        expect(second.component.validate).not.toHaveBeenCalled()

        first.resolvers[0](false)
        await flushPromises()

        // a failure stops the chain entirely
        expect(second.component.validate).not.toHaveBeenCalled()
        await expect(outcome).resolves.toBe(false)
      })

      test('validates async fields concurrently when greedy', async () => {
        const first = createDeferredValidation()
        const second = createDeferredValidation()
        const wrapper = mount(QForm, {
          props: { greedy: true }
        })
        register(wrapper, first.component, second.component)

        const outcome = wrapper.vm.validate(false)
        await flushPromises()

        expect(first.component.validate).toHaveBeenCalledTimes(1)
        expect(second.component.validate).toHaveBeenCalledTimes(1)

        first.resolvers[0](false)
        second.resolvers[0](true)
        await expect(outcome).resolves.toBe(false)
      })

      test('a superseded validation emits no events', async () => {
        const deferred = createDeferredValidation()
        const wrapper = mount(QForm)
        register(wrapper, deferred.component)

        const stale = wrapper.vm.validate(false)
        const fresh = wrapper.vm.validate(false)
        await flushPromises()

        deferred.resolvers[1](true)
        await expect(fresh).resolves.toBe(true)

        deferred.resolvers[0](false)
        await expect(stale).resolves.toBe(false)

        // only the fresh validation reported
        expect(wrapper.emitted('validationSuccess')).toHaveLength(1)
        expect(wrapper.emitted('validationError')).toBeUndefined()
      })

      test.each([
        ['not greedy', {}],
        ['greedy', { greedy: true }]
      ])(
        'reports a child whose validate() throws when %s',
        async (_, props) => {
          const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
          const error = new Error('Rule blew up')
          const throwing = createValidationComponent({
            validate: vi.fn(() => {
              throw error
            })
          })
          const wrapper = mount(QForm, { props })
          register(wrapper, throwing)

          await expect(wrapper.vm.validate()).resolves.toBe(false)

          expect(errorSpy).toHaveBeenCalledWith(error)
          expect(wrapper.emitted('validationError')[0][0]).toBe(throwing)
          expect(throwing.focus).toHaveBeenCalledTimes(1)

          errorSpy.mockRestore()
        }
      )
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

      test('does not submit when validation fails', async () => {
        const onSubmit = vi.fn()
        const invalid = createValidationComponent({
          validate: vi.fn(() => false)
        })
        const wrapper = mount(QForm, {
          props: { onSubmit, noErrorFocus: true }
        })
        register(wrapper, invalid)

        wrapper.vm.submit()
        await flushPromises()

        expect(onSubmit).not.toHaveBeenCalled()
        expect(wrapper.emitted('validationError')).toHaveLength(1)
      })

      test('falls back to the native form submit without a listener', async () => {
        const wrapper = mount(QForm)
        const event = {
          cancelable: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          target: { submit: vi.fn() }
        }

        wrapper.vm.submit(event)
        await flushPromises()

        expect(event.preventDefault).toHaveBeenCalled()
        expect(event.target.submit).toHaveBeenCalledTimes(1)
      })

      test('drops a submission superseded while validating', async () => {
        const onSubmit = vi.fn()
        const deferred = createDeferredValidation()
        const wrapper = mount(QForm, {
          props: { onSubmit }
        })
        register(wrapper, deferred.component)

        wrapper.vm.submit()
        await flushPromises()

        // the form state gets reset while the validation is in flight
        wrapper.vm.resetValidation()

        deferred.resolvers[0](true)
        await flushPromises()

        expect(onSubmit).not.toHaveBeenCalled()
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

      test('lets the reset listener run before validations are reset', async () => {
        const order = []
        const component = createValidationComponent({
          resetValidation: vi.fn(() => {
            order.push('validation')
          })
        })
        const wrapper = mount(QForm, {
          props: {
            // userland resets its models here, so it must run first
            onReset: () => {
              order.push('listener')
            }
          }
        })
        register(wrapper, component)

        wrapper.vm.reset()
        await flushPromises()

        expect(order).toStrictEqual(['listener', 'validation'])
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

  describe('[Generic]', () => {
    test('validates real field children', async () => {
      const model = ref('too long')
      const wrapper = mount(QForm, {
        slots: {
          default: () =>
            h(QInput, {
              modelValue: model.value,
              lazyRules: true,
              rules: [val => val.length <= 3 || 'Too long']
            })
        }
      })

      await expect(wrapper.vm.validate(false)).resolves.toBe(false)
      await nextTick()

      expect(wrapper.get('.q-field').classes()).toContain('q-field--error')
      expect(wrapper.get('.q-field__messages').text()).toBe('Too long')

      model.value = 'ok'
      await nextTick()

      await expect(wrapper.vm.validate(false)).resolves.toBe(true)
      await nextTick()

      expect(wrapper.get('.q-field').classes()).not.toContain('q-field--error')
    })

    test('unregisters removed fields from validation', async () => {
      const showSecond = ref(true)
      const wrapper = mount(QForm, {
        slots: {
          default: () => [
            h(QInput, {
              modelValue: 'ok',
              rules: [() => true]
            }),
            showSecond.value
              ? h(QInput, {
                  modelValue: '',
                  rules: [val => Boolean(val) || 'Required']
                })
              : null
          ]
        }
      })

      expect(wrapper.vm.getValidationComponents()).toHaveLength(2)
      await expect(wrapper.vm.validate(false)).resolves.toBe(false)

      showSecond.value = false
      await nextTick()

      expect(wrapper.vm.getValidationComponents()).toHaveLength(1)
      await expect(wrapper.vm.validate(false)).resolves.toBe(true)
    })
  })
})
