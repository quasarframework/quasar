/* eslint-disable no-unused-expressions */
import { mount } from '@cypress/vue'
import WrapperOne from './../../../components/menu/__tests__/WrapperOne.vue'
import WrapperTwo from './../../../components/menu/__tests__/WrapperTwo.vue'
import { ref } from 'vue'
import { vModelAdapter } from '../../../../test/cypress/helpers/v-model-adapter'

describe('use-model-toggle API', () => {
  describe('Props', () => {
    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should open the dialog when modifying the model-value', () => {
          const model = ref(false)
          mount(WrapperOne, {
            props: {
              ...vModelAdapter(model)
            }
          })
          cy.dataCy('wrapper')
          cy.dataCy('menu')
            .should('not.exist')
            .then(() => {
              model.value = true
              cy.dataCy('menu')
                .should('exist')
            })
        })

        it('should close the dialog when modifying the model-value', () => {
          const model = ref(true)
          mount(WrapperOne, {
            props: {
              ...vModelAdapter(model)
            }
          })
          cy.dataCy('wrapper')
          cy.dataCy('menu')
            .should('exist')
            .then(() => {
              model.value = false
              cy.dataCy('menu')
                .should('not.exist')
            })
        })
      })
    })
  })

  describe('Events', () => {
    describe('(event): update:model-value', () => {
      it('should emit @update:model-value event when state changes', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          props: {
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

    describe('(event): show', () => {
      it('should emit @show event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          props: {
            onShow: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
          .click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
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
          props: {
            onShow: fn
          }
        })

        expect(fn).not.to.be.called
        cy.dataCy('wrapper')
        cy.dataCy('method-show')
          .click({ force: true }) // Element is hidden to prevent clogging the window
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.dataCy('menu')
          .should('exist')
          .wait(300) // Await menu animation
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('(event): before-show', () => {
      it('should emit @before-show event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          props: {
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
          props: {
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

    describe('(event): hide', () => {
      it('should emit @hide event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          props: {
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
          props: {
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

    describe('(event): before-hide', () => {
      it('should emit @before-hide event when menu is triggered by parent', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          props: {
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
          props: {
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
  })

  describe('Methods', () => {
    describe('(method): show', () => {
      it('should trigger the menu to show', () => {
        mount(WrapperOne)

        cy.dataCy('wrapper')
        cy.dataCy('method-show')
          .click({ force: true })
        cy.dataCy('menu')
          .should('exist')
      })
    })

    describe('(method): hide', () => {
      it('should trigger the menu to hide', () => {
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

    describe('(method): toggle', () => {
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
  })
})
