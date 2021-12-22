/* eslint-disable no-unused-expressions */
import { mount } from '@cypress/vue'
import { ref } from 'vue'
import WrapperOne from './WrapperOne.vue'

// const snapshotOptions = { customSnapshotsDir: '../src/components/select/__tests__' }

// QSelect does not set the `data-cy` attribute on the root element, but on the `.q-field__native` element
// This means we cannot use data-cy everywhere, but instead use a custom class `select-root` for this purpose
describe('QSelect API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): fill-input', () => {
        it.skip(' ', () => {
          //
        })
      })
      describe('(prop): new-value-mode', () => {
        it.skip(' ', () => {
          //
        })
      })
      describe('(prop): autocomplete', () => {
        it.skip(' ', () => {
          //
        })
      })
      describe('(prop): transition-show', () => {
        it.skip(' ', () => {
          //
        })
      })
      describe('(prop): transition-hide', () => {
        it.skip(' ', () => {
          //
        })
      })
      describe('(prop): transition-duration', () => {
        it.skip(' ', () => {
          //
        })
      })
      describe('(prop): behavior', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): dropdown-icon', () => {
        it('should use the dropdown-icon supplied', () => {
          const icon = 'map'
          mount(WrapperOne, {
            attrs: {
              dropdownIcon: icon
            }
          })
          cy.get('.select-root')
            .get(`div:contains(${ icon })`)
            .should('exist')
        })
      })

      describe('(prop): use-input', () => {
        it('should render an input inside the select', () => {
          mount(WrapperOne, {
            attrs: {
              useInput: true
            }
          })
          cy.get('.select-root')
            .get('input')
            .should('exist')
        })

        it('should not render an input by default', () => {
          mount(WrapperOne)
          cy.get('.select-root')
            .get('input')
            .should('not.exist')
        })
      })

      describe('(prop): input-debounce', () => {
        it('should use an input-debounce of 500ms by default', () => {
          const fn = cy.stub()
          const text = 'Hello there'
          mount(WrapperOne, {
            attrs: {
              useInput: true,
              onFilter: fn
            }
          })
          cy.get('.select-root')
            .get('input')
            .type(text)
            .then(() => {
              expect(fn).not.to.be.calledWith(text)
            })
            .wait(500)
            .then(() => {
              expect(fn).to.be.calledWith(text)
            })
        })

        it('should use a custom input-debounce', () => {
          const fn = cy.stub()
          const text = 'Hello there'
          mount(WrapperOne, {
            attrs: {
              useInput: true,
              onFilter: fn,
              inputDebounce: 800
            }
          })
          cy.get('.select-root')
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
    })

    describe('Category: content|behavior', () => {
      describe('(prop): hide-dropdown-icon', () => {
        it('should show the dropdown-icon when this property is not supplied', () => {
          mount(WrapperOne)
          cy.get('.select-root')
            .get('.q-icon')
            .should('exist')
        })

        it('should hide the dropdown-icon when this property is true', () => {
          mount(WrapperOne, {
            attrs: {
              hideDropdownIcon: true
            }
          })
          cy.get('.select-root')
            .get('.q-icon')
            .should('not.exist')
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): tabindex', () => {
        it('should have a default tabindex of 0', () => {
          mount(WrapperOne)
          cy.get('.select-root [tabindex="0"]')
            .should('exist')
        })

        it('should set the tabindex to the supplied value', () => {
          const tabindex = 2
          mount(WrapperOne, {
            attrs: {
              tabindex
            }
          })
          cy.get(`.select-root [tabindex="${ tabindex }"]`)
            .should('exist')
          cy.get('.select-root [tabindex="0"]')
            .should('not.exist')
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should have the option selected passed in the model-value', () => {
          const modelValue = 'Option 1'
          mount(WrapperOne, {
            attrs: {
              modelValue,
              options: [ 'Option 1', 'Option 2', 'Option 3' ]
            }
          })
          cy.get('.select-root')
            .should('include.text', modelValue)
        })
      })

      describe('(prop): emit-value', () => {
        it('should emit the value under the value key, if options are objects', () => {
          const fn = cy.stub()
          mount(WrapperOne, {
            attrs: {
              emitValue: true,
              'onUpdate:modelValue': fn,
              options: [ { label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 } ]
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('Option 1')
            .click()
            .then(() => {
              expect(fn).to.have.been.calledWith(1)
            })
        })

        it('should emit the whole object by default if options are objects', () => {
          const fn = cy.stub()
          const options = [ { label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              'onUpdate:modelValue': fn,
              options
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('Option 1')
            .click()
            .then(() => {
              expect(fn).to.have.been.calledWith(options[ 0 ])
            })
        })
      })
    })

    describe('Category: model|selection', () => {
      describe('(prop): multiple', () => {
        it('should select only one option by default', () => {
          const options = [ 'Option 1', 'Option 2' ]
          const model = ref(null)
          mount(WrapperOne, {
            attrs: {
              modelValue: model,
              'onUpdate:modelValue': (val) => {
                model.value = val
              },
              options
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('Option 1')
            .click()
            .then(() => {
              expect(model.value).to.equal(options[ 0 ])
            })
          cy.get('.q-menu')
            .contains('Option 2')
            .click()
            .then(() => {
              expect(model.value).to.equal(options[ 1 ])
            })
        })

        it('should select multiple options if multiple is true', () => {
          const options = [ 'Option 1', 'Option 2' ]
          const model = ref([])
          mount(WrapperOne, {
            attrs: {
              multiple: true,
              modelValue: model,
              'onUpdate:modelValue': (val) => {
                model.value = val
              },
              options
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('Option 1')
            .click()
            .then(() => {
              expect(model.value).to.eql([ options[ 0 ] ])
            })
          cy.get('.q-menu')
            .contains('Option 2')
            .click()
            .then(() => {
              expect(model.value).to.eql(options)
            })
        })
      })
    })

    describe('Category: options', () => {
      describe('(prop): options', () => {
        it('should show each option when opening the dropdown', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .children()
            .should('contain', options[ 0 ])
            .and('contain', options[ 1 ])
            .and('contain', options[ 2 ])
            .and('contain', options[ 3 ])
        })
      })

      describe('(prop): option-value', () => {
        it('should use the value key as option-value by default', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          const model = ref(null)
          mount(WrapperOne, {
            attrs: {
              options,
              emitValue: true,
              modelValue: model,
              'onUpdate:modelValue': (val) => {
                model.value = val
              }
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains(options[ 0 ].label)
            .click()
            .then(() => {
              expect(model.value).to.equal(options[ 0 ].value)
            })
        })

        it('should use a custom key supplied by option-value', () => {
          const options = [ { label: 'Option one', test: 1 }, { label: 'Option two', test: 2 } ]
          const model = ref(null)
          mount(WrapperOne, {
            attrs: {
              options,
              emitValue: true,
              optionValue: 'test',
              modelValue: model,
              'onUpdate:modelValue': (val) => {
                model.value = val
              }
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains(options[ 0 ].label)
            .click()
            .then(() => {
              expect(model.value).to.equal(options[ 0 ].test)
            })
        })

        // Not working yet, see: https://github.com/quasarframework/quasar/issues/11754
        it.skip('should accept a function as option-value', () => {
          const options = [ { label: 'Option one', test: 1 }, { label: 'Option two', test: 2 } ]
          const model = ref(null)
          mount(WrapperOne, {
            attrs: {
              options,
              emitValue: true,
              optionValue: (val) => val.test,
              modelValue: model,
              'onUpdate:modelValue': (val) => {
                model.value = val
              }
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains(options[ 0 ].label)
            .click()
            .then(() => {
              expect(model.value).to.equal(options[ 0 ].test)
            })
        })
      })

      describe('(prop): option-label', () => {
        it.skip(' ', () => {
          //
        })
      })
      describe('(prop): option-disable', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): options-dense', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): options-dark', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): options-selected-class', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): options-html', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): options-cover', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): menu-shrink', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): map-options', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: position', () => {
      describe('(prop): menu-anchor', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): menu-self', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): menu-offset', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: selection', () => {
      describe('(prop): display-value', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): display-value-html', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-selected', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): max-values', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): use-chips', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): popup-content-class', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): popup-content-style', () => {
        it.skip(' ', () => {
          //
        })
      })

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

  // Events
  describe('Events', () => {
    describe('(event): update:model-value', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): input-value', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): remove', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): add', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): new-value', () => {
      it.skip(' ', () => {
        //
      })
    })
    describe('(event): filter', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): filter-abort', () => {
      it.skip(' ', () => {
        //
      })
    })
    describe('(event): popup-show', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): popup-hide', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): virtual-scroll', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  // Methods
  describe('Methods', () => {
    describe('(method): focus', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): showPopup', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): hidePopup', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): removeAtIndex', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): add', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): toggleOption', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): setOptionIndex', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): moveOptionSelection', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): filter', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): updateMenuPosition', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): updateInputValue', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): isOptionSelected', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): getEmittingOptionValue', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): getOptionValue', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): getOptionLabel', () => {
      it.skip(' ', () => {
      //
      })
    })

    describe('(method): isOptionDisabled', () => {
      it.skip(' ', () => {
      //
      })
    })
  })
})
