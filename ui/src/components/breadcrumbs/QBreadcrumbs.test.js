import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import { alignMap, alignValues } from '../../composables/private/use-align.js'
import BasicBreadcrumbs from './test/BasicBreadcrumbs.vue'
import BreadcrumbWithSeparatorSlot from './test/BreadcrumbWithSeparatorSlot.vue'

const gutterValues = [ 'xs', 'sm', 'md', 'lg', 'xl' ]

describe('[QBreadcrumbs API]', () => {
  describe('[Props]', () => {
    describe('[(prop)separator]', () => {
      test('should render a custom separator based on the defined value', () => {
        const customSeparator = '>'
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            separator: customSeparator
          }
        })

        expect(
          wrapper.get('.q-breadcrumbs__separator')
            .text()
        ).toContain(customSeparator)
      })
    })

    describe('[(prop)gutter]', () => {
      test(`should render a breadcrumb with a gutter based on defined values: ${ gutterValues.join(', ') }`, () => {
        // loop through each gutter value
        for (const gutter of gutterValues) {
          const wrapper = mount(BasicBreadcrumbs, {
            props: { gutter }
          })

          expect(
            wrapper.get('.q-breadcrumbs > div')
              .classes()
          ).toContain(`q-gutter-${ gutter }`)
        }
      })

      test('should render a breadcrumb with no gutter when the value is set to "none"', () => {
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            gutter: 'none'
          }
        })

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .classes()
        ).not.toContain('q-gutter')
      })
    })

    describe('[(prop)align]', () => {
      test(`should render a breadcrumb aligned based on defined values: ${ alignValues.join(', ') }`, () => {
        // loop over alignValues
        for (const align of alignValues) {
          const wrapper = mount(BasicBreadcrumbs, {
            props: { align }
          })

          expect(
            wrapper.get('.q-breadcrumbs > div')
              .classes()
          ).toContain(`justify-${ alignMap[ align ] }`)
        }
      })
    })

    describe('[(prop)active-color]', () => {
      test('should change breadcrumb item color based on Quasar Color Palette', () => {
        const activeColor = 'red'
        const wrapper = mount(BasicBreadcrumbs, {
          props: { activeColor }
        })

        expect(
          wrapper.get('.q-breadcrumbs > div > .flex.items-center:not(.q-breadcrumbs--last)')
            .classes()
        ).toContain(`text-${ activeColor }`)
      })
    })

    describe('[(prop)separator-color]', () => {
      test('should change breadcrumb separator color based on Quasar Color Palette', () => {
        const separatorColor = 'red'
        const wrapper = mount(BasicBreadcrumbs, {
          props: { separatorColor }
        })

        wrapper.findAll('.q-breadcrumbs__separator')
          .forEach(el => expect(el.classes()).toContain(`text-${ separatorColor }`))
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should display the default slot content', () => {
        const wrapper = mount(BasicBreadcrumbs)

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .text()
        ).toContain('Home')
      })
    })

    describe('[(slot)separator]', () => {
      test('should display the separator slot content', () => {
        const wrapper = mount(BreadcrumbWithSeparatorSlot)

        expect(
          wrapper.get('.q-breadcrumbs__separator')
            .text()
        ).toContain('arrow_forward')
      })
    })
  })
})
