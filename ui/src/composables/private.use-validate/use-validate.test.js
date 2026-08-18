import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

import { formKey } from '../../utils/private.symbols/symbols.js'
import useValidate, { useValidateProps } from './use-validate.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function mountValidate({ form, ...props } = {}) {
  const focused = ref(false)
  const innerLoading = ref(false)
  let result

  wrapper = mount(
    defineComponent({
      props: {
        ...useValidateProps,
        disable: Boolean
      },

      setup() {
        result = useValidate(focused, innerLoading)
        return () => null
      }
    }),
    {
      props,
      global: form === void 0 ? {} : { provide: { [formKey]: form } }
    }
  )

  return { focused, innerLoading, result }
}

/** The composable debounces with a 0ms timer. */
async function flushDebounce() {
  await vi.advanceTimersByTimeAsync(0)
}

const requiredRule = val => (val ? true : 'Required')

describe('[useValidate API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useValidateProps]', () => {
      test('is defined correctly', () => {
        expect(useValidateProps).$props()
      })

      test.each([
        [true, true],
        [false, true],
        ['ondemand', true],
        ['always', false],
        [0, false]
      ])('validates lazy-rules %s as %s', (value, expected) => {
        expect(useValidateProps.lazyRules.validator(value)).toBe(expected)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const { result } = mountValidate()

        expect(result).toStrictEqual({
          isDirtyModel: expect.$ref(false),
          hasRules: expect.$ref(false),
          hasError: expect.$ref(false),
          errorMessage: expect.$ref(null),

          validate: expect.any(Function),
          resetValidation: expect.any(Function)
        })
      })

      test('exposes its public API on the component instance', () => {
        const { result } = mountValidate()

        expect(wrapper.vm.validate).toBe(result.validate)
        expect(wrapper.vm.resetValidation).toBe(result.resetValidation)
        expect(wrapper.vm.hasError).toBe(false)
      })

      test.each([
        ['no rules', {}, false],
        ['an empty rules list', { rules: [] }, false],
        ['at least one rule', { rules: [requiredRule] }, true]
      ])('reports having %s', (_, props, expected) => {
        const { result } = mountValidate(props)

        expect(result.hasRules.value).toBe(expected)
      })

      test.each([
        ['there are no rules', {}],
        ['the field is disabled', { rules: [() => false], disable: true }]
      ])('passes validation when %s', (_, props) => {
        const { result } = mountValidate(props)

        expect(result.validate()).toBe(true)
        expect(result.hasError.value).toBe(false)
      })

      test('passes when every rule agrees', () => {
        const { result } = mountValidate({
          modelValue: 'ok',
          rules: [() => true, val => val.length > 1]
        })

        expect(result.validate()).toBe(true)
        expect(result.hasError.value).toBe(false)
        expect(result.errorMessage.value).toBeNull()
      })

      test.each([
        ['false', () => false, null],
        ['an error message', () => 'Nope', 'Nope']
      ])('fails when a rule returns %s', (_, rule, message) => {
        const { result } = mountValidate({ modelValue: 'x', rules: [rule] })

        expect(result.validate()).toBe(false)
        expect(result.hasError.value).toBe(true)
        expect(result.errorMessage.value).toBe(message)
        expect(result.isDirtyModel.value).toBe(true)
      })

      test('hands the current model value and the patterns to the rules', () => {
        const rule = vi.fn(() => true)
        const { result } = mountValidate({ modelValue: 'abc', rules: [rule] })

        result.validate()

        expect(rule).toHaveBeenCalledExactlyOnceWith(
          'abc',
          expect.objectContaining({ email: expect.any(Function) })
        )
      })

      test('validates an explicitly supplied value', () => {
        const { result } = mountValidate({
          modelValue: 'abc',
          rules: [val => val === 'other']
        })

        expect(result.validate('other')).toBe(true)
      })

      test.each([
        ['a matching value', 'a@b.co', true],
        ['a non-matching value', 'not-an-email', false]
      ])('supports the built-in patterns for %s', (_, modelValue, expected) => {
        const { result } = mountValidate({ modelValue, rules: ['email'] })

        expect(result.validate()).toBe(expected)
      })

      test('fails on an unknown pattern name', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const { result } = mountValidate({
          modelValue: 'x',
          rules: ['thereIsNoSuchPattern']
        })

        // a misspelled pattern must not quietly accept anything
        expect(result.validate()).toBe(false)
        expect(result.hasError.value).toBe(true)
        expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
          'Unknown validation pattern rule: "thereIsNoSuchPattern"'
        )

        // it fails like any other message-less rule does
        expect(result.errorMessage.value).toBeNull()
      })

      test('stops at the first failing rule', () => {
        const second = vi.fn(() => true)
        const { result } = mountValidate({
          modelValue: 'x',
          rules: [() => 'Boom', second]
        })

        expect(result.validate()).toBe(false)
        expect(second).not.toHaveBeenCalled()
      })

      test.each([
        ['resolves to true', [Promise.resolve(true)], true, null],
        [
          'resolves to a message',
          [Promise.resolve('Async error')],
          false,
          'Async error'
        ],
        ['resolves to false', [Promise.resolve(false)], false, null]
      ])('awaits an async rule that %s', async (_, rules, valid, message) => {
        const { result, innerLoading } = mountValidate({
          modelValue: 'x',
          rules: rules.map(promise => () => promise)
        })

        const outcome = result.validate()

        expect(outcome).toBeInstanceOf(Promise)
        expect(innerLoading.value).toBe(true)

        await expect(outcome).resolves.toBe(valid)

        expect(innerLoading.value).toBe(false)
        expect(result.hasError.value).toBe(!valid)
        expect(result.errorMessage.value).toBe(valid ? null : message)
      })

      test('reports a rejected async rule', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const error = new Error('Boom')
        const { result, innerLoading } = mountValidate({
          modelValue: 'x',
          rules: [() => Promise.reject(error)]
        })

        await expect(result.validate()).resolves.toBe(false)

        expect(errorSpy).toHaveBeenCalledExactlyOnceWith(error)
        expect(result.hasError.value).toBe(true)
        expect(innerLoading.value).toBe(false)
      })

      test('discards the outcome of a superseded async validation', async () => {
        let resolveRule
        const { result, innerLoading } = mountValidate({
          modelValue: 'x',
          rules: [
            () =>
              new Promise(resolve => {
                resolveRule = resolve
              })
          ]
        })

        const outcome = result.validate()
        result.resetValidation()

        resolveRule('Too late')
        await expect(outcome).resolves.toBe(false)

        expect(result.hasError.value).toBe(false)
        expect(result.errorMessage.value).toBeNull()
        expect(innerLoading.value).toBe(false)
      })

      test('a newer validation supersedes an older pending async one', async () => {
        const resolvers = []
        const { result, innerLoading } = mountValidate({
          modelValue: 'x',
          rules: [
            () =>
              new Promise(resolve => {
                resolvers.push(resolve)
              })
          ]
        })

        const first = result.validate()
        const second = result.validate()

        // the newer one resolves first...
        resolvers[1](true)
        await expect(second).resolves.toBe(true)

        expect(result.hasError.value).toBe(false)
        expect(innerLoading.value).toBe(false)

        // ...then the stale one fails; its verdict must not win
        resolvers[0]('Stale failure')
        await expect(first).resolves.toBe(false)

        expect(result.hasError.value).toBe(false)
        expect(result.errorMessage.value).toBeNull()
      })

      test('reports the first failing result among multiple async rules', async () => {
        const { result } = mountValidate({
          modelValue: 'x',
          rules: [
            () => Promise.resolve(true),
            () => Promise.resolve('Second failed')
          ]
        })

        await expect(result.validate()).resolves.toBe(false)

        expect(result.errorMessage.value).toBe('Second failed')
      })

      test('a failing sync rule wins immediately over an earlier async one', () => {
        const { result, innerLoading } = mountValidate({
          modelValue: 'x',
          rules: [() => new Promise(() => {}), () => 'Sync nope']
        })

        expect(result.validate()).toBe(false)
        expect(result.errorMessage.value).toBe('Sync nope')
        expect(innerLoading.value).toBe(false)
      })

      test('clears everything on reset', () => {
        const { result, innerLoading } = mountValidate({
          modelValue: '',
          rules: [requiredRule]
        })

        result.validate()
        innerLoading.value = true

        expect(result.hasError.value).toBe(true)

        result.resetValidation()

        expect(result.hasError.value).toBe(false)
        expect(result.errorMessage.value).toBeNull()
        expect(result.isDirtyModel.value).toBe(false)
        expect(innerLoading.value).toBe(false)
      })

      test.each([
        ['the error prop is forced', { error: true }, true],
        ['the error prop is off', { error: false }, false],
        ['the error prop is unset', {}, false]
      ])('reports an error when %s', (_, props, expected) => {
        const { result } = mountValidate(props)

        expect(result.hasError.value).toBe(expected)
      })

      test('lets the error-message prop win over the inner one', async () => {
        const { result } = mountValidate({
          modelValue: '',
          rules: [requiredRule],
          errorMessage: 'From the outside'
        })

        result.validate()

        expect(result.errorMessage.value).toBe('From the outside')

        await wrapper.setProps({ errorMessage: '' })

        expect(result.errorMessage.value).toBe('Required')
      })

      test('validates a model change when not lazy', async () => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: 'ok',
          rules: [requiredRule]
        })

        await wrapper.setProps({ modelValue: '' })
        expect(result.isDirtyModel.value).toBe(true)

        await flushDebounce()

        expect(result.hasError.value).toBe(true)
      })

      test.each([
        ['lazy-rules', true],
        ['on-demand rules', 'ondemand']
      ])('holds back the validation with %s', async (_, lazyRules) => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: 'ok',
          rules: [requiredRule],
          lazyRules
        })

        await wrapper.setProps({ modelValue: '' })
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
      })

      test('validates a lazy field once it loses focus', async () => {
        vi.useFakeTimers()
        const { result, focused } = mountValidate({
          modelValue: '',
          rules: [requiredRule],
          lazyRules: true
        })

        focused.value = true
        await flushDebounce()

        expect(result.isDirtyModel.value).toBe(true)
        expect(result.hasError.value).toBe(false)

        focused.value = false
        await flushDebounce()

        expect(result.hasError.value).toBe(true)
      })

      test('re-validates a lazy field on model change while an error is displayed (issue #17456)', async () => {
        vi.useFakeTimers()
        const { result, focused } = mountValidate({
          modelValue: '',
          rules: [requiredRule],
          lazyRules: true
        })

        focused.value = true
        await flushDebounce()
        focused.value = false
        await flushDebounce()

        expect(result.hasError.value).toBe(true)

        await wrapper.setProps({ modelValue: 'fixed' })
        await flushDebounce()

        expect(result.hasError.value).toBe(false)

        // with the error cleared, the field is lazy again until the next blur
        await wrapper.setProps({ modelValue: '' })
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
      })

      test('clears an error produced by a QForm submit while typing (issue #17456)', async () => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: '',
          rules: [requiredRule],
          lazyRules: true
        })

        // QForm's submit() calls validate() directly, without any blur
        expect(result.validate()).toBe(false)
        expect(result.hasError.value).toBe(true)

        await wrapper.setProps({ modelValue: 'fixed' })
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
      })

      test('the error prop alone does not make a lazy field validate on change', async () => {
        vi.useFakeTimers()
        const rule = vi.fn(() => true)
        const { result } = mountValidate({
          modelValue: '',
          rules: [rule],
          lazyRules: true,
          error: true
        })

        await wrapper.setProps({ modelValue: 'typed' })
        await flushDebounce()

        expect(rule).not.toHaveBeenCalled()
        expect(result.hasError.value).toBe(true)
      })

      test('enabling reactive-rules re-validates a dirty field immediately', async () => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: 'x',
          rules: [requiredRule],
          lazyRules: true
        })

        // dirty the model without triggering the lazy field
        await wrapper.setProps({ modelValue: '' })
        await flushDebounce()
        expect(result.hasError.value).toBe(false)

        await wrapper.setProps({ reactiveRules: true })
        await flushDebounce()

        expect(result.hasError.value).toBe(true)
      })

      test('keeps on-demand rules manual even while an error is displayed', async () => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: '',
          rules: [requiredRule],
          lazyRules: 'ondemand'
        })

        expect(result.validate()).toBe(false)
        expect(result.hasError.value).toBe(true)

        await wrapper.setProps({ modelValue: 'fixed' })
        await flushDebounce()

        expect(result.hasError.value).toBe(true)
      })

      test('never auto-validates on-demand rules', async () => {
        vi.useFakeTimers()
        const { result, focused } = mountValidate({
          modelValue: '',
          rules: [requiredRule],
          lazyRules: 'ondemand'
        })

        focused.value = true
        await flushDebounce()
        focused.value = false
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
        expect(result.validate()).toBe(false)
      })

      test('skips the debounced validation while another one is running', async () => {
        vi.useFakeTimers()
        const { result, innerLoading } = mountValidate({
          modelValue: 'ok',
          rules: [requiredRule]
        })

        innerLoading.value = true
        await wrapper.setProps({ modelValue: '' })
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
      })

      test('reset cancels a pending debounced validation', async () => {
        vi.useFakeTimers()
        const rule = vi.fn(() => false)
        const { result } = mountValidate({ modelValue: 'x', rules: [rule] })

        await wrapper.setProps({ modelValue: 'y' })
        result.resetValidation()
        await flushDebounce()

        expect(rule).not.toHaveBeenCalled()
        expect(result.hasError.value).toBe(false)
      })

      test('unmounting cancels a pending debounced validation', async () => {
        vi.useFakeTimers()
        const rule = vi.fn(() => false)
        mountValidate({ modelValue: 'x', rules: [rule] })

        await wrapper.setProps({ modelValue: 'y' })
        wrapper.unmount()
        wrapper = void 0
        await flushDebounce()

        expect(rule).not.toHaveBeenCalled()
      })

      test('a disabled field ignores model changes', async () => {
        vi.useFakeTimers()
        const rule = vi.fn(() => false)
        const { result } = mountValidate({
          modelValue: 'x',
          rules: [rule],
          disable: true
        })

        await wrapper.setProps({ modelValue: 'y' })
        await flushDebounce()

        expect(rule).not.toHaveBeenCalled()
        expect(result.hasError.value).toBe(false)
      })

      test('re-validates when the model changed during a pending async validation', async () => {
        vi.useFakeTimers()
        const resolvers = []
        const rule = vi.fn(
          val =>
            new Promise(resolve => {
              resolvers.push({ val, resolve })
            })
        )
        const { result } = mountValidate({ modelValue: 'a', rules: [rule] })

        await wrapper.setProps({ modelValue: 'bad' })
        await flushDebounce()
        expect(rule).toHaveBeenCalledTimes(1)

        // the user keeps typing while the validation is in flight
        await wrapper.setProps({ modelValue: 'good' })
        await flushDebounce()
        expect(rule).toHaveBeenCalledTimes(1)

        // once it settles, the missed change gets validated too
        resolvers[0].resolve('Invalid')
        await flushDebounce()
        await flushDebounce()

        expect(rule).toHaveBeenCalledTimes(2)
        expect(resolvers[1].val).toBe('good')

        resolvers[1].resolve(true)
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
      })

      test('honors a blur that happened during a pending async validation', async () => {
        vi.useFakeTimers()
        const resolvers = []
        const rule = vi.fn(
          val =>
            new Promise(resolve => {
              resolvers.push({ val, resolve })
            })
        )
        const { result, focused } = mountValidate({
          modelValue: 'ok',
          rules: [rule],
          lazyRules: true
        })

        focused.value = true
        await flushDebounce()

        // a QForm-style validation starts while the user is editing
        result.validate()
        await wrapper.setProps({ modelValue: '' })
        focused.value = false
        await flushDebounce()
        expect(rule).toHaveBeenCalledTimes(1)

        // the old value was valid, but the blurred one must still be checked
        resolvers[0].resolve(true)
        await flushDebounce()
        await flushDebounce()

        expect(rule).toHaveBeenCalledTimes(2)
        expect(resolvers[1].val).toBe('')

        resolvers[1].resolve('Required')
        await flushDebounce()

        expect(result.hasError.value).toBe(true)
        expect(result.errorMessage.value).toBe('Required')
      })

      test('does not re-validate when the async settle arrives after unmount', async () => {
        vi.useFakeTimers()
        const resolvers = []
        const rule = vi.fn(
          () =>
            new Promise(resolve => {
              resolvers.push(resolve)
            })
        )
        mountValidate({ modelValue: 'a', rules: [rule] })

        await wrapper.setProps({ modelValue: 'bad' })
        await flushDebounce()
        await wrapper.setProps({ modelValue: 'good' })
        await flushDebounce()

        wrapper.unmount()
        wrapper = void 0

        resolvers[0]('Invalid')
        await flushDebounce()
        await flushDebounce()

        expect(rule).toHaveBeenCalledTimes(1)
      })

      test('a lazy field without an error or blur stays lazy across an async settle', async () => {
        vi.useFakeTimers()
        const resolvers = []
        const rule = vi.fn(
          () =>
            new Promise(resolve => {
              resolvers.push(resolve)
            })
        )
        const { result } = mountValidate({
          modelValue: 'ok',
          rules: [rule],
          lazyRules: true
        })

        result.validate()
        await wrapper.setProps({ modelValue: 'changed' })
        await flushDebounce()

        resolvers[0](true)
        await flushDebounce()
        await flushDebounce()

        // clean verdict, no blur: the changed model waits for the next blur
        expect(rule).toHaveBeenCalledTimes(1)
        expect(result.hasError.value).toBe(false)
      })

      test('on-demand rules never revalidate after an async settle', async () => {
        vi.useFakeTimers()
        const resolvers = []
        const rule = vi.fn(
          () =>
            new Promise(resolve => {
              resolvers.push(resolve)
            })
        )
        const { result, focused } = mountValidate({
          modelValue: 'ok',
          rules: [rule],
          lazyRules: 'ondemand'
        })

        result.validate()
        await wrapper.setProps({ modelValue: 'changed' })
        focused.value = true
        await flushDebounce()
        focused.value = false
        await flushDebounce()

        resolvers[0]('Invalid')
        await flushDebounce()
        await flushDebounce()

        expect(rule).toHaveBeenCalledTimes(1)
        expect(result.hasError.value).toBe(true)
      })

      test('re-validates a dirty field when the rules change reactively', async () => {
        vi.useFakeTimers()
        const rules = [() => true]
        const { result } = mountValidate({
          modelValue: 'x',
          rules,
          reactiveRules: true,
          lazyRules: true
        })

        result.isDirtyModel.value = true

        await wrapper.setProps({ rules: [() => 'Now failing'] })
        await flushDebounce()

        expect(result.errorMessage.value).toBe('Now failing')
      })

      test('ignores rule changes when not reactive', async () => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: 'x',
          rules: [() => true],
          lazyRules: true
        })

        result.isDirtyModel.value = true

        await wrapper.setProps({ rules: [() => 'Now failing'] })
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
      })

      test('stops watching the rules when reactivity is turned off', async () => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: 'x',
          rules: [() => true],
          reactiveRules: true,
          lazyRules: true
        })

        result.isDirtyModel.value = true

        await wrapper.setProps({ reactiveRules: false })
        await wrapper.setProps({ rules: [() => 'Now failing'] })
        await flushDebounce()

        expect(result.hasError.value).toBe(false)
      })

      test('re-validates a dirty field when the laziness changes', async () => {
        vi.useFakeTimers()
        const { result } = mountValidate({
          modelValue: '',
          rules: [requiredRule],
          lazyRules: 'ondemand'
        })

        result.isDirtyModel.value = true

        await wrapper.setProps({ lazyRules: true })
        await flushDebounce()

        expect(result.hasError.value).toBe(true)
      })

      test('registers itself with a parent QForm', () => {
        const form = {
          bindComponent: vi.fn(),
          unbindComponent: vi.fn()
        }
        const { result } = mountValidate({ form })

        expect(form.bindComponent).toHaveBeenCalledOnce()
        expect(wrapper.vm.validate).toBe(result.validate)

        wrapper.unmount()
        wrapper = void 0

        expect(form.unbindComponent).toHaveBeenCalledOnce()
      })

      test('drops any pending validation when unmounted', async () => {
        vi.useFakeTimers()
        const rule = vi.fn(requiredRule)
        mountValidate({ modelValue: 'ok', rules: [rule] })

        await wrapper.setProps({ modelValue: '' })

        wrapper.unmount()
        wrapper = void 0

        await flushDebounce()

        expect(rule).not.toHaveBeenCalled()
      })
    })
  })
})
