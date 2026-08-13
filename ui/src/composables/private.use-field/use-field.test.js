import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, ref } from 'vue'

import useField, {
  fieldValueIsFilled,
  useFieldEmits,
  useFieldProps,
  useFieldState,
  useNonInputFieldProps
} from './use-field.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
  vi.useRealTimers()
})

/**
 * Mounts a bare-bones QField equivalent. `stateOptions` goes to useFieldState()
 * while `getState` may add/override the parts a consumer is expected to supply.
 */
function mountField({
  stateOptions = { tagProp: true },
  getState = () => ({}),
  slots,
  attrs,
  ...props
} = {}) {
  let state

  wrapper = mount(
    defineComponent({
      inheritAttrs: false,

      props: {
        ...useFieldProps,
        tag: { type: String, default: 'label' }
      },

      emits: [...useFieldEmits, 'change'],

      setup() {
        state = Object.assign(useFieldState(stateOptions), getState())
        return useField(state)
      }
    }),
    {
      props: { modelValue: 'some-value', ...props },
      slots,
      attrs
    }
  )

  return { state }
}

describe('[useField API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useNonInputFieldProps]', () => {
      test('is defined correctly', () => {
        expect(useNonInputFieldProps).$props()
      })
    })

    describe('[(variable)useFieldProps]', () => {
      test('is defined correctly', () => {
        expect(useFieldProps).$props()

        // it only extends the non-input flavor
        expect(Object.keys(useFieldProps)).toStrictEqual(
          expect.arrayContaining(Object.keys(useNonInputFieldProps))
        )
        expect(useFieldProps.maxlength).toBeDefined()
        expect(useNonInputFieldProps.maxlength).toBeUndefined()
      })
    })

    describe('[(variable)useFieldEmits]', () => {
      test('is defined correctly', () => {
        expect(useFieldEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        mountField()

        expect(wrapper.get('label').classes()).toContain('q-field')
        expect(wrapper.find('.q-field__control').exists()).toBe(true)
      })

      test('renders through the tag supplied by the state', async () => {
        mountField({ tag: 'div' })

        expect(wrapper.element.tagName).toBe('DIV')

        await wrapper.setProps({ tag: 'section' })

        expect(wrapper.element.tagName).toBe('SECTION')
      })

      test('sticks to a label when the tag is not a prop', () => {
        mountField({ stateOptions: {} })

        expect(wrapper.element.tagName).toBe('LABEL')
      })

      test('fills in the pieces a consumer did not supply', () => {
        const { state } = mountField()

        expect(state).toMatchObject({
          hasValue: expect.$ref(true),
          emitValue: expect.any(Function),
          computedCounter: expect.$ref(void 0),
          controlEvents: {
            onFocusin: expect.any(Function),
            onFocusout: expect.any(Function)
          },
          clearValue: expect.any(Function),
          onControlFocusin: expect.any(Function),
          onControlFocusout: expect.any(Function),
          focus: expect.any(Function)
        })
      })

      test('leaves the consumer supplied pieces alone', () => {
        const hasValue = computed(() => false)
        const emitValue = vi.fn()
        const controlEvents = { onFocusin: vi.fn() }
        const computedCounter = computed(() => 'custom')

        const { state } = mountField({
          getState: () => ({
            hasValue,
            emitValue,
            controlEvents,
            computedCounter
          })
        })

        expect(state.hasValue).toBe(hasValue)
        expect(state.emitValue).toBe(emitValue)
        expect(state.controlEvents).toBe(controlEvents)
        expect(state.computedCounter).toBe(computedCounter)
      })

      test.each([
        ['a filled model', 'text', true],
        ['an empty model', '', false]
      ])('derives hasValue out of %s', (_, modelValue, expected) => {
        const { state } = mountField({ modelValue })

        expect(state.hasValue.value).toBe(expected)
      })

      test('emits the model updates through emitValue', () => {
        const { state } = mountField()

        state.emitValue('next')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['next']])
      })

      test('exposes the focus helpers on the component instance', () => {
        const { state } = mountField()

        expect(wrapper.vm.focus).toBe(state.focus)
        expect(wrapper.vm.blur).toBeTypeOf('function')
      })

      test('tracks the focus through the control events', () => {
        vi.useFakeTimers()
        const { state } = mountField()
        const focusEvent = { type: 'focusin' }
        const blurEvent = { type: 'focusout' }
        const then = vi.fn()

        state.controlEvents.onFocusin(focusEvent)

        expect(state.focused.value).toBe(true)
        expect(wrapper.emitted('focus')).toStrictEqual([[focusEvent]])

        // a second focusin does not emit again
        state.controlEvents.onFocusin(focusEvent)
        expect(wrapper.emitted('focus')).toHaveLength(1)

        state.controlEvents.onFocusout(blurEvent, then)
        expect(state.focused.value).toBe(true)

        vi.advanceTimersByTime(0)

        expect(state.focused.value).toBe(false)
        expect(wrapper.emitted('blur')).toStrictEqual([[blurEvent]])
        expect(then).toHaveBeenCalledOnce()
      })

      test('cancels a pending focusout when the focus comes back', () => {
        vi.useFakeTimers()
        const { state } = mountField()

        state.controlEvents.onFocusin({})
        state.controlEvents.onFocusout({})
        state.controlEvents.onFocusin({})

        vi.advanceTimersByTime(0)

        expect(state.focused.value).toBe(true)
        expect(wrapper.emitted('blur')).toBeUndefined()
      })

      test.each([
        ['disabled', { disable: true }],
        ['readonly', { readonly: true }]
      ])('does not take the focus while %s', (_, props) => {
        const { state } = mountField(props)

        state.controlEvents.onFocusin({})

        expect(state.focused.value).toBe(false)
        expect(wrapper.emitted('focus')).toBeUndefined()
      })

      test('clears the value', async () => {
        const { state } = mountField({ clearable: true, modelValue: 'text' })
        const event = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          cancelable: true
        }

        state.clearValue(event)
        await nextTick()

        expect(event.preventDefault).toHaveBeenCalledOnce()
        expect(event.stopPropagation).toHaveBeenCalledOnce()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[null]])
        expect(wrapper.emitted('clear')).toStrictEqual([['text']])
        expect(wrapper.emitted('change')).toBeUndefined()
      })

      test('also emits a change while clearing when asked to', () => {
        const { state } = mountField({
          stateOptions: { tagProp: true, changeEvent: true },
          clearable: true
        })

        state.clearValue({ preventDefault: vi.fn(), stopPropagation: vi.fn() })

        expect(wrapper.emitted('change')).toStrictEqual([[null]])
      })

      test('lets the consumer hook into the clearing', () => {
        const onClear = vi.fn()
        const { state } = mountField({ getState: () => ({ onClear }) })

        state.clearValue({ preventDefault: vi.fn(), stopPropagation: vi.fn() })

        expect(onClear).toHaveBeenCalledOnce()
      })

      test.each([
        ['a string', 'abcd', 10, '4 / 10'],
        ['an array', ['a', 'b'], void 0, '2'],
        ['a number', 1234, void 0, '4'],
        ['anything else', {}, void 0, '0']
      ])('counts %s', (_, modelValue, maxlength, expected) => {
        const { state } = mountField({ counter: true, modelValue, maxlength })

        expect(state.computedCounter.value).toBe(expected)
        expect(wrapper.get('.q-field__counter').text()).toBe(expected)
      })

      test('renders the bottom only when there is something to show', async () => {
        mountField({ hint: 'A hint' })

        expect(wrapper.get('.q-field__messages').text()).toBe('A hint')

        await wrapper.setProps({ hint: void 0 })

        expect(wrapper.find('.q-field__bottom').exists()).toBe(false)
      })

      test('reports the error message coming from the validation', async () => {
        mountField({
          modelValue: '',
          rules: [val => (val ? true : 'Required')]
        })

        wrapper.vm.validate()
        await nextTick()

        expect(wrapper.vm.hasError).toBe(true)
        expect(wrapper.get('[role="alert"]').text()).toBe('Required')
        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('renders the label, the prefix and the suffix', () => {
        mountField({ label: 'Label', prefix: '$', suffix: 'kg' })

        expect(wrapper.get('.q-field__label').text()).toBe('Label')
        expect(wrapper.get('.q-field__prefix').text()).toBe('$')
        expect(wrapper.get('.q-field__suffix').text()).toBe('kg')
        expect(wrapper.classes()).toContain('q-field--labeled')
      })

      test('hands a scope to the control slot', () => {
        const controlSlot = vi.fn(() => h('div', { class: 'my-control' }))

        mountField({
          modelValue: 'text',
          for: 'my-id',
          slots: { control: controlSlot }
        })

        expect(controlSlot).toHaveBeenCalledWith({
          id: 'my-id',
          editable: true,
          focused: false,
          floatingLabel: true,
          modelValue: 'text',
          emitValue: expect.any(Function),
          // resolved on access, since the root element only exists after the
          // first render
          field: wrapper.element
        })
      })

      test('delegates the rendering of the control to the state', () => {
        const getControl = vi.fn(() => h('div', { class: 'state-control' }))

        mountField({ getState: () => ({ getControl }) })

        expect(wrapper.find('.state-control').exists()).toBe(true)
        expect(wrapper.classes()).not.toContain('q-field--auto-height')
      })

      test.each([
        ['filled', 'q-field--filled'],
        ['outlined', 'q-field--outlined'],
        ['borderless', 'q-field--borderless'],
        ['standout', 'q-field--standout']
      ])('styles a %s field', (prop, className) => {
        mountField({ [prop]: true })

        expect(wrapper.classes()).toContain(className)
      })

      test('falls back to the standard style', () => {
        mountField()

        expect(wrapper.classes()).toContain('q-field--standard')
      })

      test('floats the label once there is a value or focus', async () => {
        mountField({ modelValue: '', label: 'Label' })

        expect(wrapper.classes()).not.toContain('q-field--float')

        await wrapper.setProps({ modelValue: 'text' })

        expect(wrapper.classes()).toContain('q-field--float')
      })

      test('lets the state decide when the label floats', async () => {
        const floatingLabel = ref(true)

        mountField({
          modelValue: '',
          label: 'Label',
          getState: () => ({ floatingLabel })
        })

        expect(wrapper.classes()).toContain('q-field--float')

        floatingLabel.value = false
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-field--float')
      })

      test('marks the field as disabled for assistive technology', () => {
        mountField({ disable: true })

        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(wrapper.classes()).toContain('q-field--disabled')
      })

      test('renders the surrounding slots', () => {
        mountField({
          slots: {
            before: () => h('div', { class: 'my-before' }),
            after: () => h('div', { class: 'my-after' }),
            prepend: () => h('div', { class: 'my-prepend' }),
            append: () => h('div', { class: 'my-append' })
          }
        })

        expect(wrapper.find('.q-field__before .my-before').exists()).toBe(true)
        expect(wrapper.find('.q-field__after .my-after').exists()).toBe(true)
        expect(wrapper.find('.q-field__prepend .my-prepend').exists()).toBe(
          true
        )
        expect(wrapper.find('.q-field__append .my-append').exists()).toBe(true)
      })
    })

    describe('[(function)fieldValueIsFilled]', () => {
      test.each([
        ['a non-empty string', 'text', true],
        ['zero', 0, true],
        ['false', false, true],
        ['an object', {}, true],
        ['a non-empty array', [1], true],
        ['an empty string', '', false],
        ['null', null, false],
        ['undefined', void 0, false],
        ['an empty array', [], false]
      ])('reports %s as filled: %s', (_, val, expected) => {
        expect(fieldValueIsFilled(val)).toBe(expected)
      })
    })

    describe('[(function)useFieldState]', () => {
      test('has correct return value', () => {
        const { state } = mountField({ stateOptions: {} })

        expect(state).toMatchObject({
          requiredForAttr: true,
          changeEvent: false,
          tag: { value: 'label' },

          isDark: expect.any(Function),
          editable: expect.$ref(true),

          innerLoading: expect.$ref(false),
          focused: expect.$ref(false),
          hasPopupOpen: false,

          splitAttrs: {
            listeners: expect.$ref({}),
            attributes: expect.$ref({})
          },
          targetUid: expect.$ref(expect.any(String)),

          rootRef: expect.$ref(expect.any(HTMLElement)),
          targetRef: expect.$ref(null),
          controlRef: expect.$ref(expect.any(HTMLElement))
        })
      })

      test('follows the tag prop only when told to', async () => {
        const { state } = mountField({ tag: 'div' })

        expect(state.tag.value).toBe('div')

        await wrapper.setProps({ tag: 'span' })

        expect(state.tag.value).toBe('span')
      })

      test('generates a target id when one is required', () => {
        const { state } = mountField({ stateOptions: {} })

        expect(state.targetUid.value).toMatch(/^f_/)
        expect(wrapper.attributes('for')).toBe(state.targetUid.value)
      })

      test('stays without a target id when it is not required', () => {
        const { state } = mountField({
          stateOptions: { requiredForAttr: false }
        })

        expect(state.requiredForAttr).toBe(false)
        expect(state.targetUid.value).toBeNull()
        expect(wrapper.attributes('for')).toBeUndefined()
      })

      test('prefers the id supplied through the for prop', async () => {
        const { state } = mountField({ for: 'my-id' })

        expect(state.targetUid.value).toBe('my-id')

        await wrapper.setProps({ for: void 0 })

        expect(state.targetUid.value).toMatch(/^f_/)
      })

      test.each([
        ['disabled', { disable: true }],
        ['readonly', { readonly: true }]
      ])('is not editable while %s', (_, props) => {
        const { state } = mountField(props)

        expect(state.editable.value).toBe(false)
      })

      test('remembers that a change event is wanted', () => {
        const { state } = mountField({
          stateOptions: { changeEvent: true }
        })

        expect(state.changeEvent).toBe(true)
      })

      test('splits the attributes away from the listeners', () => {
        const onClick = vi.fn()
        const { state } = mountField({
          attrs: { 'data-test': 'yes', onClick }
        })

        expect(state.splitAttrs.attributes.value).toStrictEqual({
          'data-test': 'yes'
        })
        expect(state.splitAttrs.listeners.value).toStrictEqual({ onClick })
      })
    })
  })
})
