import { mount } from '@cypress/vue'
import MenuWrapperBtn from './MenuWrapperBtn.vue'

describe('QMenu', () => {
  // Position tests
  describe('Position tests', () => {
    describe('(prop): fit', () => {
      it('should show a menu that matches the full with of the target when fit is supplied', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            target: '.other-target',
            fit: true
          }
        })
        let targetWidth = 0
        cy.dataCy('other-target')
          .then(($el) => {
            targetWidth = $el[ 0 ].clientWidth
          })
          .click()
        cy.dataCy('menu')
          .then(($el) => {
            expect($el[ 0 ].clientWidth).to.equal(targetWidth)
          })
      })

      it('should show a menu that not matches the full with of the target when fit is false', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            target: '.other-target',
            fit: false
          }
        })
        let targetWidth = 0
        cy.dataCy('other-target')
          .then(($el) => {
            targetWidth = $el[ 0 ].clientWidth
          })
          .click()
        cy.dataCy('menu')
          .then(($el) => {
            expect($el[ 0 ].clientWidth).not.to.equal(targetWidth)
          })
      })
    })

    describe('(prop): cover', () => {
      it('should show a menu that overlays the target when using cover', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            cover: true
          }
        })
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .checkVerticalPosition('wrapper', 'center', 'center')
          .checkHorizontalPosition('wrapper', 'middle', 'middle')
      })

      it('should show a menu that overlays the target when using cover', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            cover: true,
            target: '.other-target'
          }
        })
        cy.dataCy('other-target')
          .click()
        cy.dataCy('menu')
          .checkVerticalPosition('other-target', 'center', 'center')
          .checkHorizontalPosition('other-target', 'middle', 'middle')
      })

      it('should ignore self property when using cover', () => {
        mount(MenuWrapperBtn, {
          attrs: {
            cover: true,
            self: 'center right',
            target: '.other-target'
          }
        })
        cy.dataCy('other-target')
          .click()
        cy.dataCy('menu')
          .checkVerticalPosition('other-target', 'center', 'center')
          .checkHorizontalPosition('other-target', 'middle', 'middle')
      })
    })

    describe('(prop): anchor & self', () => {
      it('should show a menu at anchor: bottom left and self: top left  by default', () => {
        mount(MenuWrapperBtn)

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .checkVerticalPosition('wrapper', 'bottom', 'top')
          .checkHorizontalPosition('wrapper', 'left', 'left')
      })

      const verticalAnchor = [ 'top', 'center', 'bottom' ]
      const horizontalAnchor = [ 'left', 'middle', 'right' ]
      const verticalSelf = [ 'top', 'center', 'bottom' ]
      const horizontalSelf = [ 'left', 'middle', 'right' ]
      verticalAnchor.forEach((vA) => {
        horizontalAnchor.forEach((hA) => {
          verticalSelf.forEach((vS) => {
            horizontalSelf.forEach((hS) => {
              it(`should position Anchor(${ vA } ${ hA }) & Self(${ vS } ${ hS })  correctly`, () => {
                mount(MenuWrapperBtn, {
                  attrs: {
                    anchor: `${ vA } ${ hA }`,
                    self: `${ vS } ${ hS }`
                  }
                })

                cy.dataCy('wrapper')
                  .click()
                cy.dataCy('menu')
                  .checkVerticalPosition('wrapper', vA, vS)
                  .checkHorizontalPosition('wrapper', hA, hS)
              })
            })
          })
        })
      })
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

        const mouseX = 75
        const mouseY = 25
        let elementX = 0
        let elementY = 0

        cy.dataCy('wrapper')
          .then(($el) => {
            const rect = $el[ 0 ].getBoundingClientRect()
            elementX = rect.left
            elementY = rect.top
          })
          .click(mouseX, mouseY)
        cy.dataCy('menu')
          .should('exist')
          .then(($el) => {
            expect($el[ 0 ].offsetLeft).to.equal(mouseX + elementX)
            // TODO: check if the Y position being off by 1 is intentional
            expect($el[ 0 ].offsetTop).to.equal(mouseY + 1 + elementY)
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
