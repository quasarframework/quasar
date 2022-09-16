import { mount } from '@cypress/vue'
import QChip, { defaultSizes } from '../QChip.js'

describe('Chip API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): icon', () => {
        it('should render an icon', () => {
          const icon = 'add'

          mount(QChip, {
            propsData: {
              icon
            }
          })

          cy.get('.q-chip')
            .get('.q-icon')
            .should('have.text', `${ icon }`)
        })
      })

      describe('(prop): icon-right', () => {
        it('should render an icon on the right', () => {
          const icon = 'add'

          mount(QChip, {
            propsData: {
              iconRight: icon
            }
          })

          cy.get('.q-chip')
            .get('.q-icon.q-chip__icon--right')
            .should('have.text', `${ icon }`)
        })
      })

      describe('(prop): icon-remove', () => {
        it('should render a remove icon if "removable" is active', () => {
          const icon = 'delete'

          mount(QChip, {
            propsData: {
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
        it('should render a selected icon if is true', () => {
          const icon = 'done'

          mount(QChip, {
            propsData: {
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
        it('should render the label inside the chip', () => {
          const label = 'Chip label'

          mount(QChip, {
            propsData: {
              label
            }
          })

          cy.get('.q-chip')
            .get('.q-chip__content')
            .should('have.text', label)
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): tabindex', () => {
        it('should set the tabindex', () => {
          const tabindex = 1

          mount(QChip, {
            propsData: {
              clickable: true,
              tabindex
            }
          })

          cy.get('.q-chip')
            .should('have.attr', 'tabindex', `${ tabindex }`)
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should be exist when modelValue is true', () => {
          mount(QChip, {
            propsData: {
              modelValue: true
            }
          })

          cy.get('.q-chip').should('exist')
        })

        it('should NOT be exist when modelValue is false', () => {
          mount(QChip, {
            propsData: {
              modelValue: false
            }
          })

          cy.get('.q-chip').should('not.exist')
        })
      })

      describe('(prop): selected', () => {
        it('should be selected when selected is true', () => {
          mount(QChip, {
            propsData: {
              selected: true
            }
          })

          cy.get('.q-chip.q-chip--selected').should('exist')
        })

        it('should NOT be selected when selected is false', () => {
          mount(QChip, {
            propsData: {
              selected: false
            }
          })

          // q-ship should not have the class "q-chip--selected"
          cy.get('.q-chip').not('.q-chip--selected').should('exist')
        })
      })
    })

    describe('Category: state', () => {
      describe('(prop): clickable', () => {
        it('should have hover effects and emit click events when clickable is true', () => {
          const fn = cy.stub()

          mount(QChip, {
            propsData: {
              clickable: true,
              onClick: fn
            }
          })

          cy.get('.q-chip')
            .should('have.css', 'cursor', 'pointer')
            .click()
            .then(() =>
              expect(fn).to.be.calledOnce
            )
        })
      })

      describe('(prop): removable', () => {
        it('should displays a "remove" icon that when clicked the QChip emits "remove" event', () => {
          const fn = cy.stub()

          mount(QChip, {
            propsData: {
              removable: true,
              onRemove: fn
            }
          })

          cy.get('.q-chip')
            .get('.q-icon.q-chip__icon--remove')
            .click()
            .then(() =>
              expect(fn).to.be.calledOnce
            )
        })
      })

      describe('(prop): disable', () => {
        it('should NOT have hover effects and NOT emit click events when disable is true', () => {
          const fn = cy.stub()

          mount(QChip, {
            propsData: {
              disable: true,
              onClick: fn
            }
          })

          cy.get('.q-chip')
            .should('not.have.css', 'cursor', 'pointer')
            .click()
            .then(() =>
              expect(fn).to.not.be.called
            )
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): dense', () => {
        it('should have a dense style when dense is true', () => {
          mount(QChip, {
            propsData: {
              dense: true
            }
          })

          cy.get('.q-chip.q-chip--dense').should('exist')
        })
      })

      describe('(prop): size', () => {
        it('should change QChip size based on a CSS unit value', () => {
          const size = '50px'

          mount(QChip, {
            propsData: {
              size
            }
          })

          cy.get('.q-chip')
            .should('have.css', 'font-size', size)
        })

        it('should change QChip size based defined values: xs, sm, md, lg, xl', () => {
          const sizes = [ 'xs', 'sm', 'md', 'lg', 'xl' ]

          sizes.forEach(size => {
            mount(QChip, {
              propsData: {
                size
              }
            })

            cy.get('.q-chip')
              .should('have.css', 'font-size', `${ defaultSizes[ size ] }px`)

            // remove the component from the DOM
            cy.get('.q-chip').invoke('remove')
          })
        })
      })

      describe('(prop): dark', () => {
        it('should have a dark style when dark is true', () => {
          mount(QChip, {
            propsData: {
              dark: true
            }
          })

          cy.get('.q-chip.q-dark.q-chip--dark').should('exist')
        })
      })

      describe('(prop): color', () => {
        it('should change color based on Quasar Color Palette', () => {
          const color = 'red'

          mount(QChip, {
            propsData: {
              color
            }
          })

          cy.get(`.q-chip.bg-${ color }`).should('exist')
        })
      })

      describe('(prop): text-color', () => {
        it('should change text color based on Quasar Color Palette', () => {
          const textColor = 'red'

          mount(QChip, {
            propsData: {
              textColor
            }
          })

          cy.get(`.q-chip.q-chip--colored.text-${ textColor }`).should('exist')
        })
      })

      describe('(prop): square', () => {
        it('should have a square style when square is true', () => {
          mount(QChip, {
            propsData: {
              square: true
            }
          })

          cy.get('.q-chip.q-chip--square').should('exist')
        })
      })

      describe('(prop): outline', () => {
        it('should have a outline style when outline is true', () => {
          mount(QChip, {
            propsData: {
              outline: true
            }
          })

          cy.get('.q-chip.q-chip--outline').should('exist')
        })
      })

      describe('(prop): ripple', () => {
        it('should have a ripple effect when ripple is true', () => {
          mount(QChip, {
            propsData: {
              ripple: true
            }
          })

          cy.get('.q-chip')
            .click()
            .get('.q-ripple')
            .should('exist')
        })

        it('should NOT have a ripple effect when ripple is false', () => {
          mount(QChip, {
            propsData: {
              ripple: false
            }
          })

          cy.get('.q-chip')
            .click()
            .get('.q-ripple')
            .should('not.exist')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should display the default slot content', () => {
        mount(QChip, {
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
      it('should emit click event when clicked and "clickable" is set', () => {
        const fn = cy.stub()

        mount(QChip, {
          propsData: {
            clickable: true,
            onClick: fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() =>
            expect(fn).to.be.calledOnce
          )
      })

      it('should NOT emit click event when "clickable" is NOT set', () => {
        const fn = cy.stub()

        mount(QChip, {
          propsData: {
            onClick: fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() =>
            expect(fn).to.not.be.called
          )
      })
    })

    describe('(event): update:selected', () => {
      it('should update selected value when called', () => {
        const fn = cy.stub()

        mount(QChip, {
          propsData: {
            selected: false,
            'onUpdate:selected': fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() =>
            expect(fn).to.be.calledOnce
          )
      })

      it('should NOT emit update:selected event selected is NOT applied', () => {
        const fn = cy.stub()

        mount(QChip, {
          propsData: {
            'onUpdate:selected': fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() =>
            expect(fn).to.not.be.called
          )
      })
    })

    describe('(event): remove', () => {
      it('should emit remove event when clicked and removable is applied', () => {
        const fn = cy.stub()

        mount(QChip, {
          propsData: {
            removable: true,
            onRemove: fn
          }
        })

        cy.get('.q-chip')
          .get('.q-icon.q-chip__icon--remove')
          .click()
          .then(() =>
            expect(fn).to.be.calledOnce
          )
      })

      it('should NOT emit remove event when removable is NOT applied', () => {
        const fn = cy.stub()

        mount(QChip, {
          propsData: {
            onRemove: fn
          }
        })

        cy.get('.q-chip')
          .click()
          .then(() =>
            expect(fn).to.not.be.called
          )
      })
    })
  })
})
