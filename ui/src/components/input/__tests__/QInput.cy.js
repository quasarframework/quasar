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
        it('should apply the input class to the underlying element', () => {
          mountQInput()
          getHostElement().get('input.input-class').should('not.exist')

          mountQInput({
            props: {
              inputClass: 'input-class'
            }
          })

          getHostElement().get('input.input-class').should('exist')
        })

        it('should apply the input class specified as an object', () => {
          mountQInput({
            props: {
              inputClass: { 'input-class': true }
            }
          })

          getHostElement().get('input.input-class').should('exist')
        })
      })

      describe('(prop): input-style', () => {
        it('should set input-style as string', () => {
          mountQInput({
            props: {
              inputStyle: 'background-color: red'
            }
          })

          getHostElement().get('input[style="background-color: red;"]').should('exist')
        })

        it('should set input-style as an object', () => {
          mountQInput({
            props: {
              inputStyle: { backgroundColor: 'red' }
            }
          })

          getHostElement().get('input[style="background-color: red;"]').should('exist')
        })
      })

      describe('(prop): label-color', () => {
        it('should display a label color', () => {
          const label = 'Hello there!'
          mountQInput({
            props: {
              label,
              labelColor: 'red'
            }
          })

          getHostElement().get('.q-field__label.text-red').should('contain', label)
        })
      })

      describe('(prop): color', () => {
        it('should set a color on the component', () => {
          mountQInput()
          getHostElement().get('.q-field__control.text-red').should('not.exist')
          mountQInput({
            props: {
              color: 'red'
            }
          })

          getHostElement().get('input').then(() => {
            Cypress.vueWrapper.vm.focus()
            getHostElement().get('.q-field__control.text-red').should('exist')
          })
        })
      })

      describe('(prop): bg-color', () => {
        it('should display a background color', () => {
          mountQInput({
            props: {
              bgColor: 'red'
            }
          })

          getHostElement().get('.q-field__control.bg-red').should('exist')
        })
      })

      describe('(prop): filled', () => {
        it('should use a filled design', () => {
          mountQInput({
            props: {
              filled: true
            }
          })

          getHostElement().get('.q-field--filled').should('exist')
        })
      })

      describe('(prop): outlined', () => {
        it('should use a outlined design', () => {
          mountQInput({
            props: {
              outlined: true
            }
          })

          getHostElement().get('.q-field--outlined').should('exist')
        })
      })

      describe('(prop): borderless', () => {
        it('should use a borderless design', () => {
          mountQInput({
            props: {
              borderless: true
            }
          })

          getHostElement().get('.q-field--borderless').should('exist')
        })
      })

      describe('(prop): standout', () => {
        it('should display a standout color', () => {
          mountQInput({
            props: {
              standout: true
            }
          })

          getHostElement().get('.q-field--standout').should('exist')
        })
      })

      describe('(prop): hide-bottom-space', () => {
        it('should hide bottom space', () => {
          mountQInput({
            props: {
              rules: [ (value) => !!value || '' ]
            }
          })
          getHostElement().get('.q-field__messages').should('exist')

          mountQInput({
            props: {
              rules: [ (value) => !!value || '' ],
              hideBottomSpace: true
            }
          })

          getHostElement().get('.q-field__messages').should('not.exist')
        })
      })

      describe('(prop): rounded', () => {
        it('should use a rounded design', () => {
          mountQInput({
            props: {
              rounded: true
            }
          })

          getHostElement().get('.q-field--rounded').should('exist')
        })
      })

      describe('(prop): square', () => {
        it('should use a square design', () => {
          mountQInput({
            props: {
              square: true
            }
          })

          getHostElement().get('.q-field--square').should('exist')
        })
      })

      describe('(prop): dense', () => {
        it('should use a dense design', () => {
          mountQInput({
            props: {
              dense: true
            }
          })

          getHostElement().get('.q-field--dense').should('exist')
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
