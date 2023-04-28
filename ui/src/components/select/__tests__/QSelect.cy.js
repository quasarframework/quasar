/* eslint-disable no-unused-expressions */
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'
import { h, ref } from 'vue'
import QSelect from '../QSelect.js'

function getHostElement (extendedSelector = '') {
  return cy.get(`.q-select ${ extendedSelector }`)
}

function mountQSelect (options = {}) {
  if (!options.props?.modelValue) {
    options.props = {
      modelValue: null,
      ...options.props ?? {}
    }
  }

  return cy.mount(QSelect, options)
}

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
          mountQSelect({
            props: {
              dropdownIcon: icon
            }
          })
          getHostElement()
            .get(`div:contains(${ icon })`)
            .should('exist')
        })
      })

      describe('(prop): use-input', () => {
        it('should render an input inside the select', () => {
          mountQSelect({
            props: {
              useInput: true
            }
          })
          getHostElement()
            .get('input')
            .should('exist')
        })

        it('should render an input, but it shouldn\'t be visible', () => {
          mountQSelect()

          getHostElement()
            .get('input')
            .should('not.be.visible')
        })

        it.skip('should not render an input by default', () => {
          // Native input is now always rendered, due to having a target for autocomplete
          // Refer to commit: https://github.com/quasarframework/quasar/commit/21a3af0dfe01bac0da617737562b599edee397a2
        })
      })

      describe('(prop): input-debounce', () => {
        it('should use an input-debounce of 500ms by default', () => {
          const fn = cy.stub()
          const text = 'Hello there'
          mountQSelect({
            props: {
              useInput: true,
              onFilter: fn
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              useInput: true,
              onFilter: fn,
              inputDebounce: 800
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
    })

    describe('Category: content|behavior', () => {
      describe('(prop): hide-dropdown-icon', () => {
        it('should show the dropdown-icon when this property is not supplied', () => {
          mountQSelect()
          getHostElement()
            .get('.q-icon')
            .should('exist')
        })

        it('should hide the dropdown-icon when this property is true', () => {
          mountQSelect({
            props: {
              hideDropdownIcon: true
            }
          })
          getHostElement()
            .get('.q-icon')
            .should('not.exist')
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): tabindex', () => {
        it('should have a default tabindex of 0', () => {
          mountQSelect()
          getHostElement('[tabindex="0"]')
            .should('exist')
        })

        it('should set the tabindex to the supplied value', () => {
          const tabindex = 2
          mountQSelect({
            props: {
              tabindex
            }
          })
          getHostElement(`[tabindex="${ tabindex }"]`)
            .should('exist')
          getHostElement('[tabindex="0"]')
            .should('not.exist')
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should have the option selected passed in the model-value', () => {
          const modelValue = 'Option 1'
          mountQSelect({
            props: {
              modelValue,
              options: [ 'Option 1', 'Option 2', 'Option 3' ]
            }
          })
          getHostElement()
            .should('include.text', modelValue)
        })
      })

      describe('(prop): emit-value', () => {
        it('should emit the value under the value key, if options are objects', () => {
          const fn = cy.stub()
          mountQSelect({
            props: {
              emitValue: true,
              'onUpdate:modelValue': fn,
              options: [ { label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 } ]
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              'onUpdate:modelValue': fn,
              options
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              ...vModelAdapter(model),
              options
            }
          })

          getHostElement().click()
          cy.withinSelectMenu(() => {
            cy.contains('Option 1')
              .click()
              .then(() => {
                expect(model.value).to.equal(options[ 0 ])
              })
          })

          getHostElement().click()
          cy.withinSelectMenu(() => {
            cy.contains('Option 2')
              .click()
              .then(() => {
                expect(model.value).to.equal(options[ 1 ])
              })
          })
        })

        it('should select multiple options if multiple is true', () => {
          const options = [ 'Option 1', 'Option 2' ]
          const model = ref([])
          mountQSelect({
            props: {
              ...vModelAdapter(model),
              multiple: true,
              options
            }
          })

          getHostElement().click()
          cy.withinSelectMenu({
            persistent: true,
            fn: () => {
              cy.contains('Option 1')
                .click()
                .then(() => {
                  expect(model.value).to.eql([ options[ 0 ] ])
                })

              cy.contains('Option 2')
                .click()
                .then(() => {
                  expect(model.value).to.eql(options)
                })
            }
          })
        })
      })
    })

    describe('Category: options', () => {
      describe('(prop): options', () => {
        it('should show each option when opening the dropdown', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mountQSelect({
            props: {
              options
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              ...vModelAdapter(model),
              options,
              emitValue: true
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              ...vModelAdapter(model),
              options,
              emitValue: true,
              optionValue: 'test'
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              ...vModelAdapter(model),
              options,
              emitValue: true,
              optionValue: (val) => val.test
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              options
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .children()
            .should('contain', options[ 0 ].label)
            .and('contain', options[ 1 ].label)
        })

        it('should use the key supplied by option-label', () => {
          const options = [ { test: 'Option one', value: 1 }, { test: 'Option two', value: 2 } ]
          mountQSelect({
            props: {
              options,
              optionLabel: 'test'
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .children()
            .should('contain', options[ 0 ].test)
            .and('contain', options[ 1 ].test)
        })

        it('should accept a function as option-label', () => {
          const options = [ { test: 'Option one', value: 1 }, { test: 'Option two', value: 2 } ]
          mountQSelect({
            props: {
              options,
              optionLabel: (item) => (item === null ? 'Null' : item.test)
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              options
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .get('[role="option"][aria-disabled="true"]')
            .should('have.length', 2)
        })

        it('should use the key supplied by option-disable', () => {
          const options = [ { label: 'Option one', value: 1, test: true }, { label: 'Option two', value: 2, disable: true } ]
          mountQSelect({
            props: {
              options,
              optionDisable: 'test'
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .get('[role="option"][aria-disabled="true"]')
            .should('have.length', 1)
            .should('have.text', options[ 0 ].label)
        })

        it('should accept a function as option-disable', () => {
          const options = [ { label: 'Option one', value: 1, test: true }, { label: 'Option two', value: 2, disable: true } ]
          mountQSelect({
            props: {
              options,
              optionDisable: (item) => (item === null ? true : item.test)
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              options,
              optionsDense: true
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .get('.q-item')
            .should('have.class', 'q-item--dense')
        })
      })

      describe('(prop): options-dark', () => {
        it('should show options list in dark mode', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mountQSelect({
            props: {
              options,
              optionsDark: true
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .get('.q-item')
            .should('have.class', 'q-item--dark')
        })
      })

      describe('(prop): options-selected-class', () => {
        it('should have text-{color} applied as selected by default', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mountQSelect({
            props: {
              options,
              modelValue: 'Option 1',
              color: 'orange'
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .contains('[role="option"]', options[ 0 ])
            .should('have.class', 'text-orange')
        })

        it('should not have default active class when passed option is empty', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mountQSelect({
            props: {
              options,
              modelValue: 'Option 1',
              optionsSelectedClass: '',
              color: 'orange'
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .contains('[role="option"]', options[ 0 ])
            .should('not.have.class', 'text-orange')
        })

        it('should have class name supplied by options-selected-class on active item', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mountQSelect({
            props: {
              options,
              modelValue: 'Option 1',
              optionsSelectedClass: 'test-class',
              color: 'orange'
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              options
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .contains('Option 1')
            .should('have.color', 'black')
            .should('not.have.css', 'font-weight', '700')
        })

        it('should render options with html when options-html is true', () => {
          const options = [ '<b style="color: red">Option 1</b>', 'Option 2' ]
          mountQSelect({
            props: {
              options,
              optionsHtml: true
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              options,
              optionsCover: true
            }
          })
          getHostElement()
            .click()
            .isNotActionable(done)
        })

        it('should not make the popup menu cover the select when use-input is used', () => {
          const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4' ]
          mountQSelect({
            props: {
              options,
              optionsCover: true,
              useInput: true
            }
          })
          getHostElement()
            .click()
            .click({ timeout: 100 })
        })
      })

      describe('(prop): menu-shrink', () => {
        it('should shrink the menu', () => {
          const options = [ '1', '2', '3', '4' ]
          mountQSelect({
            props: {
              options,
              menuShrink: true
            }
          })
          let selectWidth = 0
          getHostElement()
            .then(($el) => {
              selectWidth = $el[ 0 ].clientWidth
            })
            .click()
          cy.get('.q-menu')
            .then(($el) => {
              expect($el[ 0 ].clientWidth).to.below(selectWidth)
            })
        })
      })

      describe('(prop): map-options', () => {
        it('should display the label of the selected value instead of the value itself', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mountQSelect({
            props: {
              options,
              modelValue: 1,
              mapOptions: true
            }
          })
          getHostElement()
            .contains(options[ 0 ].label)
        })

        it('should display the selected value as string by default', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mountQSelect({
            props: {
              options,
              modelValue: 1
            }
          })
          getHostElement()
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
          mountQSelect({
            props: {
              options,
              modelValue: 1,
              displayValue: 'Test'
            }
          })
          getHostElement()
            .should('not.contain', options[ 0 ].value)
            .should('contain', 'Test')
        })

        it('should not override the default selection string when using `use-chips`', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mountQSelect({
            props: {
              options,
              modelValue: 1,
              displayValue: 'Test',
              useChips: true
            }
          })
          getHostElement()
            .should('contain', options[ 0 ].value)
            .should('not.contain', 'Test')
        })

        it('should not override the default selection string when using `selected` slot', () => {
          const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
          mountQSelect({
            props: {
              options,
              modelValue: 1,
              displayValue: 'Test'
            },
            slots: {
              selected: () => 'Hello there'
            }
          })
          getHostElement()
            .should('not.contain', options[ 0 ].value)
            .should('not.contain', 'Test')
            .should('contain', 'Hello there')
        })
      })

      describe('(prop): display-value-html', () => {
        it('should render the selected option as html', () => {
          const options = [ '<b style="color: red">Option 1</b>', 'Option 2' ]
          mountQSelect({
            props: {
              options,
              modelValue: options[ 0 ],
              displayValueHtml: true
            }
          })
          getHostElement()
            .contains('Option 1')
            .should('have.color', 'red')
            .should('have.css', 'font-weight', '700')
        })

        it('should not render the selected option as html when using `selected` slot', () => {
          const html = '<b style="color: red">Option 1</b>'
          const options = [ 'Option 1', 'Option 2' ]
          mountQSelect({
            props: {
              options,
              modelValue: options[ 0 ],
              displayValueHtml: true
            },
            slots: {
              selected: () => html
            }
          })
          getHostElement()
            .contains(html)
        })

        it('should not render the selected option as html when using `selected-item` slot', () => {
          const html = '<b style="color: red">Option 1</b>'
          const options = [ 'Option 1', 'Option 2' ]
          mountQSelect({
            props: {
              options,
              modelValue: options[ 0 ],
              displayValueHtml: true
            },
            slots: {
              'selected-item': () => html
            }
          })
          getHostElement()
            .contains(html)
        })
      })

      describe('(prop): hide-selected', () => {
        it('should not show the selected value', () => {
          const options = [ 'Option 1', 'Option 2' ]
          mountQSelect({
            props: {
              options,
              modelValue: options[ 0 ],
              hideSelected: true
            }
          })
          getHostElement()
            .should('not.contain', options[ 0 ])
        })

        it('should set the value on the underlying input when using hide-selected', () => {
          // Todo: it its not really clear from the docs that you need to use `useInput` and `fillInput` together with this prop to achieve this
          const options = [ 'Option 1', 'Option 2' ]
          mountQSelect({
            props: {
              options,
              modelValue: options[ 0 ],
              hideSelected: true,
              fillInput: true,
              useInput: true
            }
          })
          getHostElement()
            .get('input')
            .should('have.value', options[ 0 ])
        })
      })

      describe('(prop): max-values', () => {
        it('should allow a maximum number of selections', () => {
          const max = 3
          const options = [ '1', '2', '3', '4', '5' ]
          const model = ref([])
          mountQSelect({
            props: {
              ...vModelAdapter(model),
              options,
              maxValues: max,
              multiple: true
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .get('[role="option"]')
            .click({ multiple: true })
            .then(() => {
              expect(model.value.length).to.equal(max)
            })
        })
      })

      describe('(prop): use-chips', () => {
        it('should use QChips to show the selected value', () => {
          const options = [ 'Option 1', 'Option 2' ]
          mountQSelect({
            props: {
              options,
              modelValue: options[ 0 ],
              useChips: true
            }
          })
          getHostElement()
            .get('.q-chip')
            .should('contain', options[ 0 ])
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): popup-content-class', () => {
        it('should apply the class to the popup element', () => {
          const className = 'test-class'
          mountQSelect({
            props: {
              options: [ '1', '2 ' ],
              popupContentClass: className
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .should('have.class', className)
        })
      })

      describe('(prop): popup-content-style', () => {
        it('should apply the style definitions to the popup element', () => {
          const style = 'background: red;'
          mountQSelect({
            props: {
              options: [ '1', '2 ' ],
              popupContentStyle: style
            }
          })
          getHostElement()
            .click()
          cy.get('.q-menu')
            .should('have.backgroundColor', 'red')
        })
      })

      describe('(prop): input-class', () => {
        it('should apply a class to the input element when using `useInput`', () => {
          const className = 'test-class'
          mountQSelect({
            props: {
              useInput: true,
              inputClass: className
            }
          })
          getHostElement()
            .get('input')
            .should('have.class', className)
        })
      })

      describe('(prop): input-style', () => {
        it('should apply a style to the input element when using `useInput`', () => {
          const style = 'font-size: 30px'
          mountQSelect({
            props: {
              useInput: true,
              inputStyle: style
            }
          })
          getHostElement()
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
        mountQSelect({
          props: {
            options,
            modelValue: options[ 0 ]
          },
          slots: {
            selected: () => selectedString
          }
        })
        getHostElement()
          .should('contain', selectedString)
      })
    })

    describe('(slot): loading', () => {
      it('should display when element is loading', () => {
        const loadingString = 'Test slot loading'
        mountQSelect({
          props: {
            loading: true
          },
          slots: {
            loading: () => loadingString
          }
        })
        getHostElement()
          .should('contain', loadingString)
      })

      it('should not display when element is loading', () => {
        const loadingString = 'Test slot loading'
        mountQSelect({
          props: {
            loading: false
          },
          slots: {
            loading: () => loadingString
          }
        })
        getHostElement()
          .should('not.contain', loadingString)
      })
    })

    describe('(slot): before-options', () => {
      it('should display the slot content before the options', () => {
        mountQSelect({
          props: {
            options: [ '1', '2', '3' ]
          },
          slots: {
            'before-options': () => h('div', { class: 'dummyClass' }, 'Hello')
          }
        })
        getHostElement()
          .click()
        cy.get('.q-menu')
          .children().first()
          .should('have.class', 'dummyClass')
      })
    })

    describe('(slot): after-options', () => {
      it('should display the slot content after the options', () => {
        mountQSelect({
          props: {
            options: [ '1', '2', '3' ]
          },
          slots: {
            'after-options': () => h('div', { class: 'dummyClass' }, 'Hello')
          }
        })
        getHostElement()
          .click()
        cy.get('.q-menu')
          .children().last()
          .should('have.class', 'dummyClass')
      })
    })

    describe('(slot): no-option', () => {
      it('should display the slot content when there are no options', () => {
        const compareString = 'No options :('
        mountQSelect({
          props: {
            options: [ ]
          },
          slots: {
            'no-option': () => compareString
          }
        })
        getHostElement()
          .click()
        cy.get('.q-menu')
          .should('contain', compareString)
      })

      it('should pass the inputValue to the slot scope', () => {
        const compareString = 'No options :('
        mountQSelect({
          props: {
            options: [ ],
            useInput: true
          },
          slots: {
            'no-option': (scope) => compareString + scope.inputValue
          }
        })
        getHostElement()
          .click()
          .type('Hello')
        cy.get('.q-menu')
          .should('contain', compareString + 'Hello')
      })

      it('should not display the slot content when there are options', () => {
        const compareString = 'No options :('
        mountQSelect({
          props: {
            options: [ '1', '2', '3' ]
          },
          slots: {
            'no-option': () => compareString
          }
        })
        getHostElement()
          .click()
        cy.get('.q-menu')
          .should('not.contain', compareString)
      })
    })

    describe('(slot): selected-item', () => {
      it('should override the default selection slot', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        mountQSelect({
          props: {
            options,
            modelValue: 1
          },
          slots: {
            'selected-item': () => 'Test'
          }
        })
        getHostElement()
          .should('not.contain', options[ 0 ].value)
          .should('contain', 'Test')
      })

      it('should pass the selected option index to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        mountQSelect({
          props: {
            options,
            modelValue: 1
          },
          slots: {
            'selected-item': (scope) => 'Test' + scope.index
          }
        })
        getHostElement()
          .should('contain', 'Test0')
      })

      it('should pass the selected option value to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        mountQSelect({
          props: {
            options,
            modelValue: 1
          },
          slots: {
            'selected-item': (scope) => 'Test' + scope.opt
          }
        })
        getHostElement()
          .should('contain', 'Test1')
      })

      it('should pass a removeAtIndex function to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        const model = ref(1)
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            options
          },
          slots: {
            'selected-item': (scope) => h('button', { class: 'remove', onClick: () => scope.removeAtIndex(scope.index) }, 'Remove')
          }
        })
        getHostElement()
          .get('button.remove')
          .click()
        getHostElement()
          .get('button.remove')
          .should('not.exist')
      })

      it('should pass a toggleOption function to the slot scope', () => {
        const options = [ { label: 'Option one', value: 1 }, { label: 'Option two', value: 2 } ]
        const model = ref(1)
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            options
          },
          slots: {
            'selected-item': (scope) => h('button', { class: 'toggle', onClick: () => scope.toggleOption(2) }, 'Toggle' + scope.opt)
          }
        })
        getHostElement()
          .get('button.toggle')
          .should('contain', 'Toggle1')
          .click()
        getHostElement()
          .get('button.toggle')
          .should('contain', 'Toggle2')
      })
    })

    describe('(slot): option', () => {
      it('should render a list of the provided slot as options', () => {
        const options = [ '1', '2', '3' ]
        mountQSelect({
          props: {
            options
          },
          slots: {
            option: (scope) => h('div', { class: 'custom-option' }, scope.opt)
          }
        })
        getHostElement()
          .click()
        cy.get('.q-menu')
          .get('.custom-option')
          .should('have.length', options.length)
      })

      it('should have a selected property in the scope', () => {
        const options = [ '1', '2', '3' ]
        mountQSelect({
          props: {
            modelValue: '1',
            options
          },
          slots: {
            option: (scope) => h('div', { class: `custom-option-${ scope.selected }` }, scope.opt + scope.selected)
          }
        })
        getHostElement()
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
        mountQSelect({
          props: {
            options: [ '1', '2', '3' ],
            modelValue: null,
            'onUpdate:modelValue': fn
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            modelValue: null,
            onInputValue: fn,
            useInput: true
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            onRemove: fn,
            multiple: true,
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            onAdd: fn,
            multiple: true,
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            onNewValue: fn,
            multiple: true,
            useInput: true,
            hideDropdownIcon: true
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            onNewValue: (val, doneFn) => {
              doneFn(val)
            },
            multiple: true,
            useInput: true,
            hideDropdownIcon: true
          }
        })

        getHostElement()
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
        mountQSelect({
          props: {
            onFilter: fn,
            useInput: true,
            inputDebounce: 0
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            onFilter: filterFn,
            onFilterAbort: fn,
            useInput: true,
            inputDebounce: 0
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            onFilter: (val, doneFn) => {
              doneFn()
            },
            onFilterAbort: fn,
            useInput: true,
            inputDebounce: 0
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
        mountQSelect({
          props: {
            onPopupShow: fn,
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
          .click()
          .then(() => {
            expect(fn).to.be.called
          })
      })
    })

    describe('(event): popup-hide', () => {
      it('should emit event when the options are hidden', () => {
        const fn = cy.stub()
        mountQSelect({
          props: {
            onPopupHide: fn,
            options: [ '1', '2', '3' ]
          }
        })

        expect(fn).not.to.be.called
        getHostElement()
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
      it('should focus the component', () => {
        mountQSelect()

        getHostElement()
          .get('[tabindex="0"]')
          .should('not.have.focus')
        getHostElement()
          .then(() => {
            Cypress.vueWrapper.vm.focus()
          })
        getHostElement()
          .get('[tabindex="0"]')
          .should('have.focus')
      })
    })

    describe('(method): showPopup', () => {
      it('should open the popup and focus the component', () => {
        mountQSelect({
          props: {
            options: [ '1', '2' ]
          }
        })

        cy.get('.q-menu')
          .should('not.exist')
          .then(() => {
            Cypress.vueWrapper.vm.showPopup()
          })
        cy.get('.q-menu')
          .should('be.visible')
        getHostElement()
          .get('[tabindex="0"]')
          .should('have.focus')
      })
    })

    describe('(method): hidePopup', () => {
      it('should hide the popup', () => {
        mountQSelect({
          props: {
            options: [ '1', '2' ]
          }
        })

        getHostElement()
          .click()
        cy.get('.q-menu')
          .should('be.visible')
          .then(() => {
            Cypress.vueWrapper.vm.hidePopup()
          })
        cy.get('.q-menu')
          .should('not.exist')
      })
    })

    describe('(method): removeAtIndex', () => {
      it('should remove a selected option at the correct index', () => {
        const options = [ '1', '2', '3', '4' ]
        const model = ref([ '1', '2', '4' ])
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            multiple: true,
            options
          }
        })
          .then(() => {
            expect(model.value.includes('4')).to.be.true
            Cypress.vueWrapper.vm.removeAtIndex(2)
            expect(model.value.includes('4')).to.be.false
          })
      })
    })

    describe('(method): add', () => {
      it('should add a selected option', () => {
        const model = ref([ '1', '2' ])
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            multiple: true
          }
        })
          .then(() => {
            expect(model.value.includes('100')).to.be.false
            Cypress.vueWrapper.vm.add('100')
            expect(model.value.includes('100')).to.be.true
          })
      })

      it('should not add a duplicate option when unique is true', () => {
        const model = ref([ '1', '2' ])
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            multiple: true
          }
        })
          .then(() => {
            expect(model.value.length).to.be.equal(2)
            Cypress.vueWrapper.vm.add('2', true)
            expect(model.value.length).to.be.equal(2)
            Cypress.vueWrapper.vm.add('2')
            expect(model.value.length).to.be.equal(3)
          })
      })
    })

    describe('(method): toggleOption', () => {
      it('should toggle an option', () => {
        const model = ref([ '1', '2' ])
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            multiple: true
          }
        })
          .then(() => {
            expect(model.value.length).to.be.equal(2)
            Cypress.vueWrapper.vm.toggleOption('2')
            expect(model.value.length).to.be.equal(1)
          })
          // When not using this wait this test will succeed on `open-ct` but fail on `run-ct`
          .wait(50)
          .then(() => {
            Cypress.vueWrapper.vm.toggleOption('2')
            expect(model.value.length).to.be.equal(2)
          })
      })

      // Todo: toggleOption argument keepOpen only does something when using single select. This is not clear from the docs.
      // should this be consistent? E.g. use `true` as argument when multiple is true by default but make sure it can be overridden.
      it('should close the menu and clear the filter', () => {
        const model = ref('1')
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            options: [ '1', '2' ],
            useInput: true
          }
        })

        getHostElement()
          .click()
          .get('input')
          .type('h')
        cy.get('.q-menu')
          .should('be.visible')
          .then(() => {
            Cypress.vueWrapper.vm.toggleOption('2')
          })
        cy.get('.q-menu')
          .should('not.exist')
        cy.get('input')
          .should('have.value', '')
      })

      it('should not close the menu and clear the filter when keepOpen is true', () => {
        const model = ref('1')
        mountQSelect({
          props: {
            ...vModelAdapter(model),
            options: [ '1', '2' ],
            useInput: true
          }
        })

        getHostElement()
          .click()
          .get('input')
          .type('h')
        cy.get('.q-menu')
          .should('be.visible')
          .then(() => {
            Cypress.vueWrapper.vm.toggleOption('2', true)
          })
        cy.get('.q-menu')
          .should('be.visible')
        cy.get('input')
          .should('have.value', 'h')
      })
    })

    describe('(method): setOptionIndex', () => {
      it('should set an option from the menu dropdown as focused', () => {
        const options = [ '1', '2', '3', '4' ]
        mountQSelect({
          props: {
            options
          }
        })
        getHostElement()
          .click()
          .then(() => {
            Cypress.vueWrapper.vm.setOptionIndex(0)
          })
          .get('[role="option"]')
          .first()
          .should('have.class', 'q-manual-focusable--focused')
      })
    })

    describe('(method): moveOptionSelection', () => {
      it('should move the optionSelection by some index offset', () => {
        const options = [ '1', '2', '3', '4' ]
        mountQSelect({
          props: {
            options
          }
        })
        getHostElement()
          .click()
          .then(() => {
            Cypress.vueWrapper.vm.setOptionIndex(0)
          })
          .get('[role="option"]')
          .first()
          .should('have.class', 'q-manual-focusable--focused')
          .then(() => {
            Cypress.vueWrapper.vm.moveOptionSelection(3)
          })
          .get('[role="option"]')
          .last()
          .should('have.class', 'q-manual-focusable--focused')
      })
    })

    describe('(method): filter', () => {
      it('should filter the options list', () => {
        const options = [ '1', '2', '3', '4' ]
        const fn = cy.stub()
        const text = 'test'
        mountQSelect({
          props: {
            options,
            useInput: true,
            onFilter: fn
          }
        })
        getHostElement()
          .click()
          .then(() => {
            expect(fn).not.to.be.calledWith(text)
            Cypress.vueWrapper.vm.filter(text)
            expect(fn).to.be.calledWith(text)
          })
      })
    })

    describe('(method): updateMenuPosition', () => {
      it.skip(' ', () => {
        // Not sure in what scenario this is needed, there is also some auto repositioning going on
      })
    })

    describe('(method): updateInputValue', () => {
      it('should update the input value', () => {
        const options = [ '1', '2', '3', '4' ]
        const fn = cy.stub()
        const text = 'test'
        mountQSelect({
          props: {
            options,
            useInput: true,
            onFilter: fn
          }
        })
        getHostElement()
          .click()
          .then(() => {
            expect(fn).not.to.be.calledWith(text)
            Cypress.vueWrapper.vm.updateInputValue(text)
            expect(fn).to.be.calledWith(text)
          })
          .get('input')
          .should('have.value', text)
      })

      it('should not trigger the filter when specified', () => {
        const options = [ '1', '2', '3', '4' ]
        const fn = cy.stub()
        const text = 'test'
        mountQSelect({
          props: {
            options,
            useInput: true,
            onFilter: fn
          }
        })
        getHostElement()
          .click()
          .then(() => {
            expect(fn).not.to.be.calledWith(text)
            Cypress.vueWrapper.vm.updateInputValue(text, true)
            expect(fn).not.to.be.calledWith(text)
          })
          .get('input')
          .should('have.value', text)
      })
    })

    describe('(method): isOptionSelected', () => {
      it('should tell when an option is selected', () => {
        const options = [ '1', '2', '3', '4' ]
        const modelValue = [ '1', '2', '4' ]
        mountQSelect({
          props: {
            modelValue,
            multiple: true,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.isOptionSelected(options[ 0 ])).to.be.true
            expect(Cypress.vueWrapper.vm.isOptionSelected(options[ 2 ])).to.be.false
          })
      })
    })

    describe('(method): getEmittingOptionValue', () => {
      it('should return the emit value with plain options', () => {
        const options = [ '1', '2', '3', '4' ]
        const modelValue = '1'
        mountQSelect({
          props: {
            modelValue,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getEmittingOptionValue(options[ 2 ])).to.equal(options[ 2 ])
          })
      })

      it('should return the emit value with object options', () => {
        const options = [ { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 } ]
        const modelValue = options[ 0 ]
        mountQSelect({
          props: {
            modelValue,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getEmittingOptionValue(options[ 2 ])).to.equal(options[ 2 ])
          })
      })

      it('should respect emit-value when using options', () => {
        const options = [ { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 } ]
        const modelValue = options[ 0 ]
        mountQSelect({
          props: {
            modelValue,
            options,
            emitValue: true
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getEmittingOptionValue(options[ 2 ])).to.equal(options[ 2 ].value)
          })
      })
    })

    describe('(method): getOptionValue', () => {
      it('should return the option value with plain options', () => {
        const options = [ '1', '2', '3', '4' ]
        const modelValue = '1'
        mountQSelect({
          props: {
            modelValue,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getOptionValue(options[ 2 ])).to.equal(options[ 2 ])
          })
      })

      it('should return the option value with object options (value by default)', () => {
        const options = [ { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 } ]
        const modelValue = options[ 0 ]
        mountQSelect({
          props: {
            modelValue,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getOptionValue(options[ 2 ])).to.equal(options[ 2 ].value)
          })
      })

      it('should respect the option-value option', () => {
        const options = [ { label: '1', test: 1 }, { label: '2', test: 2 }, { label: '3', test: 3 } ]
        const modelValue = options[ 0 ]
        mountQSelect({
          props: {
            modelValue,
            options,
            optionValue: 'test'
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getOptionValue(options[ 2 ])).to.equal(options[ 2 ].test)
          })
      })
    })

    describe('(method): getOptionLabel', () => {
      it('should return the option label with plain options', () => {
        const options = [ '1', '2', '3', '4' ]
        const modelValue = '1'
        mountQSelect({
          props: {
            modelValue,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getOptionLabel(options[ 2 ])).to.equal(options[ 2 ])
          })
      })

      it('should return the option label with object options (label by default)', () => {
        const options = [ { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 } ]
        const modelValue = options[ 0 ]
        mountQSelect({
          props: {
            modelValue,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getOptionLabel(options[ 2 ])).to.equal(options[ 2 ].label)
          })
      })

      it('should respect the option-value option', () => {
        const options = [ { test: '1', value: 1 }, { test: '2', value: 2 }, { test: '3', value: 3 } ]
        const modelValue = options[ 0 ]
        mountQSelect({
          props: {
            modelValue,
            options,
            optionLabel: 'test'
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.getOptionLabel(options[ 2 ])).to.equal(options[ 2 ].test)
          })
      })
    })

    describe('(method): isOptionDisabled', () => {
      it('should return if an option is disabled correctly', () => {
        const options = [ { label: '1', value: 1, disable: true }, { label: '2', value: 2 }, { label: '3', value: 3 } ]
        const modelValue = options[ 0 ]
        mountQSelect({
          props: {
            modelValue,
            options
          }
        })
          .then(() => {
            expect(Cypress.vueWrapper.vm.isOptionDisabled(options[ 0 ])).to.be.true
            // This currently fails: https://github.com/quasarframework/quasar/issues/12046
            // expect(Cypress.vueWrapper.vm.isOptionDisabled(options[ 1 ])).to.be.false
            // expect(Cypress.vueWrapper.vm.isOptionDisabled(options[ 2 ])).to.be.false
          })
      })
    })
  })
})
