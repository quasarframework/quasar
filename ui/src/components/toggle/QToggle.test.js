import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QToggle from './QToggle.js'

function mountToggle(props = {}, slots = {}) {
  return mount(QToggle, {
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

describe('[QToggle API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({
          modelValue: true,
          name: 'notifications'
        })
        const input = wrapper.get('input[type="checkbox"]')

        expect(input.attributes('name')).toBe('notifications')
        expect(input.attributes('value')).toBe('true')
        expect(input.element.checked).toBe(true)
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({ size: '16px' })

        expect(wrapper.get('.q-toggle__inner').$style('font-size')).toBe('16px')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountToggle({ modelValue: true })

        expect(wrapper.attributes('role')).toBe('switch')
        expect(wrapper.attributes('aria-checked')).toBe('true')
      })

      test('type Array has effect', () => {
        const wrapper = mountToggle({
          modelValue: ['car', 'building'],
          val: 'car'
        })

        expect(wrapper.attributes('aria-checked')).toBe('true')
      })
    })

    describe('[(prop)val]', () => {
      test('type Any has effect', () => {
        const wrapper = mountToggle({
          modelValue: ['car', 'building'],
          val: 'car'
        })

        expect(wrapper.get('.q-toggle__inner').classes()).toContain(
          'q-toggle__inner--truthy'
        )
      })
    })

    describe('[(prop)true-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountToggle({
          modelValue: 'Enabled',
          trueValue: 'Enabled'
        })

        expect(wrapper.attributes('aria-checked')).toBe('true')
      })
    })

    describe('[(prop)false-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountToggle({
          modelValue: 'Disabled',
          falseValue: 'Disabled'
        })

        expect(wrapper.attributes('aria-checked')).toBe('false')
      })
    })

    describe('[(prop)indeterminate-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountToggle({
          modelValue: 0,
          indeterminateValue: 0
        })

        expect(wrapper.attributes('aria-checked')).toBe('mixed')
      })
    })

    describe('[(prop)toggle-order]', () => {
      test('value "tf" has effect', async () => {
        const wrapper = mountToggle({
          modelValue: true,
          toggleIndeterminate: true,
          toggleOrder: 'tf'
        })

        await wrapper.trigger('click')

        expect(getUpdate(wrapper)[0]).toBe(false)
      })

      test('value "ft" has effect', async () => {
        const wrapper = mountToggle({
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
        const wrapper = mountToggle({
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
        const wrapper = mountToggle({ label: 'Notifications' })

        expect(wrapper.get('.q-toggle__label').text()).toBe('Notifications')
      })
    })

    describe('[(prop)left-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountToggle({ leftLabel: true })

        expect(wrapper.classes()).toContain('reverse')
      })
    })

    describe('[(prop)checked-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({
          modelValue: true,
          checkedIcon: 'visibility'
        })

        expect(wrapper.get('.q-toggle__thumb .q-icon').text()).toBe(
          'visibility'
        )
      })
    })

    describe('[(prop)unchecked-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({ uncheckedIcon: 'visibility_off' })

        expect(wrapper.get('.q-toggle__thumb .q-icon').text()).toBe(
          'visibility_off'
        )
      })
    })

    describe('[(prop)indeterminate-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({
          modelValue: null,
          indeterminateIcon: 'help'
        })

        expect(wrapper.get('.q-toggle__thumb .q-icon').text()).toBe('help')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({
          modelValue: true,
          color: 'primary'
        })

        expect(wrapper.get('.q-toggle__inner').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)keep-color]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountToggle({
          color: 'primary',
          keepColor: true
        })

        expect(wrapper.get('.q-toggle__inner').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountToggle({ dark: true })

        expect(wrapper.classes()).toContain('q-toggle--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountToggle({ dark: null })

        expect(wrapper.classes()).not.toContain('q-toggle--dark')

        try {
          wrapper.vm.$q.dark.set(true)
          await flushPromises()

          expect(wrapper.classes()).toContain('q-toggle--dark')
        } finally {
          wrapper.vm.$q.dark.set(false)
        }
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountToggle({ dense: true })

        expect(wrapper.classes()).toContain('q-toggle--dense')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountToggle({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')

        await wrapper.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const wrapper = mountToggle({ tabindex: 100 })

        expect(wrapper.attributes('tabindex')).toBe('100')
      })

      test('type String has effect', () => {
        const wrapper = mountToggle({ tabindex: '2' })

        expect(wrapper.attributes('tabindex')).toBe('2')
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({ icon: 'notifications' })

        expect(wrapper.get('.q-toggle__thumb .q-icon').text()).toBe(
          'notifications'
        )
      })
    })

    describe('[(prop)icon-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountToggle({
          modelValue: true,
          icon: 'notifications',
          iconColor: 'accent'
        })

        expect(wrapper.get('.q-toggle__thumb .q-icon').classes()).toContain(
          'text-accent'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountToggle(
          {},
          { default: () => 'Custom toggle label' }
        )

        expect(wrapper.get('.q-toggle__label').text()).toBe(
          'Custom toggle label'
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountToggle()

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
        const wrapper = mountToggle()

        expect(wrapper.vm.toggle()).toBeUndefined()
        expect(getUpdate(wrapper)[0]).toBe(true)
      })
    })
  })
})
