import FieldWrapper from './FieldWrapper.vue'
import Icons from '../../../../icon-set/material-icons.mjs'
import { ref } from 'vue'
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'

function mountQFieldWrapper (options) {
  return cy.mount(FieldWrapper, options)
}

function getHostElement () {
  return cy.get('.select-root')
}

describe('use-validate API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): error', () => {
        it('should mark the field as having an error', () => {
          mountQFieldWrapper()
          getHostElement().should('not.have.class', 'q-field--error')

          getHostElement().then(() => {
            Cypress.vueWrapper.setProps({ error: true })
          })

          getHostElement().should('have.class', 'q-field--error')
        })
      })

      describe('(prop): rules', () => {
        it('should validate value using custom validation logic', () => {
          const errorMessage = 'Selected value should be greater than 10 characters'
          const model = ref('Option 1')
          const options = [ 'Option 1', 'Option 2' ]

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options,
              rules: [ val => val.length > 10 || errorMessage ]
            }
          })

          getHostElement().then(() => {
            model.value = 'Option 2'
          })
          getHostElement().get('.q-field__messages').should('contain.text', errorMessage)
        })

        it('should validate email using inbuilt validation logic', () => {
          const errorMessage = 'Enter a valid email address'
          const model = ref('Option 1')
          const options = [ 'Option 1', 'Option 2' ]
          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options,
              rules: [ (val, rules) => rules.email(val) || errorMessage ]
            }
          })
          getHostElement().then(() => {
            model.value = 'Option 2'
          })
          getHostElement().get('.q-field__messages').should('contain.text', errorMessage)
        })
      })

      describe('(prop): reactive-rules', () => {
        it('should trigger validation when there\'s a change of rules', () => {
          const errorMessage = 'Error message'
          const model = ref('Option 1')
          const options = [ 'Option 1', 'Option 2' ]
          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options
            }
          })

          getHostElement().then(() => {
            Cypress.vueWrapper.setProps({ rules: [ (value) => value.length < 3 || errorMessage ] })

            Cypress.vueWrapper.vm.focusMethod()
            Cypress.vueWrapper.vm.blur()
          })
          getHostElement().get('.q-field__messages').should('not.exist')

          getHostElement().then(() => {
            Cypress.vueWrapper.setProps({ reactiveRules: true, rules: [ (value, rules) => rules.email(value) || errorMessage ] })
          })
          getHostElement().get('.q-field__messages').should('contain.text', errorMessage)
        })
      })

      describe('(prop): lazy-rules', () => {
        it('should validate the input only when component loses focus', () => {
          const errorMessage = 'Use a max 3 of characters'
          const model = ref('Option 1')
          const options = [ 'Option 1', 'Option 2' ]
          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options,
              lazyRules: true,
              rules: [ () => errorMessage ]
            }
          })

          getHostElement().select('Option 2')
          getHostElement().get('.q-field__messages').should('not.contain', errorMessage)

          getHostElement().then(() => {
            Cypress.vueWrapper.vm.blur()
            getHostElement().get('.q-field__messages').should('contain.text', errorMessage)
          })
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): error-message', () => {
        it('should show an error-message when error is true', () => {
          const message = 'Please select something'
          cy.mount(FieldWrapper, {
            props: {
              error: true,
              errorMessage: message
            }
          })
          cy.get('.select-root')
            .should('include.text', message)
        })

        it('should not show an error-message when error is false', () => {
          const message = 'Please select something'
          cy.mount(FieldWrapper, {
            props: {
              error: false,
              errorMessage: message
            }
          })
          cy.get('.select-root')
            .should('not.include.text', message)
        })
      })

      describe('(prop): no-error-icon', () => {
        it('should not show an error icon when error is true', () => {
          cy.mount(FieldWrapper, {
            props: {
              error: true,
              noErrorIcon: true
            }
          })
          cy.get('.select-root')
            .get(`i:contains(${ Icons.field.error })`)
            .should('not.exist')
        })

        it('should show an error icon when error is true an no-error-icon is false', () => {
          cy.mount(FieldWrapper, {
            props: {
              error: true,
              noErrorIcon: false
            }
          })
          cy.get('.select-root')
            .get(`i:contains(${ Icons.field.error })`)
            .should('exist')
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should correctly update the model value', () => {
          const model = ref()
          const options = [ 'Option 1', 'Option 2' ]
          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options
            }
          })
          getHostElement().get('input').should('not.have.value', options[ 0 ])

          getHostElement().then(() => {
            model.value = options[ 0 ]
          })

          getHostElement().get('input').should('have.value', options[ 0 ])
        })
      })
    })
  })

  describe('Methods', () => {
    describe('(method): resetValidation', () => {
      it('should reset validation', () => {
        const errorMessage = 'Use a max 3 of characters'
        const model = ref('Option 1')
        const options = [ 'Option 1', 'Option 2' ]
        mountQFieldWrapper({
          props: {
            ...vModelAdapter(model),
            options,
            rules: [ val => val.length <= 3 || errorMessage ],
            lazyRules: 'ondemand'
          }
        })

        getHostElement().then(() => {
          model.value = 'Option 2'
        })
        getHostElement().get('.q-field__messages').should('not.contain', errorMessage)

        getHostElement().then(() => {
          Cypress.vueWrapper.vm.validate()
          getHostElement().get('.q-field__messages').should('contain', errorMessage)
        })

        getHostElement().then(() => {
          Cypress.vueWrapper.vm.resetValidation()
          getHostElement().get('.q-field__messages').should('not.contain', errorMessage)
        })
      })
    })

    describe('(method): validate', () => {
      it('should validate the input only when component\'s validate() method is called', () => {
        const errorMessage = 'Use a max 3 of characters'
        const model = ref('Option 1')
        const options = [ 'Option 1', 'Option 2' ]
        mountQFieldWrapper({
          props: {
            ...vModelAdapter(model),
            options,
            rules: [ val => val.length <= 3 || errorMessage ],
            lazyRules: 'ondemand'
          }
        })

        getHostElement().then(() => {
          model.value = 'Option 2'
        })
        getHostElement().get('.q-field__messages').should('not.contain', errorMessage)

        getHostElement().get('input').then(() => {
          Cypress.vueWrapper.vm.blur()
          getHostElement().get('.q-field__messages').should('not.contain', errorMessage)
          Cypress.vueWrapper.vm.validate()
          getHostElement().get('.q-field__messages').should('contain', errorMessage)
        })
      })
    })
  })
})
