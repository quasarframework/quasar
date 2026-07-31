import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import { getRouter } from 'testing/runtime/router.js'

import QFab from './QFab.js'

function mountFab(props = {}, slots = {}, global = {}) {
  return mount(QFab, {
    props,
    slots,
    global
  })
}

function getTrigger(wrapper) {
  return wrapper.get('.q-btn')
}

function getLabel(wrapper) {
  return wrapper.get('.q-fab__label')
}

function expectButtonType(wrapper, type) {
  const button = getTrigger(wrapper)

  if (type === 'a') {
    expect(button.element.tagName).toBe('A')
    expect(button.attributes('type')).toBeUndefined()
  } else {
    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('type')).toBe(type)
  }
}

describe('[QFab API]', () => {
  describe('[Props]', () => {
    describe('[(prop)type]', () => {
      test('value "a" has effect', () => {
        expectButtonType(mountFab({ type: 'a' }), 'a')
      })

      test('value "submit" has effect', () => {
        expectButtonType(mountFab({ type: 'submit' }), 'submit')
      })

      test('value "button" has effect', () => {
        expectButtonType(mountFab({ type: 'button' }), 'button')
      })

      test('value "reset" has effect', () => {
        expectButtonType(mountFab({ type: 'reset' }), 'reset')
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ outline: true })

        expect(getTrigger(wrapper).classes()).toContain('q-btn--outline')
      })
    })

    describe('[(prop)push]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ push: true })

        expect(getTrigger(wrapper).classes()).toContain('q-btn--push')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ flat: true })

        expect(getTrigger(wrapper).classes()).toContain('q-btn--flat')
      })
    })

    describe('[(prop)unelevated]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ unelevated: true })

        expect(getTrigger(wrapper).classes()).toContain('q-btn--unelevated')
      })
    })

    describe('[(prop)padding]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({ padding: '4px 8px' })

        expect(getTrigger(wrapper).$style('padding')).toBe('4px 8px')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({ color: 'primary' })

        expect(getTrigger(wrapper).classes()).toContain('bg-primary')
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({ textColor: 'dark' })

        expect(getTrigger(wrapper).classes()).toContain('text-dark')
      })
    })

    describe('[(prop)glossy]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ glossy: true })

        expect(getTrigger(wrapper).classes()).toContain('glossy')
      })
    })

    describe('[(prop)external-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({
          externalLabel: true,
          label: 'Create'
        })

        expect(getLabel(wrapper).classes()).toContain('q-fab__label--external')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({ label: 'Create' })

        expect(getLabel(wrapper).text()).toBe('Create')
      })

      test('type Number has effect', () => {
        const wrapper = mountFab({ label: 42 })

        expect(getLabel(wrapper).text()).toBe('42')
      })
    })

    describe('[(prop)label-position]', () => {
      test('value "top" has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelPosition: 'top'
        })

        expect(getLabel(wrapper).classes()).toContain(
          'q-fab__label--internal-top'
        )
      })

      test('value "right" has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelPosition: 'right'
        })

        expect(getLabel(wrapper).classes()).toContain(
          'q-fab__label--internal-right'
        )
      })

      test('value "bottom" has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelPosition: 'bottom'
        })

        expect(getLabel(wrapper).classes()).toContain(
          'q-fab__label--internal-bottom'
        )
      })

      test('value "left" has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelPosition: 'left'
        })

        expect(getLabel(wrapper).classes()).toContain(
          'q-fab__label--internal-left'
        )
      })
    })

    describe('[(prop)hide-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({
          hideLabel: true,
          label: 'Create'
        })

        expect(getLabel(wrapper).classes()).toContain(
          'q-fab__label--internal-hidden'
        )
      })

      test('type null has effect', () => {
        const wrapper = mountFab({
          externalLabel: true,
          hideLabel: null,
          label: 'Create',
          modelValue: false
        })

        expect(getLabel(wrapper).classes()).toContain(
          'q-fab__label--external-hidden'
        )
      })
    })

    describe('[(prop)label-class]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelClass: 'custom-label'
        })

        expect(getLabel(wrapper).classes()).toContain('custom-label')
      })

      test('type Array has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelClass: ['custom-label', 'emphasis']
        })

        expect(getLabel(wrapper).classes()).toEqual(
          expect.arrayContaining(['custom-label', 'emphasis'])
        )
      })

      test('type Object has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelClass: {
            'custom-label': true,
            unused: false
          }
        })

        expect(getLabel(wrapper).classes()).toContain('custom-label')
        expect(getLabel(wrapper).classes()).not.toContain('unused')
      })
    })

    describe('[(prop)label-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelStyle: 'color: red'
        })

        expect(getLabel(wrapper).attributes('style')).toContain('color: red')
      })

      test('type Array has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelStyle: ['color: red', { fontSize: '12px' }]
        })

        expect(getLabel(wrapper).attributes('style')).toContain('color: red')
        expect(getLabel(wrapper).attributes('style')).toContain(
          'font-size: 12px'
        )
      })

      test('type Object has effect', () => {
        const wrapper = mountFab({
          label: 'Create',
          labelStyle: { color: 'red' }
        })

        expect(getLabel(wrapper).attributes('style')).toContain('color: red')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ square: true })

        expect(wrapper.classes()).toContain('q-fab--form-square')
        expect(getTrigger(wrapper).classes()).toContain('q-btn--square')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFab({ disable: true })

        expect(getTrigger(wrapper).attributes('aria-disabled')).toBe('true')

        await getTrigger(wrapper).trigger('click')

        expect(wrapper.classes()).toContain('q-fab--closed')
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const wrapper = mountFab({ tabindex: 100 })

        expect(getTrigger(wrapper).attributes('tabindex')).toBe('100')
      })

      test('type String has effect', () => {
        const wrapper = mountFab({ tabindex: '2' })

        expect(getTrigger(wrapper).attributes('tabindex')).toBe('2')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ modelValue: true })

        expect(wrapper.classes()).toContain('q-fab--opened')
        expect(getTrigger(wrapper).attributes('aria-expanded')).toBe('true')
        expect(
          wrapper.get('.q-fab__actions').attributes('aria-hidden')
        ).toBeUndefined()
      })

      test('type null has effect', () => {
        const wrapper = mountFab({ modelValue: null })

        expect(wrapper.classes()).toContain('q-fab--closed')
        expect(getTrigger(wrapper).attributes('aria-expanded')).toBe('false')
        expect(wrapper.get('.q-fab__actions').attributes('aria-hidden')).toBe(
          'true'
        )
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({ icon: 'add' })

        expect(wrapper.get('.q-fab__icon').text()).toBe('add')
      })
    })

    describe('[(prop)active-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountFab({ activeIcon: 'close' })

        expect(wrapper.get('.q-fab__active-icon').text()).toBe('close')
      })
    })

    describe('[(prop)hide-icon]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFab({ hideIcon: true })

        expect(wrapper.find('.q-fab__icon-holder').exists()).toBe(false)
      })
    })

    describe('[(prop)direction]', () => {
      test('value "up" has effect', () => {
        const wrapper = mountFab({ direction: 'up' })

        expect(wrapper.get('.q-fab__actions').classes()).toContain(
          'q-fab__actions--up'
        )
      })

      test('value "right" has effect', () => {
        const wrapper = mountFab({ direction: 'right' })

        expect(wrapper.get('.q-fab__actions').classes()).toContain(
          'q-fab__actions--right'
        )
      })

      test('value "down" has effect', () => {
        const wrapper = mountFab({ direction: 'down' })

        expect(wrapper.get('.q-fab__actions').classes()).toContain(
          'q-fab__actions--down'
        )
      })

      test('value "left" has effect', () => {
        const wrapper = mountFab({ direction: 'left' })

        expect(wrapper.get('.q-fab__actions').classes()).toContain(
          'q-fab__actions--left'
        )
      })
    })

    describe('[(prop)vertical-actions-align]', () => {
      test('value "left" has effect', () => {
        const wrapper = mountFab({ verticalActionsAlign: 'left' })

        expect(wrapper.classes()).toContain('q-fab--align-left')
      })

      test('value "center" has effect', () => {
        const wrapper = mountFab({ verticalActionsAlign: 'center' })

        expect(wrapper.classes()).toContain('q-fab--align-center')
      })

      test('value "right" has effect', () => {
        const wrapper = mountFab({ verticalActionsAlign: 'right' })

        expect(wrapper.classes()).toContain('q-fab--align-right')
      })
    })

    describe('[(prop)persistent]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter(['/one', '/two'])
        const wrapper = mountFab(
          { persistent: true },
          {},
          { plugins: [router] }
        )

        wrapper.vm.show()
        await router.push('/two')

        expect(wrapper.classes()).toContain('q-fab--opened')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountFab(
          {},
          { default: () => 'Floating action content' }
        )

        expect(wrapper.get('.q-fab__actions').text()).toBe(
          'Floating action content'
        )
      })
    })

    describe('[(slot)tooltip]', () => {
      test('renders the content', () => {
        const wrapper = mountFab({}, { tooltip: () => 'Create a new record' })

        expect(getTrigger(wrapper).text()).toContain('Create a new record')
      })
    })

    describe('[(slot)icon]', () => {
      test('renders the content', () => {
        const wrapper = mountFab(
          {},
          { icon: ({ opened }) => `Custom icon: ${opened}` }
        )

        expect(wrapper.get('.q-fab__icon').text()).toBe('Custom icon: false')
      })
    })

    describe('[(slot)active-icon]', () => {
      test('renders the content', () => {
        const wrapper = mountFab(
          { modelValue: true },
          { 'active-icon': ({ opened }) => `Active icon: ${opened}` }
        )

        expect(wrapper.get('.q-fab__active-icon').text()).toBe(
          'Active icon: true'
        )
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const wrapper = mountFab(
          {},
          { label: ({ opened }) => `Custom label: ${opened}` }
        )

        expect(getLabel(wrapper).text()).toBe('Custom label: false')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountFab({
          modelValue: false,
          'onUpdate:modelValue': () => {}
        })

        await getTrigger(wrapper).trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[true]])
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const wrapper = mountFab()

        await getTrigger(wrapper).trigger('click')

        expect(wrapper.emitted('show')).toHaveLength(1)
        expect(wrapper.emitted('show')[0][0]).toBeInstanceOf(Event)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountFab()

        await getTrigger(wrapper).trigger('click')

        expect(wrapper.emitted('beforeShow')).toHaveLength(1)
        expect(wrapper.emitted('beforeShow')[0][0]).toBeInstanceOf(Event)
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', () => {
        const wrapper = mountFab({ modelValue: true })
        const evt = new Event('click')

        wrapper.vm.hide(evt)

        expect(wrapper.emitted('hide')).toStrictEqual([[evt]])
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', () => {
        const wrapper = mountFab({ modelValue: true })
        const evt = new Event('click')

        wrapper.vm.hide(evt)

        expect(wrapper.emitted('beforeHide')).toStrictEqual([[evt]])
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = mountFab()

        expect(wrapper.vm.show()).toBeUndefined()
        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).toContain('q-fab--opened')
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = mountFab({ modelValue: true })

        expect(wrapper.vm.hide()).toBeUndefined()
        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).toContain('q-fab--closed')
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        const wrapper = mountFab()

        expect(wrapper.vm.toggle()).toBeUndefined()
        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).toContain('q-fab--opened')
      })
    })
  })
})
