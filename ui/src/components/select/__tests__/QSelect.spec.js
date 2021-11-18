import { mount } from '@cypress/vue'
import WrapperOne from './WrapperOne.vue'

describe('QSelect API', () => {
  // Behavior tests
  describe('Behavior', () => {
    describe('(prop): name', () => {
      it('should specify the name attribute of the control', () => {
        mount(WrapperOne, {
          attrs: {
            name: 'shouldWork',
            modelValue: 'test', // Name attr is not rendered if there is no selected value
            options: [ 'test' ]
          }
        })
        cy.dataCy('select')
          .get('select')
          .should('have.attr', 'name', 'shouldWork')
      })

      it('should use the `for` as name when name is not supplied', () => {
        mount(WrapperOne, {
          attrs: {
            for: 'usefor',
            modelValue: 'test', // Name attr is not rendered if there is no selected value
            options: [ 'test' ]
          }
        })
        cy.dataCy('select')
          .get('select')
          .should('have.attr', 'name', 'usefor')
      })
    })
  })
})
