import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { h, nextTick } from 'vue'

import QField from './QField.js'

function mountField(props, options) {
  props ||= {}
  options ||= {}

  return mount(QField, {
    props: {
      modelValue: 'some-value',
      ...props
    },
    ...options
  })
}

/**
 * QField has no native control of its own, so the interactive behavior
 * only shows up once something is put into the "control" slot.
 */
function mountControlField(props, controlSlot) {
  return mountField(props, {
    slots: {
      control:
        controlSlot ||
        (() => h('div', { class: 'my-control', tabindex: 0 }, 'Control'))
    },
    attachTo: document.body
  })
}

function getControl(wrapper) {
  return wrapper.get('.q-field__control')
}

function getNative(wrapper) {
  return wrapper.get('.q-field__native')
}

function getBottom(wrapper) {
  return wrapper.get('.q-field__bottom')
}

// the validation debounce and the focusout handler are both timer based
function flushTimers() {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

const maxThreeChars = val =>
  String(val).length <= 3 || 'Please use maximum 3 characters'

describe('[QField API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Any has effect', async () => {
        const wrapper = mountField({ modelValue: null, label: 'Username' })

        // an empty model keeps the label in place
        expect(wrapper.classes()).toContain('q-field--labeled')
        expect(wrapper.classes()).not.toContain('q-field--float')

        await wrapper.setProps({ modelValue: 'filled in' })

        expect(wrapper.classes()).toContain('q-field--float')
      })

      test('is handed over to the control slot', () => {
        let slotScope
        const propVal = { deep: 'value' }

        mountControlField({ modelValue: propVal }, scope => {
          slotScope = scope
          return h('div')
        })

        expect(slotScope.modelValue).toStrictEqual(propVal)
      })
    })

    describe('[(prop)error]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ error: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-field--error', 'q-field--highlighted'])
        )
        expect(getControl(wrapper).classes()).toContain('text-negative')
      })

      test('type null has effect', () => {
        // null is the "no opinion" value: it does not even reserve
        // the bottom slot, while an explicit false does
        const wrapper = mountField({ error: null })

        expect(wrapper.classes()).not.toContain('q-field--error')
        expect(wrapper.find('.q-field__bottom').exists()).toBe(false)

        const explicitFalse = mountField({ error: false })

        expect(explicitFalse.classes()).not.toContain('q-field--error')
        expect(explicitFalse.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)error-message]', () => {
      test('type String has effect', () => {
        const propVal = 'Username must have at least 5 characters'
        const wrapper = mountField({ error: true, errorMessage: propVal })

        expect(wrapper.get('.q-field__messages [role="alert"]').text()).toBe(
          propVal
        )
      })
    })

    describe('[(prop)no-error-icon]', () => {
      test('type Boolean has effect', () => {
        const withIcon = mountField({ error: true })
        expect(withIcon.find('.q-field__append .q-icon').exists()).toBe(true)

        const wrapper = mountField({ error: true, noErrorIcon: true })
        expect(wrapper.find('.q-field__append .q-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)rules]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountField({
          modelValue: 'some-value',
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

        const inert = mountField(props)
        await inert.setProps({ modelValue: 'abcd' })
        await inert.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(inert.classes()).not.toContain('q-field--error')

        const wrapper = mountField({ ...props, reactiveRules: true })
        await wrapper.setProps({ modelValue: 'abcd' })
        await wrapper.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)lazy-rules]', () => {
      test('value true has effect', async () => {
        const wrapper = mountField({
          modelValue: 'ab',
          lazyRules: true,
          rules: [maxThreeChars]
        })

        // a model change alone does not validate
        await wrapper.setProps({ modelValue: 'abcd' })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        // ...but an explicit validation still does
        wrapper.vm.validate()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value false has effect', async () => {
        const wrapper = mountField({
          modelValue: 'ab',
          lazyRules: false,
          rules: [maxThreeChars]
        })

        // every model change gets validated
        await wrapper.setProps({ modelValue: 'abcd' })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value "ondemand" has effect', async () => {
        const wrapper = mountControlField({
          modelValue: 'ab',
          lazyRules: 'ondemand',
          rules: [maxThreeChars]
        })

        await wrapper.setProps({ modelValue: 'abcd' })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        // not even losing the focus validates it
        await getControl(wrapper).trigger('focusin')
        await getControl(wrapper).trigger('focusout')
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        wrapper.vm.validate()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const propVal = 'Username'
        const wrapper = mountField({ label: propVal })

        expect(wrapper.get('.q-field__label').text()).toBe(propVal)
        expect(wrapper.classes()).toContain('q-field--labeled')
      })
    })

    describe('[(prop)stack-label]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField({ modelValue: null, label: 'Username' })

        expect(wrapper.classes()).not.toContain('q-field--float')

        await wrapper.setProps({ stackLabel: true })

        // the label stays up even with an empty model
        expect(wrapper.classes()).toContain('q-field--float')
      })
    })

    describe('[(prop)hint]', () => {
      test('type String has effect', () => {
        const propVal = 'Fill in your username'
        const wrapper = mountField({ hint: propVal })

        expect(wrapper.get('.q-field__messages').text()).toBe(propVal)
      })
    })

    describe('[(prop)hide-hint]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountControlField({
          hint: 'Fill in your username',
          hideHint: true
        })

        // the hint only shows up while focused
        expect(wrapper.get('.q-field__messages').text()).toBe('')

        await getControl(wrapper).trigger('focusin')

        expect(wrapper.get('.q-field__messages').text()).toBe(
          'Fill in your username'
        )
      })
    })

    describe('[(prop)prefix]', () => {
      test('type String has effect', () => {
        const propVal = '$'
        const wrapper = mountField({ prefix: propVal })

        expect(wrapper.get('.q-field__prefix').text()).toBe(propVal)
      })
    })

    describe('[(prop)suffix]', () => {
      test('type String has effect', () => {
        const propVal = '@gmail.com'
        const wrapper = mountField({ suffix: propVal })

        expect(wrapper.get('.q-field__suffix').text()).toBe(propVal)
      })
    })

    describe('[(prop)label-color]', () => {
      test('type String has effect', () => {
        const propVal = 'primary'
        const wrapper = mountField({ label: 'Username', labelColor: propVal })

        expect(wrapper.get('.q-field__label').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const propVal = 'primary'
        const wrapper = mountField({ color: propVal })

        expect(getControl(wrapper).classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)bg-color]', () => {
      test('type String has effect', () => {
        const propVal = 'primary'
        const wrapper = mountField({ bgColor: propVal })

        expect(getControl(wrapper).classes()).toContain(`bg-${propVal}`)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField()

        expect(wrapper.classes()).not.toContain('q-field--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-field--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountField({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-field--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-field--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)loading]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField()

        expect(wrapper.find('.q-spinner').exists()).toBe(false)

        await wrapper.setProps({ loading: true })

        expect(wrapper.find('.q-field__append .q-spinner').exists()).toBe(true)
      })
    })

    describe('[(prop)clearable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField({ 'onUpdate:modelValue': () => {} })

        expect(wrapper.find('.q-field__append .q-icon').exists()).toBe(false)

        await wrapper.setProps({ clearable: true })

        await wrapper.get('.q-field__append .q-icon').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[null]])
        expect(wrapper.emitted('clear')).toStrictEqual([['some-value']])
      })
    })

    describe('[(prop)clear-icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'delete'
        const wrapper = mountField({ clearable: true })

        const defaultIcon = wrapper.get('.q-field__append .q-icon').text()
        expect(defaultIcon).not.toBe(propVal)

        await wrapper.setProps({ clearIcon: propVal })

        expect(wrapper.get('.q-field__append .q-icon').text()).toBe(propVal)
      })
    })

    describe('[(prop)filled]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ filled: true })

        expect(wrapper.classes()).toContain('q-field--filled')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })
    })

    describe('[(prop)outlined]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ outlined: true })

        expect(wrapper.classes()).toContain('q-field--outlined')
      })
    })

    describe('[(prop)borderless]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ borderless: true })

        expect(wrapper.classes()).toContain('q-field--borderless')
      })
    })

    describe('[(prop)standout]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ standout: true })

        expect(wrapper.classes()).toContain('q-field--standout')
      })

      test('type String has effect', async () => {
        const propVal = 'bg-teal text-white'
        const wrapper = mountControlField({ standout: propVal })

        expect(wrapper.classes()).toContain('q-field--standout')
        // the custom classes only apply while focused
        expect(getControl(wrapper).classes()).not.toContain('bg-teal')

        await getControl(wrapper).trigger('focusin')

        expect(getControl(wrapper).classes()).toEqual(
          expect.arrayContaining(['bg-teal', 'text-white'])
        )
      })
    })

    describe('[(prop)label-slot]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField()

        expect(wrapper.classes()).not.toContain('q-field--labeled')

        await wrapper.setProps({ labelSlot: true })

        // it forces the label space even without a label prop
        expect(wrapper.classes()).toContain('q-field--labeled')
      })
    })

    describe('[(prop)bottom-slots]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField({ error: null })

        expect(wrapper.find('.q-field__bottom').exists()).toBe(false)

        await wrapper.setProps({ bottomSlots: true })

        expect(wrapper.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)hide-bottom-space]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField({ hint: 'Some hint' })

        expect(wrapper.classes()).toContain('q-field--with-bottom')
        expect(getBottom(wrapper).classes()).toContain(
          'q-field__bottom--animated'
        )

        await wrapper.setProps({ hideBottomSpace: true })

        expect(wrapper.classes()).not.toContain('q-field--with-bottom')
        expect(getBottom(wrapper).classes()).toContain('q-field__bottom--stale')
      })
    })

    describe('[(prop)counter]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountField({ modelValue: 'abcd' })

        expect(wrapper.find('.q-field__counter').exists()).toBe(false)

        await wrapper.setProps({ counter: true })

        expect(wrapper.get('.q-field__counter').text()).toBe('4')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ rounded: true })

        expect(wrapper.classes()).toContain('q-field--rounded')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ square: true })

        expect(wrapper.classes()).toContain('q-field--square')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ dense: true })

        expect(wrapper.classes()).toContain('q-field--dense')
      })
    })

    describe('[(prop)item-aligned]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ itemAligned: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-field--item-aligned', 'q-item-type'])
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ clearable: true, disable: true })

        expect(wrapper.classes()).toContain('q-field--disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        // there is nothing to clear anymore either
        expect(wrapper.find('.q-field__append .q-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountField({ clearable: true, readonly: true })

        expect(wrapper.classes()).toContain('q-field--readonly')
        expect(wrapper.classes()).not.toContain('q-field--disabled')
        expect(wrapper.find('.q-field__append .q-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)autofocus]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountControlField({ autofocus: true })
        await flushPromises()

        expect(getNative(wrapper).attributes('data-autofocus')).toBe('true')
        // the native wrapper is what carries the tabindex, so it takes focus
        expect(getNative(wrapper).element).toBe(document.activeElement)
      })
    })

    describe('[(prop)for]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-field'
        let slotScope

        const wrapper = mountControlField({}, scope => {
          slotScope = scope
          return h('div', { class: 'my-control', tabindex: 0 })
        })

        await wrapper.setProps({ for: propVal })

        expect(wrapper.attributes('for')).toBe(propVal)
        // the control slot receives it, so it can link its own control
        expect(slotScope.id).toBe(propVal)
      })
    })

    describe('[(prop)maxlength]', () => {
      test('type String has effect', async () => {
        const propVal = '12'
        const wrapper = mountField({ modelValue: 'abcd', counter: true })

        await wrapper.setProps({ maxlength: propVal })

        expect(wrapper.get('.q-field__counter').text()).toBe(`4 / ${propVal}`)
      })

      test('type Number has effect', () => {
        const propVal = 12
        const wrapper = mountField({
          modelValue: 'abcd',
          counter: true,
          maxlength: propVal
        })

        expect(wrapper.get('.q-field__counter').text()).toBe(`4 / ${propVal}`)
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', async () => {
        const propVal = 'div'
        const wrapper = mountField()

        // it defaults to a label, so that clicking it focuses the control
        expect(wrapper.element.tagName.toLowerCase()).toBe('label')

        await wrapper.setProps({ tag: propVal })

        expect(wrapper.element.tagName.toLowerCase()).toBe(propVal)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          {},
          { slots: { default: () => slotContent } }
        )

        expect(getControl(wrapper).text()).toContain(slotContent)
      })
    })

    describe('[(slot)prepend]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          {},
          { slots: { prepend: () => slotContent } }
        )

        expect(wrapper.get('.q-field__prepend').text()).toBe(slotContent)
      })
    })

    describe('[(slot)append]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField({}, { slots: { append: () => slotContent } })

        expect(wrapper.get('.q-field__append').text()).toBe(slotContent)
      })
    })

    describe('[(slot)before]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField({}, { slots: { before: () => slotContent } })

        expect(wrapper.get('.q-field__before').text()).toBe(slotContent)
      })
    })

    describe('[(slot)after]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField({}, { slots: { after: () => slotContent } })

        expect(wrapper.get('.q-field__after').text()).toBe(slotContent)
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          { labelSlot: true },
          { slots: { label: () => slotContent } }
        )

        expect(wrapper.get('.q-field__label').text()).toBe(slotContent)
      })
    })

    describe('[(slot)error]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          { error: true },
          { slots: { error: () => slotContent } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(slotContent)
      })
    })

    describe('[(slot)hint]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          { bottomSlots: true },
          { slots: { hint: () => slotContent } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(slotContent)
      })
    })

    describe('[(slot)counter]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          { bottomSlots: true },
          { slots: { counter: () => slotContent } }
        )

        // it takes over the counter, no "counter" prop needed
        expect(wrapper.get('.q-field__counter').text()).toBe(slotContent)
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          { loading: true },
          { slots: { loading: () => slotContent } }
        )

        expect(wrapper.get('.q-field__append').text()).toBe(slotContent)
        // it replaces the default spinner
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
      })
    })

    describe('[(slot)control]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountField(
          { modelValue: 'some-value' },
          {
            slots: {
              control: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(getNative(wrapper).text()).toBe(slotContent)
        // QField has no built-in control, so it always sizes itself
        expect(wrapper.classes()).toContain('q-field--auto-height')

        expect(slotScope).toStrictEqual({
          id: expect.any(String),
          field: expect.any(Element),
          editable: true,
          focused: false,
          floatingLabel: true,
          modelValue: 'some-value',
          emitValue: expect.any(Function),
          // populated only while the field is in error state
          ariaInvalid: void 0,
          ariaDescribedby: void 0,
          ariaErrormessage: void 0
        })

        // the field element is resolved on access, so it points at the root
        expect(slotScope.field).toBe(wrapper.element)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', () => {
        let slotScope

        const wrapper = mountControlField({}, scope => {
          slotScope = scope
          return h('div')
        })

        // the control slot emits through the scope it receives
        slotScope.emitValue('new-value')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe('new-value')
      })
    })

    describe('[(event)focus]', () => {
      test('is emitting', async () => {
        const wrapper = mountControlField()

        await getControl(wrapper).trigger('focusin')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('focus')
        expect(eventList.focus).toHaveLength(1)

        const [evt] = eventList.focus[0]
        expect(evt).toBeInstanceOf(Event)
        expect(wrapper.classes()).toContain('q-field--focused')
      })
    })

    describe('[(event)blur]', () => {
      test('is emitting', async () => {
        const wrapper = mountControlField()

        await getControl(wrapper).trigger('focusin')
        await getControl(wrapper).trigger('focusout')
        await flushTimers()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('blur')
        expect(eventList.blur).toHaveLength(1)

        const [evt] = eventList.blur[0]
        expect(evt).toBeInstanceOf(Event)
        expect(wrapper.classes()).not.toContain('q-field--focused')
      })
    })

    describe('[(event)clear]', () => {
      test('is emitting', async () => {
        const wrapper = mountField({
          modelValue: 'some-value',
          clearable: true
        })

        await wrapper.get('.q-field__append .q-icon').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('clear')
        expect(eventList.clear).toHaveLength(1)

        // it reports the value that was cleared
        const [value] = eventList.clear[0]
        expect(value).toBe('some-value')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)resetValidation]', () => {
      test('should be callable', async () => {
        const wrapper = mountField({
          modelValue: 'some-value',
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
        const wrapper = mountField({
          modelValue: 'ab',
          rules: [maxThreeChars]
        })

        expect(wrapper.vm.validate()).toBe(true)
        await flushPromises()
        expect(wrapper.classes()).not.toContain('q-field--error')

        // it can also validate a value that is not the model
        expect(wrapper.vm.validate('abcd')).toBe(false)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(method)focus]', () => {
      test('should be callable', async () => {
        const wrapper = mountControlField()

        expect(wrapper.vm.focus()).toBeUndefined()
        await flushPromises()

        expect(getNative(wrapper).element).toBe(document.activeElement)
      })
    })

    describe('[(method)blur]', () => {
      test('should be callable', async () => {
        const wrapper = mountControlField()

        wrapper.vm.focus()
        await flushPromises()
        expect(getNative(wrapper).element).toBe(document.activeElement)

        expect(wrapper.vm.blur()).toBeUndefined()
        await flushPromises()

        expect(getNative(wrapper).element).not.toBe(document.activeElement)
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)hasError]', () => {
      test('should be exposed', async () => {
        const wrapper = mountField({ modelValue: 'some-value' })

        expect(wrapper.vm.hasError).toBe(false)

        await wrapper.setProps({ error: true })

        expect(wrapper.vm.hasError).toBe(true)

        // a failing rule flips it as well
        await wrapper.setProps({ error: null, rules: [maxThreeChars] })
        wrapper.vm.validate()
        await flushPromises()

        expect(wrapper.vm.hasError).toBe(true)
      })
    })
  })

  describe('[Accessibility]', () => {
    test('exposes the error ARIA values to the control slot', () => {
      let slotScope
      const wrapper = mountField(
        { error: true, errorMessage: 'Choose a value' },
        {
          slots: {
            control: scope => {
              slotScope = scope
              return 'some-slot-content'
            }
          }
        }
      )

      const messageId = wrapper.get('.q-field__messages').attributes('id')

      expect(messageId).toBeTruthy()
      expect(slotScope.ariaInvalid).toBe('true')
      expect(slotScope.ariaDescribedby).toBe(messageId)
      expect(slotScope.ariaErrormessage).toBe(messageId)
    })
  })
})
