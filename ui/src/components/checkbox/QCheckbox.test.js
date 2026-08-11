import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCheckbox from './QCheckbox.js'

function mountCheckbox(props = {}, slots = {}) {
  return mount(QCheckbox, {
    props: {
      modelValue: false,
      ...props
    },
    slots
  })
}

function getUpdate(wrapper) {
  return wrapper.emitted('update:modelValue')[0]
}

describe('[QCheckbox API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: true,
          name: 'agreement'
        })
        const input = wrapper.get('input[type="checkbox"]')

        expect(input.attributes('name')).toBe('agreement')
        expect(input.attributes('value')).toBe('true')
        expect(input.element.checked).toBe(true)
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountCheckbox({ size: '16px' })

        expect(wrapper.get('.q-checkbox__inner').$style('font-size')).toBe(
          '16px'
        )
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountCheckbox({ modelValue: true })

        expect(wrapper.attributes('aria-checked')).toBe('true')
        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'q-checkbox__inner--truthy'
        )
      })

      test('type Array has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: ['car', 'building'],
          val: 'car'
        })

        expect(wrapper.attributes('aria-checked')).toBe('true')
      })
    })

    describe('[(prop)val]', () => {
      test('type Any has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: ['car', 'building'],
          val: 'car'
        })

        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'q-checkbox__inner--truthy'
        )
      })
    })

    describe('[(prop)true-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: 'Agreed',
          trueValue: 'Agreed'
        })

        expect(wrapper.attributes('aria-checked')).toBe('true')
      })
    })

    describe('[(prop)false-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: 'Disagree',
          falseValue: 'Disagree'
        })

        expect(wrapper.attributes('aria-checked')).toBe('false')
        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'q-checkbox__inner--falsy'
        )
      })
    })

    describe('[(prop)indeterminate-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: 0,
          indeterminateValue: 0
        })

        expect(wrapper.attributes('aria-checked')).toBe('mixed')
        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'q-checkbox__inner--indet'
        )
      })
    })

    describe('[(prop)toggle-order]', () => {
      test('value "tf" has effect', async () => {
        const wrapper = mountCheckbox({
          modelValue: true,
          toggleIndeterminate: true,
          toggleOrder: 'tf'
        })

        await wrapper.trigger('click')

        expect(getUpdate(wrapper)[0]).toBe(false)
      })

      test('value "ft" has effect', async () => {
        const wrapper = mountCheckbox({
          modelValue: true,
          toggleIndeterminate: true,
          toggleOrder: 'ft'
        })

        await wrapper.trigger('click')

        expect(getUpdate(wrapper)[0]).toBe(null)
      })
    })

    describe('[(prop)toggle-indeterminate]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCheckbox({
          modelValue: true,
          toggleIndeterminate: true,
          toggleOrder: 'ft'
        })

        await wrapper.trigger('click')

        expect(getUpdate(wrapper)[0]).toBe(null)
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mountCheckbox({
          label: 'I agree with the Terms and Conditions'
        })

        expect(wrapper.get('.q-checkbox__label').text()).toBe(
          'I agree with the Terms and Conditions'
        )
      })
    })

    describe('[(prop)left-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCheckbox({ leftLabel: true })

        expect(wrapper.classes()).toContain('reverse')
      })
    })

    describe('[(prop)checked-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: true,
          checkedIcon: 'visibility'
        })

        expect(wrapper.get('.q-checkbox__icon').text()).toBe('visibility')
      })
    })

    describe('[(prop)unchecked-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountCheckbox({ uncheckedIcon: 'visibility_off' })

        expect(wrapper.get('.q-checkbox__icon').text()).toBe('visibility_off')
      })
    })

    describe('[(prop)indeterminate-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: null,
          indeterminateIcon: 'help'
        })

        expect(wrapper.get('.q-checkbox__icon').text()).toBe('help')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountCheckbox({
          modelValue: true,
          color: 'primary'
        })

        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)keep-color]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCheckbox({
          color: 'primary',
          keepColor: true
        })

        expect(wrapper.get('.q-checkbox__inner').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCheckbox({ dark: true })

        expect(wrapper.classes()).toContain('q-checkbox--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountCheckbox({ dark: null })

        expect(wrapper.classes()).not.toContain('q-checkbox--dark')

        try {
          wrapper.vm.$q.dark.set(true)
          await flushPromises()

          expect(wrapper.classes()).toContain('q-checkbox--dark')
        } finally {
          wrapper.vm.$q.dark.set(false)
        }
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCheckbox({ dense: true })

        expect(wrapper.classes()).toContain('q-checkbox--dense')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCheckbox({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(wrapper.attributes('tabindex')).toBe('-1')

        await wrapper.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const wrapper = mountCheckbox({ tabindex: 100 })

        expect(wrapper.attributes('tabindex')).toBe('100')
      })

      test('type String has effect', () => {
        const wrapper = mountCheckbox({ tabindex: '2' })

        expect(wrapper.attributes('tabindex')).toBe('2')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountCheckbox(
          {},
          { default: () => 'Custom checkbox label' }
        )

        expect(wrapper.get('.q-checkbox__label').text()).toBe(
          'Custom checkbox label'
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountCheckbox()

        await wrapper.trigger('click')

        const [value, evt] = getUpdate(wrapper)
        expect(value).toBe(true)
        expect(evt).toBeInstanceOf(Event)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)toggle]', () => {
      test('should be callable', () => {
        const wrapper = mountCheckbox()

        expect(wrapper.vm.toggle()).toBeUndefined()
        expect(getUpdate(wrapper)[0]).toBe(true)
      })
    })
  })
})
