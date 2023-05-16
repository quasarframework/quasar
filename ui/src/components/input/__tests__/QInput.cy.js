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
      it('should emit onUpdate:modelValue event', () => {
        const fn = cy.stub()
        const text = 'Hello there'
        mountQInput({
          props: {
            'onUpdate:modelValue': fn
          }
        })
        getHostElement()
          .get('input')
          .type(text)
          .then(() => {
            expect(fn).to.be.calledWith(text)
          })
      })
    })

    describe('(event): focus', () => {
      it('should emit focus event', () => {
        const fn = cy.stub()
        mountQInput({
          props: {
            onfocus: fn,
            autoFocus: true
          }
        })

        getHostElement()
          .get('input')
          .as('input')
          .focus()

        cy.get('@input').then(() => {
          expect(fn).to.be.calledWith()
        })
      })
    })

    describe('(event): blur', () => {
      it('should emit blur event', () => {
        const fn = cy.stub()
        mountQInput({
          props: {
            onblur: fn
          }
        })

        getHostElement()
          .get('input')
          .focus()
          .blur()
          .then(() => {
            expect(fn).to.be.calledWith()
          })
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
