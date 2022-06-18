import { mount } from '@cypress/vue'
import WrapperOne from './../../../components/menu/__tests__/WrapperOne.vue'

describe('use-anchor API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): target', () => {
        it('should use another target using a CSS selector', () => {
          mount(WrapperOne, {
            props: {
              target: '.other-target'
            }
          })

          // Click on parent element should not show menu
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('not.exist')

          // Click on other target should show menu
          cy.dataCy('other-target')
            .click()
          cy.dataCy('menu')
            .should('exist')
        })

        it('should not show when target is false', () => {
          mount(WrapperOne, {
            props: {
              target: false
            }
          })

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('not.exist')
        })
      })

      describe('(prop): no-parent-event', () => {
        it('should not show when clicking parent with no-parent-event true', () => {
          mount(WrapperOne, {
            props: {
              'no-parent-event': true
            }
          })

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('not.exist')
        })

        it('should show when clicking parent with no-parent-event false', () => {
          mount(WrapperOne, {
            props: {
              'no-parent-event': false
            }
          })

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
        })
      })

      describe('(prop): context-menu', () => {
        it('should not show when left clicking parent', () => {
          mount(WrapperOne, {
            props: {
              'context-menu': true
            }
          })

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('not.exist')
        })

        it('should show when right clicking parent', () => {
          mount(WrapperOne, {
            props: {
              'context-menu': true
            }
          })

          cy.dataCy('wrapper')
            .rightclick()
          cy.dataCy('menu')
            .should('exist')
        })
      })
    })
  })
})
