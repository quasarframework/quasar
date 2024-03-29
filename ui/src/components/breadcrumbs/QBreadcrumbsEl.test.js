import { mount } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'

import QBreadcrumbsEl from './QBreadcrumbsEl.js'

describe('[QBreadcrumbsEl API]', () => {
  describe('[Props]', () => {
    describe('[(prop)label]', () => {
      test('should render a label inside the breadcrumb element', () => {
        const label = 'Breadcrumb label'
        const wrapper = mount(QBreadcrumbsEl, {
          props: { label }
        })

        expect(
          wrapper.get('.q-breadcrumbs__el')
            .text()
        ).toContain(label)
      })
    })

    describe('[(prop)icon]', () => {
      test('should render on the left of the breadcrumb element', () => {
        const icon = 'home'
        const wrapper = mount(QBreadcrumbsEl, {
          props: { icon }
        })

        expect(
          wrapper.get('.q-breadcrumbs__el')
            .get('.q-icon')
            .text()
        ).toContain(icon)
      })
    })

    describe('[(prop)tag]', () => {
      test('should render a custom tag', () => {
        const tag = 'a'
        const wrapper = mount(QBreadcrumbsEl, {
          props: { tag }
        })

        expect(
          wrapper.get('.q-breadcrumbs__el')
            .element.tagName
        ).toBe(tag.toUpperCase())
      })
    })

    describe.todo('(prop): to', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): exact', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): replace', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): active-class', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): exact-active-class', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): href', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): target', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): disable', () => {
      test(' ', () => {
        //
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should render the default slot', () => {
        const label = 'Breadcrumb label'
        const wrapper = mount(QBreadcrumbsEl, {
          slots: { default: label }
        })

        expect(
          wrapper.get('.q-breadcrumbs__el')
            .text()
        ).toContain(label)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('should emit "click" event when clicked', () => {
        const fn = vi.fn()
        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            label: 'clicked breadcrumb',
            onClick: fn
          }
        })

        wrapper.get('.q-breadcrumbs__el')
          .trigger('click')

        expect(fn).toHaveBeenCalledTimes(1)
      })
    })
  })
})
