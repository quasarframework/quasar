import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import QStep from './QStep.js'
import QStepper from './QStepper.js'

function createCounter(name) {
  return defineComponent({
    name,
    data: () => ({ count: 0 }),
    template: `<button data-step="${name}" @click="count++">{{ count }}</button>`
  })
}

function mountStepper(props, steps, slots) {
  props ||= {}
  slots ||= {}

  const stepList = steps || [
    ['step-a', createCounter('StepA')],
    ['step-b', createCounter('StepB')],
    ['step-c', createCounter('StepC')]
  ]

  return mount(QStepper, {
    props: {
      modelValue: 'step-a',
      ...props
    },
    slots: {
      default: () =>
        stepList.map(([name, component, disable = false]) =>
          h(QStep, { name, title: name.toUpperCase(), disable }, () =>
            h(component)
          )
        ),
      ...slots
    }
  })
}

async function expectStepCached(filterProps) {
  const wrapper = mountStepper({ keepAlive: true, ...filterProps })

  await wrapper.get('button').trigger('click')
  expect(wrapper.get('button').text()).toBe('1')

  await wrapper.setProps({ modelValue: 'step-b' })
  await wrapper.setProps({ modelValue: 'step-a' })

  expect(wrapper.get('button').text()).toBe('1')
}

function getHeaders(wrapper) {
  return wrapper.findAll('.q-stepper__tab')
}

function getIconName(header) {
  return header.get('.q-stepper__dot .q-icon').text()
}

