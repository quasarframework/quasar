import FieldWrapper from './FieldWrapper.vue'
import Icons from '../../../../icon-set/material-icons.mjs'

// const snapshotOptions = { customSnapshotsDir: '../__tests__' }

describe('use-validate API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): error', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): rules', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): reactive-rules', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): lazy-rules', () => {
        it.skip(' ', () => {
          //
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
        it.skip(' ', () => {
          //
        })
      })
    })
  })

  describe('Methods', () => {
    describe('(method): resetValidation', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): validate', () => {
      it.skip(' ', () => {
        //
      })
    })
  })
})
