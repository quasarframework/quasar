import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QChip, { defaultSizes } from './QChip.js'

describe('[QChip API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.classes()
        ).not.toContain('q-chip--dense')

        await wrapper.setProps({ dense: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-chip--dense')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.$style('font-size')
        ).not.toBe('100px')

        await wrapper.setProps({ size: '100px' })
        await flushPromises()

        expect(
          target.$style('font-size')
        ).toBe('100px')

        await wrapper.setProps({ size: 'sm' })

        expect(
          target.$style('font-size')
        ).toBe(`${ defaultSizes.sm }px`)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.classes()
        ).not.toContain('q-chip--dark')

        await wrapper.setProps({ dark: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-chip--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.classes()
        ).not.toContain('q-chip--dense')

        await wrapper.setProps({ dark: null })
        await flushPromises()

        expect(
          target.classes()
        ).not.toContain('q-chip--dense')
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QChip)

        expect(
          wrapper.find('.q-icon').exists()
        ).toBe(false)

        await wrapper.setProps({ icon: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-icon').text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)icon-right]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QChip)

        expect(
          wrapper.find('.q-icon').exists()
        ).toBe(false)

        await wrapper.setProps({ iconRight: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-icon').text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)icon-remove]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QChip)

        expect(
          wrapper.find('.q-icon').exists()
        ).toBe(false)

        await wrapper.setProps({
          removable: true,
          iconRemove: propVal
        })
        await flushPromises()

        expect(
          wrapper.get('.q-icon.q-chip__icon--remove')
            .text()
        ).toBe(propVal)
      })
    })

    describe('[(prop)icon-selected]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QChip)

        expect(
          wrapper.find('.q-icon').exists()
        ).toBe(false)

        await wrapper.setProps({
          selected: true,
          iconSelected: propVal
        })
        await flushPromises()

        expect(
          wrapper.get('.q-chip.q-chip--selected')
            .get('.q-icon')
            .text()
        ).toBe(propVal)
      })
    })

    describe('[(prop)label]', () => {
      test.each([
        [ 'String', 'John Doe' ],
        [ 'Number', 22 ]
      ])('type %s has effect', async (_, propVal) => {
        const wrapper = mount(QChip)

        expect(
          wrapper.get('.q-chip__content')
            .text()
        ).not.toBe('' + propVal)

        await wrapper.setProps({ label: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-chip__content')
            .text()
        ).toBe('' + propVal)
      })
    })

    describe('[(prop)color]', () => {
      test('with default design', async () => {
        const propVal = 'red'
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        let cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')

        await wrapper.setProps({ color: propVal })
        await flushPromises()

        cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).toContain('bg-red')
      })

      test('with outline design', async () => {
        const propVal = 'red'
        const wrapper = mount(QChip, {
          props: {
            outline: true
          }
        })

        const target = wrapper.get('.q-chip')

        let cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')

        await wrapper.setProps({ color: propVal })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
      })
    })

    describe('[(prop)text-color]', () => {
      test('with default design', async () => {
        const propVal = 'red'
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        let cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('q-chip--colored')

        await wrapper.setProps({ textColor: propVal })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).toContain('q-chip--colored')
      })

      test('with default design + color', async () => {
        const propVal = 'red'
        const wrapper = mount(QChip, {
          props: {
            color: 'blue'
          }
        })

        const target = wrapper.get('.q-chip')

        let cls = target.classes()
        expect(cls).not.toContain('text-blue')
        expect(cls).toContain('bg-blue')
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('q-chip--colored')

        await wrapper.setProps({ textColor: propVal })
        await flushPromises()

        cls = target.classes()
        expect(cls).not.toContain('text-blue')
        expect(cls).toContain('bg-blue')
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).toContain('q-chip--colored')
      })

      test('with outline design', async () => {
        const propVal = 'red'
        const wrapper = mount(QChip, {
          props: {
            outline: true
          }
        })

        const target = wrapper.get('.q-chip')

        let cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('q-chip--colored')

        await wrapper.setProps({ textColor: propVal })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).toContain('q-chip--colored')
      })

      test('with outline design + color', async () => {
        const propVal = 'red'
        const wrapper = mount(QChip, {
          props: {
            color: 'blue',
            outline: true
          }
        })

        const target = wrapper.get('.q-chip')

        let cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).toContain('text-blue')
        expect(cls).not.toContain('bg-blue')
        expect(cls).toContain('q-chip--colored')

        await wrapper.setProps({ textColor: propVal })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('text-blue')
        expect(cls).not.toContain('bg-blue')
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).toContain('q-chip--colored')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip, {
          props: {
            modelValue: true
          }
        })

        expect(
          wrapper.find('.q-chip').exists()
        ).toBe(true)

        await wrapper.setProps({ modelValue: false })
        await flushPromises()

        expect(
          wrapper.find('.q-chip')
            .exists()
        ).toBe(false)
      })
    })

    describe('[(prop)selected]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.classes()
        ).not.toContain('q-chip--selected')

        await wrapper.setProps({
          selected: true,
          'onUpdate:selected': val => { wrapper.setProps({ selected: val }) }
        })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-chip--selected')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.classes()
        ).not.toContain('q-chip--selected')

        await wrapper.setProps({
          selected: null,
          'onUpdate:selected': val => { wrapper.setProps({ selected: val }) }
        })
        await flushPromises()

        expect(
          target.classes()
        ).not.toContain('q-chip--selected')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.classes()
        ).not.toContain('q-chip--square')

        await wrapper.setProps({ square: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-chip--square')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('4px')
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.classes()
        ).not.toContain('q-chip--outline')

        await wrapper.setProps({ outline: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-chip--outline')
      })
    })

    describe('[(prop)clickable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)
        const target = wrapper.get('.q-chip')

        expect(
          target.attributes('tabindex')
        ).toBeUndefined()

        await wrapper.setProps({ clickable: true })
        await flushPromises()

        expect(
          target.attributes('tabindex')
        ).toBe('0')

        expect(
          target.$computedStyle('cursor')
        ).toBe('pointer')
      })
    })

    describe('[(prop)removable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)

        expect(
          wrapper.find('.q-icon.q-chip__icon--remove')
            .exists()
        ).not.toBe(true)

        await wrapper.setProps({ removable: true })
        await flushPromises()

        expect(
          wrapper.find('.q-icon.q-chip__icon--remove')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)ripple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(false)

        await wrapper.setProps({ ripple: true })
        await flushPromises()

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })

      test('type Object has effect', async () => {
        const propVal = { center: true, color: 'teal', keyCodes: [] }
        const wrapper = mount(QChip)

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(false)

        await wrapper.setProps({ ripple: propVal })
        await flushPromises()

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)remove-aria-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Remove item'
        const wrapper = mount(QChip, {
          props: {
            removable: true
          }
        })

        const removeIcon = wrapper.get('.q-chip__icon--remove')

        expect(
          removeIcon.attributes('aria-label')
        ).not.toBe(propVal)

        await wrapper.setProps({ removeAriaLabel: propVal })
        await flushPromises()

        expect(
          removeIcon.attributes('aria-label')
        ).toBe(propVal)

        expect(
          removeIcon.attributes('tabindex')
        ).toBe('0')
      })
    })

    describe('[(prop)tabindex]', () => {
      test.each([
        [ 'Number', 100 ],
        [ 'String', '100' ]
      ])('type %s has effect', async (_, propVal) => {
        const wrapper = mount(QChip, {
          props: {
            clickable: true,
            tabindex: propVal
          }
        })

        expect(
          wrapper.attributes('tabindex')
        ).toBe('' + propVal)

        // we'll test clickable + disable
        await wrapper.setProps({ disable: true })
        await flushPromises()

        expect(
          wrapper.attributes('tabindex')
        ).toBeUndefined()

        expect(
          wrapper.attributes('aria-disabled')
        ).toBeUndefined()

        // we'll now test removable + disable
        await wrapper.setProps({
          clickable: false,
          removable: true
        })
        await flushPromises()

        let removeIcon = wrapper.get('.q-chip__icon--remove')

        expect(
          removeIcon.attributes('tabindex')
        ).toBe('-1')

        expect(
          removeIcon.attributes('aria-disabled')
        ).toBe('true')

        // we'll now test removable
        await wrapper.setProps({ disable: false })
        await flushPromises()

        removeIcon = wrapper.get('.q-chip__icon--remove')

        expect(
          removeIcon.attributes('tabindex')
        ).toBe('' + propVal)

        expect(
          removeIcon.attributes('aria-disabled')
        ).toBeUndefined()
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip)

        expect(
          wrapper.get('.q-chip').classes()
        ).not.toContain('disabled')

        await wrapper.setProps({ disable: true })
        await flushPromises()

        expect(
          wrapper.get('.q-chip').classes()
        ).toContain('disabled')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QChip, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('is emitting when clickable', async () => {
        const wrapper = mount(QChip, {
          props: {
            clickable: true
          }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [ evt ] = eventList.click[ 0 ]
        expect(evt).toBeInstanceOf(Event)
      })

      test('is emitting when selected', async () => {
        const wrapper = mount(QChip, {
          props: {
            selected: true
          }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [ evt ] = eventList.click[ 0 ]
        expect(evt).toBeInstanceOf(Event)
      })

      test('is NOT emitting when not clickable or removable', async () => {
        const wrapper = mount(QChip)

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).not.toHaveProperty('click')
      })

      test('is NOT emitting when disable + clickable', async () => {
        const wrapper = mount(QChip, {
          props: {
            clickable: true,
            disable: true
          }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).not.toHaveProperty('click')
      })

      test('is NOT emitting when disable + selected', async () => {
        const wrapper = mount(QChip, {
          props: {
            selected: true,
            disable: true
          }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).not.toHaveProperty('click')
      })
    })

    describe('[(event)update:selected]', () => {
      test('is emitting', async () => {
        const wrapper = mount(QChip, {
          props: {
            selected: false,
            'onUpdate:selected': val => {
              wrapper.setProps({ selected: val })
            }
          }
        })

        await wrapper.trigger('click')
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:selected')
        expect(eventList[ 'update:selected' ]).toHaveLength(1)

        const [ state ] = eventList[ 'update:selected' ][ 0 ]
        expect(state).toBeTypeOf('boolean')
      })

      test('is NOT emitting when disable', async () => {
        const wrapper = mount(QChip, {
          props: {
            disable: true,
            selected: false,
            'onUpdate:selected': val => {
              wrapper.setProps({ selected: val })
            }
          }
        })

        await wrapper.trigger('click')
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).not.toHaveProperty('update:selected')
      })
    })

    describe('[(event)remove]', () => {
      test('is emitting', async () => {
        const wrapper = mount(QChip, {
          props: {
            removable: true
          }
        })

        await wrapper.get('.q-chip__icon--remove')
          .trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('remove')
        expect(eventList.remove).toHaveLength(1)

        expect(eventList.remove[ 0 ]).toHaveLength(0)
      })
    })

    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mount(QChip, {
          props: {
            removable: true,
            modelValue: true,
            'onUpdate:modelValue': val => {
              wrapper.setProps({ modelValue: val })
            }
          }
        })

        await wrapper.get('.q-chip__icon--remove')
          .trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList[ 'update:modelValue' ]).toHaveLength(1)

        const [ value ] = eventList[ 'update:modelValue' ][ 0 ]
        expect(value).toBe(false)
      })
    })
  })
})
