import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import QInput from './QInput.js'

function mountInput(props = {}, options = {}) {
  return mount(QInput, {
    props: {
      modelValue: 'some-string',
      ...props
    },
    ...options
  })
}

// the validation debounce and the focusout handler are both timer based
function flushTimers() {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

const maxThreeChars = val =>
  val.length <= 3 || 'Please use maximum 3 characters'

describe('[QInput API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ name: 'car_id' })

        expect(wrapper.get('input').attributes('name')).toBe('car_id')
      })
    })

    describe('[(prop)mask]', () => {
      test('type String has effect', () => {
        const unmasked = mountInput({ modelValue: '12345' })
        expect(unmasked.get('input').element.value).toBe('12345')

        const wrapper = mountInput({ modelValue: '12345', mask: '###-##' })
        expect(wrapper.get('input').element.value).toBe('123-45')
      })
    })

    describe('[(prop)fill-mask]', () => {
      test('type Boolean has effect', () => {
        const unfilled = mountInput({ modelValue: '12', mask: '###-##' })
        expect(unfilled.get('input').element.value).toBe('12')

        const wrapper = mountInput({
          modelValue: '12',
          mask: '###-##',
          fillMask: true
        })
        expect(wrapper.get('input').element.value).toBe('12_-__')
      })

      test('type String has effect', () => {
        // the first char of the string is used as filling char
        const wrapper = mountInput({
          modelValue: '12',
          mask: '###-##',
          fillMask: '0'
        })

        expect(wrapper.get('input').element.value).toBe('120-00')
      })
    })

    describe('[(prop)reverse-fill-mask]', () => {
      test('type Boolean has effect', () => {
        // the value gets consumed starting from the end of the mask
        const forward = mountInput({ modelValue: '123', mask: '##:##' })
        expect(forward.get('input').element.value).toBe('12:3')

        const wrapper = mountInput({
          modelValue: '123',
          mask: '##:##',
          reverseFillMask: true
        })
        expect(wrapper.get('input').element.value).toBe('1:23')
      })
    })

    describe('[(prop)unmasked-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountInput({
          modelValue: '',
          mask: '###-##',
          unmaskedValue: true
        })
        const input = wrapper.get('input')

        input.element.value = '12345'
        await input.trigger('input')

        // the control still displays the masked value...
        expect(input.element.value).toBe('123-45')
        // ...while the model receives the unmasked one
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['12345'])
      })
    })

    describe('[(prop)mask-tokens]', () => {
      test('type Object has effect', () => {
        // "C" is not a default token, so it is treated as a literal
        const literal = mountInput({ modelValue: 'ab5', mask: 'CCC' })
        expect(literal.get('input').element.value).toBe('CCC')

        const wrapper = mountInput({
          modelValue: 'ab5',
          mask: 'CCC',
          maskTokens: {
            C: {
              pattern: '[0-4a-eA-E]',
              negate: '[^0-4a-eA-E]',
              transform: v => v.toLocaleUpperCase()
            }
          }
        })

        // "5" does not match the custom pattern, so masking stops there
        expect(wrapper.get('input').element.value).toBe('AB')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({
          modelValue: 'some-string',
          label: 'Username'
        })

        expect(wrapper.get('input').element.value).toBe('some-string')
        expect(wrapper.classes()).toContain('q-field--float')
      })

      test('type Number has effect', () => {
        const wrapper = mountInput({ modelValue: 10, label: 'Username' })

        expect(wrapper.get('input').element.value).toBe('10')
        expect(wrapper.classes()).toContain('q-field--float')
      })

      test('type null has effect', () => {
        const wrapper = mountInput({ modelValue: null, label: 'Username' })

        expect(wrapper.get('input').element.value).toBe('')
        expect(wrapper.classes()).not.toContain('q-field--float')
      })

      test('type undefined has effect', () => {
        const wrapper = mountInput({ modelValue: void 0, label: 'Username' })

        expect(wrapper.get('input').element.value).toBe('')
        expect(wrapper.classes()).not.toContain('q-field--float')
      })
    })

    describe('[(prop)error]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ error: true })

        expect(wrapper.classes()).toContain('q-field--error')
        expect(wrapper.classes()).toContain('q-field--highlighted')
        expect(wrapper.get('.q-field__control').classes()).toContain(
          'text-negative'
        )
      })

      test('type null has effect', () => {
        // null is the "no opinion" value: it does not even reserve
        // the bottom slot, while an explicit false does
        const wrapper = mountInput({ error: null })

        expect(wrapper.classes()).not.toContain('q-field--error')
        expect(wrapper.find('.q-field__bottom').exists()).toBe(false)

        const explicitFalse = mountInput({ error: false })

        expect(explicitFalse.classes()).not.toContain('q-field--error')
        expect(explicitFalse.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)error-message]', () => {
      test('type String has effect', () => {
        const propVal = 'Username must have at least 5 characters'
        const wrapper = mountInput({ error: true, errorMessage: propVal })

        expect(wrapper.get('.q-field__messages [role="alert"]').text()).toBe(
          propVal
        )
      })
    })

    describe('[(prop)no-error-icon]', () => {
      test('type Boolean has effect', () => {
        const withIcon = mountInput({ error: true })
        expect(withIcon.find('.q-field__append .q-icon').exists()).toBe(true)

        const wrapper = mountInput({ error: true, noErrorIcon: true })
        expect(wrapper.find('.q-field__append .q-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)rules]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountInput({
          modelValue: 'some-string',
          rules: [maxThreeChars]
        })

        expect(wrapper.classes()).not.toContain('q-field--error')

        expect(wrapper.vm.validate()).toBe(false)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
        expect(wrapper.get('.q-field__messages').text()).toBe(
          'Please use maximum 3 characters'
        )
      })
    })

    describe('[(prop)reactive-rules]', () => {
      test('type Boolean has effect', async () => {
        // lazy-rules keeps the model watcher from validating,
        // so only a rules change can trigger the validation below
        const props = {
          modelValue: 'ab',
          lazyRules: true,
          rules: [() => true]
        }

        const inert = mountInput(props)
        await inert.setProps({ modelValue: 'abcd' })
        await inert.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(inert.classes()).not.toContain('q-field--error')

        const wrapper = mountInput({ ...props, reactiveRules: true })
        await wrapper.setProps({ modelValue: 'abcd' })
        await wrapper.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)lazy-rules]', () => {
      test('value true has effect', async () => {
        const wrapper = mountInput({
          modelValue: 'ab',
          lazyRules: true,
          rules: [maxThreeChars]
        })

        // a model change alone does not validate...
        await wrapper.setProps({ modelValue: 'abcd' })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        // ...but losing the focus does
        const control = wrapper.get('.q-field__control')
        await control.trigger('focusin')
        await control.trigger('focusout')
        await flushTimers()
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value false has effect', async () => {
        const wrapper = mountInput({
          modelValue: 'ab',
          lazyRules: false,
          rules: [maxThreeChars]
        })

        await wrapper.setProps({ modelValue: 'abcd' })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value "ondemand" has effect', async () => {
        const wrapper = mountInput({
          modelValue: 'abcd',
          lazyRules: 'ondemand',
          rules: [maxThreeChars]
        })

        // neither a model change nor a blur validates
        await wrapper.setProps({ modelValue: 'abcde' })

        const control = wrapper.get('.q-field__control')
        await control.trigger('focusin')
        await control.trigger('focusout')
        await flushTimers()
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        expect(wrapper.vm.validate()).toBe(false)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ label: 'Username' })

        expect(wrapper.classes()).toContain('q-field--labeled')
        expect(wrapper.get('.q-field__label').text()).toBe('Username')
        expect(wrapper.get('input').attributes('aria-label')).toBe('Username')
      })
    })

    describe('[(prop)stack-label]', () => {
      test('type Boolean has effect', () => {
        const floating = mountInput({ modelValue: '', label: 'Username' })
        expect(floating.classes()).not.toContain('q-field--float')

        const wrapper = mountInput({
          modelValue: '',
          label: 'Username',
          stackLabel: true
        })
        expect(wrapper.classes()).toContain('q-field--float')
      })
    })

    describe('[(prop)hint]', () => {
      test('type String has effect', () => {
        const propVal = 'Fill in between 3 and 12 characters'
        const wrapper = mountInput({ hint: propVal })

        expect(wrapper.get('.q-field__messages').text()).toBe(propVal)
      })
    })

    describe('[(prop)hide-hint]', () => {
      test('type Boolean has effect', async () => {
        const propVal = 'Fill in between 3 and 12 characters'
        const wrapper = mountInput({ hint: propVal, hideHint: true })

        expect(wrapper.get('.q-field__messages').text()).toBe('')

        // the hint is still shown while the control is focused
        await wrapper.get('.q-field__control').trigger('focusin')

        expect(wrapper.get('.q-field__messages').text()).toBe(propVal)
      })
    })

    describe('[(prop)prefix]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ prefix: '$' })

        expect(wrapper.get('.q-field__prefix').text()).toBe('$')
      })
    })

    describe('[(prop)suffix]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ suffix: '@gmail.com' })

        expect(wrapper.get('.q-field__suffix').text()).toBe('@gmail.com')
      })
    })

    describe('[(prop)label-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({
          label: 'Username',
          labelColor: 'primary'
        })

        expect(wrapper.get('.q-field__label').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ color: 'primary' })

        expect(wrapper.get('.q-field__control').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)bg-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ bgColor: 'primary' })

        expect(wrapper.get('.q-field__control').classes()).toContain(
          'bg-primary'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ dark: true })

        expect(wrapper.classes()).toContain('q-field--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountInput({ dark: null })

        expect(wrapper.classes()).not.toContain('q-field--dark')

        try {
          wrapper.vm.$q.dark.set(true)
          await flushPromises()

          expect(wrapper.classes()).toContain('q-field--dark')
        } finally {
          wrapper.vm.$q.dark.set(false)
        }
      })
    })

    describe('[(prop)loading]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ loading: true })

        expect(wrapper.find('.q-field__append .q-spinner').exists()).toBe(true)
      })
    })

    describe('[(prop)clearable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountInput({ clearable: true })

        const clearAction = wrapper.get('.q-field__focusable-action')
        await clearAction.trigger('click')

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([null])

        const notClearable = mountInput()
        expect(notClearable.find('.q-field__focusable-action').exists()).toBe(
          false
        )
      })
    })

    describe('[(prop)clear-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ clearable: true, clearIcon: 'close' })

        expect(wrapper.get('.q-field__focusable-action').text()).toBe('close')
      })
    })

    describe('[(prop)filled]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ filled: true })

        expect(wrapper.classes()).toContain('q-field--filled')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })
    })

    describe('[(prop)outlined]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ outlined: true })

        expect(wrapper.classes()).toContain('q-field--outlined')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })
    })

    describe('[(prop)borderless]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ borderless: true })

        expect(wrapper.classes()).toContain('q-field--borderless')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })
    })

    describe('[(prop)standout]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ standout: true })

        expect(wrapper.classes()).toContain('q-field--standout')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })

      test('type String has effect', async () => {
        const wrapper = mountInput({ standout: 'bg-primary text-white' })
        const control = wrapper.get('.q-field__control')

        expect(wrapper.classes()).toContain('q-field--standout')
        expect(control.classes()).not.toContain('bg-primary')

        // the supplied classes are applied while focused
        await control.trigger('focusin')

        expect(control.classes()).toContain('bg-primary')
        expect(control.classes()).toContain('text-white')
      })
    })

    describe('[(prop)label-slot]', () => {
      test('type Boolean has effect', () => {
        const slots = { label: () => 'Custom label' }

        const noLabel = mountInput({}, { slots })
        expect(noLabel.find('.q-field__label').exists()).toBe(false)

        const wrapper = mountInput({ labelSlot: true }, { slots })

        expect(wrapper.classes()).toContain('q-field--labeled')
        expect(wrapper.get('.q-field__label').text()).toBe('Custom label')
      })
    })

    describe('[(prop)bottom-slots]', () => {
      test('type Boolean has effect', () => {
        const noBottom = mountInput()
        expect(noBottom.find('.q-field__bottom').exists()).toBe(false)

        const wrapper = mountInput({ bottomSlots: true })
        expect(wrapper.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)hide-bottom-space]', () => {
      test('type Boolean has effect', () => {
        const withSpace = mountInput({ hint: 'Some hint' })
        expect(withSpace.classes()).toContain('q-field--with-bottom')
        expect(withSpace.get('.q-field__bottom').classes()).toContain(
          'q-field__bottom--animated'
        )

        const wrapper = mountInput({
          hint: 'Some hint',
          hideBottomSpace: true
        })

        expect(wrapper.classes()).not.toContain('q-field--with-bottom')
        expect(wrapper.get('.q-field__bottom').classes()).toContain(
          'q-field__bottom--stale'
        )
      })
    })

    describe('[(prop)counter]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({
          modelValue: 'some-string',
          counter: true
        })

        expect(wrapper.get('.q-field__counter').text()).toBe('11')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ rounded: true })

        expect(wrapper.classes()).toContain('q-field--rounded')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ square: true })

        expect(wrapper.classes()).toContain('q-field--square')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ dense: true })

        expect(wrapper.classes()).toContain('q-field--dense')
      })
    })

    describe('[(prop)item-aligned]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ itemAligned: true })

        expect(wrapper.classes()).toContain('q-field--item-aligned')
        expect(wrapper.classes()).toContain('q-item-type')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountInput({ disable: true })

        expect(wrapper.classes()).toContain('q-field--disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(wrapper.get('input').element.disabled).toBe(true)

        // a disabled field is not editable, so it does not focus
        await wrapper.get('.q-field__control').trigger('focusin')

        expect(wrapper.emitted('focus')).toBeUndefined()
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ readonly: true })

        expect(wrapper.classes()).toContain('q-field--readonly')
        expect(wrapper.get('input').element.readOnly).toBe(true)
      })
    })

    describe('[(prop)autofocus]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput(
          { autofocus: true },
          { attachTo: document.body }
        )

        expect(wrapper.get('input').attributes('data-autofocus')).toBeDefined()
        expect(document.activeElement).toBe(wrapper.get('input').element)

        wrapper.unmount()
      })
    })

    describe('[(prop)for]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ for: 'myFieldsId' })
        const input = wrapper.get('input')

        expect(input.attributes('id')).toBe('myFieldsId')
        expect(wrapper.attributes('for')).toBe('myFieldsId')
        // it also acts as fallback for the "name" prop
        expect(input.attributes('name')).toBe('myFieldsId')
      })
    })

    describe('[(prop)shadow-text]', () => {
      test('type String has effect', () => {
        const noShadow = mountInput({ modelValue: 'some' })
        expect(noShadow.find('.q-field__shadow').exists()).toBe(false)

        const wrapper = mountInput({
          modelValue: 'some',
          shadowText: 'rest of the fill value'
        })

        // the current value is rendered as invisible padding
        // in front of the shadow text
        expect(wrapper.get('.q-field__shadow').text()).toBe(
          'somerest of the fill value'
        )
      })
    })

    describe('[(prop)type]', () => {
      test('value "text" has effect', () => {
        const wrapper = mountInput({ type: 'text' })

        expect(wrapper.get('input').attributes('type')).toBe('text')
      })

      test('value "password" has effect', () => {
        const wrapper = mountInput({ type: 'password' })

        expect(wrapper.get('input').attributes('type')).toBe('password')
      })

      test('value "textarea" has effect', () => {
        const wrapper = mountInput({ type: 'textarea' })

        expect(wrapper.find('input').exists()).toBe(false)
        expect(wrapper.get('textarea').attributes('rows')).toBe('6')
        expect(wrapper.classes()).toContain('q-textarea')
      })

      test('value "email" has effect', () => {
        const wrapper = mountInput({ type: 'email' })

        expect(wrapper.get('input').attributes('type')).toBe('email')
      })

      test('value "search" has effect', () => {
        const wrapper = mountInput({ type: 'search' })

        expect(wrapper.get('input').attributes('type')).toBe('search')
      })

      test('value "tel" has effect', () => {
        const wrapper = mountInput({ type: 'tel' })

        expect(wrapper.get('input').attributes('type')).toBe('tel')
      })

      test('value "file" has effect', () => {
        const wrapper = mountInput({
          modelValue: null,
          type: 'file',
          shadowText: 'rest of the fill value'
        })

        expect(wrapper.get('input').attributes('type')).toBe('file')
        // the shadow text does not apply to type=file
        expect(wrapper.find('.q-field__shadow').exists()).toBe(false)
      })

      test('value "number" has effect', () => {
        const wrapper = mountInput({ modelValue: 10, type: 'number' })
        const input = wrapper.get('input')

        expect(input.attributes('type')).toBe('number')
        expect(input.element.value).toBe('10')
      })

      test('value "url" has effect', () => {
        const wrapper = mountInput({ type: 'url' })

        expect(wrapper.get('input').attributes('type')).toBe('url')
      })

      test('value "time" has effect', () => {
        const wrapper = mountInput({ modelValue: '10:30', type: 'time' })

        expect(wrapper.get('input').attributes('type')).toBe('time')
      })

      test('value "date" has effect', () => {
        const wrapper = mountInput({ modelValue: '2023-01-05', type: 'date' })

        expect(wrapper.get('input').attributes('type')).toBe('date')
      })

      test('value "datetime-local" has effect', () => {
        const wrapper = mountInput({
          modelValue: '2023-01-05T10:30',
          type: 'datetime-local'
        })

        expect(wrapper.get('input').attributes('type')).toBe('datetime-local')
      })
    })

    describe('[(prop)debounce]', () => {
      test('type String has effect', async () => {
        vi.useFakeTimers()

        try {
          const wrapper = mountInput({ modelValue: '', debounce: '100' })
          const input = wrapper.get('input')

          input.element.value = 'a'
          await input.trigger('input')

          expect(wrapper.emitted('update:modelValue')).toBeUndefined()

          vi.advanceTimersByTime(100)

          expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['a'])
        } finally {
          vi.useRealTimers()
        }
      })

      test('type Number has effect', async () => {
        vi.useFakeTimers()

        try {
          const wrapper = mountInput({ modelValue: '', debounce: 100 })
          const input = wrapper.get('input')

          input.element.value = 'a'
          await input.trigger('input')

          expect(wrapper.emitted('update:modelValue')).toBeUndefined()

          vi.advanceTimersByTime(100)

          expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['a'])
        } finally {
          vi.useRealTimers()
        }
      })
    })

    describe('[(prop)maxlength]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ maxlength: '20', counter: true })

        expect(wrapper.get('input').attributes('maxlength')).toBe('20')
        expect(wrapper.get('.q-field__counter').text()).toBe('11 / 20')
      })

      test('type Number has effect', () => {
        const wrapper = mountInput({ maxlength: 20, counter: true })

        expect(wrapper.get('input').attributes('maxlength')).toBe('20')
        expect(wrapper.get('.q-field__counter').text()).toBe('11 / 20')
      })
    })

    describe('[(prop)autogrow]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountInput({ autogrow: true })

        expect(wrapper.find('input').exists()).toBe(false)
        expect(wrapper.get('textarea').attributes('rows')).toBe('1')
        expect(wrapper.classes()).toContain('q-textarea')
        expect(wrapper.classes()).toContain('q-textarea--autogrow')
      })
    })

    describe('[(prop)input-class]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({ inputClass: 'my-special-class' })

        expect(wrapper.get('input').classes()).toContain('my-special-class')
      })

      test('type Array has effect', () => {
        const wrapper = mountInput({ inputClass: ['my-special-class'] })

        expect(wrapper.get('input').classes()).toContain('my-special-class')
      })

      test('type Object has effect', () => {
        const wrapper = mountInput({
          inputClass: { 'my-special-class': true }
        })

        expect(wrapper.get('input').classes()).toContain('my-special-class')
      })
    })

    describe('[(prop)input-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountInput({
          inputStyle: 'background-color: #ff0000'
        })

        expect(wrapper.get('input').$style('background-color')).toBe(
          'rgb(255, 0, 0)'
        )
      })

      test('type Array has effect', () => {
        const wrapper = mountInput({
          inputStyle: [{ backgroundColor: '#ff0000' }]
        })

        expect(wrapper.get('input').$style('background-color')).toBe(
          'rgb(255, 0, 0)'
        )
      })

      test('type Object has effect', () => {
        const wrapper = mountInput({
          inputStyle: { backgroundColor: '#ff0000' }
        })

        expect(wrapper.get('input').$style('background-color')).toBe(
          'rgb(255, 0, 0)'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          {},
          { slots: { default: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__control-container').text()).toContain(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)prepend]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          {},
          { slots: { prepend: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__prepend').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)append]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          {},
          { slots: { append: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__append').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)before]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          {},
          { slots: { before: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__before').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)after]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          {},
          { slots: { after: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__after').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          { labelSlot: true },
          { slots: { label: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__label').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)error]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          { error: true },
          { slots: { error: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)hint]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          { bottomSlots: true },
          { slots: { hint: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)counter]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          { bottomSlots: true },
          { slots: { counter: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__counter').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', () => {
        const wrapper = mountInput(
          { loading: true },
          { slots: { loading: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__append').text()).toBe('some-slot-content')
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountInput({ modelValue: '' })
        const input = wrapper.get('input')

        input.element.value = 'some-string'
        await input.trigger('input')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe('some-string')
      })
    })

    describe('[(event)focus]', () => {
      test('is emitting', async () => {
        const wrapper = mountInput()

        await wrapper.get('.q-field__control').trigger('focusin')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('focus')
        expect(eventList.focus).toHaveLength(1)

        const [evt] = eventList.focus[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)blur]', () => {
      test('is emitting', async () => {
        const wrapper = mountInput()
        const control = wrapper.get('.q-field__control')

        await control.trigger('focusin')
        await control.trigger('focusout')
        await flushTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('blur')
        expect(eventList.blur).toHaveLength(1)

        const [evt] = eventList.blur[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)clear]', () => {
      test('is emitting', async () => {
        const wrapper = mountInput({
          modelValue: 'some-string',
          clearable: true
        })

        await wrapper.get('.q-field__focusable-action').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('clear')
        expect(eventList.clear).toHaveLength(1)

        // it carries the value that has been cleared
        const [value] = eventList.clear[0]
        expect(value).toBe('some-string')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)resetValidation]', () => {
      test('should be callable', async () => {
        const wrapper = mountInput({
          modelValue: 'some-string',
          rules: [maxThreeChars]
        })

        wrapper.vm.validate()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')

        expect(wrapper.vm.resetValidation()).toBeUndefined()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')
      })
    })

    describe('[(method)validate]', () => {
      test('should be callable', async () => {
        const wrapper = mountInput({
          modelValue: 'some-string',
          rules: [maxThreeChars]
        })

        expect(wrapper.vm.validate('ab')).toBe(true)
        expect(wrapper.vm.validate('abcd')).toBe(false)

        // async rules make it return a Promise instead
        const asyncWrapper = mountInput({
          modelValue: 'some-string',
          rules: [() => Promise.resolve('Nope')]
        })

        const result = asyncWrapper.vm.validate()
        expect(result).toBeInstanceOf(Promise)

        await expect(result).resolves.toBe(false)
        await flushPromises()

        expect(asyncWrapper.get('.q-field__messages').text()).toBe('Nope')
      })
    })

    describe('[(method)focus]', () => {
      test('should be callable', () => {
        const wrapper = mountInput({}, { attachTo: document.body })

        expect(wrapper.vm.focus()).toBeUndefined()
        expect(document.activeElement).toBe(wrapper.get('input').element)

        wrapper.unmount()
      })
    })

    describe('[(method)blur]', () => {
      test('should be callable', () => {
        const wrapper = mountInput({}, { attachTo: document.body })
        const input = wrapper.get('input').element

        wrapper.vm.focus()
        expect(document.activeElement).toBe(input)

        expect(wrapper.vm.blur()).toBeUndefined()
        expect(document.activeElement).not.toBe(input)

        wrapper.unmount()
      })
    })

    describe('[(method)select]', () => {
      test('should be callable', () => {
        const wrapper = mountInput({ modelValue: 'some-string' })
        const input = wrapper.get('input').element

        input.setSelectionRange(2, 2)
        expect(input.selectionEnd).toBe(2)

        expect(wrapper.vm.select()).toBeUndefined()

        expect(input.selectionStart).toBe(0)
        expect(input.selectionEnd).toBe('some-string'.length)
      })
    })

    describe('[(method)getNativeElement]', () => {
      test('should be callable', () => {
        const wrapper = mountInput()

        expect(wrapper.vm.getNativeElement()).toBe(wrapper.get('input').element)
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)hasError]', () => {
      test('should be exposed', () => {
        const wrapper = mountInput()
        expect(wrapper.vm.hasError).toBe(false)

        const withError = mountInput({ error: true })
        expect(withError.vm.hasError).toBe(true)
      })
    })

    describe('[(computedProp)nativeEl]', () => {
      test('should be exposed', () => {
        const wrapper = mountInput()
        expect(wrapper.vm.nativeEl).toBe(wrapper.get('input').element)

        const textarea = mountInput({ type: 'textarea' })
        expect(textarea.vm.nativeEl).toBe(textarea.get('textarea').element)
      })
    })
  })

  describe('[Generic]', () => {
    test('should not throw error on render', () => {
      const wrapper = mountInput()

      expect(wrapper.get('input')).toBeDefined()
    })

    // IME composition: a mask must not rewrite the value while an IME owns
    // the composition, otherwise each composed char gets masked in isolation
    // (#16618, #16629)

    test('defers masking for each composed digit until composition ends', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = mountInput({
        modelValue: '',
        mask: '####/##/##',
        'onUpdate:modelValue': onUpdateModelValue
      })
      const input = wrapper.get('input')

      for (const [index, value] of ['2', '20', '202', '2023'].entries()) {
        const data = value.at(-1)

        await input.trigger('compositionstart')

        input.element.value = value
        await input.trigger('input', {
          data,
          inputType: 'insertCompositionText'
        })

        expect(onUpdateModelValue).toHaveBeenCalledTimes(index)
        expect(input.element.value).toBe(value)

        await input.trigger('compositionend', { data })
      }

      expect(onUpdateModelValue.mock.calls).toEqual([
        ['2'],
        ['20'],
        ['202'],
        ['2023/']
      ])
      expect(input.element.value).toBe('2023/')
    })

    test('keeps immediate updates for unmasked compositionstart-only input', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = mountInput({
        modelValue: '',
        'onUpdate:modelValue': onUpdateModelValue
      })
      const input = wrapper.get('input')

      await input.trigger('compositionstart')

      input.element.value = 'a'
      await input.trigger('input', {
        data: 'a',
        inputType: 'insertCompositionText'
      })

      expect(onUpdateModelValue).toHaveBeenCalledOnce()
      expect(onUpdateModelValue).toHaveBeenLastCalledWith('a')
    })

    test('keeps immediate masking for input outside composition', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = mountInput({
        modelValue: '',
        mask: '####/##/##',
        'onUpdate:modelValue': onUpdateModelValue
      })
      const input = wrapper.get('input')

      input.element.value = '2023'
      await input.trigger('input', { inputType: 'insertText' })

      expect(onUpdateModelValue).toHaveBeenCalledOnce()
      expect(onUpdateModelValue).toHaveBeenLastCalledWith('2023/')
      expect(input.element.value).toBe('2023/')
    })
  })
})
