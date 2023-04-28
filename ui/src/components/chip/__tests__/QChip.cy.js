import QChip, { defaultSizes } from '../QChip.js'

const defaultOptions = {
  label: 'simple chip'
}

const chipSizeValues = Object.keys(defaultSizes)

function mountQChip (options = {}) {
  options.props = {
    ...defaultOptions,
    ...options.props
  }

  return cy.mount(QChip, options)
}

describe('Chip API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): icon', () => {
        it('should render an icon on the left', () => {
          const icon = 'add'

          mountQChip({
            props: {
              icon
            }
          })

          cy.get('.q-chip')
            .get('.q-icon.q-chip__icon--left')
            .should('have.text', `${ icon }`)
        })
      })

      describe('(prop): icon-right', () => {
        it('should render an icon on the right', () => {
          const icon = 'add'

          mountQChip({
            props: {
              iconRight: icon
            }
          })

          cy.get('.q-chip')
            .get('.q-icon.q-chip__icon--right')
            .should('have.text', `${ icon }`)
        })
      })

      describe('(prop): icon-remove', () => {
        it('should render a custom remove icon', () => {
          const icon = 'delete'

          mountQChip({
            props: {
              removable: true,
              iconRemove: icon
            }
          })

          cy.get('.q-chip')
            .get('.q-icon.q-chip__icon--remove')
            .should('have.text', `${ icon }`)
        })
      })

      describe('(prop): icon-selected', () => {
        it('should render a custom selected icon when one provided', () => {
          const icon = 'done'

          mountQChip({
            props: {
              selected: true,
              iconSelected: icon
            }
          })

          cy.get('.q-chip.q-chip--selected')
            .get('.q-icon')
            .should('have.text', `${ icon }`)
        })
      })

      describe('(prop): label', () => {
        it('should render a label inside the chip', () => {
          const label = 'Chip label'

          mountQChip({
            props: {
              label
            }
          })

          cy.get('.q-chip').get('.q-chip__content').should('have.text', label)
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): tabindex', () => {
        it('should set the tabindex', () => {
          const tabindex = 1

          mountQChip({
            props: {
              clickable: true,
              tabindex
            }
          })

          cy.get('.q-chip').should('have.attr', 'tabindex', `${ tabindex }`)
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should render when "modelValue" prop is true', () => {
          mountQChip({
            props: {
              modelValue: true
            }
          })

          cy.get('.q-chip').should('exist')
        })

        it('should not render when "modelValue" prop is false', () => {
          mountQChip({
            props: {
              modelValue: false
            }
          })

          cy.get('.q-chip').should('not.exist')
        })
      })

      describe('(prop): selected', () => {
        it('should be selected when "selected" prop is true', () => {
          mountQChip({
            props: {
              selected: true
            }
          })

          cy.get('.q-chip.q-chip--selected').should('exist')
        })

        it('should not be selected when "selected" prop is false', () => {
          mountQChip({
            props: {
              selected: false
            }
          })

          cy.get('.q-chip').should('not.have.class', 'q-chip--selected')
        })
      })
    })

    describe('Category: state', () => {
      describe('(prop): clickable', () => {
        it('should have hover effects and emit "click" event when "clickable" prop is true', () => {
          const fn = cy.stub()

          mountQChip({
            props: {
              clickable: true,
              onClick: fn
            }
          })

          cy.get('.q-chip')
            .should('have.css', 'cursor', 'pointer')
            .click()
            .then(() => expect(fn).to.be.calledOnce)
        })
      })

      describe('(prop): removable', () => {
        it('should display a remove icon emitting a "remove" event when clicked', () => {
          const fn = cy.stub()

          mountQChip({
            props: {
              removable: true,
              onRemove: fn
            }
          })

          cy.get('.q-chip')
            .get('.q-icon.q-chip__icon--remove')
            .click()
            .then(() => expect(fn).to.be.calledOnce)
        })
      })

      describe('(prop): disable', () => {
        it('should not have hover effect and not emit "click" event when "disable" prop is true', () => {
          const fn = cy.stub()

          mountQChip({
            props: {
              disable: true,
              onClick: fn
            }
          })

          cy.get('.q-chip')
            .should('not.have.css', 'cursor', 'pointer')
            .click()
            .then(() => expect(fn).to.not.be.called)
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): dense', () => {
        it('should have a dense style when "dense" prop is true', () => {
          mountQChip({
            props: {
              dense: true
            }
          })

          cy.get('.q-chip.q-chip--dense').should('exist')
        })
      })

      describe('(prop): size', () => {
        it('should change QChip size based on a CSS unit value', () => {
          const size = '50px'

          mountQChip({
            props: {
              size
            }
          })

          cy.get('.q-chip').should('have.css', 'font-size', size)
        })

        it(`should change QChip size based defined values: ${ chipSizeValues.join(', ') }`, () => {
          mountQChip()

          // loop over chipSizeValues
          for (const key of chipSizeValues) {
            cy.get('.q-chip')
              .then(() => Cypress.vueWrapper.setProps({ size: key }))
              .should('have.css', 'font-size', `${ defaultSizes[ key ] }px`)
          }
        })
      })

      describe('(prop): dark', () => {
        it('should have a dark style when "dark" prop is true', () => {
          mountQChip({
            props: {
              dark: true
            }
          })

          cy.get('.q-chip')
            .should('have.class', 'q-dark')
            .and('have.class', 'q-chip--dark')
        })
      })

      describe('(prop): color', () => {
        it('should change color based on Quasar Color Palette', () => {
          const color = 'red'

          mountQChip({
            props: {
              color
            }
          })

          cy.get('.q-chip').should('have.class', `bg-${ color }`)
        })
      })

      describe('(prop): text-color', () => {
        it('should change text color based on Quasar Color Palette', () => {
          const textColor = 'red'

          mountQChip({
            props: {
              textColor
            }
          })

          cy.get('.q-chip')
            .should('have.class', 'q-chip--colored')
            .and('have.class', `text-${ textColor }`)
        })
      })

      describe('(prop): square', () => {
        it('should have a square style when "square" prop is true', () => {
          mountQChip({
            props: {
              square: true
            }
          })

          cy.get('.q-chip').should('have.class', 'q-chip--square')
        })
      })

      describe('(prop): outline', () => {
        it('should have a outline style when "outline" prop is true', () => {
          mountQChip({
            props: {
              outline: true
            }
          })

          cy.get('.q-chip').should('have.class', 'q-chip--outline')
        })
      })

      describe('(prop): ripple', () => {
        it('should have a ripple effect when "ripple" prop is true', () => {
          mountQChip({
            props: {
              ripple: true
            }
          })

          cy.get('.q-chip').click().get('.q-ripple').should('exist')
        })

        it('should not have a ripple effect when "ripple" prop is false', () => {
          mountQChip({
            props: {
              ripple: false
            }
          })

          cy.get('.q-chip').click().get('.q-ripple').should('not.exist')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should display the default slot content', () => {
        mountQChip({
          props: {
            label: undefined
          },

          slots: {
            default: 'Default Slot Content'
          }
        })

        cy.get('.q-chip').should('have.text', 'Default Slot Content')
      })
    })
  })

  describe('Events', () => {
    describe('(event): click', () => {
      it('should emit "click" event when clicked and "clickable" prop is true', () => {
        const fn = cy.stub()

        mountQChip({
          props: {
            clickable: true,
            onClick: fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() => expect(fn).to.be.calledOnce)
      })

      it('should not emit "click" event when "clickable" prop is false', () => {
        const fn = cy.stub()

        mountQChip({
          props: {
            clickable: false,
            onClick: fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() => expect(fn).to.not.be.called)
      })
    })

    describe('(event): update:selected', () => {
      it('should update selected value when called', () => {
        const fn = cy.stub()

        mountQChip({
          props: {
            selected: false,
            'onUpdate:selected': fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() => expect(fn).to.be.calledOnce)
      })

      it('should not emit update:selected event when "selected" prop is not set', () => {
        const fn = cy.stub()

        mountQChip({
          props: {
            selected: undefined,
            'onUpdate:selected': fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() => expect(fn).to.not.be.called)
      })
    })

    describe('(event): remove', () => {
      it('should emit remove event when clicked and "removable" prop is true', () => {
        const fn = cy.stub()

        mountQChip({
          props: {
            removable: true,
            onRemove: fn
          }
        })

        cy.get('.q-chip')
          .get('.q-icon.q-chip__icon--remove')
          .click()
          .then(() => expect(fn).to.be.calledOnce)
      })

      it('should not emit remove event when "removable" prop is false', () => {
        const fn = cy.stub()

        mountQChip({
          props: {
            removable: false,
            onRemove: fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() => expect(fn).to.not.be.called)
      })
    })
  })
})
