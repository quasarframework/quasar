import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { defineComponent, h } from 'vue'

import useCheckbox, {
  useCheckboxEmits,
  useCheckboxProps
} from './use-checkbox.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

// stands in for what QCheckbox/QToggle supply as the "inner" renderer
const getInner = (isTrue, isIndeterminate) => () => [
  h('div', {
    class: 'my-inner',
    'data-state': isIndeterminate.value ? 'indet' : String(isTrue.value)
  })
]

function mountCheckbox({
  props = { modelValue: false },
  type = 'checkbox',
  slots,
  inner = getInner
} = {}) {
  wrapper = mount(
    defineComponent({
      props: useCheckboxProps,
      emits: useCheckboxEmits,
      setup() {
        return useCheckbox(type, inner)
      }
    }),
    { props, slots }
  )

  return wrapper
}

function getModelUpdates() {
  return wrapper.emitted('update:modelValue')?.map(([value]) => value)
}

describe('[useCheckbox API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useCheckboxProps]', () => {
      test('is defined correctly', () => {
        expect(useCheckboxProps).$props()
      })

      test('requires a model value', () => {
        expect(useCheckboxProps.modelValue.required).toBe(true)
      })

      test('only accepts the two toggle orders', () => {
        const { validator } = useCheckboxProps.toggleOrder

        expect(validator('tf')).toBe(true)
        expect(validator('ft')).toBe(true)
        expect(validator('ftf')).toBe(false)
      })
    })

    describe('[(variable)useCheckboxEmits]', () => {
      test('is defined correctly', () => {
        expect(useCheckboxEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns a render function', () => {
        let result

        wrapper = mount(
          defineComponent({
            props: useCheckboxProps,
            emits: useCheckboxEmits,
            setup() {
              result = useCheckbox('checkbox', getInner)
              return result
            }
          }),
          { props: { modelValue: false } }
        )

        expect(result).toBeTypeOf('function')
      })

      test('renders the inner content of the supplied getter', () => {
        mountCheckbox()

        expect(wrapper.find('.my-inner').exists()).toBe(true)
        expect(wrapper.get('.q-checkbox__inner').element).toBe(
          wrapper.get('.my-inner').element.parentElement
        )
      })

      test('names its classes after the supplied type', () => {
        mountCheckbox({ type: 'toggle' })

        expect(wrapper.classes()).toContain('q-toggle')
        expect(wrapper.find('.q-toggle__inner').exists()).toBe(true)
        expect(wrapper.attributes('role')).toBe('switch')
      })

      test('exposes the checkbox role by default', () => {
        mountCheckbox()

        expect(wrapper.attributes('role')).toBe('checkbox')
      })

      test.each([
        [{ modelValue: true }, 'true', 'truthy'],
        [{ modelValue: false }, 'false', 'falsy'],
        [{ modelValue: null }, 'mixed', 'indet']
      ])(
        'reports %o as aria-checked "%s"',
        (props, ariaChecked, innerState) => {
          mountCheckbox({ props })

          expect(wrapper.attributes('aria-checked')).toBe(ariaChecked)
          expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
            `q-checkbox__inner--${innerState}`
          )
        }
      )

      test('compares against the custom true/false values', () => {
        mountCheckbox({
          props: { modelValue: 'yes', trueValue: 'yes', falseValue: 'no' }
        })

        expect(wrapper.attributes('aria-checked')).toBe('true')
      })

      test('treats a value present in an array model as checked', () => {
        mountCheckbox({ props: { modelValue: ['a', 'b'], val: 'b' } })

        expect(wrapper.attributes('aria-checked')).toBe('true')
      })

      test('treats a value missing from an array model as unchecked', () => {
        mountCheckbox({ props: { modelValue: ['a'], val: 'b' } })

        expect(wrapper.attributes('aria-checked')).toBe('false')
      })

      test('toggles between the true and false values on click', async () => {
        mountCheckbox({ props: { modelValue: false } })

        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([true])

        await wrapper.setProps({ modelValue: true })
        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([true, false])
      })

      test('toggles the custom true and false values', async () => {
        mountCheckbox({
          props: { modelValue: 'no', trueValue: 'yes', falseValue: 'no' }
        })

        await wrapper.trigger('click')

        expect(getModelUpdates()).toStrictEqual(['yes'])
      })

      test('adds and removes the value of an array model', async () => {
        mountCheckbox({ props: { modelValue: ['a'], val: 'b' } })

        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([['a', 'b']])

        await wrapper.setProps({ modelValue: ['a', 'b'] })
        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([['a', 'b'], ['a']])
      })

      test('goes through the indeterminate value when asked to', async () => {
        // the default "tf" order cycles true -> false -> indeterminate
        mountCheckbox({
          props: { modelValue: true, toggleIndeterminate: true }
        })

        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([false])

        await wrapper.setProps({ modelValue: false })
        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([false, null])

        await wrapper.setProps({ modelValue: null })
        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([false, null, true])
      })

      test('skips the indeterminate value by default', async () => {
        mountCheckbox({ props: { modelValue: true } })

        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([false])

        await wrapper.setProps({ modelValue: false })
        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([false, true])
      })

      test('reverses the cycle with a "ft" toggle order', async () => {
        // "ft" cycles false -> true -> indeterminate
        mountCheckbox({
          props: {
            modelValue: null,
            toggleOrder: 'ft',
            toggleIndeterminate: true
          }
        })

        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([false])

        await wrapper.setProps({ modelValue: false })
        await wrapper.trigger('click')
        expect(getModelUpdates()).toStrictEqual([false, true])
      })

      test('uses a custom indeterminate value', async () => {
        mountCheckbox({
          props: {
            modelValue: false,
            toggleIndeterminate: true,
            indeterminateValue: 'maybe'
          }
        })

        await wrapper.trigger('click')

        expect(getModelUpdates()).toStrictEqual(['maybe'])
      })

      test.each([[13], [32]])(
        'toggles when releasing keyCode %i',
        async keyCode => {
          mountCheckbox()

          await wrapper.trigger('keyup', { keyCode })

          expect(getModelUpdates()).toStrictEqual([true])
        }
      )

      test('ignores the other keys', async () => {
        mountCheckbox()

        await wrapper.trigger('keyup', { keyCode: 65 })

        expect(getModelUpdates()).toBeUndefined()
      })

      test('exposes a toggle method on the component', async () => {
        mountCheckbox()

        wrapper.vm.toggle()
        await wrapper.vm.$nextTick()

        expect(getModelUpdates()).toStrictEqual([true])
      })

      test('does nothing when disabled', async () => {
        mountCheckbox({ props: { modelValue: false, disable: true } })

        await wrapper.trigger('click')

        expect(getModelUpdates()).toBeUndefined()
        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.attributes('tabindex')).toBe('-1')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
      })

      test('honors the tabindex prop', () => {
        mountCheckbox({ props: { modelValue: false, tabindex: 3 } })

        expect(wrapper.attributes('tabindex')).toBe('3')
      })

      test('renders the label prop', () => {
        mountCheckbox({ props: { modelValue: false, label: 'Accept' } })

        expect(wrapper.get('.q-checkbox__label').text()).toBe('Accept')
        expect(wrapper.attributes('aria-label')).toBe('Accept')
      })

      test('renders the default slot', () => {
        mountCheckbox({ slots: { default: () => 'Slot label' } })

        expect(wrapper.get('.q-checkbox__label').text()).toBe('Slot label')
      })

      test('renders the default slot next to the label prop', () => {
        mountCheckbox({
          props: { modelValue: false, label: 'Accept' },
          slots: { default: () => 'Slot label' }
        })

        const text = wrapper.get('.q-checkbox__label').text()
        expect(text).toContain('Accept')
        expect(text).toContain('Slot label')
      })

      test('renders no label element when there is nothing to show', () => {
        mountCheckbox()

        expect(wrapper.find('.q-checkbox__label').exists()).toBe(false)
      })

      test('puts the label first when asked to', () => {
        mountCheckbox({
          props: { modelValue: false, label: 'Accept', leftLabel: true }
        })

        expect(wrapper.classes()).toContain('reverse')
      })

      test('applies the dense modifier', () => {
        mountCheckbox({ props: { modelValue: false, dense: true } })

        expect(wrapper.classes()).toContain('q-checkbox--dense')
      })

      test('colors the inner part only when relevant', () => {
        mountCheckbox({ props: { modelValue: true, color: 'red' } })
        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'text-red'
        )

        wrapper.unmount()

        mountCheckbox({ props: { modelValue: false, color: 'red' } })
        expect(wrapper.get('.q-checkbox__inner').classes()).not.toContain(
          'text-red'
        )
      })

      test('always colors the inner part when told to keep the color', () => {
        mountCheckbox({
          props: { modelValue: false, color: 'red', keepColor: true }
        })

        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'text-red'
        )
      })

      test('injects a native form input when a name is supplied', () => {
        mountCheckbox({
          props: { modelValue: true, name: 'accept' }
        })

        const input = wrapper.get('input')

        expect(input.attributes('name')).toBe('accept')
        expect(input.attributes('type')).toBe('checkbox')
        expect(input.element.checked).toBe(true)
        expect(input.classes()).toContain('q-checkbox__native')
      })

      test('submits the val of an array model', () => {
        mountCheckbox({
          props: { modelValue: ['a'], val: 'a', name: 'letters' }
        })

        expect(wrapper.get('input').attributes('value')).toBe('a')
      })

      test('injects no form input when there is no name', () => {
        mountCheckbox()

        // nothing to submit means nothing to inject
        expect(wrapper.find('input').exists()).toBe(false)
      })

      test('injects no form input when disabled', () => {
        mountCheckbox({
          props: { modelValue: true, name: 'accept', disable: true }
        })

        expect(wrapper.find('input').exists()).toBe(false)
      })
    })
  })
})
