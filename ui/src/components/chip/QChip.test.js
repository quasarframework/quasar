import { mount } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'

import QChip, { defaultSizes } from './QChip.js'

const defaultOptions = {
  label: 'simple chip'
}

const chipSizeValues = Object.keys(defaultSizes)

function mountQChip (options = {}) {
  options.props = {
    ...defaultOptions,
    ...options.props
  }

  return mount(QChip, options)
}

describe('[QChip API]', () => {
  describe('[Props]', () => {
    describe('[(prop)icon]', () => {
      test('should render an icon on the left', () => {
        const icon = 'add'
        const wrapper = mountQChip({
          props: {
            icon
          }
        })

        expect(
          wrapper.get('.q-chip')
            .get('.q-icon.q-chip__icon--left')
            .text()
        ).toBe(icon)
      })
    })

    describe('[(prop)icon-right]', () => {
      test('should render an icon on the right', () => {
        const icon = 'add'
        const wrapper = mountQChip({
          props: {
            iconRight: icon
          }
        })

        expect(
          wrapper.get('.q-chip')
            .get('.q-icon.q-chip__icon--right')
            .text()
        ).toBe(icon)
      })
    })

    describe('[(prop)icon-remove]', () => {
      test('should render a custom remove icon', () => {
        const icon = 'delete'
        const wrapper = mountQChip({
          props: {
            removable: true,
            iconRemove: icon
          }
        })

        expect(
          wrapper.get('.q-chip')
            .get('.q-icon.q-chip__icon--remove')
            .text()
        ).toBe(icon)
      })
    })

    describe('[(prop)icon-selected]', () => {
      test('should render a custom selected icon when one provided', () => {
        const icon = 'done'
        const wrapper = mountQChip({
          props: {
            selected: true,
            iconSelected: icon
          }
        })

        expect(
          wrapper.get('.q-chip.q-chip--selected')
            .get('.q-icon')
            .text()
        ).toBe(icon)
      })
    })

    describe('[(prop)label]', () => {
      test('should render a label inside the chip', () => {
        const label = 'Chip label'
        const wrapper = mountQChip({
          props: {
            label
          }
        })

        expect(
          wrapper.get('.q-chip')
            .get('.q-chip__content')
            .text()
        ).toBe(label)
      })
    })

    describe('[(prop)tabindex]', () => {
      test('should set the tabindex', () => {
        const tabindex = 1
        const wrapper = mountQChip({
          props: {
            clickable: true,
            tabindex
          }
        })

        expect(
          wrapper.get('.q-chip')
            .attributes('tabindex')
        ).toBe(`${ tabindex }`)
      })
    })

    describe('[(prop)model-value]', () => {
      test('should render when "modelValue" prop is true', () => {
        const wrapper = mountQChip({
          props: {
            modelValue: true
          }
        })

        expect(
          wrapper.find('.q-chip')
            .exists()
        ).toBe(true)
      })

      test('should not render when "modelValue" prop is false', async () => {
        const wrapper = mountQChip({
          props: {
            modelValue: false
          }
        })

        expect(
          wrapper.find('.q-chip')
            .exists()
        ).toBe(false)
      })
    })

    describe('[(prop)selected]', () => {
      test('should be selected when "selected" prop is true', () => {
        const wrapper = mountQChip({
          props: {
            selected: true
          }
        })

        expect(
          wrapper.find('.q-chip.q-chip--selected')
            .exists()
        ).toBe(true)
      })

      test('should not be selected when "selected" prop is false', () => {
        const wrapper = mountQChip({
          props: {
            selected: false
          }
        })

        expect(
          wrapper.get('.q-chip')
            .classes()
        ).not.toContain('q-chip--selected')
      })
    })

    describe('[(prop)clickable]', () => {
      test('should have hover effects and emit "click" event when "clickable" prop is true', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            clickable: true,
            onClick: fn
          }
        })

        expect(
          wrapper.get('.q-chip')
            .$computedStyle('cursor')
        ).toBe('pointer')

        wrapper.get('.q-chip')
          .trigger('click')

        expect(fn).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(prop)removable]', () => {
      test('should display a remove icon emitting a "remove" event when clicked', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            removable: true,
            onRemove: fn
          }
        })

        wrapper.get('.q-chip')
          .get('.q-icon.q-chip__icon--remove')
          .trigger('click')

        expect(fn).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(prop)disable]', () => {
      test('should not have hover effect and not emit "click" event when "disable" prop is true', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            disable: true,
            onClick: fn
          }
        })

        expect(
          wrapper.get('.q-chip')
            .$computedStyle('cursor')
        ).not.toBe('pointer')

        wrapper.get('.q-chip')
          .trigger('click')

        expect(fn).not.toHaveBeenCalled()
      })
    })

    describe('[(prop)dense]', () => {
      test('should have a dense style when "dense" prop is true', () => {
        const wrapper = mountQChip({
          props: { dense: true }
        })

        expect(
          wrapper.find('.q-chip.q-chip--dense')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)size]', () => {
      test('should change QChip size based on a CSS unit value', () => {
        const size = '50px'
        const wrapper = mountQChip({
          props: { size }
        })

        expect(
          wrapper.get('.q-chip')
            .$style()
        ).toContain(`font-size: ${ size };`)
      })

      test(`should change QChip size based defined values: ${ chipSizeValues.join(', ') }`, () => {
        // loop over chipSizeValues
        for (const key of chipSizeValues) {
          const wrapper = mountQChip({
            props: { size: key }
          })

          expect(
            wrapper.get('.q-chip')
              .$style()
          ).toContain(`font-size: ${ defaultSizes[ key ] }px;`)
        }
      })
    })

    describe('[(prop)dark]', () => {
      test('should have a dark style when "dark" prop is true', () => {
        const wrapper = mountQChip({
          props: {
            dark: true
          }
        })

        const cls = wrapper.get('.q-chip').classes()
        expect(cls).toContain('q-dark')
        expect(cls).toContain('q-chip--dark')
      })
    })

    describe('[(prop)color]', () => {
      test('should change color based on Quasar Color Palette', () => {
        const color = 'red'
        const wrapper = mountQChip({
          props: { color }
        })

        expect(
          wrapper.get('.q-chip')
            .classes()
        ).toContain(`bg-${ color }`)
      })
    })

    describe('[(prop)text-color]', () => {
      test('should change text color based on Quasar Color Palette', () => {
        const textColor = 'red'
        const wrapper = mountQChip({
          props: { textColor }
        })

        const cls = wrapper.get('.q-chip').classes()
        expect(cls).toContain(`text-${ textColor }`)
        expect(cls).toContain('q-chip--colored')
      })
    })

    describe('[(prop)square]', () => {
      test('should have a square style when "square" prop is true', () => {
        const wrapper = mountQChip({
          props: {
            square: true
          }
        })

        expect(
          wrapper.get('.q-chip')
            .classes()
        ).toContain('q-chip--square')
      })
    })

    describe('[(prop)outline]', () => {
      test('should have a outline style when "outline" prop is true', () => {
        const wrapper = mountQChip({
          props: {
            outline: true
          }
        })

        expect(
          wrapper.get('.q-chip')
            .classes()
        ).toContain('q-chip--outline')
      })
    })

    describe('[(prop)ripple]', () => {
      test('should have a ripple effect when "ripple" prop is true', () => {
        const wrapper = mountQChip({
          props: {
            ripple: true
          }
        })

        wrapper.get('.q-chip')
          .trigger('click')

        expect(
          wrapper.get('.q-chip')
            .find('.q-ripple')
            .exists()
        ).toBe(true)
      })

      test('should not have a ripple effect when "ripple" prop is false', () => {
        const wrapper = mountQChip({
          props: {
            ripple: false
          }
        })

        wrapper.get('.q-chip')
          .trigger('click')

        expect(
          wrapper.get('.q-chip')
            .find('.q-ripple')
            .exists()
        ).toBe(false)
      })
    })

    describe.todo('(prop): remove-aria-label', () => {
      test(' ', () => {
        //
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should display the default slot content', () => {
        const wrapper = mountQChip({
          props: {
            label: undefined
          },

          slots: {
            default: 'Default Slot Content'
          }
        })

        expect(
          wrapper.get('.q-chip__content')
            .text()
        ).toBe('Default Slot Content')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('should emit "click" event when clicked and "clickable" prop is true', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            clickable: true,
            onClick: fn
          }
        })

        wrapper.get('.q-chip')
          .trigger('click')

        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('should not emit "click" event when "clickable" prop is false', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            clickable: false,
            onClick: fn
          }
        })

        wrapper.get('.q-chip')
          .trigger('click')

        expect(fn).not.toHaveBeenCalled()
      })
    })

    describe('[(event): update:selected]', () => {
      test('should update selected value when called', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            selected: false,
            'onUpdate:selected': fn
          }
        })

        wrapper.get('.q-chip')
          .trigger('click')

        expect(
          wrapper.find('.q-chip')
            .exists()
        ).toBe(true)

        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('should not emit update:selected event when "selected" prop is not set', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            selected: undefined,
            'onUpdate:selected': fn
          }
        })

        wrapper.get('.q-chip')
          .trigger('click')

        expect(
          wrapper.find('.q-chip')
            .exists()
        ).toBe(true)

        expect(fn).not.toHaveBeenCalled()
      })
    })

    describe('[(event)remove]', () => {
      test('should emit remove event when clicked and "removable" prop is true', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            removable: true,
            onRemove: fn
          }
        })

        wrapper.get('.q-chip')
          .get('.q-icon.q-chip__icon--remove')
          .trigger('click')

        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('should not emit remove event when "removable" prop is false', () => {
        const fn = vi.fn()
        const wrapper = mountQChip({
          props: {
            removable: false,
            onRemove: fn
          }
        })

        wrapper.get('.q-chip')
          .trigger('click')

        expect(
          wrapper.find('.q-chip')
            .exists()
        ).toBe(true)

        expect(fn).not.toHaveBeenCalled()
      })
    })
  })
})
