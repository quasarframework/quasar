/* eslint-disable no-unused-expressions */
import { mount } from '@cypress/vue'
import { ref, h } from 'vue'
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
        it('should not show the selected value', () => {
          const options = [ 'Option 1', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: options[ 0 ],
              hideSelected: true
            }
          })
          cy.get('.select-root')
            .should('not.contain', options[ 0 ])
        })

        it('should set the value on the underlying input when using hide-selected', () => {
          // Todo: it its not really clear from the docs that you need to use `useInput` and `fillInput` together with this prop to achieve this
          const options = [ 'Option 1', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: options[ 0 ],
              hideSelected: true,
              fillInput: true,
              useInput: true
            }
          })
          cy.get('.select-root')
            .get('input')
            .should('have.value', options[ 0 ])
        })
      })

      describe('(prop): max-values', () => {
        it('should allow a maximum number of selections', () => {
          const max = 3
          const options = [ '1', '2', '3', '4', '5' ]
          const modelValue = ref([])
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue,
              maxValues: max,
              'onUpdate:modelValue': (val) => {
                modelValue.value = val
              },
              multiple: true
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .get('[role="option"]')
            .click({ multiple: true })
            .then(() => {
              expect(modelValue.value.length).to.equal(max)
            })
        })
      })

      describe('(prop): use-chips', () => {
        it('should use QChips to show the selected value', () => {
          const options = [ 'Option 1', 'Option 2' ]
          mount(WrapperOne, {
            attrs: {
              options,
              modelValue: options[ 0 ],
              useChips: true
            }
          })
          cy.get('.select-root')
            .get('.q-chip')
            .should('contain', options[ 0 ])
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): popup-content-class', () => {
        it('should apply the class to the popup element', () => {
          const className = 'test-class'
          mount(WrapperOne, {
            attrs: {
              options: [ '1', '2 ' ],
              popupContentClass: className
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .should('have.class', className)
        })
      })

      describe('(prop): popup-content-style', () => {
        it('should apply the style definitions to the popup element', () => {
          const style = 'background: red;'
          mount(WrapperOne, {
            attrs: {
              options: [ '1', '2 ' ],
              popupContentStyle: style
            }
          })
          cy.get('.select-root')
            .click()
          cy.get('.q-menu')
            .should('have.backgroundColor', 'red')
        })
      })

      describe('(prop): input-class', () => {
        it('should apply a class to the input element when using `useInput`', () => {
          const className = 'test-class'
          mount(WrapperOne, {
            attrs: {
              useInput: true,
              inputClass: className
            }
          })
          cy.get('.select-root')
            .get('input')
            .should('have.class', className)
        })
      })

      describe('(prop): input-style', () => {
        it('should apply a style to the input element when using `useInput`', () => {
          const style = 'font-size: 30px'
          mount(WrapperOne, {
            attrs: {
              useInput: true,
              inputStyle: style
            }
          })
          cy.get('.select-root')
            .get('input')
            .should('have.css', 'font-size', '30px')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): selected', () => {
      it('should display when something is selected', () => {
        const selectedString = 'Test slot selected'
        const options = [ 'Option 1', 'Option 2' ]
        mount(WrapperOne, {
          attrs: {
            options,
            modelValue: options[ 0 ]
          },
          slots: {
            selected: () => selectedString
          }
        })
        cy.get('.select-root')
          .should('contain', selectedString)
      })
    })

    describe('(slot): loading', () => {
      it('should display when element is loading', () => {
        const loadingString = 'Test slot loading'
        mount(WrapperOne, {
          attrs: {
            loading: true
          },
          slots: {
            loading: () => loadingString
          }
        })
        cy.get('.select-root')
          .should('contain', loadingString)
      })

      it('should not display when element is loading', () => {
        const loadingString = 'Test slot loading'
        mount(WrapperOne, {
          attrs: {
            loading: false
          },
          slots: {
            loading: () => loadingString
          }
        })
        cy.get('.select-root')
          .should('not.contain', loadingString)
      })
    })

    describe('(slot): before-options', () => {
      it('should display the slot content before the options', () => {
        mount(WrapperOne, {
          attrs: {
            options: [ '1', '2', '3' ]
          },
          slots: {
            'before-options': () => h('div', { class: 'dummyClass' }, 'Hello')
          }
        })
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .children().first()
          .should('have.class', 'dummyClass')
      })
    })

    describe('(slot): after-options', () => {
      it('should display the slot content after the options', () => {
        mount(WrapperOne, {
          attrs: {
            options: [ '1', '2', '3' ]
          },
          slots: {
            'after-options': () => h('div', { class: 'dummyClass' }, 'Hello')
          }
        })
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .children().last()
          .should('have.class', 'dummyClass')
      })
    })

    describe('(slot): no-option', () => {
      it('should display the slot content when there are no options', () => {
        const compareString = 'No options :('
        mount(WrapperOne, {
          attrs: {
            options: [ ]
          },
          slots: {
            'no-option': () => compareString
          }
        })
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .should('contain', compareString)
      })

      it('should pass the inputValue to the slot scope', () => {
        const compareString = 'No options :('
        mount(WrapperOne, {
          attrs: {
            options: [ ],
            useInput: true
          },
          slots: {
            'no-option': (scope) => compareString + scope.inputValue
          }
        })
        cy.get('.select-root')
          .click()
          .type('Hello')
        cy.get('.q-menu')
          .should('contain', compareString + 'Hello')
      })

      it('should not display the slot content when there are options', () => {
        const compareString = 'No options :('
        mount(WrapperOne, {
          attrs: {
            options: [ '1', '2', '3' ]
          },
          slots: {
            'no-option': () => compareString
          }
        })
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .should('not.contain', compareString)
      })
    })

    describe('(slot): selected-item', () => {
      it('should override the default selection slot', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        mount(WrapperOne, {
          attrs: {
            options,
            modelValue: 1
          },
          slots: {
            'selected-item': () => 'Test'
          }
        })
        cy.get('.select-root')
          .should('not.contain', options[ 0 ].value)
          .should('contain', 'Test')
      })

      it('should pass the selected option index to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        mount(WrapperOne, {
          attrs: {
            options,
            modelValue: 1
          },
          slots: {
            'selected-item': (scope) => 'Test' + scope.index
          }
        })
        cy.get('.select-root')
          .should('contain', 'Test0')
      })

      it('should pass the selected option value to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        mount(WrapperOne, {
          attrs: {
            options,
            modelValue: 1
          },
          slots: {
            'selected-item': (scope) => 'Test' + scope.opt
          }
        })
        cy.get('.select-root')
          .should('contain', 'Test1')
      })

      it('should pass a removeAtIndex function to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        const model = ref(1)
        mount(WrapperOne, {
          attrs: {
            options,
            modelValue: model,
            'onUpdate:modelValue': (val) => {
              model.value = val
            }
          },
          slots: {
            'selected-item': (scope) => h('button', { class: 'remove', onClick: () => scope.removeAtIndex(scope.index) }, 'Remove')
          }
        })
        cy.get('.select-root')
          .get('button.remove')
          .click()
        cy.get('.select-root')
          .get('button.remove')
          .should('not.exist')
      })

      it('should pass a toggleOption function to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        const model = ref(1)
        mount(WrapperOne, {
          attrs: {
            options,
            modelValue: model,
            'onUpdate:modelValue': (val) => {
              model.value = val
            }
          },
          slots: {
            'selected-item': (scope) => h('button', { class: 'toggle', onClick: () => scope.toggleOption(2) }, 'Toggle' + scope.opt)
          }
        })
        cy.get('.select-root')
          .get('button.toggle')
          .should('contain', 'Toggle1')
          .click()
        cy.get('.select-root')
          .get('button.toggle')
          .should('contain', 'Toggle2')
      })
    })

    describe('(slot): option', () => {
      it('should render a list of the provided slot as options', () => {
        const options = [ '1', '2', '3' ]
        mount(WrapperOne, {
          attrs: {
            options
          },
          slots: {
            option: (scope) => h('div', { class: 'custom-option' }, scope.opt)
          }
        })
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .get('.custom-option')
          .should('have.length', options.length)
      })

      it('should have a selected property in the scope', () => {
        const options = [ '1', '2', '3' ]
        mount(WrapperOne, {
          attrs: {
            modelValue: '1',
            options
          },
          slots: {
            option: (scope) => h('div', { class: `custom-option-${ scope.selected }` }, scope.opt + scope.selected)
          }
        })
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .get('.custom-option-true')
          .should('have.length', 1)
          .should('contain', options[ 0 ])
      })
    })
  })

  describe('Events', () => {
    describe('(event): update:model-value', () => {
      it('should emit event when model value changes', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            options: [ '1', '2', '3' ],
            modelValue: null,
            'onUpdate:modelValue': fn
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .get('[role="option"]')
          .first()
          .click()
          .then(() => {
            expect(fn).to.be.calledWith('1')
          })
      })
    })

    describe('(event): input-value', () => {
      it('should emit event when text input changes', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            modelValue: null,
            onInputValue: fn,
            useInput: true
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .get('input')
          .type('h')
          .then(() => {
            expect(fn).to.be.calledWith('h')
          })
      })
    })

    describe('(event): remove', () => {
      it('should emit event when a selected item is removed from selection', () => {
        const fn = cy.stub()
        const model = ref([ '2', '3' ])
        mount(WrapperOne, {
          attrs: {
            onRemove: fn,
            multiple: true,
            modelValue: model,
            'onUpdate:modelValue': (val) => {
              model.value = val
            },
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .get('[role="option"]')
          .first()
          .click()
          .then(() => {
            expect(fn).not.to.be.called
          })
        cy.get('.q-menu')
          .get('[role="option"]')
          .first()
          .click()
          .then(() => {
            // Item is added in the previous step at the end of the array, so at index 2
            expect(fn).to.be.calledWith({ index: 2, value: '1' })
          })
      })
    })

    describe('(event): add', () => {
      it('should emit event when an option is added to the selection', () => {
        const fn = cy.stub()
        const model = ref([ '2' ])
        mount(WrapperOne, {
          attrs: {
            onAdd: fn,
            multiple: true,
            modelValue: model,
            'onUpdate:modelValue': (val) => {
              model.value = val
            },
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .click()
        cy.get('.q-menu')
          .get('[role="option"]')
          .first()
          .click()
          .then(() => {
            // Item is added in the previous step at the end of the array, so at index 2
            expect(fn).to.be.calledWith({ index: 1, value: '1' })
          })
      })
    })

    describe('(event): new-value', () => {
      it('should emit event when something is typed into the input field and enter is pressed', () => {
        const fn = cy.stub()
        const model = ref([ '2' ])
        mount(WrapperOne, {
          attrs: {
            onNewValue: fn,
            multiple: true,
            useInput: true,
            modelValue: model,
            'onUpdate:modelValue': (val) => {
              model.value = val
            },
            hideDropdownIcon: true
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .get('input')
          .type('100')
          .then(() => {
            expect(fn).not.to.be.called
          })
          .type('{enter}')
          .then(() => {
            expect(fn).to.be.calledWith('100')
          })
      })

      it('should add the value to the model when the doneFn is called', () => {
        const model = ref([ '2' ])
        mount(WrapperOne, {
          attrs: {
            onNewValue: (val, doneFn) => {
              doneFn(val)
            },
            multiple: true,
            useInput: true,
            modelValue: model,
            'onUpdate:modelValue': (val) => {
              model.value = val
            },
            hideDropdownIcon: true
          }
        })

        cy.get('.select-root')
          .get('input')
          .type('100')
          .type('{enter}')
          .then(() => {
            expect(model.value).includes('100')
          })
      })
    })

    describe('(event): filter', () => {
      it('should emit event when something is typed into the input field', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onFilter: fn,
            useInput: true,
            inputDebounce: 0
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .get('input')
          .type('h')
          .then(() => {
            expect(fn).to.be.calledWith('h')
          })
      })
    })

    describe('(event): filter-abort', () => {
      it('should emit event when the the filterFn has not called the doneFn yet and a new filter is requested', () => {
        const fn = cy.stub()
        const filterFn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onFilter: filterFn,
            onFilterAbort: fn,
            useInput: true,
            inputDebounce: 0
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .get('input')
          .click()
          .then(() => {
            expect(filterFn).to.be.calledOnce
            expect(fn).not.to.be.called
          })
          .type('h')
          .then(() => {
            expect(fn).to.be.calledOnce
          })
      })

      it('should not emit event when the filter has called its doneFn', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onFilter: (val, doneFn) => {
              doneFn()
            },
            onFilterAbort: fn,
            useInput: true,
            inputDebounce: 0
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .get('input')
          .click()
          .then(() => {
            expect(fn).not.to.be.called
          })
          .type('h')
          .then(() => {
            expect(fn).not.to.be.called
          })
      })
    })

    describe('(event): popup-show', () => {
      it('should emit event when the options are shown', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onPopupShow: fn,
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .click()
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('(event): popup-hide', () => {
      it('should emit event when the options are hidden', () => {
        const fn = cy.stub()
        mount(WrapperOne, {
          attrs: {
            onPopupHide: fn,
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        cy.get('.select-root')
          .click()
          .then(() => {
            expect(fn).not.to.be.called
          })
          .type('{esc}')
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('(event): virtual-scroll', () => {
      it.skip('', () => {
        // The virtual scroll code is tested as a composable
        // The property is included in the QSelect.json to add typings
        // for the QSelect ref passed in this event.
        // I think testing the component ref that is passed is of type QSelect is out of scope for unit tests.
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
