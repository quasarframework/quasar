import { ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import { getRouter } from 'testing/runtime/router.js'

import QFabAction from './QFabAction.js'
import { fabKey } from '../../utils/private.symbols/symbols.js'

function mountAction(props = {}, slots = {}, global = {}) {
  const fab = {
    showing: ref(true),
    onChildClick: () => {}
  }

  return mount(QFabAction, {
    props,
    slots,
    global: {
      ...global,
      provide: {
        [fabKey]: fab,
        ...global.provide
      }
    }
  })
}

function getButton(wrapper) {
  return wrapper.get('.q-btn')
}

function getLabel(wrapper) {
  return wrapper.get('.q-fab__label')
}

function expectButtonType(wrapper, type) {
  const button = getButton(wrapper)

  if (type === 'a') {
    expect(button.element.tagName).toBe('A')
    expect(button.attributes('type')).toBeUndefined()
  } else {
    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('type')).toBe(type)
  }
}

describe('[QFabAction API]', () => {
  describe('[Props]', () => {
    describe('[(prop)type]', () => {
      test('value "a" has effect', () => {
        expectButtonType(mountAction({ type: 'a' }), 'a')
      })

      test('value "submit" has effect', () => {
        expectButtonType(mountAction({ type: 'submit' }), 'submit')
      })

      test('value "button" has effect', () => {
        expectButtonType(mountAction({ type: 'button' }), 'button')
      })

      test('value "reset" has effect', () => {
        expectButtonType(mountAction({ type: 'reset' }), 'reset')
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', () => {
        expect(getButton(mountAction({ outline: true })).classes()).toContain(
          'q-btn--outline'
        )
      })
    })

    describe('[(prop)push]', () => {
      test('type Boolean has effect', () => {
        expect(getButton(mountAction({ push: true })).classes()).toContain(
          'q-btn--push'
        )
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', () => {
        expect(getButton(mountAction({ flat: true })).classes()).toContain(
          'q-btn--flat'
        )
      })
    })

    describe('[(prop)unelevated]', () => {
      test('type Boolean has effect', () => {
        expect(
          getButton(mountAction({ unelevated: true })).classes()
        ).toContain('q-btn--unelevated')
      })
    })

    describe('[(prop)padding]', () => {
      test('type String has effect', () => {
        expect(
          getButton(mountAction({ padding: '4px 8px' })).$style('padding')
        ).toBe('4px 8px')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        expect(
          getButton(mountAction({ color: 'primary' })).classes()
        ).toContain('bg-primary')
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', () => {
        expect(
          getButton(mountAction({ textColor: 'dark' })).classes()
        ).toContain('text-dark')
      })
    })

    describe('[(prop)glossy]', () => {
      test('type Boolean has effect', () => {
        expect(getButton(mountAction({ glossy: true })).classes()).toContain(
          'glossy'
        )
      })
    })

    describe('[(prop)external-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountAction({
          externalLabel: true,
          label: 'Create'
        })

        expect(getLabel(wrapper).classes()).toContain('q-fab__label--external')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        expect(getLabel(mountAction({ label: 'Create' })).text()).toBe('Create')
      })

      test('type Number has effect', () => {
        expect(getLabel(mountAction({ label: 42 })).text()).toBe('42')
      })
    })

    describe('[(prop)label-position]', () => {
      test('value "top" has effect', () => {
        expect(
          getLabel(
            mountAction({ label: 'Create', labelPosition: 'top' })
          ).classes()
        ).toContain('q-fab__label--internal-top')
      })

      test('value "right" has effect', () => {
        expect(
          getLabel(
            mountAction({ label: 'Create', labelPosition: 'right' })
          ).classes()
        ).toContain('q-fab__label--internal-right')
      })

      test('value "bottom" has effect', () => {
        expect(
          getLabel(
            mountAction({ label: 'Create', labelPosition: 'bottom' })
          ).classes()
        ).toContain('q-fab__label--internal-bottom')
      })

      test('value "left" has effect', () => {
        expect(
          getLabel(
            mountAction({ label: 'Create', labelPosition: 'left' })
          ).classes()
        ).toContain('q-fab__label--internal-left')
      })
    })

    describe('[(prop)hide-label]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountAction({
          hideLabel: true,
          label: 'Create'
        })

        expect(getLabel(wrapper).classes()).toContain(
          'q-fab__label--internal-hidden'
        )
      })

      test('type null has effect', () => {
        const wrapper = mountAction({
          externalLabel: true,
          hideLabel: null,
          label: 'Create'
        })

        expect(getLabel(wrapper).classes()).not.toContain(
          'q-fab__label--external-hidden'
        )
      })
    })

    describe('[(prop)label-class]', () => {
      test('type String has effect', () => {
        expect(
          getLabel(
            mountAction({ label: 'Create', labelClass: 'custom-label' })
          ).classes()
        ).toContain('custom-label')
      })

      test('type Array has effect', () => {
        expect(
          getLabel(
            mountAction({
              label: 'Create',
              labelClass: ['custom-label', 'emphasis']
            })
          ).classes()
        ).toEqual(expect.arrayContaining(['custom-label', 'emphasis']))
      })

      test('type Object has effect', () => {
        const label = getLabel(
          mountAction({
            label: 'Create',
            labelClass: {
              'custom-label': true,
              unused: false
            }
          })
        )

        expect(label.classes()).toContain('custom-label')
        expect(label.classes()).not.toContain('unused')
      })
    })

    describe('[(prop)label-style]', () => {
      test('type String has effect', () => {
        expect(
          getLabel(
            mountAction({ label: 'Create', labelStyle: 'color: red' })
          ).attributes('style')
        ).toContain('color: red')
      })

      test('type Array has effect', () => {
        const style = getLabel(
          mountAction({
            label: 'Create',
            labelStyle: ['color: red', { fontSize: '12px' }]
          })
        ).attributes('style')

        expect(style).toContain('color: red')
        expect(style).toContain('font-size: 12px')
      })

      test('type Object has effect', () => {
        expect(
          getLabel(
            mountAction({ label: 'Create', labelStyle: { color: 'red' } })
          ).attributes('style')
        ).toContain('color: red')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        const button = getButton(mountAction({ square: true }))

        expect(button.classes()).toContain('q-fab--form-square')
        expect(button.classes()).toContain('q-btn--square')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountAction({ disable: true })

        expect(getButton(wrapper).attributes('aria-disabled')).toBe('true')

        await getButton(wrapper).trigger('click')

        expect(wrapper.emitted('click')).toBeUndefined()
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        expect(
          getButton(mountAction({ tabindex: 100 })).attributes('tabindex')
        ).toBe('100')
      })

      test('type String has effect', () => {
        expect(
          getButton(mountAction({ tabindex: '2' })).attributes('tabindex')
        ).toBe('2')
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        expect(mountAction({ icon: 'add' }).get('.q-icon').text()).toBe('add')
      })
    })

    describe('[(prop)anchor]', () => {
      test('value "start" has effect', () => {
        expect(getButton(mountAction({ anchor: 'start' })).classes()).toContain(
          'self-end'
        )
      })

      test('value "center" has effect', () => {
        expect(
          getButton(mountAction({ anchor: 'center' })).classes()
        ).toContain('self-center')
      })

      test('value "end" has effect', () => {
        expect(getButton(mountAction({ anchor: 'end' })).classes()).toContain(
          'self-start'
        )
      })
    })

    describe('[(prop)to]', () => {
      test('type String has effect', async () => {
        const router = await getRouter('/target')
        const wrapper = mountAction(
          { to: '/target' },
          {},
          { plugins: [router] }
        )

        expect(getButton(wrapper).attributes('href')).toBe('/target')

        await getButton(wrapper).trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/target')
      })

      test('type Object has effect', async () => {
        const router = await getRouter('/target')
        const wrapper = mountAction(
          { to: { path: '/target' } },
          {},
          { plugins: [router] }
        )

        expect(getButton(wrapper).attributes('href')).toBe('/target')

        await getButton(wrapper).trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/target')
      })
    })

    describe('[(prop)replace]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter('/target')
        const replace = vi.spyOn(router, 'replace')
        const wrapper = mountAction(
          {
            replace: true,
            to: '/target'
          },
          {},
          { plugins: [router] }
        )

        await getButton(wrapper).trigger('click')
        await flushPromises()

        expect(replace).toHaveBeenCalledWith('/target')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        expect(
          getButton(mountAction({}, { default: () => 'Action content' })).text()
        ).toContain('Action content')
      })
    })

    describe('[(slot)icon]', () => {
      test('renders the content', () => {
        const wrapper = mountAction(
          {},
          { icon: () => '<custom-action-icon />' }
        )

        expect(getButton(wrapper).text()).toContain('<custom-action-icon />')
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const wrapper = mountAction({}, { label: () => 'Custom action label' })

        expect(getLabel(wrapper).text()).toBe('Custom action label')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('is emitting', async () => {
        const wrapper = mountAction()

        await getButton(wrapper).trigger('click')

        expect(wrapper.emitted('click')).toHaveLength(1)
        expect(wrapper.emitted('click')[0][0]).toBeInstanceOf(Event)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)click]', () => {
      test('should be callable', () => {
        const wrapper = mountAction()
        const evt = new Event('click')

        expect(wrapper.vm.click(evt)).toBeUndefined()
        expect(wrapper.emitted('click')).toStrictEqual([[evt]])
      })
    })
  })
})
