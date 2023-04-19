import { alignMap, alignValues } from '../../../composables/private/use-align.js'
import BasicBreadcrumbs from './BasicBreadcrumbs.vue'
import BreadcrumbWithSeparatorSlot from './BreadcrumbWithSeparatorSlot.vue'

const gutterValues = [ 'xs', 'sm', 'md', 'lg', 'xl' ]

describe('Breadcrumbs API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): separator', () => {
        it('should render a custom separator based on the defined value', () => {
          const customSeparator = '>'

          cy.mount(BasicBreadcrumbs, {
            props: {
              separator: customSeparator
            }
          })
          cy.get('.q-breadcrumbs__separator')
            .each(($el) => cy.wrap($el).should('contain', customSeparator))
        })
      })

      describe('(prop): gutter', () => {
        it(`should render a breadcrumb with a gutter based on defined values: ${ gutterValues.join(', ') }`, () => {
          cy.mount(BasicBreadcrumbs)

          // loop through each gutter value
          for (const gutter of gutterValues) {
            cy.get('.q-breadcrumbs > div')
              .then(() => Cypress.vueWrapper.setProps({ gutter }))
              .should('have.class', `q-gutter-${ gutter }`)
          }
        })

        it('should render a breadcrumb with no gutter when the value is set to "none"', () => {
          cy.mount(BasicBreadcrumbs, {
            props: {
              gutter: 'none'
            }
          })
          cy.get('.q-breadcrumbs > div')
            .should('not.have.class', 'q-gutter')
        })
      })

      describe('(prop): align', () => {
        it(`should render a breadcrumb aligned based on defined values: ${ alignValues.join(', ') }`, () => {
          cy.mount(BasicBreadcrumbs)

          // loop over alignValues
          for (const align of alignValues) {
            cy.get('.q-breadcrumbs > div')
              .then(() => Cypress.vueWrapper.setProps({ align }))
              .should('have.class', `justify-${ alignMap[ align ] }`)
          }
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): active-color', () => {
        it('should change breadcrumb item color based on Quasar Color Palette', () => {
          const activeColor = 'red'

          cy.mount(BasicBreadcrumbs, {
            props: {
              activeColor
            }
          })
          cy.get('.q-breadcrumbs > div > .flex.items-center:not(.q-breadcrumbs--last)')
            .each(($el) => cy.wrap($el).should('have.class', `text-${ activeColor }`))
        })
      })

      describe('(prop): separator-color', () => {
        it('should change breadcrumb separator color based on Quasar Color Palette', () => {
          const separatorColor = 'red'

          cy.mount(BasicBreadcrumbs, {
            props: {
              separatorColor
            }
          })
          cy.get('.q-breadcrumbs__separator')
            .each(($el) => cy.wrap($el).should('have.class', `text-${ separatorColor }`))
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should display the default slot content', () => {
        cy.mount(BasicBreadcrumbs)

        cy.get('.q-breadcrumbs > div')
          .should('contain', 'Home')
      })
    })

    describe('(slot): separator', () => {
      it('should display the separator slot content', () => {
        cy.mount(BreadcrumbWithSeparatorSlot)

        cy.get('.q-breadcrumbs__separator')
          .should('contain', 'arrow_forward')
      })
    })
  })
})
