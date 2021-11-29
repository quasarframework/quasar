/* eslint-disable no-unused-expressions */
import { mount } from '@cypress/vue'
import WrapperOne from './WrapperOne.vue'
import WrapperTwo from './WrapperTwo.vue'
import { ref } from 'vue'

describe('QMenu', () => {
  // Behavior tests
  describe('Behavior tests', () => {
    describe('(prop): target', () => {
      it('should use another target using a CSS selector', () => {
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne)

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
        mount(WrapperOne)

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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne)

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
        mount(WrapperOne, {
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
        mount(WrapperOne)

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
        mount(WrapperOne, {
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
        mount(WrapperOne)

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .should('have.focus')
      })

      it('should no switch focus to the menu when opening with no-focus is true', () => {
        mount(WrapperOne, {
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

  // Model tests
  describe('Model tests', () => {
    describe('(prop): model-value', () => {
      it('should open the dialog when modifying the model-value', () => {
        const modelValue = ref(false)
        mount(WrapperOne, {
          attrs: {
            modelValue
          }
        })
        cy.dataCy('wrapper')
        cy.dataCy('menu')
          .should('not.exist')
          .then(() => {
            modelValue.value = true
            cy.dataCy('menu')
              .should('exist')
          })
      })

      it('should close the dialog when modifying the model-value', () => {
        const modelValue = ref(true)
        mount(WrapperOne, {
          attrs: {
            modelValue
          }
        })
        cy.dataCy('wrapper')
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            modelValue.value = false
            cy.dataCy('menu')
              .should('not.exist')
          })
      })
    })
  })

  // Position tests
  describe('Position tests', () => {
    describe('(prop): fit', () => {
      it('should show a menu that matches the full with of the target when fit is supplied', () => {
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne, {
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
        mount(WrapperOne)

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
                mount(WrapperOne, {
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

    describe('(prop): offset', () => {
      const verticalAnchor = [ 'top', 'center', 'bottom' ]
      const verticalSelf = [ 'top', 'center', 'bottom' ]
      verticalAnchor.forEach((vA) => {
        verticalSelf.forEach((vS) => {
          it(`should offset vertical position Anchor(${ vA } left) & Self(${ vS } left) correctly`, () => {
            mount(WrapperOne, {
              attrs: {
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
            mount(WrapperOne, {
              attrs: {
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

  // Style tests
  describe('Style tests', () => {
    describe('(prop): dark', () => {
      it('should set the --q-dark color as background and white text color', () => {
        mount(WrapperOne, {
          attrs: {
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
        mount(WrapperOne, {
          attrs: {
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
        mount(WrapperOne, {
          attrs: {
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
        mount(WrapperOne, {
          attrs: {
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

  // Transition tests
  describe('Transition tests', () => {
    describe('(prop): transition-show', () => {
      it('should use the fade transition by default', () => {
        mount(WrapperOne)
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('have.class', 'q-transition--fade-enter-active')
      })

      it('should use a different show transtion if defined', () => {
        const transition = 'scale'
        mount(WrapperOne, {
          attrs: {
            transitionShow: transition
          }
        })
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('have.class', `q-transition--${ transition }-enter-active`)
      })
    })

    describe('(prop): transition-hide', () => {
      it('should use the fade transition by default', () => {
        mount(WrapperOne)
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
        cy.get('body')
          .type('{esc}')
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('have.class', 'q-transition--fade-leave-active')
      })

      it('should use a different hide transtion if defined', () => {
        const transition = 'scale'
        mount(WrapperOne, {
          attrs: {
            transitionHide: transition
          }
        })
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
        cy.get('body')
          .type('{esc}')
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('have.class', `q-transition--${ transition }-leave-active`)
      })
    })

    describe('(prop): transition-duration', () => {
      it('should be done with transitioning after 300ms passed', () => {
        mount(WrapperOne)
        cy.dataCy('wrapper')
          .click()
          .wait(300)
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('not.have.class', 'q-transition--fade-enter-active')
      })

      it('should not be done with transitioning before 300ms passed', () => {
        mount(WrapperOne)
        cy.dataCy('wrapper')
          .click()
          .wait(200) // Commands take some time so a high value can fail, just take a decent margin
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('have.class', 'q-transition--fade-enter-active')
      })

      it('should be done after a custom 1000ms passed', () => {
        mount(WrapperOne, {
          attrs: {
            transitionDuration: 1000
          }
        })
        cy.dataCy('wrapper')
          .click()
          .wait(1000)
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('not.have.class', 'q-transition--fade-enter-active')
      })

      it('should not be done before a custom 1000ms passed', () => {
        mount(WrapperOne, {
          attrs: {
            transitionDuration: 1000
          }
        })
        cy.dataCy('wrapper')
          .click()
          .wait(900)
        cy.dataCy('menu', { timeout: 0 }) // Disable retry
          .should('have.class', 'q-transition--fade-enter-active')
      })
    })
  })

  // Events
  describe('Events', () => {
    describe('@update:model-value', () => {
      it('should emit @update:model-value event when state changes', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            'onUpdate:modelValue': fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('@show', () => {
      it('should emit @show event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onShow: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .wait(300) // Await menu animation
          .then(() => {
            expect(fn).to.be.called
          })
      })

      it('should emit @show event when component is triggered with the show() method', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onShow: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
        cy.dataCy('method-show')
          .click({ force: true }) // Element is hidden to prevent clogging the window
        cy.dataCy('menu')
          .should('exist')
          .wait(300) // Await menu animation
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('@before-show', () => {
      it('should emit @before-show event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onBeforeShow: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            expect(fn).to.be.called
          })
      })

      it('should emit @before-show event when component is triggered with the show() method', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onBeforeShow: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
        cy.dataCy('method-show')
          .click({ force: true }) // Element is hidden to prevent clogging the window
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('@hide', () => {
      it('should emit @hide event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onHide: fn
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
          .click(499, 0)
        cy.dataCy('menu')
          .should('not.exist')
          .then(() => {
            expect(fn).to.be.called
          })
      })

      it('should emit @hide event when component is triggered with the show() method', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onHide: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
        cy.dataCy('method-show')
          .click({ force: true }) // Element is hidden to prevent clogging the window
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            expect(fn).not.to.be.called
          })
        cy.dataCy('method-hide')
          .click({ force: true })
        cy.dataCy('menu')
          .should('not.exist') // Element is hidden to prevent clogging the window
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('@before-hide', () => {
      it('should emit @before-hide event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onBeforeHide: fn
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
          .click(499, 0)
          .then(() => {
            expect(fn).to.be.called
          })
        cy.dataCy('menu')
          .should('not.exist')
      })

      it('should emit @before-hide event when component is triggered with the show() method', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onBeforeHide: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
        cy.dataCy('method-show')
          .click({ force: true }) // Element is hidden to prevent clogging the window
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            expect(fn).not.to.be.called
          })
        cy.dataCy('method-hide')
          .click({ force: true })
          .then(() => {
            expect(fn).to.be.called
          })
        cy.dataCy('menu')
          .should('not.exist')
      })
    })

    describe('@escape-key', () => {
      it('should emit @escape-key event when escape key is pressed', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
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
          .then(() => {
            expect(fn).to.be.called
          })
      })

      it('should not emit @escape-key event when menu is persistent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
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
          .then(() => {
            expect(fn).not.to.be.called
          })
      })
    })
  })

  // Methods
  describe('Methods', () => {
    describe('show', () => {
      it('should tigger the menu to show', () => {
        mount(WrapperOne)

        cy.dataCy('wrapper')
        cy.dataCy('method-show')
          .click({ force: true })
        cy.dataCy('menu')
          .should('exist')
      })
    })

    describe('hide', () => {
      it('should tigger the menu to hide', () => {
        mount(WrapperOne)

        cy.dataCy('wrapper')
          .click()
        cy.dataCy('menu')
          .should('exist')
        cy.dataCy('method-hide')
          .click({ force: true })
        cy.dataCy('menu')
          .should('not.exist')
      })
    })

    describe('toggle', () => {
      it('should toggle the menu', () => {
        mount(WrapperTwo)

        cy.dataCy('wrapper')
          .then(() => {
            // Need to call method from wrapper
            // Click a button closes the menu
            Cypress.vueWrapper.vm.toggle()
          })
        cy.dataCy('menu')
          .should('exist')
          .then(() => {
            // Need to call method from wrapper
            // Click a button closes the menu
            Cypress.vueWrapper.vm.toggle()
          })
        cy.dataCy('menu')
          .should('not.exist')
      })
    })

    describe('updatePosition', () => {
      it('should reposition the menu when it is no longer in correct position', () => {
        mount(WrapperTwo, {
          attrs: {
            anchor: 'bottom left',
            self: 'bottom left'
          }
        })

        let bottom = null
        let left = null

        cy.dataCy('wrapper')
          .click()
          .wait(300)
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

    describe('focus', () => {
      it('should focus the menu', () => {
        mount(WrapperOne, {
          attrs: {
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
        mount(WrapperTwo, {
          attrs: {
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
