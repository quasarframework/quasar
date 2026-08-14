import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCheckbox from '../checkbox/QCheckbox.js'
import QRadio from '../radio/QRadio.js'
import QToggle from '../toggle/QToggle.js'
import QOptionGroup from './QOptionGroup.js'

const options = [
  {
    label: 'First option',
    value: 'first',
    modelNumber: 1,
    itemName: 'First custom label',
    cannotSelect: false
  },
  {
    label: 'Second option',
    value: 'second',
    modelNumber: 2,
    itemName: 'Second custom label',
    cannotSelect: true
  }
]

function mountGroup(props, slots) {
  props ||= {}

  const type = props.type || 'radio'

  return mount(QOptionGroup, {
    props: {
      modelValue: type === 'radio' ? 'first' : ['first'],
      options,
      ...props
    },
    slots
  })
}

describe('[QOptionGroup API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountGroup({ size: '16px' })

        expect(wrapper.getComponent(QRadio).props('size')).toBe('16px')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountGroup({ modelValue: 'second' })
        const controls = wrapper.findAllComponents(QRadio)

        expect(controls[0].props('modelValue')).toBe('second')
        expect(controls[1].props('modelValue')).toBe('second')
        expect(controls[1].get('.q-radio').attributes('aria-checked')).toBe(
          'true'
        )
      })
    })

    describe('[(prop)options]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountGroup()

        expect(wrapper.findAllComponents(QRadio)).toHaveLength(2)

        await wrapper.setProps({
          options: [{ label: 'Only option', value: 'only' }]
        })

        expect(wrapper.findAllComponents(QRadio)).toHaveLength(1)
        expect(wrapper.text()).toContain('Only option')
      })
    })

    describe('[(prop)option-value]', () => {
      test('type Function has effect', () => {
        const wrapper = mountGroup({
          optionValue: item => item.modelNumber
        })

        expect(
          wrapper.findAllComponents(QRadio).map(control => control.props('val'))
        ).toStrictEqual([1, 2])
      })

      test('type String has effect', () => {
        const wrapper = mountGroup({ optionValue: 'modelNumber' })

        expect(
          wrapper.findAllComponents(QRadio).map(control => control.props('val'))
        ).toStrictEqual([1, 2])
      })
    })

    describe('[(prop)option-label]', () => {
      test('type Function has effect', () => {
        const wrapper = mountGroup({
          optionLabel: item => item.itemName
        })

        expect(wrapper.text()).toContain('First custom label')
        expect(wrapper.text()).toContain('Second custom label')
      })

      test('type String has effect', () => {
        const wrapper = mountGroup({ optionLabel: 'itemName' })

        expect(wrapper.text()).toContain('First custom label')
        expect(wrapper.text()).toContain('Second custom label')
      })
    })

    describe('[(prop)option-disable]', () => {
      test('type Function has effect', () => {
        const wrapper = mountGroup({
          optionDisable: item => item.cannotSelect
        })
        const controls = wrapper.findAllComponents(QRadio)

        expect(controls[0].props('disable')).toBe(false)
        expect(controls[1].props('disable')).toBe(true)
      })

      test('type String has effect', () => {
        const wrapper = mountGroup({ optionDisable: 'cannotSelect' })
        const controls = wrapper.findAllComponents(QRadio)

        expect(controls[0].props('disable')).toBe(false)
        expect(controls[1].props('disable')).toBe(true)
      })
    })

    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountGroup({ name: 'car_id' })
        const controls = wrapper.findAllComponents(QRadio)

        expect(
          controls.every(control => control.props('name') === 'car_id')
        ).toBe(true)
      })
    })

    describe('[(prop)type]', () => {
      test('value "radio" has effect', () => {
        const wrapper = mountGroup({ type: 'radio' })

        expect(wrapper.findAllComponents(QRadio)).toHaveLength(2)
        expect(wrapper.attributes('role')).toBe('radiogroup')
      })

      test('value "checkbox" has effect', () => {
        const wrapper = mountGroup({ type: 'checkbox' })

        expect(wrapper.findAllComponents(QCheckbox)).toHaveLength(2)
        expect(wrapper.attributes('role')).toBe('group')
      })

      test('value "toggle" has effect', () => {
        const wrapper = mountGroup({ type: 'toggle' })

        expect(wrapper.findAllComponents(QToggle)).toHaveLength(2)
        expect(wrapper.attributes('role')).toBe('group')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountGroup({ color: 'primary' })

        expect(wrapper.getComponent(QRadio).props('color')).toBe('primary')
      })
    })

    describe('[(prop)keep-color]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountGroup({ keepColor: true })

        expect(wrapper.getComponent(QRadio).props('keepColor')).toBe(true)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountGroup({ dark: true })

        expect(wrapper.getComponent(QRadio).props('dark')).toBe(true)
      })

      test('type null has effect', async () => {
        const wrapper = mountGroup({ dark: null })
        await wrapper.vm.$q.dark.set(false)

        expect(wrapper.getComponent(QRadio).props('dark')).toBe(false)

        await wrapper.vm.$q.dark.set(true)

        expect(wrapper.getComponent(QRadio).props('dark')).toBe(true)

        await wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountGroup({ dense: true })

        expect(wrapper.getComponent(QRadio).props('dense')).toBe(true)
      })
    })

    describe('[(prop)left-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountGroup({ leftLabel: true })

        expect(wrapper.getComponent(QRadio).props('leftLabel')).toBe(true)
      })
    })

    describe('[(prop)inline]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountGroup({ inline: true })

        expect(wrapper.classes()).toContain('q-option-group--inline')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountGroup({ disable: true })

        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(
          wrapper
            .findAllComponents(QRadio)
            .every(control => control.props('disable') === true)
        ).toBe(true)
      })

      test.each(['radio', 'checkbox', 'toggle'])(
        'announces a disabled "%s" group',
        type => {
          // aria-disabled is valid on the plain "group" role too, so it must
          // not depend on the group being a radiogroup
          expect(
            mountGroup({ type, disable: true }).attributes('aria-disabled')
          ).toBe('true')
          expect(
            mountGroup({ type }).attributes('aria-disabled')
          ).toBeUndefined()
        }
      )
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const scopes = []
        const wrapper = mountGroup(
          {},
          {
            label: scope => {
              scopes.push(scope)
              return `Generic ${scope.label}`
            }
          }
        )

        expect(wrapper.text()).toContain('Generic First option')
        expect(wrapper.text()).toContain('Generic Second option')
        expect(scopes).toStrictEqual(options)
      })
    })

    describe('[(slot)label-[name]]', () => {
      test('renders the content', () => {
        let slotScope
        const wrapper = mountGroup(
          {},
          {
            'label-0': scope => {
              slotScope = scope
              return 'Specific first label'
            },
            label: scope => `Generic ${scope.label}`
          }
        )

        expect(wrapper.text()).toContain('Specific first label')
        expect(wrapper.text()).toContain('Generic Second option')
        expect(slotScope).toMatchObject(options[0])
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountGroup()

        await wrapper.findAllComponents(QRadio)[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['second']])
      })
    })
  })

  describe('[Accessibility]', () => {
    const navOptions = [
      { label: 'First option', value: 'first' },
      { label: 'Second option', value: 'second', disable: true },
      { label: 'Third option', value: 'third' }
    ]

    function mountNavGroup(props) {
      return mount(QOptionGroup, {
        attachTo: document.body,
        props: {
          modelValue: navOptions[0].value,
          options: navOptions,
          ...props
        }
      })
    }

    function getTabindexes(wrapper) {
      return wrapper
        .findAll('.q-radio')
        .map(radio => radio.attributes('tabindex'))
    }

    test('the radio group has a single tab stop (roving tabindex)', async () => {
      const wrapper = mountNavGroup()

      // the checked radio is the tab stop
      expect(getTabindexes(wrapper)).toStrictEqual(['0', '-1', '-1'])

      await wrapper.setProps({ modelValue: navOptions[2].value })
      expect(getTabindexes(wrapper)).toStrictEqual(['-1', '-1', '0'])

      // without an (enabled) checked radio,
      // the first enabled one is the tab stop
      await wrapper.setProps({ modelValue: null })
      expect(getTabindexes(wrapper)).toStrictEqual(['0', '-1', '-1'])

      await wrapper.setProps({ modelValue: navOptions[1].value })
      expect(getTabindexes(wrapper)).toStrictEqual(['0', '-1', '-1'])
    })

    test('arrow keys move focus and selection, wrapping and skipping disabled radios', async () => {
      const wrapper = mountNavGroup()
      const radios = wrapper.findAll('.q-radio')

      radios[0].element.focus()

      // ArrowDown skips the disabled radio
      await radios[0].trigger('keydown', { keyCode: 40 })
      expect(document.activeElement).toBe(radios[2].element)
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([
        [navOptions[2].value]
      ])

      // ArrowRight wraps around
      await wrapper.setProps({ modelValue: navOptions[2].value })
      await radios[2].trigger('keydown', { keyCode: 39 })
      expect(document.activeElement).toBe(radios[0].element)
      expect(wrapper.emitted('update:modelValue')[1]).toStrictEqual([
        navOptions[0].value
      ])

      // ArrowUp wraps around backwards
      await wrapper.setProps({ modelValue: navOptions[0].value })
      await radios[0].trigger('keydown', { keyCode: 38 })
      expect(document.activeElement).toBe(radios[2].element)
      expect(wrapper.emitted('update:modelValue')[2]).toStrictEqual([
        navOptions[2].value
      ])
    })

    test('horizontal arrow keys are reversed in RTL', async () => {
      const wrapper = mountNavGroup()
      const radios = wrapper.findAll('.q-radio')

      wrapper.vm.$q.lang.rtl = true

      try {
        radios[0].element.focus()

        // ArrowLeft moves to the next radio in RTL
        await radios[0].trigger('keydown', { keyCode: 37 })
        expect(document.activeElement).toBe(radios[2].element)
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          [navOptions[2].value]
        ])
      } finally {
        wrapper.vm.$q.lang.rtl = false
      }
    })

    test('checkboxes and toggles each remain their own tab stop', async () => {
      for (const type of ['checkbox', 'toggle']) {
        const wrapper = mount(QOptionGroup, {
          attachTo: document.body,
          props: { modelValue: [], options, type }
        })
        const controls = wrapper.findAll(`.q-${type}`)

        expect(
          controls.map(control => control.attributes('tabindex'))
        ).toStrictEqual(['0', '0'])

        // arrow keys are left alone
        controls[0].element.focus()
        await controls[0].trigger('keydown', { keyCode: 40 })
        expect(document.activeElement).toBe(controls[0].element)
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      }
    })
  })
})
