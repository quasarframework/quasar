import { mount } from '@cypress/vue'
import WrapperOne from './WrapperOne.vue'
import Icons from './../../../../icon-set/material-icons'

const snapshotOptions = { customSnapshotsDir: '../src/components/select/__tests__' }

// QSelect does not set the `data-cy` attribute on the root element, but on the `.q-field__native` element
// This means we cannot use data-cy everywhere, but instead use a custom class `select-root` for this purpose
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
        cy.get('.select-root')
          .get('select')
          .should('have.attr', 'name', 'usefor')
      })
    })
  })

  describe('Content', () => {
    describe.skip('(prop): table-colspan', () => {
      it('', () => {
        //
      })
    })

    describe('(prop): error-message', () => {
      it('should show an error-message when error is true', () => {
        const message = 'Please select something'
        mount(WrapperOne, {
          attrs: {
            error: true,
            errorMessage: message
          }
        })
        cy.get('.select-root')
          .should('include.text', message)
      })

      it('should not show an error-message when error is false', () => {
        const message = 'Please select something'
        mount(WrapperOne, {
          attrs: {
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
        mount(WrapperOne, {
          attrs: {
            error: true,
            noErrorIcon: true
          }
        })
        cy.get('.select-root')
          .get(`i:contains(${ Icons.field.error })`)
          .should('not.exist')
      })

      it('should show an error icon when error is true an no-error-icon is false', () => {
        mount(WrapperOne, {
          attrs: {
            error: true,
            noErrorIcon: false
          }
        })
        cy.get('.select-root')
          .get(`i:contains(${ Icons.field.error })`)
          .should('exist')
      })
    })

    describe('(prop): label', () => {
      it('should show the label when supplied', () => {
        const label = 'Select something'
        mount(WrapperOne, {
          attrs: {
            label
          }
        })
        cy.get('.select-root')
          .should('contain.text', label)
      })

      it('should show the label centered when not focused', () => {
        const label = 'Select something'
        mount(WrapperOne, {
          attrs: {
            label
          }
        })
        cy.get('.select-root')
          .get(`div:contains(${ label })`)
          .should('exist')
        cy.get('.select-root').matchImageSnapshot(snapshotOptions)
      })

      it('should show the label stacked when focused', () => {
        const label = 'Select something'
        mount(WrapperOne, {
          attrs: {
            label
          }
        })
        cy.get('.select-root [tabindex="0"]')
          .focus()
        cy.get(`.select-root:contains(${ label })`)
          .should('exist')
        cy.get('.select-root').matchImageSnapshot(snapshotOptions)
      })
    })

    describe('(prop): stack-label', () => {
      it('should show the label stacked', () => {
        const label = 'Select something'
        mount(WrapperOne, {
          attrs: {
            label,
            stackLabel: true
          }
        })
        cy.get(`.select-root:contains(${ label })`)
          .should('exist')
        cy.get('.select-root').matchImageSnapshot(snapshotOptions)
      })
    })

    describe.skip('(prop): hint', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): hide-hint', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): prefix', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): suffix', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): loading', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): clearable', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): clear-icon', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): label-slot', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): bottom-slots', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): counter', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): hide-dropdown-icon', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): dropdown-icon', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): use-input', () => {
      it('', () => {
        //
      })
    })

    describe.skip('(prop): input-debounce', () => {
      it('', () => {
        //
      })
    })
  })
})
