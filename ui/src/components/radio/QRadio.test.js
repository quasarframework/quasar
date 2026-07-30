import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QRadio from './QRadio.js'

function mountRadio(props = {}, slots = {}) {
  return mount(QRadio, {
    props: {
      modelValue: 'other',
      val: 'car',
      ...props
    },
    slots
  })
}

function getUpdate(wrapper) {
  return wrapper.emitted('update:modelValue')[0]
}

describe('[QRadio API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountRadio({
          modelValue: 'car',
          name: 'vehicle'
        })
        const input = wrapper.get('input[type="radio"]')

        expect(input.attributes('name')).toBe('vehicle')
        expect(input.attributes('value')).toBe('car')
        expect(input.element.checked).toBe(true)
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountRadio({ size: '16px' })

        expect(wrapper.get('.q-radio__inner').$style('font-size')).toBe('16px')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountRadio({ modelValue: 'car' })

        expect(wrapper.attributes('aria-checked')).toBe('true')
        expect(wrapper.get('.q-radio__inner').classes()).toContain(
          'q-radio__inner--truthy'
        )
      })
    })

    describe('[(prop)val]', () => {
      test('type Any has effect', () => {
        const wrapper = mountRadio({
          modelValue: 50,
          val: 50
        })

        expect(wrapper.attributes('aria-checked')).toBe('true')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mountRadio({ label: 'Car' })

        expect(wrapper.get('.q-radio__label').text()).toBe('Car')
        expect(wrapper.attributes('aria-label')).toBe('Car')
      })
    })

    describe('[(prop)left-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountRadio({ leftLabel: true })

        expect(wrapper.classes()).toContain('reverse')
      })
    })

    describe('[(prop)checked-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountRadio({
          modelValue: 'car',
          checkedIcon: 'visibility'
        })

        expect(wrapper.get('.q-radio__icon').text()).toBe('visibility')
      })
    })

    describe('[(prop)unchecked-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountRadio({ uncheckedIcon: 'visibility_off' })

        expect(wrapper.get('.q-radio__icon').text()).toBe('visibility_off')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountRadio({
          modelValue: 'car',
          color: 'primary'
        })

        expect(wrapper.get('.q-radio__inner').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)keep-color]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountRadio({
          color: 'primary',
          keepColor: true
        })

        expect(wrapper.get('.q-radio__inner').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountRadio({ dark: true })

        expect(wrapper.classes()).toContain('q-radio--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountRadio({ dark: null })

        expect(wrapper.classes()).not.toContain('q-radio--dark')

        try {
          wrapper.vm.$q.dark.set(true)
          await flushPromises()

          expect(wrapper.classes()).toContain('q-radio--dark')
        } finally {
          wrapper.vm.$q.dark.set(false)
        }
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountRadio({ dense: true })

        expect(wrapper.classes()).toContain('q-radio--dense')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRadio({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(wrapper.attributes('tabindex')).toBe('-1')

        await wrapper.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const wrapper = mountRadio({ tabindex: 100 })

        expect(wrapper.attributes('tabindex')).toBe('100')
      })

      test('type String has effect', () => {
        const wrapper = mountRadio({ tabindex: '2' })

        expect(wrapper.attributes('tabindex')).toBe('2')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountRadio({}, { default: () => 'Custom radio label' })

        expect(wrapper.get('.q-radio__label').text()).toBe('Custom radio label')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountRadio()

        await wrapper.trigger('click')

        const [value, evt] = getUpdate(wrapper)
        expect(value).toBe('car')
        expect(evt).toBeInstanceOf(Event)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', () => {
        const wrapper = mountRadio()

        expect(wrapper.vm.set()).toBeUndefined()
        expect(getUpdate(wrapper)[0]).toBe('car')
      })
    })
  })
})
