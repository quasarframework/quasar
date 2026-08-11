import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { h } from 'vue'

import QStep from './QStep.js'
import QStepper from './QStepper.js'

/**
 * QStep requires a QStepper parent; the step header is rendered by QStepper
 * when horizontal and by QStep itself when vertical.
 */
function mountStep(props = {}, { slots, stepperProps = {} } = {}) {
  return mount(QStepper, {
    props: { modelValue: 'first', ...stepperProps },
    slots: {
      default: () => [
        h(QStep, { name: 'first', title: 'First', ...props }, slots),
        h(QStep, { name: 'second', title: 'Second' })
      ]
    }
  })
}

function getHeader(wrapper) {
  return wrapper.get('.q-stepper__tab')
}

function getIconName(header) {
  return header.get('.q-stepper__dot .q-icon').text()
}

describe('[QStep API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type Any has effect', () => {
        const wrapper = mountStep({ name: 'first' })

        expect(wrapper.get('.q-stepper__step-inner')).toBeDefined()
        expect(getHeader(wrapper).classes()).toContain('q-stepper__tab--active')
      })

      test('selects the matching step', () => {
        const wrapper = mountStep(
          {},
          { stepperProps: { modelValue: 'second' } }
        )

        const [first, second] = wrapper.findAll('.q-stepper__tab')
        expect(first.classes()).not.toContain('q-stepper__tab--active')
        expect(second.classes()).toContain('q-stepper__tab--active')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStep(
          { disable: true },
          { stepperProps: { modelValue: 'second', headerNav: true } }
        )
        const header = getHeader(wrapper)

        expect(header.classes()).toContain('q-stepper__tab--disabled')
        // header navigation is turned off altogether for a disabled step
        expect(header.classes()).not.toContain('q-stepper__tab--navigation')
        expect(header.attributes('role')).toBeUndefined()

        await header.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountStep(
          { icon: 'map' },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getIconName(getHeader(wrapper))).toBe('map')
      })

      test('is superseded by the state icons', () => {
        const wrapper = mountStep({ icon: 'map' })

        // the step is active, so the active icon wins
        expect(getIconName(getHeader(wrapper))).not.toBe('map')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'

        expect(getHeader(mountStep()).classes()).not.toContain(
          `text-${propVal}`
        )

        const wrapper = mountStep({ color: propVal })

        expect(getHeader(wrapper).classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)title]', () => {
      test('type String has effect', () => {
        const wrapper = mountStep({ title: 'My step' })

        expect(getHeader(wrapper).get('.q-stepper__title').text()).toBe(
          'My step'
        )
      })
    })

    describe('[(prop)caption]', () => {
      test('type String has effect', () => {
        expect(
          getHeader(mountStep()).find('.q-stepper__caption').exists()
        ).toBe(false)

        const wrapper = mountStep({ caption: 'My caption' })

        expect(getHeader(wrapper).get('.q-stepper__caption').text()).toBe(
          'My caption'
        )
      })
    })

    describe('[(prop)prefix]', () => {
      test('type String has effect', () => {
        const wrapper = mountStep(
          { prefix: 'A' },
          { stepperProps: { modelValue: 'second' } }
        )
        const header = getHeader(wrapper)

        expect(header.get('.q-stepper__dot').text()).toBe('A')
        // the prefix replaces the icon
        expect(header.find('.q-stepper__dot .q-icon').exists()).toBe(false)
      })

      test('type Number has effect', () => {
        const wrapper = mountStep(
          { prefix: 1 },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getHeader(wrapper).get('.q-stepper__dot').text()).toBe('1')
      })

      test('is superseded by the active icon', () => {
        const wrapper = mountStep({ prefix: 'A' })

        expect(
          getHeader(wrapper).find('.q-stepper__dot .q-icon').exists()
        ).toBe(true)
      })

      test('is kept when the state icon is turned off', () => {
        const wrapper = mountStep(
          { prefix: 'A' },
          { stepperProps: { activeIcon: 'none' } }
        )

        expect(getHeader(wrapper).get('.q-stepper__dot').text()).toBe('A')
      })
    })

    describe('[(prop)done-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountStep(
          { done: true, doneIcon: 'alarm_on' },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getIconName(getHeader(wrapper))).toBe('alarm_on')
      })

      test('overrides the one of QStepper', () => {
        const wrapper = mountStep(
          { done: true, doneIcon: 'alarm_on' },
          { stepperProps: { modelValue: 'second', doneIcon: 'star' } }
        )

        expect(getIconName(getHeader(wrapper))).toBe('alarm_on')
      })
    })

    describe('[(prop)done-color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'
        const wrapper = mountStep(
          { done: true, doneColor: propVal },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getHeader(wrapper).classes()).toContain(`text-${propVal}`)
      })

      test('only applies to a done step', () => {
        const propVal = 'purple'
        const wrapper = mountStep(
          { doneColor: propVal },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getHeader(wrapper).classes()).not.toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)active-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountStep({ activeIcon: 'alarm_on' })

        expect(getIconName(getHeader(wrapper))).toBe('alarm_on')
      })

      test('only applies to the active step', () => {
        const wrapper = mountStep(
          { activeIcon: 'alarm_on' },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getIconName(getHeader(wrapper))).not.toBe('alarm_on')
      })
    })

    describe('[(prop)active-color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'
        const wrapper = mountStep({ activeColor: propVal })

        expect(getHeader(wrapper).classes()).toContain(`text-${propVal}`)
      })

      test('wins over the color prop', () => {
        const wrapper = mountStep({ color: 'red', activeColor: 'purple' })

        const classes = getHeader(wrapper).classes()
        expect(classes).toContain('text-purple')
        expect(classes).not.toContain('text-red')
      })
    })

    describe('[(prop)error-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountStep(
          { error: true, errorIcon: 'alarm_on' },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getIconName(getHeader(wrapper))).toBe('alarm_on')
      })
    })

    describe('[(prop)error-color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'
        const wrapper = mountStep(
          { error: true, errorColor: propVal },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getHeader(wrapper).classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)header-nav]', () => {
      test('type Boolean has effect', async () => {
        const stepperProps = { modelValue: 'second', headerNav: true }

        const navigable = mountStep({}, { stepperProps })
        expect(getHeader(navigable).classes()).toContain(
          'q-stepper__tab--navigation'
        )

        const wrapper = mountStep({ headerNav: false }, { stepperProps })
        const header = getHeader(wrapper)

        expect(header.classes()).not.toContain('q-stepper__tab--navigation')
        expect(header.attributes('role')).toBeUndefined()

        await header.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })

      test('lets the step be selected from its header', async () => {
        const wrapper = mountStep(
          {},
          { stepperProps: { modelValue: 'second', headerNav: true } }
        )

        await getHeader(wrapper).trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['first']])
      })
    })

    describe('[(prop)done]', () => {
      test('type Boolean has effect', () => {
        const stepperProps = { modelValue: 'second' }

        expect(
          getHeader(mountStep({}, { stepperProps })).classes()
        ).not.toContain('q-stepper__tab--done')

        const wrapper = mountStep({ done: true }, { stepperProps })

        expect(getHeader(wrapper).classes()).toContain('q-stepper__tab--done')
      })

      test('is ignored on a disabled step', () => {
        const wrapper = mountStep(
          { done: true, disable: true },
          { stepperProps: { modelValue: 'second' } }
        )

        expect(getHeader(wrapper).classes()).not.toContain(
          'q-stepper__tab--done'
        )
      })
    })

    describe('[(prop)error]', () => {
      test('type Boolean has effect', () => {
        const stepperProps = { modelValue: 'second' }

        expect(
          getHeader(mountStep({}, { stepperProps })).classes()
        ).not.toContain('q-stepper__tab--error')

        const wrapper = mountStep({ error: true }, { stepperProps })
        const classes = getHeader(wrapper).classes()

        expect(classes).toContain('q-stepper__tab--error')
        expect(classes).toContain('q-stepper__tab--error-with-icon')
      })

      test('is reported next to a prefix', () => {
        const wrapper = mountStep(
          { error: true, prefix: 'A' },
          { stepperProps: { modelValue: 'second', errorIcon: 'none' } }
        )

        expect(getHeader(wrapper).classes()).toContain(
          'q-stepper__tab--error-with-prefix'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountStep({}, { slots: () => slotContent })

        expect(wrapper.get('.q-stepper__step-inner').text()).toBe(slotContent)
      })

      test('is not rendered for an inactive vertical step', () => {
        const wrapper = mount(QStepper, {
          props: { modelValue: 'first', vertical: true },
          slots: {
            default: () => [
              h(QStep, { name: 'first', title: 'First' }, () => 'First body'),
              h(QStep, { name: 'second', title: 'Second' }, () => 'Second body')
            ]
          }
        })

        const bodies = wrapper.findAll('.q-stepper__step-inner')
        expect(bodies).toHaveLength(1)
        expect(bodies[0].text()).toBe('First body')
      })
    })
  })
})
