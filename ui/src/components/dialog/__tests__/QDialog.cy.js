import DialogWrapper from './DialogWrapper.vue'
import { nextTick, ref } from 'vue'
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'

function mountQDialogWrapper (options) {
  return cy.mount(DialogWrapper, options)
}

function getHostElement () {
  return cy.dataCy('dialog-card')
}

function closeDialogViaBackdrop () {
  return cy.get('.q-dialog__backdrop').click({ force: true })
}

// TODO: this only works in `withinDialog` context,
// as when using it outside it `.root()` will yeld "html" tag
// and Cypress won't be able to find anything with `.closest('body')`
// since it only searches upwards
function closeDialogViaEscKey () {
  // Official way to escape `within` context
  // https://docs.cypress.io/api/commands/within#Temporarily-escape
  return cy.root().closest('body').type('{esc}')
}

// TODO: we'll add this check to the AE helper to automatically test persistent dialogs
// TODO: take into consideration that seamless dialogs have always 'aria-modal' false
// TODO: take into consideration that dialogs without backdrop have always 'aria-modal' false
// Check if there's a more reliable way to check for persistent dialogs
function assertPersistentDialogExists () {
  cy.dataCy('dialog-form').should('not.have.attr', 'aria-modal', 'false')
}

describe('Dialog API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): persistent', () => {
        it('should display a persistent dialog', () => {
          const model = ref(true)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              persistent: true
            }
          })

          cy.withinDialog({
            persistent: true,
            fn: () => {
              closeDialogViaBackdrop()
            }
          })

          assertPersistentDialogExists()

          cy.withinDialog({
            persistent: true,
            fn: () => {
              closeDialogViaEscKey()
            }
          })

          assertPersistentDialogExists()
        })
      })

      describe('(prop): no-esc-dismiss', () => {
        it('should not allow closing the dialog with the escape key', () => {
          const model = ref(true)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              noEscDismiss: true
            }
          })

          cy.withinDialog({
            persistent: true,
            fn: () => {
              closeDialogViaEscKey()
            }
          })

          assertPersistentDialogExists()

          cy.wrap()
            .then(async () => {
              // Care as you need to wait setProps to complete its execution
              // before moving on or the tests will fail due to the race condition
              await Cypress.vueWrapper.setProps({ noEscDismiss: false })
            })

          cy.withinDialog(() => {
            closeDialogViaEscKey()
          })
        })
      })

      describe('(prop): no-backdrop-dismiss', () => {
        it('should not close dialog with backdrop', () => {
          const model = ref(true)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              noBackdropDismiss: true
            }
          })

          cy.withinDialog({
            persistent: true,
            fn: () => {
              closeDialogViaBackdrop()
            }
          })

          assertPersistentDialogExists()

          cy.wrap()
            .then(async () => {
              // Care as you need to wait setProps to complete its execution
              // before moving on or the tests will fail due to the race condition
              await Cypress.vueWrapper.setProps({ noBackdropDismiss: false })
            })

          cy.withinDialog(() => {
            closeDialogViaBackdrop()
          })
        })
      })

      describe('(prop): no-route-dismiss', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): auto-close', () => {
        it('should auto-close the dialog', () => {
          const model = ref(true)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              autoClose: true
            }
          })

          cy.withinDialog(() => {
            cy.dataCy('dialog-button').click()
          })
        })
      })

      describe('(prop): no-refocus', () => {
        it('should not refocus on the DOM element that had focus', () => {
          const model = ref(false)

          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              noRefocus: false
            }
          })

          // Test the input field regaining focus
          cy.dataCy('input-field')
            .focus()
          cy.dataCy('input-field')
            .then(async () => {
              model.value = true
              await nextTick()
            })
          cy.withinDialog(() => {
            closeDialogViaBackdrop()
          })

          cy.dataCy('input-field')
            .should('have.focus')

          // Test the input field not regaining focus
          cy.dataCy('input-field')
            .then(async () => {
              await Cypress.vueWrapper.setProps({ noRefocus: true })
              model.value = true
              await nextTick()
            })

          cy.withinDialog(() => {
            closeDialogViaBackdrop()
          })
          cy.dataCy('input-field')
            .should('not.have.focus')
        })
      })

      describe('(prop): no-focus', () => {
        it('should not focus on dialog when switching to it', () => {
          const model = ref(true)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              noFocus: false
            }
          })

          cy.withinDialog(() => {
            cy.focused()
              .should('have.class', 'q-dialog__inner')
            closeDialogViaBackdrop()
          })

          cy.wrap().then(async () => {
            await Cypress.vueWrapper.setProps({ noFocus: true })
            model.value = true
            await nextTick()
          })

          cy.withinDialog(() => {
            cy.focused().should('not.exist')
            closeDialogViaBackdrop()
          })
        })
      })

      describe('(prop): no-shake', () => {
        it('should not shake dialog', () => {
          const model = ref(true)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              persistent: true
            }
          })

          cy.withinDialog({
            persistent: true,
            fn: () => {
              closeDialogViaBackdrop()
              cy.get('.q-dialog__inner')
                .should('have.class', 'q-animate--scale')
            }
          })

          assertPersistentDialogExists()

          cy.wrap().then(async () => {
            await Cypress.vueWrapper.setProps({ noShake: true })
          })

          cy.withinDialog({
            persistent: true, fn: () => {
              closeDialogViaBackdrop()
              cy.get('.q-dialog__inner')
                .should('not.have.class', 'q-animate--scale')
            }
          })

          assertPersistentDialogExists()
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): seamless', () => {
        it('should put the dialog in a seamless state', () => {
          const model = ref(true)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              seamless: true
            }
          })

          cy.dataCy('dialog-form')
            .should('have.class', 'q-dialog--seamless')

          cy.dataCy('input-field')
            .should('be.visible')
            .then(async () => {
              await Cypress.vueWrapper.setProps({ seamless: false })
            })

          cy.dataCy('dialog-form')
            .should('not.have.class', 'q-dialog--seamless')
          cy.dataCy('input-field')
            .should('not.be.visible')
        })
      })

      describe('(prop): maximized', () => {
        it('should maximize the dialog', () => {
          const model = ref(false)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              maximized: true
            }
          })

          cy.dataCy('dialog-page').then(() => {
            model.value = true

            getHostElement().then(() => {
              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--maximized')
                .should('exist')
              cy.dataCy('input-field')
                .should('not.be.visible')
                .then(() => {
                  Cypress.vueWrapper.setProps({ maximized: false })
                })

              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--maximized')
                .should('not.exist')
            })
          })
        })
      })

      describe('(prop): full-width', () => {
        it('should use a full-width for the dialog', () => {
          const model = ref(false)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              fullWidth: true
            }
          })

          cy.dataCy('dialog-page').then(() => {
            model.value = true

            getHostElement().then(() => {
              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--fullwidth')
                .should('exist').then(() => {
                  Cypress.vueWrapper.setProps({ fullWidth: false })
                })

              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--fullwidth')
                .should('not.exist')
            })
          })
        })
      })

      describe('(prop): full-height', () => {
        it('should set the dialog to full-height', () => {
          const model = ref(false)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              fullHeight: true
            }
          })

          cy.dataCy('dialog-page').then(() => {
            model.value = true

            getHostElement().then(() => {
              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--fullheight')
                .should('exist')
                .then(() => {
                  Cypress.vueWrapper.setProps({ fullHeight: false })
                })

              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--fullheight')
                .should('not.exist')
            })
          })
        })
      })

      describe('(prop): position', () => {
        it('should display the dialog at a specific position', () => {
          const model = ref(false)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model)
            }
          })

          cy.dataCy('dialog-page').then(() => {
            model.value = true

            const positions = [ 'top', 'right', 'bottom', 'left' ]
            for (const position of positions) {
              getHostElement()
                .then(() => {
                  Cypress.vueWrapper.setProps({ position })

                  cy.dataCy('dialog-form')
                    .get(`.q-dialog__inner--${ position }.fixed-${ position }`)
                    .should('exist')
                })
            }
          })
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): square', () => {
        it('should use a square style for dialog', () => {
          const model = ref(false)
          mountQDialogWrapper({
            props: {
              ...vModelAdapter(model),
              square: true
            }
          })

          cy.dataCy('dialog-page').then(() => {
            model.value = true

            getHostElement().then(() => {
              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--square')
                .should('exist')
                .then(() => {
                  Cypress.vueWrapper.setProps({ square: false })
                })

              cy.dataCy('dialog-form')
                .get('.q-dialog__inner--square')
                .should('not.exist')
            })
          })
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should display a default slot', () => {
        const model = ref(false)
        mountQDialogWrapper({
          props: {
            ...vModelAdapter(model)
          }
        })

        cy.dataCy('dialog-page').then(() => {
          model.value = true

          // Host element is the default slot, so let's simply test that it exists
          getHostElement().should('exist')
        })
      })
    })
  })

  describe('Events', () => {
    describe('(event): shake', () => {
      it('should emit shake event', () => {
        const fn = cy.stub()
        const model = ref(true)
        mountQDialogWrapper({
          props: {
            ...vModelAdapter(model),
            persistent: true,
            onShake: fn
          }
        })

        getHostElement()
          .then(() => {
            closeDialogViaBackdrop()
            cy.get('.q-dialog__inner')
              .should('have.class', 'q-animate--scale')
              .then(() => {
                expect(fn).to.be.calledWith()
              })
          })
      })
    })

    describe('(event): escape-key', () => {
      it('should emit escape-key event', () => {
        const fn = cy.stub()
        const model = ref(true)
        mountQDialogWrapper({
          props: {
            ...vModelAdapter(model),
            onEscapeKey: fn
          }
        })

        cy.withinDialog(() => {
          closeDialogViaEscKey()
        })

        cy.wrap().then(() => {
          expect(fn).to.be.calledWith()
        })
      })
    })
  })

  describe('Methods', () => {
    describe('(method): focus', () => {
      it('should use the focus method to focus on dialog', () => {
        const model = ref(true)
        mountQDialogWrapper({
          props: {
            ...vModelAdapter(model),
            seamless: true
          }
        })

        cy.dataCy('dialog-page').then(() => {
          getHostElement()
            .should('exist').then(() => {
              cy.focused().should('have.class', 'q-dialog__inner')
              cy.dataCy('input-field').type('Hello')
              cy.focused().should('not.have.class', 'q-dialog__inner')
            })

          getHostElement()
            .should('exist')
            .then(() => {
              Cypress.vueWrapper.vm.focus()
              cy.focused().should('have.class', 'q-dialog__inner')
            })
        })
      })
    })

    describe('(method): shake', () => {
      it('should use the shake method to shake dialog', () => {
        const model = ref(true)
        mountQDialogWrapper({
          props: {
            ...vModelAdapter(model),
            persistent: true
          }
        })

        getHostElement()
          .should('exist')
          .then(() => {
            cy.get('.q-dialog__inner')
              .should('not.have.class', 'q-animate--scale')
          })

        getHostElement()
          .should('exist')
          .then(() => {
            Cypress.vueWrapper.vm.shake()
            cy.get('.q-dialog__inner')
              .should('have.class', 'q-animate--scale')
          })
      })
    })
  })
})
