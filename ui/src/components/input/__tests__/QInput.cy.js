import QInput from '../QInput'
import { ref } from 'vue'
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'

function getHostElement () {
  return cy.get('.q-field')
}

function mountQInput (options) {
  return cy.mount(QInput, options)
}

describe('Input API', () => {
  describe('Props', () => {
    describe('Category: behaviour', () => {
      describe('(prop): error', () => {
        it('should mark the field as having an error', () => {
          mountQInput()
          getHostElement().should('not.have.class', 'q-field--error')

          mountQInput({
            props: {
              error: true
            }
          })

          getHostElement().should('have.class', 'q-field--error')
        })
      })

      describe('(prop): rules', () => {
        it('should validate value using custom validation logic', () => {
          const errorMessage = 'Use a max 3 of characters'
          const model = ref('')
          mountQInput({
            props: {
              ...vModelAdapter(model),
              rules: [ val => val.length <= 3 || errorMessage ]
            }
          })
          getHostElement().get('input').type('1234')
          getHostElement().get('.q-field__messages').should('contain', errorMessage)
        })

        it('should validate email using inbuilt validation logic', () => {
          const errorMessage = 'Enter a valid email address'
          const model = ref('')
          mountQInput({
            props: {
              ...vModelAdapter(model),
              rules: [ (val, rules) => rules.email(val) || errorMessage ]
            }
          })
          getHostElement().get('input').type('1234')
          getHostElement().get('.q-field__messages').should('contain', errorMessage)
        })
      })

      describe('(prop): loading', () => {
        it('should should set the component into a loading state', () => {
          mountQInput({
            props: {
              loading: true
            }
          })

          getHostElement().get('.q-spinner').should('exist')
        })
      })

      describe('(prop): clearable', () => {
        it('should append a cancel icon', () => {
          const model = ref('')

          mountQInput({
            props: {
              ...vModelAdapter(model),
              clearable: true
            }
          })

          getHostElement().get('input').type('1')
          getHostElement().get('button').should('exist').should('contain', 'cancel')
        })
      })

      describe('(prop): autofocus', () => {
        it('should autofocus on component', () => {
          mountQInput({
            props: {
              autofocus: true
            }
          })

          getHostElement()
            .get('.q-field--focused')
            .should('exist')
            .get('input')
            .should('have.focus')
        })
      })

      describe('(prop): lazy-rules', () => {
        it('should validate the input only when component loses focus', () => {
          const errorMessage = 'Use a max 3 of characters'
          const model = ref('')
          mountQInput({
            props: {
              ...vModelAdapter(model),
              rules: [ val => val.length <= 3 || errorMessage ],
              lazyRules: true
            }
          })

          getHostElement().get('input').type('1234')
          getHostElement().get('.q-field__messages').should('not.contain', errorMessage)

          getHostElement().get('input').then(() => {
            Cypress.vueWrapper.vm.blur()
            getHostElement().get('.q-field__messages').should('contain', errorMessage)
          })
        })

        it('should validate the input only when component\'s validate() method is called', () => {
          const errorMessage = 'Use a max 3 of characters'
          const model = ref('')
          mountQInput({
            props: {
              ...vModelAdapter(model),
              rules: [ val => val.length <= 3 || errorMessage ],
              lazyRules: 'ondemand'
            }
          })

          getHostElement().get('input').type('1234')
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

    describe('Category: content', () => {
      describe('(prop): error-message', () => {
        it('should display validation error message if error = true', () => {
          const errorMessage = 'Username must have at least 3 characters'
          mountQInput({
            props: {
              errorMessage
            }
          })
          getHostElement().should('not.contain', errorMessage)

          mountQInput({
            props: {
              error: true,
              errorMessage
            }
          })
          getHostElement().should('contain', errorMessage)
        })
      })

      describe('(prop): no-error-icon', () => {
        it('should hide error icon when there is an error', () => {
          mountQInput({
            props: {
              error: true,
              errorMessage: 'error message'
            }
          })

          getHostElement().get('.q-field__append .q-icon').should('contain', 'error')

          mountQInput({
            props: {
              error: true,
              errorMessage: 'error message',
              noErrorIcon: true
            }
          })

          getHostElement().get('.q-field__append .q-icon').should('not.exist')
        })
      })

      describe('(prop): label', () => {
        it('should display the label set', () => {
          const label = 'Hello there!'

          mountQInput({
            props: {
              label
            }
          })

          getHostElement().get('.q-field__label').should('contain', label)
        })
      })

      describe('(prop): stack-label', () => {
        it('should stack label', () => {
          const label = 'Hello there!'
          mountQInput({
            props: {
              label
            }
          })
          getHostElement().should('not.have.class', 'q-field--float')

          mountQInput({
            props: {
              label,
              stackLabel: true
            }
          })

          getHostElement().should('have.class', 'q-field--float')
        })
      })

      describe('(prop): hint', () => {
        it('should display the hint message', () => {
          const hint = 'hint message'
          mountQInput({
            props: {
              hint
            }
          })

          getHostElement().get('.q-field__messages').should('contain', hint)
        })
      })

      describe('(prop): hide-hint', () => {
        it('should hide hint when element is not focused', () => {
          const hint = 'hint message'
          mountQInput({
            props: {
              hint,
              hideHint: true
            }
          })
          getHostElement().get('.q-field__messages').should('not.contain', hint)

          getHostElement().get('input').then(() => {
            Cypress.vueWrapper.vm.focus()
            getHostElement().get('.q-field__messages').should('contain', hint)
          })
        })
      })

      describe('(prop): prefix', () => {
        it('should display a prefix', () => {
          const prefix = 'Hello there!'
          mountQInput({
            props: {
              prefix
            }
          })

          getHostElement().get('.q-field__prefix').should('exist').should('contain', prefix)
        })
      })

      describe('(prop): suffix', () => {
        it('should display a suffix', () => {
          const suffix = 'Hello there!'
          mountQInput({
            props: {
              suffix
            }
          })

          getHostElement().get('.q-field__suffix').should('exist').should('contain', suffix)
        })
      })

      describe('(prop): clear-icon', () => {
        it('should display custom clear-icon when one is set', () => {
          const model = ref('')
          const clearIcon = 'custom-clear-icon'
          mountQInput({
            props: {
              ...vModelAdapter(model),
              clearable: true,
              clearIcon
            }
          })

          getHostElement().get('input').type('123')
          getHostElement().get('.q-field__append').get('button').should('contain', clearIcon)
        })
      })

      describe('(prop): label-slot', () => {
        it('should force use the label slot when a label is not set', () => {
          const labelSlot = 'Hello there'
          mountQInput({
            props: {
              labelSlot: true
            },
            slots: {
              label: () => labelSlot
            }
          })

          getHostElement().get('.q-field__label').should('contain', labelSlot)
        })
      })

      describe('(prop): counter', () => {
        it('should show an automatic counter on bottom right', () => {
          const model = ref('')
          mountQInput({
            props: {
              ...vModelAdapter(model),
              counter: true
            }
          })

          const value = '1234'
          getHostElement().get('input').type(value)
          getHostElement().get('.q-field__counter').should('contain', value.length)
        })
      })

      describe('(prop): shadow-text', () => {
        it('should render shadow-text', () => {
          const shadowText = 'Shadow Text'

          mountQInput({
            props: {
              shadowText
            }
          })

          getHostElement().get('.q-field__shadow').should('exist').contains(shadowText)
        })
      })

      describe('(prop): autogrow', () => {
        it('should use textarea for input field', () => {
          mountQInput()
          getHostElement().get('textarea').should('not.exist').get('input').should('exist')

          mountQInput({
            props: {
              autogrow: true
            }
          })

          getHostElement().get('textarea').should('exist')
          getHostElement().get('input').should('not.exist')
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): type', () => {
        it('should render an input text type by default', () => {
          mountQInput()

          getHostElement().get('input[type=text]').should('exist')
        })

        it('should render with the appropriate type set', () => {
          const types = [ 'text', 'password', 'email', 'search', 'tel', 'file', 'number', 'url', 'time', 'date' ]

          types.forEach((type) => {
            mountQInput({
              props: {
                type
              }
            })

            getHostElement().get(`input[type="${ type }"]`).should('exist')
          })

          mountQInput({
            props: {
              type: 'textarea'
            }
          })

          getHostElement().get('input').should('not.exist').get('textarea').should('exist')
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should render with the correct model value', () => {
          const model = ref('Input Model Value')
          mountQInput()
          getHostElement().get('input').should('not.have.value', model.value)

          mountQInput({
            props: {
              modelValue: model.value
            }
          })

          getHostElement().get('input').should('have.value', model.value)
        })
      })

      describe('(prop): debounce', () => {
        it('should no input debounce by default', () => {
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

        it('should use a custom input-debounce', () => {
          const fn = cy.stub()
          const text = 'Hello there'
          mountQInput({
            props: {
              'onUpdate:modelValue': fn,
              debounce: 800
            }
          })
          getHostElement()
            .get('input')
            .type(text)
            .wait(500)
            .then(() => {
              expect(fn).not.to.be.calledWith(text)
            })
            .wait(300)
            .then(() => {
              expect(fn).to.be.calledWith(text)
            })
        })
      })

      describe('(prop): maxlength', () => {
        it('should respect the maxLength specified', () => {
          mountQInput()
          getHostElement()
            .get('input')
            .type('1234567890abcdefghij')
            .should('have.value', '1234567890abcdefghij')

          mountQInput({
            props: {
              maxlength: 10
            }
          })

          getHostElement()
            .get('input')
            .type('1234567890abcdefghij')
            .should('have.value', '1234567890')
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
