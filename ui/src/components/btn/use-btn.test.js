import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import { createMemoryHistory, createRouter } from 'vue-router'
import { alignMap, alignValues } from '../../composables/private/use-align.js'
import QBtn from './QBtn.js'
import { btnPadding as paddingMap } from './use-btn.js'

const defaultOptions = {
  label: 'simple Btn'
}

const typesValues = [ 'button', 'submit', 'reset' ]

const paddingValues = Object.keys(paddingMap)

function mountQBtn (options = {}) {
  // Setup options object
  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []

  options.props = {
    ...defaultOptions,
    ...options.props
  }

  if (!options.router) {
    options.router = createRouter({
      routes: [],
      history: createMemoryHistory()
    })
  }

  // Add router plugin
  options.global.plugins.push({
    install (app) {
      app.use(options.router)
    }
  })

  return mount(QBtn, options)
}

describe('[useBtn API]', () => {
  describe('[Props]', () => {
    describe('[(prop)loading]', () => {
      test('should render a button with "loading" slot when "loading" prop is set to true', () => {
        const wrapper = mountQBtn({
          props: {
            loading: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .find('.q-spinner')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)label]', () => {
      test('should render a label inside the button', () => {
        const label = 'Custom Label'
        const wrapper = mountQBtn({
          props: {
            label
          }
        })

        expect(
          wrapper.get('.q-btn')
            .text()
        ).toContain(label)
      })
    })

    describe('[(prop)icon]', () => {
      test('should render an icon on the left', () => {
        const icon = 'home'
        const wrapper = mountQBtn({
          props: {
            icon
          }
        })

        expect(
          wrapper.get('.q-btn .on-left')
            .text()
        ).toContain(icon)
      })
    })

    describe('[(prop)icon-right]', () => {
      test('should render an icon on the right', () => {
        const iconRight = 'home'
        const wrapper = mountQBtn({
          props: {
            iconRight
          }
        })

        expect(
          wrapper.get('.q-btn .on-right')
            .text()
        ).toContain(iconRight)
      })
    })

    describe('[(prop)no-caps]', () => {
      test('should render a button with no uppercase text', () => {
        const wrapper = mountQBtn({
          props: {
            noCaps: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--no-uppercase')
      })
    })

    describe('[(prop)no-wrap]', () => {
      test('should render a button with no wrapping text', () => {
        const wrapper = mountQBtn({
          props: {
            noWrap: true
          }
        })

        const cls = wrapper.get('.q-btn .q-btn__content').classes()
        expect(cls).toContain('no-wrap')
        expect(cls).toContain('text-no-wrap')
      })
    })

    describe('[(prop)align]', () => {
      test(`should render a badge aligned based on defined values: ${ alignValues.join(', ') }`, () => {
        for (const align of alignValues) {
          const wrapper = mountQBtn({
            props: { align }
          })

          expect(
            wrapper.get('.q-btn .q-btn__content')
              .classes()
          ).toContain(`justify-${ alignMap[ align ] }`)
        }
      })
    })

    describe('[(prop)stack]', () => {
      test('should render a button with icon and label stacked vertically', () => {
        const wrapper = mountQBtn({
          props: {
            stack: true
          }
        })

        expect(
          wrapper.get('.q-btn .q-btn__content')
            .classes()
        ).toContain('column')
      })
    })

    describe('[(prop)stretch]', () => {
      test('should render stretch height button when used in flexbox container', () => {
        const wrapper = mountQBtn({
          props: {
            stretch: true
          }
        })

        const cls = wrapper.get('.q-btn').classes()
        expect(cls).toContain('no-border-radius')
        expect(cls).toContain('self-stretch')
      })
    })

    describe('[(prop)type]', () => {
      test(`should render a button with a type based on defined values: ${ typesValues.join(', ') }`, () => {
        for (const type of typesValues) {
          const wrapper = mountQBtn({
            props: { type }
          })

          expect(
            wrapper.get('.q-btn')
              .attributes('type')
          ).toBe(type)
        }
      })

      test('should render a component with <a> tag when "type" prop is set to "a"', () => {
        const wrapper = mountQBtn({
          props: {
            type: 'a'
          }
        })

        expect(
          wrapper.get('.q-btn')
            .element.tagName
        ).toBe('A')
      })
    })

    describe('[(prop)tabindex]', () => {
      test('should set the tabindex', () => {
        const tabindex = 1
        const wrapper = mountQBtn({
          props: {
            tabindex
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('tabindex')
        ).toBe(tabindex.toString())
      })
    })

    describe('[(prop)to]', () => {
      test('should render a component with <a> tag when "to" prop is set', () => {
        const link = '/test'
        const wrapper = mountQBtn({
          props: {
            to: link
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('href')
        ).toBe(link)

        expect(
          wrapper.get('.q-btn')
            .element.tagName
        ).toBe('A')
      })
    })

    describe('[(prop)replace]', () => {
      test('should render a component with <a> tag when "replace" prop is set', () => {
        const link = '/test'
        const wrapper = mountQBtn({
          props: {
            to: link,
            replace: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('href')
        ).toBe(link)

        expect(
          wrapper.get('.q-btn')
            .element.tagName
        ).toBe('A')
      })
    })

    describe('[(prop)href]', () => {
      test('should render a component with <a> tag when "href" attribute is set', () => {
        const href = 'https://quasar.dev'
        const wrapper = mountQBtn({
          props: {
            href
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('href')
        ).toBe(href)

        expect(
          wrapper.get('.q-btn')
            .element.tagName
        ).toBe('A')
      })
    })

    describe('[(prop)target]', () => {
      test('should render a component with <a> tag when "href" and "target" attributes are set', () => {
        const href = 'https://quasar.dev'
        const wrapper = mountQBtn({
          props: {
            href,
            target: '_blank'
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('href')
        ).toBe(href)

        expect(
          wrapper.get('.q-btn')
            .element.tagName
        ).toBe('A')
      })
    })

    describe('[(prop)disable]', () => {
      test('should render a disabled button', () => {
        const wrapper = mountQBtn({
          props: {
            disable: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('disabled')
        ).toBeDefined()

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('disabled')
      })
    })

    describe('[(prop)outline]', () => {
      test('should render a button with outline style', () => {
        const wrapper = mountQBtn({
          props: {
            outline: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--outline')
      })
    })

    describe('[(prop)flat]', () => {
      test('should render a button with flat style', () => {
        const wrapper = mountQBtn({
          props: {
            flat: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--flat')
      })
    })

    describe('[(prop)unelevated]', () => {
      test('should render a button with unelevated style', () => {
        const wrapper = mountQBtn({
          props: {
            unelevated: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--unelevated')
      })
    })

    describe('[(prop)rounded]', () => {
      test('should render a button with rounded style', () => {
        const wrapper = mountQBtn({
          props: {
            rounded: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--rounded')
      })
    })

    describe('[(prop)push]', () => {
      test('should render a button with push style', () => {
        const wrapper = mountQBtn({
          props: {
            push: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--push')
      })
    })

    describe('[(prop)square]', () => {
      test('should render a button with square style', () => {
        const wrapper = mountQBtn({
          props: {
            square: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--square')
      })
    })

    describe('[(prop)glossy]', () => {
      test('should render a button with glossy style', () => {
        const wrapper = mountQBtn({
          props: {
            glossy: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('glossy')
      })
    })

    describe('[(prop)fab]', () => {
      test('should render a button with fab style', () => {
        const wrapper = mountQBtn({
          props: {
            fab: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--fab')
      })
    })

    describe('[(prop)fab-mini]', () => {
      test('should render a button with fab-mini style', () => {
        const wrapper = mountQBtn({
          props: {
            fabMini: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--fab-mini')
      })
    })

    describe('[(prop)padding]', () => {
      test(`should render a button with padding based on defined values: ${ paddingValues.join(', ') }`, () => {
        for (const padding of paddingValues) {
          const wrapper = mountQBtn({
            props: { padding }
          })

          expect(
            wrapper.get('.q-btn')
              .$style()
          ).toContain(`padding: ${ paddingMap[ padding ] }px`)
        }
      })

      test('should render a button with padding based custom value', () => {
        const padding = '10px'
        const wrapper = mountQBtn({
          props: { padding }
        })

        expect(
          wrapper.get('.q-btn')
            .$style()
        ).toContain(`padding: ${ padding }`)
      })

      test('should render a button with padding vertically and horizontally based on defined values" ', () => {
        for (const paddingVertically of paddingValues) {
          for (const paddingHorizontally of paddingValues) {
            if (paddingVertically === paddingHorizontally) { continue }
            const padding = `${ paddingVertically } ${ paddingHorizontally }`
            const wrapper = mountQBtn({
              props: { padding }
            })

            expect(
              wrapper.get('.q-btn')
                .$style()
            ).toContain(`padding: ${ paddingMap[ paddingVertically ] }px ${ paddingMap[ paddingHorizontally ] }px`)
          }
        }
      })

      test('should render a button with "minWidth" and "minHeight" props set to "0"', () => {
        const wrapper = mountQBtn({
          props: { padding: '0' }
        })

        expect(
          wrapper.get('.q-btn')
            .$style()
        ).toContain('min-width: 0')

        expect(
          wrapper.get('.q-btn')
            .$style()
        ).toContain('min-height: 0')
      })
    })

    describe('[(prop)color]', () => {
      test('should change text color based on Quasar Color Palette', () => {
        const color = 'red'
        const wrapper = mountQBtn({
          props: { color }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain(`bg-${ color }`)
      })
    })

    describe('[(prop)text-color]', () => {
      test('should change text color based on Quasar Color Palette', () => {
        const textColor = 'red'
        const wrapper = mountQBtn({
          props: { textColor }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain(`text-${ textColor }`)
      })
    })

    describe('[(prop)dense]', () => {
      test('should render a button with dense style', () => {
        const wrapper = mountQBtn({
          props: {
            dense: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--dense')
      })
    })

    describe('[(prop)ripple]', () => {
      test('should render a button with ripple effect', () => {
        const wrapper = mountQBtn({
          props: {
            ripple: true
          }
        })

        wrapper.get('.q-btn')
          .trigger('click')

        expect(
          wrapper.get('.q-btn')
            .find('.q-ripple')
            .exists()
        ).toBe(true)
      })
    })
  })
})
