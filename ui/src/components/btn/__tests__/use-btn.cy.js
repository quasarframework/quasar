import { createMemoryHistory, createRouter } from 'vue-router'
import { alignMap, alignValues } from '../../../composables/private/use-align.js'
import QBtn from '../QBtn.js'
import { btnPadding as paddingMap } from '../use-btn.js'

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

  return cy.mount(QBtn, options)
}

describe('use-btn API', () => {
  describe('Props', () => {
    describe('Category: behavior|state', () => {
      describe('(prop): loading', () => {
        it('should render a button with "loading" slot when "loading" prop is set to true', () => {
          mountQBtn({
            props: {
              loading: true
            }
          })

          cy.get('.q-btn .q-spinner')
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): label', () => {
        it('should render a label inside the button', () => {
          const label = 'Custom Label'
          mountQBtn({
            props: {
              label
            }
          })

          cy.get('.q-btn').should('contain', label)
        })
      })

      describe('(prop): icon', () => {
        it('should render an icon on the left', () => {
          const icon = 'home'

          mountQBtn({
            props: {
              icon
            }
          })

          cy.get('.q-btn .on-left').should('contain', icon)
        })
      })

      describe('(prop): icon-right', () => {
        it('should render an icon on the right', () => {
          const iconRight = 'home'

          mountQBtn({
            props: {
              iconRight
            }
          })

          cy.get('.q-btn .on-right').should('contain', iconRight)
        })
      })

      describe('(prop): no-caps', () => {
        it('should render a button with no uppercase text', () => {
          mountQBtn({
            props: {
              noCaps: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--no-uppercase')
        })
      })

      describe('(prop): no-wrap', () => {
        it('should render a button with no wrapping text', () => {
          mountQBtn({
            props: {
              noWrap: true
            }
          })

          cy.get('.q-btn .q-btn__content')
            .should('have.class', 'no-wrap')
            .should('have.class', 'text-no-wrap')
        })
      })

      describe('(prop): align', () => {
        it(`should render a badge aligned based on defined values: ${ alignValues.join(', ') }`, () => {
          mountQBtn()

          for (const align of alignValues) {
            cy.get('.q-btn .q-btn__content')
              .then(() => Cypress.vueWrapper.setProps({ align }))
              .should('have.class', `justify-${ alignMap[ align ] }`)
          }
        })
      })

      describe('(prop): stack', () => {
        it('should render a button with icon and label stacked vertically', () => {
          mountQBtn({
            props: {
              stack: true
            }
          })

          cy.get('.q-btn .q-btn__content')
            .should('have.class', 'column')
        })
      })

      describe('(prop): stretch', () => {
        it('should render stretch height button when used in flexbox container', () => {
          mountQBtn({
            props: {
              stretch: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'no-border-radius')
            .should('have.class', 'self-stretch')
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): type', () => {
        it(`should render a button with a type based on defined values: ${ typesValues.join(', ') }`, () => {
          mountQBtn()

          for (const type of typesValues) {
            cy.get('.q-btn')
              .then(() => Cypress.vueWrapper.setProps({ type }))
              .should('have.attr', 'type', type)
          }
        })

        it('should render a component with <a> tag when "type" prop is set to "a"', () => {
          mountQBtn({
            props: {
              type: 'a'
            }
          })

          cy.get('.q-btn')
            .should('have.prop', 'tagName').should('eq', 'A')
        })
      })

      describe('(prop): tabindex', () => {
        it('should set the tabindex', () => {
          const tabindex = 1

          mountQBtn({
            props: {
              tabindex
            }
          })

          cy.get('.q-btn')
            .should('have.attr', 'tabindex', tabindex)
        })
      })
    })

    describe('Category: navigation', () => {
      describe('(prop): to', () => {
        it('should render a component with <a> tag when "to" prop is set', () => {
          const link = '/test'

          mountQBtn({
            props: {
              to: link
            }
          })

          cy.get('.q-btn')
            .should('have.attr', 'href', link)
            .should('have.prop', 'tagName').should('eq', 'A')
        })
      })

      describe('(prop): replace', () => {
        it('should render a component with <a> tag when "replace" prop is set', () => {
          const link = '/test'

          mountQBtn({
            props: {
              to: link,
              replace: true
            }
          })

          cy.get('.q-btn')
            .should('have.attr', 'href', link)
            .should('have.prop', 'tagName').should('eq', 'A')
        })
      })

      describe('(prop): href', () => {
        it('should render a component with <a> tag when "href" attribute is set', () => {
          const href = 'https://quasar.dev'

          mountQBtn({
            props: {
              href
            }
          })

          cy.get('.q-btn')
            .should('have.attr', 'href', href)
            .should('have.prop', 'tagName').should('eq', 'A')
        })
      })

      describe('(prop): target', () => {
        it('should render a component with <a> tag when "href" and "target" attributes are set', () => {
          const href = 'https://quasar.dev'

          mountQBtn({
            props: {
              href,
              target: '_blank'
            }
          })

          cy.get('.q-btn')
            .should('have.attr', 'target', '_blank')
            .should('have.prop', 'tagName').should('eq', 'A')
        })
      })
    })

    describe('Category: state', () => {
      describe('(prop): disable', () => {
        it('should render a disabled button', () => {
          mountQBtn({
            props: {
              disable: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'disabled')
            .should('have.attr', 'disabled')
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): outline', () => {
        it('should render a button with outline style', () => {
          mountQBtn({
            props: {
              outline: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--outline')
        })
      })

      describe('(prop): flat', () => {
        it('should render a button with flat style', () => {
          mountQBtn({
            props: {
              flat: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--flat')
        })
      })

      describe('(prop): unelevated', () => {
        it('should render a button with unelevated style', () => {
          mountQBtn({
            props: {
              unelevated: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--unelevated')
        })
      })

      describe('(prop): rounded', () => {
        it('should render a button with rounded style', () => {
          mountQBtn({
            props: {
              rounded: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--rounded')
        })
      })

      describe('(prop): push', () => {
        it('should render a button with push style', () => {
          mountQBtn({
            props: {
              push: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--push')
        })
      })

      describe('(prop): square', () => {
        it('should render a button with square style', () => {
          mountQBtn({
            props: {
              square: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--square')
        })
      })

      describe('(prop): glossy', () => {
        it('should render a button with glossy style', () => {
          mountQBtn({
            props: {
              glossy: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'glossy')
        })
      })

      describe('(prop): fab', () => {
        it('should render a button with fab style', () => {
          mountQBtn({
            props: {
              fab: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--fab')
        })
      })

      describe('(prop): fab-mini', () => {
        it('should render a button with fab-mini style', () => {
          mountQBtn({
            props: {
              fabMini: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--fab-mini')
        })
      })

      describe('(prop): padding', () => {
        it(`should render a button with padding based on defined values: ${ paddingValues.join(', ') }`, () => {
          mountQBtn()

          for (const padding of paddingValues) {
            cy.get('.q-btn')
              .then(() => Cypress.vueWrapper.setProps({ padding }))
              .should('have.css', 'padding', `${ paddingMap[ padding ] }px`)
          }
        })

        it('should render a button with padding based custom value', () => {
          const padding = '10px'

          mountQBtn({
            props: {
              padding
            }
          })

          cy.get('.q-btn')
            .should('have.css', 'padding', padding)
        })

        it('should render a button with padding vertically and horizontally based on defined values" ', () => {
          mountQBtn()

          for (const paddingVertically of paddingValues) {
            for (const paddingHorizontally of paddingValues) {
              if (paddingVertically === paddingHorizontally) { continue }

              const padding = `${ paddingVertically } ${ paddingHorizontally }`

              cy.get('.q-btn')
                .then(() => Cypress.vueWrapper.setProps({ padding }))
                .should('have.css', 'padding',
                  `${ paddingMap[ paddingVertically ] }px ${ paddingMap[ paddingHorizontally ] }px`)
            }
          }
        })

        it('should render a button with "minWidth" and "minHeight" props set to "0"', () => {
          mountQBtn({
            props: {
              padding: '0'
            }
          })

          cy.get('.q-btn')
            .should('have.css', 'min-width', '0px')
            .should('have.css', 'min-height', '0px')
        })
      })

      describe('(prop): color', () => {
        it('should change text color based on Quasar Color Palette', () => {
          const color = 'red'

          mountQBtn({
            props: { color }
          })

          cy.get('.q-btn')
            .should('have.class', `bg-${ color }`)
        })
      })

      describe('(prop): text-color', () => {
        it('should change text color based on Quasar Color Palette', () => {
          const textColor = 'red'

          mountQBtn({
            props: { textColor }
          })

          cy.get('.q-btn')
            .should('have.class', `text-${ textColor }`)
        })
      })

      describe('(prop): dense', () => {
        it('should render a button with dense style', () => {
          mountQBtn({
            props: {
              dense: true
            }
          })

          cy.get('.q-btn')
            .should('have.class', 'q-btn--dense')
        })
      })

      describe('(prop): ripple', () => {
        it('should render a button with ripple effect', () => {
          mountQBtn({
            props: {
              ripple: true
            }
          })

          cy.get('.q-btn')
            .click()
          cy.get('.q-btn').get('.q-ripple')
            .should('exist')
        })
      })
    })
  })
})
