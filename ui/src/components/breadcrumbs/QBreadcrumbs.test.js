import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBreadcrumbs from './QBreadcrumbs.js'

import { alignMap } from 'quasar/src/composables/private/use-align.js'

import BasicBreadcrumbs from './test/BasicBreadcrumbs.vue'
import BreadcrumbWithSeparatorSlot from './test/BreadcrumbWithSeparatorSlot.vue'

describe('[QBreadcrumbs API]', () => {
  describe('[Props]', () => {
    describe('[(prop)separator]', () => {
      test('is defined correctly', () => {
        expect(QBreadcrumbs.props.separator).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = '>'
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            separator: propVal
          }
        })

        expect(
          wrapper.get('.q-breadcrumbs__separator')
            .text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)active-color]', () => {
      test('is defined correctly', () => {
        expect(QBreadcrumbs.props.activeColor).toBeDefined()
      })

      test('type String has effect', () => {
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            activeColor: 'red'
          }
        })

        expect(
          wrapper.get('.q-breadcrumbs > div > .flex.items-center:not(.q-breadcrumbs--last)')
            .classes()
        ).toContain('text-red')
      })
    })

    describe('[(prop)gutter]', () => {
      test('is defined correctly', () => {
        expect(QBreadcrumbs.props.gutter).toBeDefined()
      })

      test('value "none" has effect', () => {
        const propVal = 'none'
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            gutter: propVal
          }
        })

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .classes()
        ).toSatisfy(
          list => list.every(cls => cls.startsWith('q-gutter') === false)
        )
      })

      test.each([
        [ 'xs' ],
        [ 'sm' ],
        [ 'md' ],
        [ 'lg' ],
        [ 'xl' ]
      ])('value %s has effect', propVal => {
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            gutter: propVal
          }
        })

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .classes()
        ).toContain(`q-gutter-${ propVal }`)
      })
    })

    describe('[(prop)separator-color]', () => {
      test('is defined correctly', () => {
        expect(QBreadcrumbs.props.separatorColor).toBeDefined()
      })

      test('type String has effect', () => {
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            separatorColor: 'red'
          }
        })

        wrapper.findAll('.q-breadcrumbs__separator')
          .forEach(el => expect(el.classes()).toContain('text-red'))
      })
    })

    describe('[(prop)align]', () => {
      test('is defined correctly', () => {
        expect(QBreadcrumbs.props.align).toBeDefined()
      })

      test.each([
        [ 'left' ],
        [ 'center' ],
        [ 'right' ],
        [ 'between' ],
        [ 'around' ],
        [ 'evenly' ]
      ])('value "%s" has effect', propVal => {
        const wrapper = mount(BasicBreadcrumbs, {
          props: {
            align: propVal
          }
        })

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .classes()
        ).toContain(`justify-${ alignMap[ propVal ] }`)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mount(BasicBreadcrumbs)

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .text()
        ).toContain('Home')
      })
    })

    describe('[(slot)separator]', () => {
      test('renders the content', () => {
        const wrapper = mount(BreadcrumbWithSeparatorSlot)

        expect(
          wrapper.get('.q-breadcrumbs__separator')
            .text()
        ).toContain('arrow_forward')
      })
    })
  })
})
