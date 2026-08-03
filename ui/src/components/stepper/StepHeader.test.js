import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QIcon from '../icon/QIcon.js'
import StepHeader from './StepHeader.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

function mountStepHeader({ stepper, step, attrs } = {}) {
  const goToPanel = vi.fn()

  wrapper = mount(StepHeader, {
    props: {
      stepper: { modelValue: 'first', ...stepper },
      step: { name: 'first', title: 'First step', ...step },
      goToPanel
    },
    attrs
  })

  return { goToPanel }
}

function getIconName() {
  return wrapper.findComponent(QIcon).props('name')
}

describe('[StepHeader API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)default]', () => {
      test('is defined correctly', () => {
        expect(StepHeader).toBeTypeOf('object')
        expect(StepHeader.name).toBe('StepHeader')
        expect(StepHeader.props).$props()
        expect(StepHeader.setup).toBeTypeOf('function')
      })

      test('renders the dot, the title and the caption', () => {
        mountStepHeader({ step: { caption: 'Some caption' } })

        expect(wrapper.get('.q-stepper__dot')).toBeDefined()
        expect(wrapper.get('.q-stepper__title').text()).toBe('First step')
        expect(wrapper.get('.q-stepper__caption').text()).toBe('Some caption')
      })

      test.each([
        ['no title', {}],
        ['a null title', { title: null }]
      ])('skips the label when there is %s', (_, step) => {
        mountStepHeader({ step: { title: void 0, ...step } })

        expect(wrapper.find('.q-stepper__label').exists()).toBe(false)
      })

      test('leaves out the caption when there is none', () => {
        mountStepHeader()

        expect(wrapper.find('.q-stepper__caption').exists()).toBe(false)
      })

      test.each([
        ['the active icon', { modelValue: 'first' }, {}, 'edit'],
        ['the error icon', { modelValue: 'other' }, { error: true }, 'warning'],
        ['the done icon', { modelValue: 'other' }, { done: true }, 'check'],
        [
          'the stepper inactive icon',
          { modelValue: 'other', inactiveIcon: 'circle' },
          {},
          'circle'
        ],
        [
          'the step icon',
          { modelValue: 'other', inactiveIcon: 'circle' },
          { icon: 'star' },
          'star'
        ]
      ])('shows %s', (_, stepper, step, expected) => {
        mountStepHeader({ stepper, step })

        expect(getIconName()).toBe(expected)
      })

      test.each([
        ['stepper level', { modelValue: 'first', activeIcon: 'bolt' }, {}],
        ['step level', { modelValue: 'first' }, { activeIcon: 'bolt' }]
      ])('lets the %s icon win', (_, stepper, step) => {
        mountStepHeader({ stepper, step })

        expect(getIconName()).toBe('bolt')
      })

      test.each([
        ['active', { modelValue: 'first', activeIcon: 'none' }, {}],
        [
          'erroring',
          { modelValue: 'other', errorIcon: 'none' },
          { error: true }
        ],
        ['done', { modelValue: 'other', doneIcon: 'none' }, { done: true }]
      ])('falls back to the default icon for a %s step', (_, stepper, step) => {
        mountStepHeader({
          stepper: { inactiveIcon: 'circle', ...stepper },
          step
        })

        expect(getIconName()).toBe('circle')
      })

      test('renders the prefix instead of a disabled icon', () => {
        mountStepHeader({
          stepper: { modelValue: 'first', activeIcon: 'none' },
          step: { prefix: '1' }
        })

        expect(wrapper.findComponent(QIcon).exists()).toBe(false)
        expect(wrapper.get('.q-stepper__dot').text()).toBe('1')
      })

      test('prefers the icon over the prefix', () => {
        mountStepHeader({ step: { prefix: '1' } })

        expect(getIconName()).toBe('edit')
      })

      test.each([
        ['active', { modelValue: 'first' }, {}, 'q-stepper__tab--active'],
        [
          'done',
          { modelValue: 'other' },
          { done: true },
          'q-stepper__tab--done'
        ],
        [
          'erroring',
          { modelValue: 'other' },
          { error: true },
          'q-stepper__tab--error'
        ],
        [
          'disabled',
          { modelValue: 'other' },
          { disable: true },
          'q-stepper__tab--disabled'
        ]
      ])('flags a %s step', (_, stepper, step, className) => {
        mountStepHeader({ stepper, step })

        expect(wrapper.classes()).toContain(className)
      })

      test.each([
        ['icon', {}, 'q-stepper__tab--error-with-icon'],
        ['prefix', { prefix: '1' }, 'q-stepper__tab--error-with-prefix']
      ])('marks an erroring step rendered with an %s', (_, step, className) => {
        mountStepHeader({
          stepper: { modelValue: 'other', errorIcon: 'none' },
          step: { error: true, ...step }
        })

        expect(wrapper.classes()).toContain(className)
      })

      test('does not consider a disabled step as done', () => {
        mountStepHeader({
          stepper: { modelValue: 'other' },
          step: { done: true, disable: true }
        })

        expect(wrapper.classes()).not.toContain('q-stepper__tab--done')
        expect(wrapper.classes()).toContain('q-stepper__tab--disabled')
      })

      test.each([
        ['an empty string', ''],
        ['true', true]
      ])('accepts %s as a boolean step flag', (_, value) => {
        mountStepHeader({
          stepper: { modelValue: 'other' },
          step: { done: value }
        })

        expect(wrapper.classes()).toContain('q-stepper__tab--done')
      })

      test.each([
        [
          'the active color',
          { modelValue: 'first', activeColor: 'purple' },
          {},
          'text-purple'
        ],
        [
          'the error color',
          { modelValue: 'other', errorColor: 'orange' },
          { error: true },
          'text-orange'
        ],
        [
          'the done color',
          { modelValue: 'other', doneColor: 'teal' },
          { done: true },
          'text-teal'
        ],
        [
          'the inactive color',
          { modelValue: 'other', inactiveColor: 'grey' },
          {},
          'text-grey'
        ],
        [
          'the step color',
          { modelValue: 'other', inactiveColor: 'grey' },
          { color: 'red' },
          'text-red'
        ]
      ])('paints with %s', (_, stepper, step, className) => {
        mountStepHeader({ stepper, step })

        expect(wrapper.classes()).toContain(className)
      })

      test('stays unpainted when no color applies', () => {
        mountStepHeader({ stepper: { modelValue: 'other' } })

        expect(wrapper.classes().some(cls => cls.startsWith('text-'))).toBe(
          false
        )
      })

      test('is inert unless the stepper allows header navigation', async () => {
        const { goToPanel } = mountStepHeader({
          stepper: { modelValue: 'other' }
        })

        expect(wrapper.classes()).not.toContain('q-stepper__tab--navigation')
        expect(wrapper.attributes('role')).toBeUndefined()
        expect(wrapper.attributes('tabindex')).toBeUndefined()

        await wrapper.trigger('click')
        expect(goToPanel).not.toHaveBeenCalled()
      })

      test('navigates on click when allowed', async () => {
        const { goToPanel } = mountStepHeader({
          stepper: { modelValue: 'other', headerNav: true },
          step: { name: 'second' }
        })

        expect(wrapper.classes()).toContain('q-stepper__tab--navigation')
        expect(wrapper.attributes('role')).toBe('button')
        expect(wrapper.attributes('tabindex')).toBe('0')

        await wrapper.trigger('click')

        expect(goToPanel).toHaveBeenCalledExactlyOnceWith('second')
      })

      test('does not navigate towards the step it is already on', async () => {
        const { goToPanel } = mountStepHeader({
          stepper: { modelValue: 'first', headerNav: true }
        })

        expect(wrapper.attributes('aria-current')).toBe('step')

        await wrapper.trigger('click')
        await wrapper.trigger('keyup', { keyCode: 13 })

        expect(goToPanel).not.toHaveBeenCalled()
      })

      test.each([
        ['ENTER', 13],
        ['SPACE', 32]
      ])('navigates on %s', async (_, keyCode) => {
        const { goToPanel } = mountStepHeader({
          stepper: { modelValue: 'other', headerNav: true },
          step: { name: 'second' }
        })

        await wrapper.trigger('keyup', { keyCode })

        expect(goToPanel).toHaveBeenCalledExactlyOnceWith('second')
      })

      test('ignores any other key', async () => {
        const { goToPanel } = mountStepHeader({
          stepper: { modelValue: 'other', headerNav: true }
        })

        await wrapper.trigger('keyup', { keyCode: 27 })

        expect(goToPanel).not.toHaveBeenCalled()
      })

      test.each([
        ['SPACE', 32, true],
        ['ENTER', 13, false]
      ])('prevents the default %s keydown: %s', (_, keyCode, prevented) => {
        mountStepHeader({
          stepper: { modelValue: 'other', headerNav: true }
        })

        const event = new Event('keydown', { cancelable: true })
        Object.defineProperty(event, 'keyCode', { value: keyCode })
        wrapper.element.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(prevented)
      })

      test.each([
        ['the step opts out', { headerNav: false }, {}],
        ['the step is disabled', { disable: true }, {}]
      ])('turns navigation off when %s', async (_, step) => {
        const { goToPanel } = mountStepHeader({
          stepper: { modelValue: 'other', headerNav: true },
          step
        })

        expect(wrapper.classes()).not.toContain('q-stepper__tab--navigation')

        await wrapper.trigger('click')
        expect(goToPanel).not.toHaveBeenCalled()
      })

      test('honors the tabindex coming from the parent', () => {
        mountStepHeader({
          stepper: { modelValue: 'other', headerNav: true },
          attrs: { tabindex: 3 }
        })

        expect(wrapper.attributes('tabindex')).toBe('3')
      })

      test('blurs the focus helper before navigating', async () => {
        const { goToPanel } = mountStepHeader({
          stepper: { modelValue: 'other', headerNav: true },
          step: { name: 'second' }
        })

        const helper = wrapper.get('.q-focus-helper')
        const focus = vi.spyOn(helper.element, 'focus')

        await wrapper.trigger('click')

        expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true })
        expect(goToPanel).toHaveBeenCalledOnce()
      })
    })
  })
})
