/* eslint-disable no-unused-expressions */
import { mount } from '@cypress/vue'
import { ref } from 'vue'
import WrapperOne from './WrapperOne.vue'

const snapshotOptions = { customSnapshotsDir: '../src/components/select/__tests__' }

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

        it('should accept a function as option-value', () => {
          const options = [ { label: 'Option one', test: 1 }, { label: 'Option two', test: 2 } ]
          const model = ref(null)
          mount(WrapperOne, {
            attrs: {
              options,
              emitValue: true,
              optionValue: (val) => (!val ? val : val.test),
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
        it('should use the "label" key by default as option-label', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .children()
            .should('contain', options[ 0 ].label)
            .and('contain', options[ 1 ].label)
        })

        it('should use the key supplied by option-label', () => {
          const options = [ { test: 'Option one', value: 1 }, { test: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionLabel: 'test'
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .children()
            .should('contain', options[ 0 ].test)
            .and('contain', options[ 1 ].test)
        })

        it('should accept a function as option-label', () => {
          const options = [ { test: 'Option one', value: 1 }, { test: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionLabel: (item) => (item === null ? 'Null' : item.test)
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .children()
            .should('contain', options[ 0 ].test)
            .and('contain', options[ 1 ].test)
        })
      })
      describe('(prop): option-disable', () => {
        it('should use the "disable" key by default as option-disable', () => {
          const options = [ { label: 'Option one', value: 1, disable: true }, { label: 'Option two', value: 2, disable: true } ]
          mount(WrapperOne, {
            attrs: {
              options
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .get('[role="option"][aria-disabled="true"]')
            .should('have.length', 2)
        })

        it('should use the key supplied by option-disable', () => {
          const options = [ { label: 'Option one', value: 1, test: true }, { label: 'Option two', value: 2, disable: true } ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionDisable: 'test'
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .get('[role="option"][aria-disabled="true"]')
            .should('have.length', 1)
            .should('have.text', options[ 0 ].label)
        })

        it('should accept a function as option-disable', () => {
          const options = [ { label: 'Option one', value: 1, test: true }, { label: 'Option two', value: 2, disable: true } ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionDisable: (item) => (item === null ? true : item.test)
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .get('[role="option"][aria-disabled="true"]')
            .should('have.length', 1)
            .should('have.text', options[ 0 ].label)
        })
      })

      describe('(prop): options-dense', () => {
        it('should show options list dense', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionsDense: true
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .matchImageSnapshot(snapshotOptions)
        })
      })

      describe('(prop): options-dark', () => {
        it('should show options list in dark mode', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionsDark: true
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .matchImageSnapshot(snapshotOptions)
        })
      })

      describe('(prop): options-selected-class', () => {
        it('should have text-{color} applied as selected by default', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 'Option 1',
              color: 'orange'
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('[role="option"]', options[ 0 ])
            .should('have.class', 'text-orange')
        })

        it('should not have default active class when passed option is empty', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 'Option 1',
              optionsSelectedClass: '',
              color: 'orange'
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('[role="option"]', options[ 0 ])
            .should('not.have.class', 'text-orange')
        })

        it('should have class name supplied by options-selected-class on active item', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 'Option 1',
              optionsSelectedClass: 'test-class',
              color: 'orange'
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('[role="option"]', options[ 0 ])
            .should('not.have.class', 'text-orange')
            .should('have.class', 'test-class')
          cy.get('.q-menu')
            .contains('[role="option"]', options[ 1 ])
            .should('not.have.class', 'text-orange')
            .should('not.have.class', 'test-class')
        })
      })

      describe('(prop): options-html', () => {
        it('should not render options with html by default', () => {
          const options = [ '<b style="color: red">Option 1</b>', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('Option 1')
            .should('have.color', 'black')
            .should('not.have.css', 'font-weight', '700')
        })

        it('should render options with html when options-html is true', () => {
          const options = [ '<b style="color: red">Option 1</b>', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionsHtml: true
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .contains('Option 1')
            .should('have.color', 'red')
            .should('have.css', 'font-weight', '700')
        })
      })

      describe('(prop): options-cover', () => {
        it('should make the popup menu cover the select', (done) => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionsCover: true
            }
          })
          cy.get('.select-root')
            .click()
            .isNotActionable(done)
        })

        it('should not make the popup menu cover the select when use-input is used', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              optionsCover: true,
              useInput: true
            }
          })
          cy.get('.select-root')
            .click()
            .click({ timeout: 100 })
        })
      })

      describe('(prop): menu-shrink', () => {
        it('should shrink the menu', () => {
          const options = [ '1', '2', '3', '4' ]
          mount(WrapperOne, {
            attrs: {
              options,
              menuShrink: true
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .matchImageSnapshot(snapshotOptions)
        })
      })

      describe('(prop): map-options', () => {
        it('should display the label of the selected value instead of the value itself', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 1,
              mapOptions: true
            }
          })
          cy.get('.select-root')
            .contains(options[ 0 ].label)
        })

        it('should display the selected value as string by default', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 1
            }
          })
          cy.get('.select-root')
            .contains(options[ 0 ].value)
        })
      })
    })

    describe('Category: position', () => {
      describe.skip('(prop): menu-anchor', () => {
        // This is a menu property which is tested in QMenu.spec.js
      })

      describe.skip('(prop): menu-self', () => {
        // This is a menu property which is tested in QMenu.spec.js
      })

      describe.skip('(prop): menu-offset', () => {
        // This is a menu property which is tested in QMenu.spec.js
      })
    })

    describe('Category: selection', () => {
      describe('(prop): display-value', () => {
        it('should override the default selection string', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 1,
              displayValue: 'Test'
            }
          })
          cy.get('.select-root')
            .should('not.contain', options[ 0 ].value)
            .should('contain', 'Test')
        })

        it('should not override the default selection string when using `use-chips`', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 1,
              displayValue: 'Test',
              useChips: true
            }
          })
          cy.get('.select-root')
            .should('contain', options[ 0 ].value)
            .should('not.contain', 'Test')
        })

        it('should not override the default selection string when using `selected` slot', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: 1,
              displayValue: 'Test'
            },
            slots: {
              selected: () => 'Hello there'
            }
          })
          cy.get('.select-root')
            .should('not.contain', options[ 0 ].value)
            .should('not.contain', 'Test')
            .should('contain', 'Hello there')
        })
      })

      describe('(prop): display-value-html', () => {
        it('should render the selected option as html', () => {
          const options = [ '<b style="color: red">Option 1</b>', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: options[ 0 ],
              displayValueHtml: true
            }
          })
          cy.get('.select-root')
            .contains('Option 1')
            .should('have.color', 'red')
            .should('have.css', 'font-weight', '700')
        })

        it('should not render the selected option as html when using `selected` slot', () => {
          const html = '<b style="color: red">Option 1</b>'
          const options = [ 'Option 1', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: options[ 0 ],
              displayValueHtml: true
            },
            slots: {
              selected: () => html
            }
          })
          cy.get('.select-root')
            .contains(html)
        })

        it('should not render the selected option as html when using `selected-item` slot', () => {
          const html = '<b style="color: red">Option 1</b>'
          const options = [ 'Option 1', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: options[ 0 ],
              displayValueHtml: true
            },
            slots: {
              'selected-item': () => html
            }
          })
          cy.get('.select-root')
            .contains(html)
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

  describe('Slots', () => {
    describe('(slot): selected', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): loading', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): before-options', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): after-options', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): no-option', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): selected-item', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): option', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

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
