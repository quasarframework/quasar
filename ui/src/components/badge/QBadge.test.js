import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBadge from './QBadge.js'

const defaultOptions = {
  label: 'simple badge'
}

const alignValues = [ 'top', 'middle', 'bottom' ]

function mountQBadge (options = {}) {
  options.props = {
    ...defaultOptions,
    ...options.props
  }

  return mount(QBadge, options)
}

describe('[QBadge API]', () => {
  describe('[Props]', () => {
    describe('[(prop)floating]', () => {
      test('should render a floating badge', () => {
        const wrapper = mountQBadge({
          props: { floating: true }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--floating')
      })
    })

    describe('[(prop)multi-line]', () => {
      test('should render a content with multiple lines', () => {
        const wrapper = mountQBadge({
          props: { multiLine: true }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--multi-line')
      })
    })

    describe('[(prop)label]', () => {
      test('should render a label inside the badge', () => {
        const label = 'Badge label'
        const wrapper = mountQBadge({
          props: { label }
        })

        expect(
          wrapper.get('.q-badge')
            .text()
        ).toContain(label)
      })
    })

    describe('[(prop)align]', () => {
      test(`should render a badge aligned based on defined values: ${ alignValues.join(', ') }`, () => {
        // loop over alignValues
        for (const align of alignValues) {
          const wrapper = mountQBadge({
            props: { align }
          })

          expect(
            wrapper.get('.q-badge')
              .$style('vertical-align')
          ).toBe(align)
        }
      })
    })

    describe('[(prop)color]', () => {
      test('should change color based on Quasar Color Palette', () => {
        const wrapper = mountQBadge({
          props: { color: 'red' }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('bg-red')
      })
    })

    describe('[(prop)text-color]', () => {
      test('should change text color based on Quasar Color Palette', () => {
        const wrapper = mountQBadge({
          props: { textColor: 'red' }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('text-red')
      })
    })

    describe('[(prop)transparent]', () => {
      test('should have opacity style when "transparent" prop is true', () => {
        const wrapper = mountQBadge({
          props: { transparent: true }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--transparent')
      })
    })

    describe('[(prop)outline]', () => {
      test('should have a outline style when "outline" prop is true', () => {
        const wrapper = mountQBadge({
          props: { outline: true }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--outline')
      })
    })

    describe('[(prop)rounded]', () => {
      test('should have a rounded style when "rounded" prop is true', () => {
        const wrapper = mountQBadge({
          props: { rounded: true }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--rounded')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should display the default slot content', () => {
        const label = 'Badge label'

        const wrapper = mountQBadge({
          props: {
            label: undefined
          },

          slots: {
            default: label
          }
        })

        expect(
          wrapper.get('.q-badge')
            .text()
        ).toBe(label)
      })
    })
  })
})
