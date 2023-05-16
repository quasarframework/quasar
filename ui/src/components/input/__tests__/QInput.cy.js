import QInput from '../QInput'

function getHostElement () {
  return cy.get('.q-field')
}

function mountQInput (options) {
  return cy.mount(QInput, options)
}
describe('Input API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): shadow-text', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): autogrow', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): type', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): debounce', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): maxlength', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): input-class', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): input-style', () => {
        it.skip(' ', () => {
          //
        })
      })
    })
  })

  describe('Events', () => {
    describe('(event): update:model-value', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): focus', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): blur', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Methods', () => {
    describe('(method): focus', () => {
      it('should focus the component', () => {
        mountQInput()

        getHostElement()
          .get('.q-field--focused')
          .should('not.exist')
          .get('input')
          .should('not.have.focus')
        getHostElement()
          .then(() => {
            Cypress.vueWrapper.vm.focus()
          })
        getHostElement()
          .get('.q-field--focused')
          .should('exist')
          .get('input')
          .should('have.focus')
      })
    })

    describe('(method): blur', () => {
      it('should blur the component', () => {
        mountQInput()
        getHostElement()
          .get('input').focus()
        getHostElement()
          .get('.q-field--focused')
          .should('exist')
          .get('input')
          .should('have.focus')

        getHostElement()
          .then(() => {
            Cypress.vueWrapper.vm.blur()
          })

        getHostElement().get('.q-field--focused').should('not.exist').get('input').should('not.have.focus')
      })
    })

    describe('(method): select', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): getNativeElement', () => {
      it.skip(' ', () => {
        //
      })
    })
  })
})
