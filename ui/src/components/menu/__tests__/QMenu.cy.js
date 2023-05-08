/* eslint-disable no-unused-expressions */
import WrapperOne from './WrapperOne.vue'
import WrapperTwo from './WrapperTwo.vue'

describe('Menu API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): scroll-target', () => {
        it.skip(' ', () => {
          // Todo: Check if test for this needs to be added.
        })
      })

      describe('(prop): touch-position', () => {
        it('should show menu at the position of the click', () => {
          cy.mount(WrapperOne, {
            props: {
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
          cy.mount(WrapperOne)

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
          cy.get('body')
            .click(499, 0)
          cy.get('body').dataCy('menu')
            .should('not.exist')
        })

        it('should close the menu when hitting the escape key', () => {
          cy.mount(WrapperOne)

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
          cy.get('body')
            .type('{esc}')
          cy.get('body').dataCy('menu')
            .should('not.exist')
        })

        it('should not close the menu when clicking outside the menu when persistent', () => {
          cy.mount(WrapperOne, {
            props: {
              persistent: true
            }
          })

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
          cy.get('body')
            .click(499, 0, { waitForAnimations: true }) // Await menu animation otherwise it always passes
          cy.get('body')
            .dataCy('menu')
            .should('exist')
        })

        it('should not close the menu when hitting the escape key when persistent', () => {
          cy.mount(WrapperOne, {
            props: {
              persistent: true
            }
          })

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
          cy.get('body')
            .type('{esc}', { waitForAnimations: true }) // Await menu animation otherwise it always passes
          cy.get('body')
            .dataCy('menu')
            .should('exist')
        })
      })

      describe('(prop): no-route-dismiss', () => {
        it.skip(' ', () => {
          // This needs a vue-router, not possible with a unit test
        })
      })

      describe('(prop): auto-close', () => {
        it('should not close the menu when clicking a menu child without v-close-popup', () => {
          cy.mount(WrapperOne)

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
            .dataCy('keep-open')
            .click({ waitForAnimations: true }) // Await menu animation otherwise it always passes
          cy.dataCy('menu')
            .should('exist')
        })

        it('should close the menu when clicking a menu child without v-close-popup when auto-close is true', () => {
          cy.mount(WrapperOne, {
            props: {
              'auto-close': true
            }
          })

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
            .dataCy('keep-open')
            .click({ waitForAnimations: true }) // Await menu animation otherwise it always passes
          cy.dataCy('menu')
            .should('not.exist')
        })
      })

      describe('(prop): separate-close-popup', () => {
        it.skip(' ', () => {
          // Todo: Check if this needs to be tested
        })
      })

      describe('(prop): no-refocus', () => {
        // TODO: it is not clear from the docs that refocussing does not happen when clicking outside or closing by escape/programatticaly. Should this be added?
        it('should switch focus back to parent element when closing', () => {
          cy.mount(WrapperOne)

          cy.dataCy('wrapper')
            .focus()
          cy.dataCy('wrapper')
            .should('have.focus')
            .click()
          cy.dataCy('menu')
            .should('exist')
            .should('have.focus')
          cy.dataCy('menu')
            .dataCy('close-popup')
            .click({ waitForAnimations: true }) // Wait for menu transition
          cy.dataCy('wrapper')
            .get('.q-focus-helper')
            .should('have.focus')
        })

        it('should not switch focus back to parent element when closing if no-refocus is true', () => {
          cy.mount(WrapperOne, {
            props: {
              'no-refocus': true
            }
          })

          cy.dataCy('wrapper')
            .focus()
          cy.dataCy('wrapper')
            .should('have.focus')
            .click()
          cy.dataCy('menu')
            .should('exist')
            .should('have.focus')
          cy.dataCy('menu')
            .dataCy('close-popup')
            .click({ waitForAnimations: true }) // Wait for menu transition
          cy.dataCy('wrapper')
            .get('.q-focus-helper')
            .should('not.have.focus')
        })
      })

      describe('(prop): no-focus', () => {
        it('should switch focus to the menu when opening', () => {
          cy.mount(WrapperOne)

          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
            .should('have.focus')
        })

        it('should no switch focus to the menu when opening with no-focus is true', () => {
          cy.mount(WrapperOne, {
            props: {
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

    describe('Category: position', () => {
      describe('(prop): fit', () => {
        it('should show a menu that matches the full with of the target when fit is supplied', () => {
          cy.mount(WrapperOne, {
            props: {
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
          cy.mount(WrapperOne, {
            props: {
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
          cy.mount(WrapperOne, {
            props: {
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
          cy.mount(WrapperOne, {
            props: {
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
          cy.mount(WrapperOne, {
            props: {
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
          cy.mount(WrapperOne)

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
                  cy.mount(WrapperOne, {
                    props: {
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

      describe.skip('(prop): self', () => {
        // This property is tested together with anchor above
      })

      describe('(prop): offset', () => {
        const verticalAnchor = [ 'top', 'center', 'bottom' ]
        const verticalSelf = [ 'top', 'center', 'bottom' ]
        verticalAnchor.forEach((vA) => {
          verticalSelf.forEach((vS) => {
            it(`should offset vertical position Anchor(${ vA } left) & Self(${ vS } left) correctly`, () => {
              cy.mount(WrapperOne, {
                props: {
                  anchor: `${ vA } left`,
                  self: `${ vS } left`,
                  offset: [ 0, 20 ]
                }
              })

              cy.dataCy('wrapper')
                .click()
              cy.dataCy('menu')
                .checkVerticalPosition('wrapper', vA, vS, 20)
            })
          })
        })

        const horizontalAnchor = [ 'left', 'middle', 'right' ]
        const horizontalSelf = [ 'left', 'middle', 'right' ]
        horizontalAnchor.forEach((hA) => {
          horizontalSelf.forEach((hS) => {
            it(`should offset horizontal position Anchor(top ${ hA }) & Self(top ${ hS }) correctly`, () => {
              cy.mount(WrapperOne, {
                props: {
                  anchor: `top ${ hA }`,
                  self: `top ${ hS }`,
                  offset: [ 20, 0 ]
                }
              })

              cy.dataCy('wrapper')
                .click()
              cy.dataCy('menu')
                .checkHorizontalPosition('wrapper', hA, hS, 20)
            })
          })
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): dark', () => {
        it('should set the --q-dark color as background and white text color', () => {
          cy.mount(WrapperOne, {
            props: {
              dark: true
            }
          })
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('have.color', 'white')
            .should('have.backgroundColor', 'var(--q-dark)')
        })
      })

      describe('(prop): square', () => {
        it('should not have border-radius when using this prop', () => {
          cy.mount(WrapperOne, {
            props: {
              square: true
            }
          })
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('have.css', 'border-radius', '0px')
        })
      })

      describe('(prop): max-height', () => {
        it('should specify a max-height when setting this prop', () => {
          const maxHeight = '30px'
          cy.mount(WrapperOne, {
            props: {
              maxHeight
            }
          })
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('have.css', 'max-height', maxHeight)
        })
      })

      describe('(prop): max-width', () => {
        it('should specify a max-width when setting this prop', () => {
          const maxWidth = '30px'
          cy.mount(WrapperOne, {
            props: {
              maxWidth
            }
          })
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('have.css', 'max-width', maxWidth)
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Events', () => {
    describe('(event): escape-key', () => {
      it('should emit @escape-key event when escape key is pressed', () => {
        const fn = cy.stub()
        cy.mount(WrapperOne, {
          props: {
            onEscapeKey: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            expect(fn).not.to.be.called
          })
        cy.get('body')
          .type('{esc}')
        cy.get('body')
          .then(() => {
            expect(fn).to.be.called
          })
      })

      it('should not emit @escape-key event when menu is persistent', () => {
        const fn = cy.stub()
        cy.mount(WrapperOne, {
          props: {
            onEscapeKey: fn,
            persistent: true
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            expect(fn).not.to.be.called
          })
        cy.get('body')
          .type('{esc}')
        cy.get('body')
          .then(() => {
            expect(fn).not.to.be.called
          })
      })
    })
  })

  describe('Methods', () => {
    describe('(method): updatePosition', () => {
      it('should reposition the menu when it is no longer in correct position', () => {
        cy.mount(WrapperTwo, {
          props: {
            anchor: 'bottom left',
            self: 'bottom left'
          }
        })

        let bottom = null
        let left = null

        cy.dataCy('wrapper')
          .click({ waitForAnimations: true })
        cy.dataCy('menu')
          .should('exist')
          .checkVerticalPosition('wrapper', 'bottom', 'bottom')
          .checkHorizontalPosition('wrapper', 'left', 'left')
          .then(($el) => {
            const rect = $el[ 0 ].getBoundingClientRect()
            bottom = rect.bottom
            left = rect.left
          })
        cy.dataCy('div')
          .then(($el) => {
            $el[ 0 ].style.height = '100px'
            cy.dataCy('menu')
              .then(($el) => {
                const rect = $el[ 0 ].getBoundingClientRect()
                expect(rect.bottom).to.equal(bottom - 100)
                expect(rect.left).to.equal(left)
              })
            cy.dataCy('wrapper')
              .then(() => {
                Cypress.vueWrapper.vm.updatePosition()
              })
            cy.dataCy('menu')
              .checkVerticalPosition('wrapper', 'bottom', 'bottom')
              .checkHorizontalPosition('wrapper', 'left', 'left')
          })
      })
    })

    describe('(method): focus', () => {
      it('should focus the menu', () => {
        cy.mount(WrapperOne, {
          props: {
            'no-focus': true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .should('not.have.focus')
        cy.dataCy('wrapper')
          .then(() => {
            // Need to call method from wrapper
            // Click a button closes the menu
            Cypress.vueWrapper.vm.focusMethod()
          })
        cy.dataCy('menu')
          .should('have.focus')
      })

      it('should focus the autofocus element inside the menu', () => {
        cy.mount(WrapperTwo, {
          props: {
            'no-focus': true
          }
        })

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .should('not.have.focus')
        cy.dataCy('wrapper')
          .then(() => {
          // Need to call method from wrapper
          // Click a button closes the menu
            Cypress.vueWrapper.vm.focusMethod()
          })
        cy.dataCy('input-2')
          .should('have.focus')
      })
    })
  })
})
