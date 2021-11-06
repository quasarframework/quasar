import { mount } from '@cypress/vue'
import MenuWrapperBtn from './MenuWrapperBtn.vue'

describe('QMenu', () => {
  // Position tests
  describe('Position tests', () => {
    it('should show a menu at the bottom of the wrapper', () => {
      mount(MenuWrapperBtn, {})

      cy.dataCy('wrapper')
        .click()

      cy.dataCy('menu')
        .checkPosition('wrapper', 'bottom')
    })
  })

  // Behavior tests
  describe('Behavior tests', () => {
    describe('(prop): target', () => {
      it('should use another target using a CSS selector', () => {
        mount(MenuWrapperBtn, {
          attrs: {
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
        mount(MenuWrapperBtn, {
          attrs: {
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
        mount(MenuWrapperBtn, {
          attrs: {
            'no-parent-event': true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('not.exist')
      })

      it('should show when clicking parent with no-parent-event false', () => {
        mount(MenuWrapperBtn, {
          attrs: {
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
        mount(MenuWrapperBtn, {
          attrs: {
            'context-menu': true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('not.exist')
      })

      it('should show when right clicking parent', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            'context-menu': true
          }
        })

        cy.dataCy('wrapper')
          .rightclick()
        cy.dataCy('menu')
          .should('exist')
      })
    })

    describe('(prop): touch-position', () => {
      it('should show menu at the position of the click', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            'touch-position': true
          }
        })

        const mouseX = 100
        const mouseY = 25

        cy.dataCy('wrapper')
          .click(mouseX, mouseY)
        cy.dataCy('menu')
          .should('exist')
          .then(($el) => {
            expect($el[ 0 ].offsetLeft).to.equal(mouseX)
            // TODO: check if the Y position being off by 1 is intentional
            expect($el[ 0 ].offsetTop).to.equal(mouseY + 1)
          })
      })
    })

    describe('(prop): persistent', () => {
      it('should close the menu when clicking outside the menu', () => {
        mount(MenuWrapperBtn)

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
        cy.get('body')
          .click(499, 0)
          .dataCy('menu')
          .should('not.exist')
      })

      it('should close the menu when hitting the escape key', () => {
        mount(MenuWrapperBtn)

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
        cy.get('body')
          .type('{esc}')
          .dataCy('menu')
          .should('not.exist')
      })

      it('should not close the menu when clicking outside the menu when persistent', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            persistent: true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
        cy.get('body')
          .click(499, 0)
          .wait(300) // Await menu animation otherwise it always passes
          .dataCy('menu')
          .should('exist')
      })

      it('should not close the menu when hitting the escape key when persistent', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            persistent: true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
        cy.get('body')
          .type('{esc}')
          .wait(300) // Await menu animation otherwise it always passes
          .dataCy('menu')
          .should('exist')
      })
    })

    describe('(prop): auto-close', () => {
      it('should not close the menu when clicking a menu child without v-close-popup', () => {
        mount(MenuWrapperBtn)

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .dataCy('keep-open')
          .click()
          .wait(300) // Await menu animation otherwise it always passes
        cy.dataCy('menu')
          .should('exist')
      })

      it('should close the menu when clicking a menu child without v-close-popup when auto-close is true', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            'auto-close': true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .dataCy('keep-open')
          .click()
          .wait(300) // Await menu animation otherwise it always passes
        cy.dataCy('menu')
          .should('not.exist')
      })
    })

    describe('(prop): no-refocus', () => {
      // TODO: it is not clear from the docs that refocussing does not happen when clicking outside or closing by escape/programatticaly. Should this be added?
      it('should switch focus back to parent element when closing', () => {
        mount(MenuWrapperBtn)

        cy.dataCy('wrapper')
          .focus()
          .should('have.focus')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .should('have.focus')
          .dataCy('close-popup')
          .click()
          .wait(300) // Wait for menu transition
        cy.dataCy('wrapper')
          .get('.q-focus-helper')
          .should('have.focus')
      })

      it('should not switch focus back to parent element when closing if no-refocus is true', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            'no-refocus': true
          }
        })

        cy.dataCy('wrapper')
          .focus()
          .should('have.focus')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .should('have.focus')
          .dataCy('close-popup')
          .click()
          .wait(300) // Wait for menu transition
        cy.dataCy('wrapper')
          .get('.q-focus-helper')
          .should('not.have.focus')
      })
    })

    describe('(prop): no-focus', () => {
      it('should switch focus to the menu when opening', () => {
        mount(MenuWrapperBtn)

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .should('have.focus')
      })

      it('should no switch focus to the menu when opening with no-focus is true', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            'no-focus': true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .should('not.have.focus')
      })
    })
  })
})
