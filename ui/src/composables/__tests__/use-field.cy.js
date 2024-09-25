import FieldWrapper from './FieldWrapper.vue'
import { ref } from 'vue'
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'
import Icons from '../../../../icon-set/material-icons.mjs'

function mountQFieldWrapper (options) {
  return cy.mount(FieldWrapper, options)
}

function getHostElement () {
  return cy.get('.select-root')
}

const selectOptions = [ 'Option 1', 'Option 2' ]

describe('use-field API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): autofocus', () => {
        it('should autofocus on component', () => {
          mountQFieldWrapper({
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

      describe('(prop): for', () => {
        it('should set the for attribute for the value and the id of the control', () => {
          const forProp = 'hello-there'

          mountQFieldWrapper({
            props: {
              for: forProp
            }
          })

          getHostElement().should('have.attr', 'for', forProp)
          getHostElement().get('input').should('have.id', forProp)
        })
      })

      describe('(prop): name', () => {
        it('should use the value of the for prop as control name if name is not set', () => {
          const forProp = 'hello-there'
          const model = ref(selectOptions[ 0 ])

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              for: forProp
            }
          })

          getHostElement().get('select').should('have.attr', 'name', forProp)
        })

        it('should set the name of the control', () => {
          const name = 'hello-there'
          const model = ref(selectOptions[ 0 ])

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              name
            }
          })

          getHostElement().get('select').should('have.attr', 'name', name)
        })
      })
    })

    describe('Category: behavior|content', () => {
      describe('(prop): loading', () => {
        it('should set the component into a loading state', () => {
          mountQFieldWrapper({
            props: {
              loading: true
            }
          })

          getHostElement().get('.q-spinner').should('exist')
        })
      })

      describe('(prop): clearable', () => {
        it('should append a clear icon', () => {
          const model = ref(selectOptions[ 0 ])

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              clearable: true,
              options: selectOptions
            }
          })

          getHostElement().find('input').should('exist').should('have.value', model.value)
          getHostElement().get('button[type="button"]').contains(Icons.field.clear).click()
          getHostElement().get('input').should('have.value', '')
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): label', () => {
        it('should show the label when supplied', () => {
          const label = 'Select something'
          cy.mount(FieldWrapper, {
            props: {
              label
            }
          })
          cy.get('.select-root')
            .should('contain.text', label)
        })

        it('should show the label centered when not focused', () => {
          const label = 'Select something'
          cy.mount(FieldWrapper, {
            props: {
              label
            }
          })
          cy.get('.select-root')
            .get(`div:contains(${ label })`)
            .should('exist')
            .should('not.have.class', 'q-field--float')
        })

        it('should show the label stacked when focused', () => {
          const label = 'Select something'
          cy.mount(FieldWrapper, {
            props: {
              label
            }
          })
          cy.get('.select-root [tabindex="0"]')
            .focus()
          cy.get(`.select-root:contains(${ label })`)
            .should('exist')
            .should('have.class', 'q-field--float')
        })
      })

      describe('(prop): stack-label', () => {
        it('should show the label stacked', () => {
          const label = 'Select something'
          cy.mount(FieldWrapper, {
            props: {
              label,
              stackLabel: true
            }
          })
          cy.get(`.select-root:contains(${ label })`)
            .should('exist')
            .should('have.class', 'q-field--float')
        })
      })

      describe('(prop): hint', () => {
        it('should show a hint text', () => {
          const hint = 'Select something'
          cy.mount(FieldWrapper, {
            props: {
              hint
            }
          })
          cy.get(`.select-root:contains(${ hint })`)
            .should('exist')
        })
      })

      describe('(prop): hide-hint', () => {
        it('should not show a hint text when not focused', () => {
          const hint = 'Select something'
          cy.mount(FieldWrapper, {
            props: {
              hint,
              hideHint: true
            }
          })
          cy.get(`.select-root:contains(${ hint })`)
            .should('not.exist')
        })
        it('should show a hint text when focused', () => {
          const hint = 'Select something'
          cy.mount(FieldWrapper, {
            props: {
              hint,
              hideHint: true
            }
          })
          cy.get('.select-root [tabindex="0"]')
            .focus()
          cy.get(`.select-root:contains(${ hint })`)
            .should('exist')
        })
      })

      describe('(prop): prefix', () => {
        it('should display a prefix', () => {
          const prefix = 'Hello there!'
          mountQFieldWrapper({
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
          mountQFieldWrapper({
            props: {
              suffix
            }
          })

          getHostElement().get('.q-field__suffix').should('exist').should('contain', suffix)
        })
      })

      describe('(prop): clear-icon', () => {
        it('should display custom clear-icon when one is set', () => {
          const model = ref(selectOptions[ 0 ])
          const clearIcon = 'custom-clear-icon'
          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              clearable: true,
              clearIcon
            }
          })

          getHostElement().get('.q-field__append').get('button').should('contain', clearIcon)
        })
      })

      describe('(prop): label-slot', () => {
        it('should force the use of the label slot even when a label prop is set', () => {
          const model = ref(selectOptions[ 0 ])
          const labelSlot = 'Hello world'

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              labelSlot: true,
              label: 'Hello there'
            },
            slots: {
              label: () => labelSlot
            }
          })

          getHostElement().find('.q-field__label').should('contain.text', labelSlot)
        })
      })

      describe('(prop): bottom-slots', () => {
        it('should use a bottom error slot', () => {
          const model = ref(selectOptions[ 0 ])
          const bottomSlot = 'Hello there'

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              bottomSlotSlots: true,
              error: true
            },
            slots: {
              error: () => bottomSlot
            }
          })

          getHostElement().find('.q-field__bottom')
            .should('contain.text', bottomSlot)
        })

        it('should use a bottom hint slot', () => {
          const model = ref(selectOptions[ 0 ])
          const bottomSlot = 'Hello there'

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              bottomSlots: true
            },
            slots: {
              hint: () => bottomSlot
            }
          })

          getHostElement().find('.q-field__bottom').should('contain.text', bottomSlot)
        })

        it('should use a bottom counter slot', () => {
          const model = ref(selectOptions[ 0 ])

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              counter: true
            }
          })

          getHostElement().find('.q-field__bottom').should('contain.text', model.value.length)
        })
      })

      describe('(prop): counter', () => {
        it('should show an automatic counter on bottom right', () => {
          const model = ref(selectOptions[ 0 ])
          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              counter: true
            }
          })

          getHostElement().get('.q-field__counter').should('contain', model.value.length)
        })
      })
    })

    describe('Category: state', () => {
      describe('(prop): disable', () => {
        it('should put the component on disable state', () => {
          mountQFieldWrapper({
            props: {
              disable: true
            }
          })

          getHostElement().should('have.class', 'q-field--disabled')
        })
      })

      describe('(prop): readonly', () => {
        it('should put the component on readonly state', () => {
          mountQFieldWrapper({
            props: {
              readonly: true
            }
          })

          getHostElement().should('have.class', 'q-field--readonly')
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): label-color', () => {
        it('should display a label color', () => {
          const label = 'Hello there!'
          mountQFieldWrapper({
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
          mountQFieldWrapper()
          getHostElement().get('.q-field__control.text-red').should('not.exist')

          getHostElement().get('input').then(() => {
            Cypress.vueWrapper.setProps({ color: 'red' })

            getHostElement().get('.q-field__control.text-red').should('exist')
          })
        })
      })

      describe('(prop): bg-color', () => {
        it('should display a background color', () => {
          mountQFieldWrapper({
            props: {
              bgColor: 'red'
            }
          })

          getHostElement().get('.q-field__control.bg-red').should('exist')
        })
      })

      describe('(prop): hide-bottom-space', () => {
        it.skip(' ', () => {
          //
        })
      })

      const fieldLooks = [ 'item-aligned', 'dark', 'filled', 'outlined', 'borderless', 'standout', 'rounded', 'square', 'dense' ]
      for (const style of fieldLooks) {
        describe(`(prop): ${ style }`, () => {
          it(`should apply ${ style } design style`, () => {
            mountQFieldWrapper({
              props: {
                [ style ]: true
              }
            })

            getHostElement().get(`.q-field--${ style }`).should('exist')
          })
        })
      }
    })
  })

  describe('Slots', () => {
    const slots = [ 'prepend', 'append', 'before', 'after', 'label' ]

    describe('(slot): default', () => {
      it('should use the default slot', () => {
        const model = ref(selectOptions[ 0 ])
        const labelSlot = 'Hello world'

        mountQFieldWrapper({
          props: {
            ...vModelAdapter(model),
            options: selectOptions,
            labelSlot: true
          },
          slots: {
            default: () => labelSlot
          }
        })

        getHostElement().should('contain.text', labelSlot)
      })
    })

    for (const slot of slots) {
      describe(`(slot): ${ slot }`, () => {
        it(`should append a '${ slot }' slot`, () => {
          const model = ref(selectOptions[ 0 ])
          const labelSlot = 'Hello world'

          mountQFieldWrapper({
            props: {
              ...vModelAdapter(model),
              options: selectOptions,
              labelSlot: true
            },
            slots: {
              [ slot ]: () => labelSlot
            }
          })

          getHostElement().get(`.q-field__${ slot }`).should('contain.text', labelSlot)
        })
      })
    }
  })

  describe('Events', () => {
    describe('(event): clear', () => {
      it('should emit the clear event when the clear button is clicked', () => {
        const model = ref(selectOptions[ 0 ])
        const fn = cy.stub()

        mountQFieldWrapper({
          props: {
            ...vModelAdapter(model),
            clearable: true,
            options: selectOptions,
            onClear: fn
          }
        })

        getHostElement().get('button[type="button"]')
          .contains(Icons.field.clear).click()
          .then(() => {
            expect(fn).to.be.calledWith()
          })
      })
    })
  })

  describe('Methods', () => {
    describe('(method): focus', () => {
      it('should focus the component', () => {
        mountQFieldWrapper()

        getHostElement()
          .get('input')
          .should('not.have.focus')
        getHostElement()
          .then(() => {
            Cypress.vueWrapper.vm.focusMethod()
          })
        getHostElement()
          .get('input')
          .should('have.focus')
      })
    })

    describe('(method): blur', () => {
      it('should blur the component', () => {
        mountQFieldWrapper()

        getHostElement()
          .get('input').focus()
        getHostElement()
          .get('.q-field--focused')
          .as('focused-element')
          .should('exist')

        cy.get('@focused-element')
          .get('input')
          .should('have.focus')

        getHostElement()
          .then(() => {
            Cypress.vueWrapper.vm.blur()
          })

        cy.get('@focused-element').should('not.exist')
        getHostElement().get('input').should('not.have.focus')
      })
    })
  })
})
