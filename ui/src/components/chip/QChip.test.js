import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QChip, { defaultSizes } from './QChip.js'

describe('[QChip API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dense]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.dense).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            dense: true
          }
        })

        expect(
          wrapper.classes()
        ).toContain('q-chip--dense')
      })
    })

    describe('[(prop)size]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.size).toBeDefined()
      })

      test('type String has effect', async () => {
        const wrapper = mount(QChip, {
          props: {
            size: '50px'
          }
        })

        expect(
          wrapper.get('.q-chip')
            .$style()
        ).toContain('font-size: 50px')

        await wrapper.setProps({ size: 'sm' })

        expect(
          wrapper.get('.q-chip')
            .$style()
        ).toContain(`font-size: ${ defaultSizes.sm }px;`)
      })
    })

    describe('[(prop)dark]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.dark).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            dark: true
          }
        })

        expect(
          wrapper.classes()
        ).toContain('q-chip--dark')
      })

      test('type null has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            dark: null
          }
        })

        expect(
          wrapper.classes()
        ).not.toContain('q-chip--dense')
      })
    })

    describe('[(prop)icon]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.icon).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'map'
        const wrapper = mount(QChip, {
          props: {
            icon: propVal
          }
        })

        expect(
          wrapper.text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)icon-right]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.iconRight).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'map'
        const wrapper = mount(QChip, {
          props: {
            iconRight: propVal
          }
        })

        expect(
          wrapper.text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)icon-remove]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.iconRemove).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'map'
        const wrapper = mount(QChip, {
          props: {
            removable: true,
            iconRemove: propVal
          }
        })

        expect(
          wrapper.get('.q-icon.q-chip__icon--remove')
            .text()
        ).toBe(propVal)
      })
    })

    describe('[(prop)icon-selected]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.iconSelected).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'map'
        const wrapper = mount(QChip, {
          props: {
            selected: true,
            iconSelected: propVal
          }
        })

        expect(
          wrapper.get('.q-chip.q-chip--selected')
            .get('.q-icon')
            .text()
        ).toBe(propVal)
      })
    })

    describe('[(prop)label]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.label).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'John Doe'
        const wrapper = mount(QChip, {
          props: {
            label: propVal
          }
        })

        expect(
          wrapper.get('.q-chip__content')
            .text()
        ).toBe(propVal)
      })

      test('type Number has effect', () => {
        const propVal = 10
        const wrapper = mount(QChip, {
          props: {
            label: propVal
          }
        })

        expect(
          wrapper.get('.q-chip')
            .get('.q-chip__content')
            .text()
        ).toBe('' + propVal)
      })
    })

    describe('[(prop)color]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.color).toBeDefined()
      })

      test('type String has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            color: 'red'
          }
        })

        expect(
          wrapper.classes()
        ).toContain('bg-red')
      })
    })

    describe('[(prop)text-color]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.textColor).toBeDefined()
      })

      test('type String has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            textColor: 'red'
          }
        })

        const cls = wrapper.classes()
        expect(cls).toContain('text-red')
        expect(cls).toContain('q-chip--colored')
      })
    })

    describe('[(prop)model-value]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.modelValue).toBeDefined()
      })

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

        expect(
          wrapper.find('.q-chip')
            .exists()
        ).toBe(false)
      })
    })

    describe('[(prop)selected]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.selected).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip, {
          props: {
            selected: true
          }
        })

        expect(
          wrapper.classes()
        ).toContain('q-chip--selected')
      })

      test('type null has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            selected: null
          }
        })

        expect(
          wrapper.classes()
        ).not.toContain('q-chip--selected')
      })
    })

    describe('[(prop)square]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.square).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            square: true
          }
        })

        expect(
          wrapper.classes()
        ).toContain('q-chip--square')

        expect(
          wrapper.get('.q-chip')
            .$computedStyle('border-radius')
        ).toBe('4px')
      })
    })

    describe('[(prop)outline]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.outline).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const propVal = true
        const wrapper = mount(QChip, {
          props: {
            outline: propVal
          }
        })

        expect(
          wrapper.classes()
        ).toContain('q-chip--outline')
      })
    })

    describe('[(prop)clickable]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.clickable).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            clickable: true
          }
        })

        const chip = wrapper.get('.q-chip')

        expect(
          chip.$computedStyle('cursor')
        ).toBe('pointer')

        expect(
          chip.attributes('tabindex')
        ).toBe('0')
      })
    })

    describe('[(prop)removable]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.removable).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QChip, {
          props: {
            removable: true
          }
        })

        expect(
          wrapper.find('.q-icon.q-chip__icon--remove')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)ripple]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.ripple).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QChip, {
          props: {
            ripple: true
          }
        })

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })

      test('type Object has effect', async () => {
        const propVal = { center: true }
        const wrapper = mount(QChip, {
          props: {
            ripple: propVal
          }
        })

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)remove-aria-label]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.removeAriaLabel).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'Remove item'
        const wrapper = mount(QChip, {
          props: {
            removable: true,
            removeAriaLabel: propVal
          }
        })

        const removeIcon = wrapper.get('.q-chip__icon--remove')

        expect(
          removeIcon.attributes('aria-label')
        ).toBe(propVal)

        expect(
          removeIcon.attributes('tabindex')
        ).toBe('0')
      })
    })

    describe('[(prop)tabindex]', () => {
      test('is defined correctly', () => {
        expect(QChip.props.tabindex).toBeDefined()
      })

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
      test('is defined correctly', () => {
        expect(QChip.props.disable).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const propVal = true
        const wrapper = mount(QChip, {
          props: {
            disable: propVal
          }
        })

        expect(
          wrapper.classes()
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
      test('is defined correctly', () => {
        expect(
          QChip.emits?.includes('click')
          ^ (QChip.props?.onClick !== void 0)
        ).toBe(1)
      })

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
      test('is defined correctly', () => {
        expect(
          QChip.emits?.includes('update:selected')
          ^ (QChip.props?.[ 'onUpdate:selected' ] !== void 0)
        ).toBe(1)
      })

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
      test('is defined correctly', () => {
        expect(
          QChip.emits?.includes('remove')
          ^ (QChip.props?.onRemove !== void 0)
        ).toBe(1)
      })

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
      test('is defined correctly', () => {
        expect(
          QChip.emits?.includes('update:modelValue')
          ^ (QChip.props?.[ 'onUpdate:modelValue' ] !== void 0)
        ).toBe(1)
      })

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
