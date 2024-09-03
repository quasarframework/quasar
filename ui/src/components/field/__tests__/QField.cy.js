import QField from '../QField'
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'
import { ref } from 'vue'
import Icons from '../../../../icon-set/material-icons.mjs'

function getHostElement () {
  return cy.get('.q-field')
}

function mountQField (options) {
  return cy.mount(QField, options)
}

describe('Field API', () => {
  describe('Props', () => {
    describe('Category: model', () => {
      describe('(prop): maxlength', () => {
        it.skip(' ', () => {
          // It is tricky to test this since it will require that we setup a control slot with v-model.
          // This is already tested in QInput and others using use-field composable, so are not testing it.
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): control', () => {
      it('should use control slot as content of the field', () => {
        const controlSlot = 'Hello there'
        mountQField({
          slots: {
            control: () => controlSlot
          }
        })

        getHostElement().get('.q-field__control-container').should('contain', controlSlot)
      })
    })
  })

  describe('Events', () => {
    describe('(event): update:model-value', () => {
      it('should emit onUpdate:modelValue event', () => {
        const model = ref('text')
        const fn = cy.stub()
        mountQField({
          props: {
            ...vModelAdapter(model),
            'onUpdate:modelValue': fn,
            clearable: true
          }
        })

        getHostElement().get('button[type="button"]')
          .contains(Icons.field.clear).click()
          .then(() => {
            expect(fn).to.be.calledWith()
          })
      })
    })

    describe('(event): focus', () => {
      it('should emit the focus event', () => {
        const fn = cy.stub()

        mountQField({
          props: {
            onfocus: fn
          },
          slots: {
            control: 'text'
          }
        })

        getHostElement().click()

        getHostElement().then(() => {
          expect(fn).to.be.calledWith()
        })
      })
    })

    describe('(event): blur', () => {
      it('should emit blur event', () => {
        const fn = cy.stub()
        mountQField({
          props: {
            onblur: fn
          },
          slots: {
            control: 'text'
          }
        })

        getHostElement()
          .click()

        getHostElement().then(() => {
          Cypress.vueWrapper.vm.blur()
        })

        getHostElement()
          .then(() => {
            expect(fn).to.be.calledWith()
          })
      })
    })
  })

  describe('Methods', () => {
    describe('(method): focus', () => {
      it('should focus the component', () => {
        mountQField({
          slots: {
            control: 'text'
          }
        })

        getHostElement()
          .get('.q-field--focused')
          .should('not.exist')

        getHostElement()
          .then(() => {
            Cypress.vueWrapper.vm.focus()
          })
        getHostElement()
          .get('.q-field--focused')
          .should('exist')
      })
    })

    describe('(method): blur', () => {
      it('should blur the component', () => {
        mountQField({
          slots: {
            control: 'text'
          }
        })

        getHostElement().click()

        getHostElement()
          .get('.q-field--focused')
          .should('exist')

        getHostElement()
          .then(() => {
            Cypress.vueWrapper.vm.blur()
          })

        cy.get('.q-field--focused').should('not.exist')
      })
    })
  })
})
