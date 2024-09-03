import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

// import QBreadcrumbs from './QBreadcrumbs.js'

import { alignMap } from 'quasar/src/composables/private.use-align/use-align.js'

import BasicBreadcrumbs from './test/BasicBreadcrumbs.vue'
import BreadcrumbWithSeparatorSlot from './test/BreadcrumbWithSeparatorSlot.vue'

describe('[QBreadcrumbs API]', () => {
  describe('[Props]', () => {
    describe('[(prop)separator]', () => {
      test('type String has effect', async () => {
        const propVal = '>'
        const wrapper = mount(BasicBreadcrumbs)

        expect(
          wrapper.get('.q-breadcrumbs__separator')
            .text()
        ).not.toContain(propVal)

        await wrapper.setProps({ separator: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-breadcrumbs__separator')
            .text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)active-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mount(BasicBreadcrumbs)

        expect(
          wrapper.get('.q-breadcrumbs > div > .flex.items-center:not(.q-breadcrumbs--last)')
            .classes()
        ).not.toContain('text-red')

        await wrapper.setProps({ activeColor: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-breadcrumbs > div > .flex.items-center:not(.q-breadcrumbs--last)')
            .classes()
        ).toContain('text-red')
      })
    })

    describe('[(prop)gutter]', () => {
      test('value "none" has effect', async () => {
        const propVal = 'none'
        const wrapper = mount(BasicBreadcrumbs)

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .classes()
        ).toContain('q-gutter-sm')

        await wrapper.setProps({ gutter: propVal })
        await flushPromises()

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
      ])('value %s has effect', async propVal => {
        const wrapper = mount(BasicBreadcrumbs)

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .classes()
        ).toContain('q-gutter-sm')

        await wrapper.setProps({ gutter: propVal })
        await flushPromises()

        if (propVal !== 'sm') {
          // the default value
          expect(
            wrapper.get('.q-breadcrumbs > div')
              .classes()
          ).not.toContain('q-gutter-sm')
        }

        expect(
          wrapper.get('.q-breadcrumbs > div')
            .classes()
        ).toContain(`q-gutter-${ propVal }`)
      })
    })

    describe('[(prop)separator-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mount(BasicBreadcrumbs)

        wrapper.findAll('.q-breadcrumbs__separator')
          .forEach(el => expect(el.classes()).not.toContain('text-red'))

        // TODO: write expectations without the prop
        // (usually negate the effect of the prop)

        await wrapper.setProps({ separatorColor: propVal })
        await flushPromises()

        wrapper.findAll('.q-breadcrumbs__separator')
          .forEach(el => expect(el.classes()).toContain('text-red'))
      })
    })

    describe('[(prop)align]', () => {
      test.each([
        [ 'left' ],
        [ 'center' ],
        [ 'right' ],
        [ 'between' ],
        [ 'around' ],
        [ 'evenly' ]
      ])('value "%s" has effect', async propVal => {
        const wrapper = mount(BasicBreadcrumbs)

        if (propVal !== 'left') {
          // the default value
          expect(
            wrapper.get('.q-breadcrumbs > div')
              .classes()
          ).not.toContain(`justify-${ alignMap[ propVal ] }`)
        }

        await wrapper.setProps({ align: propVal })
        await flushPromises()

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