describe('[QStepper API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Any has effect', async () => {
        const wrapper = mountStepper()

        expect(wrapper.get('button').attributes('data-step')).toBe('StepA')

        await wrapper.setProps({ modelValue: 'step-b' })

        expect(wrapper.get('button').attributes('data-step')).toBe('StepB')
      })
    })

    describe('[(prop)keep-alive]', () => {
      test('type Boolean has effect', async () => {
        await expectStepCached({})
      })

      test('drops the state without it', async () => {
        const wrapper = mountStepper()

        await wrapper.get('button').trigger('click')
        await wrapper.setProps({ modelValue: 'step-b' })
        await wrapper.setProps({ modelValue: 'step-a' })

        expect(wrapper.get('button').text()).toBe('0')
      })
    })

    describe('[(prop)keep-alive-include]', () => {
      test('type String has effect', async () => {
        await expectStepCached({ keepAliveInclude: 'step-a' })
      })

      test('type Array has effect', async () => {
        await expectStepCached({ keepAliveInclude: ['step-a'] })
      })

      test('type RegExp has effect', async () => {
        await expectStepCached({ keepAliveInclude: /^step-a$/ })
      })
    })

    describe('[(prop)keep-alive-exclude]', () => {
      test('type String has effect', async () => {
        await expectStepCached({ keepAliveExclude: 'step-b' })
      })

      test('type Array has effect', async () => {
        await expectStepCached({ keepAliveExclude: ['step-b'] })
      })

      test('type RegExp has effect', async () => {
        await expectStepCached({ keepAliveExclude: /^step-b$/ })
      })
    })

    describe('[(prop)keep-alive-max]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountStepper({ keepAlive: true, keepAliveMax: 1 })

        await wrapper.get('button').trigger('click')
        await wrapper.setProps({ modelValue: 'step-b' })
        await wrapper.setProps({ modelValue: 'step-a' })

        expect(wrapper.get('button').text()).toBe('0')
      })
    })

    describe('[(prop)animated]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStepper({ animated: true })

        await wrapper.setProps({ modelValue: 'step-b' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--slide-left'
        )
      })

      test('renders no transition without it', () => {
        const wrapper = mountStepper()

        expect(wrapper.find('transition-stub').exists()).toBe(false)
      })
    })

    describe('[(prop)infinite]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountStepper({
          modelValue: 'step-c',
          infinite: true
        })

        wrapper.vm.next()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-a']])
      })

      test('stops at the last step without it', () => {
        const wrapper = mountStepper({ modelValue: 'step-c' })

        wrapper.vm.next()

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)swipeable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountStepper({ swipeable: true })
        const swipe = wrapper.get('.q-stepper__content').element.__qtouchswipe

        expect(swipe.direction.horizontal).toBe(true)
        swipe.handler({ direction: 'left' })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-b']])
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountStepper({ vertical: true })

        expect(wrapper.classes()).toContain('q-stepper--vertical')
        expect(wrapper.classes()).not.toContain('q-stepper--horizontal')
        // the headers move inside each step instead of a shared header row
        expect(wrapper.find('.q-stepper__header').exists()).toBe(false)
        expect(getHeaders(wrapper)).toHaveLength(3)
      })

      test('renders only the active step content', () => {
        const wrapper = mountStepper({ vertical: true })

        const bodies = wrapper.findAll('.q-stepper__step-inner')
        expect(bodies).toHaveLength(1)
        expect(bodies[0].get('button').attributes('data-step')).toBe('StepA')
      })
    })

    describe('[(prop)transition-prev]', () => {
      test('type String has effect', async () => {
        const wrapper = mountStepper({
          modelValue: 'step-b',
          animated: true,
          transitionPrev: 'fade'
        })

        await wrapper.setProps({ modelValue: 'step-a' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--fade'
        )
      })
    })

    describe('[(prop)transition-next]', () => {
      test('type String has effect', async () => {
        const wrapper = mountStepper({
          animated: true,
          transitionNext: 'fade'
        })

        await wrapper.setProps({ modelValue: 'step-b' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--fade'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', () => {
        const wrapper = mountStepper({ transitionDuration: '450' })

        expect(wrapper.get('.q-panel').attributes('style')).toContain(
          '--q-transition-duration: 450ms'
        )
      })

      test('type Number has effect', () => {
        const wrapper = mountStepper({ transitionDuration: 450 })

        expect(wrapper.get('.q-panel').attributes('style')).toContain(
          '--q-transition-duration: 450ms'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStepper()

        expect(wrapper.classes()).not.toContain('q-stepper--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-stepper--dark')
        expect(wrapper.classes()).toContain('q-dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountStepper({ dark: null })

        await wrapper.vm.$q.dark.set(true)
        expect(wrapper.classes()).toContain('q-stepper--dark')

        await wrapper.vm.$q.dark.set(false)
        expect(wrapper.classes()).not.toContain('q-stepper--dark')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStepper()

        expect(wrapper.classes()).not.toContain('q-stepper--flat')
        expect(wrapper.get('.q-stepper__header').classes()).toContain(
          'q-stepper__header--border'
        )

        await wrapper.setProps({ flat: true })

        expect(wrapper.classes()).toContain('q-stepper--flat')
        expect(wrapper.get('.q-stepper__header').classes()).not.toContain(
          'q-stepper__header--border'
        )
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStepper({ flat: true })

        expect(wrapper.classes()).not.toContain('q-stepper--bordered')

        await wrapper.setProps({ bordered: true })

        expect(wrapper.classes()).toContain('q-stepper--bordered')
        // a bordered header comes back even when flat
        expect(wrapper.get('.q-stepper__header').classes()).toContain(
          'q-stepper__header--border'
        )
      })
    })

    describe('[(prop)alternative-labels]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStepper()
        const header = wrapper.get('.q-stepper__header')

        expect(header.classes()).toContain('q-stepper__header--standard-labels')

        await wrapper.setProps({ alternativeLabels: true })

        expect(header.classes()).toContain(
          'q-stepper__header--alternative-labels'
        )
      })
    })

    describe('[(prop)header-nav]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStepper()
        const header = getHeaders(wrapper)[1]

        expect(header.classes()).not.toContain('q-stepper__tab--navigation')

        await wrapper.setProps({ headerNav: true })

        expect(header.classes()).toContain('q-stepper__tab--navigation')

        await header.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-b']])
      })
    })

    describe('[(prop)contracted]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountStepper()
        const header = wrapper.get('.q-stepper__header')

        expect(header.classes()).not.toContain('q-stepper__header--contracted')

        await wrapper.setProps({ contracted: true })

        expect(header.classes()).toContain('q-stepper__header--contracted')
      })
    })

    describe('[(prop)inactive-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountStepper({ inactiveIcon: 'alarm_on' })
        const [active, inactive] = getHeaders(wrapper)

        expect(getIconName(inactive)).toBe('alarm_on')
        expect(getIconName(active)).not.toBe('alarm_on')
      })
    })

    describe('[(prop)inactive-color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'
        const wrapper = mountStepper({ inactiveColor: propVal })
        const [active, inactive] = getHeaders(wrapper)

        expect(inactive.classes()).toContain(`text-${propVal}`)
        expect(active.classes()).not.toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)done-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountStepper(
          { modelValue: 'step-b', doneIcon: 'alarm_on' },
          [
            ['step-a', createCounter('StepA')],
            ['step-b', createCounter('StepB')]
          ]
        )

        // mark the first step as done through its own prop
        expect(getIconName(getHeaders(wrapper)[0])).not.toBe('alarm_on')

        const doneWrapper = mount(QStepper, {
          props: { modelValue: 'step-b', doneIcon: 'alarm_on' },
          slots: {
            default: () => [
              h(QStep, { name: 'step-a', title: 'A', done: true }),
              h(QStep, { name: 'step-b', title: 'B' })
            ]
          }
        })

        expect(getIconName(getHeaders(doneWrapper)[0])).toBe('alarm_on')
      })
    })

    describe('[(prop)done-color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'
        const wrapper = mount(QStepper, {
          props: { modelValue: 'step-b', doneColor: propVal },
          slots: {
            default: () => [
              h(QStep, { name: 'step-a', title: 'A', done: true }),
              h(QStep, { name: 'step-b', title: 'B' })
            ]
          }
        })

        expect(getHeaders(wrapper)[0].classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)active-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountStepper({ activeIcon: 'alarm_on' })
        const [active, inactive] = getHeaders(wrapper)

        expect(getIconName(active)).toBe('alarm_on')
        expect(getIconName(inactive)).not.toBe('alarm_on')
      })

      test('value "none" falls back to the inactive icon', () => {
        const wrapper = mountStepper({
          activeIcon: 'none',
          inactiveIcon: 'map'
        })

        expect(getIconName(getHeaders(wrapper)[0])).toBe('map')
      })
    })

    describe('[(prop)active-color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'
        const wrapper = mountStepper({ activeColor: propVal })
        const [active, inactive] = getHeaders(wrapper)

        expect(active.classes()).toContain(`text-${propVal}`)
        expect(inactive.classes()).not.toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)error-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QStepper, {
          props: { modelValue: 'step-b', errorIcon: 'alarm_on' },
          slots: {
            default: () => [
              h(QStep, { name: 'step-a', title: 'A', error: true }),
              h(QStep, { name: 'step-b', title: 'B' })
            ]
          }
        })

        expect(getIconName(getHeaders(wrapper)[0])).toBe('alarm_on')
      })
    })

    describe('[(prop)error-color]', () => {
      test('type String has effect', () => {
        const propVal = 'purple'
        const wrapper = mount(QStepper, {
          props: { modelValue: 'step-b', errorColor: propVal },
          slots: {
            default: () => [
              h(QStep, { name: 'step-a', title: 'A', error: true }),
              h(QStep, { name: 'step-b', title: 'B' })
            ]
          }
        })

        expect(getHeaders(wrapper)[0].classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)header-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-header-class'
        const wrapper = mountStepper()
        const header = wrapper.get('.q-stepper__header')

        expect(header.classes()).not.toContain(propVal)

        await wrapper.setProps({ headerClass: propVal })

        expect(header.classes()).toContain(propVal)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QStepper, {
          props: { modelValue: 'slot' },
          slots: {
            default: () =>
              h(QStep, { name: 'slot', title: 'Slot' }, () => slotContent)
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })

    describe('[(slot)navigation]', () => {
      test('renders the content', () => {
        const slotContent = 'some-navigation-content'
        const wrapper = mountStepper({}, void 0, {
          navigation: () => slotContent
        })

        expect(wrapper.text()).toContain(slotContent)
      })
    })

    describe('[(slot)message]', () => {
      test('renders the content', () => {
        const slotContent = 'some-message-content'
        const wrapper = mountStepper({}, void 0, {
          message: () => slotContent
        })

        expect(wrapper.text()).toContain(slotContent)
      })

      test('renders above the step content', () => {
        const wrapper = mountStepper({}, void 0, {
          message: () => h('div', { class: 'my-message' })
        })

        const message = wrapper.get('.my-message').element
        const content = wrapper.get('.q-stepper__content').element

        expect(
          message.compareDocumentPosition(content) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', () => {
        const wrapper = mountStepper()

        wrapper.vm.goTo('step-b')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-b']])
      })
    })

    describe('[(event)before-transition]', () => {
      test('is emitting', async () => {
        const wrapper = mountStepper()

        await wrapper.setProps({ modelValue: 'step-b' })

        expect(wrapper.emitted('beforeTransition')).toStrictEqual([
          ['step-b', 'step-a']
        ])
      })
    })

    describe('[(event)transition]', () => {
      test('is emitting', async () => {
        vi.useFakeTimers()
        const wrapper = mountStepper({ transitionDuration: 25 })

        await wrapper.setProps({ modelValue: 'step-b' })
        await vi.advanceTimersByTimeAsync(25)

        expect(wrapper.emitted('transition')).toStrictEqual([
          ['step-b', 'step-a']
        ])

        vi.useRealTimers()
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)next]', () => {
      test('should be callable', () => {
        const wrapper = mountStepper()

        expect(wrapper.vm.next()).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-b']])
      })

      test('skips a disabled step', () => {
        const wrapper = mountStepper({}, [
          ['step-a', createCounter('StepA')],
          ['step-b', createCounter('StepB'), true],
          ['step-c', createCounter('StepC')]
        ])

        wrapper.vm.next()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-c']])
      })
    })

    describe('[(method)previous]', () => {
      test('should be callable', () => {
        const wrapper = mountStepper({ modelValue: 'step-b' })

        expect(wrapper.vm.previous()).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-a']])
      })
    })

    describe('[(method)goTo]', () => {
      test('should be callable', () => {
        const wrapper = mountStepper()

        expect(wrapper.vm.goTo('step-c')).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['step-c']])
      })
    })
  })
})
