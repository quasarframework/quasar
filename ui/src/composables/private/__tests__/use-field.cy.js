import FieldWrapper from './FieldWrapper.vue'

describe('use-field API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): autofocus', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): for', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): name', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: behavior|content', () => {
      describe('(prop): loading', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): clearable', () => {
        it.skip(' ', () => {
          //
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
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): suffix', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): clear-icon', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): label-slot', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): bottom-slots', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): counter', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: state', () => {
      describe('(prop): disable', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): readonly', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): label-color', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): color', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): bg-color', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): dark', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): filled', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): outlined', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): borderless', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): standout', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-bottom-space', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): rounded', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): square', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): dense', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): item-aligned', () => {
        it.skip(' ', () => {
          //
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): prepend', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): append', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): before', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): after', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): label', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): error', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): hint', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): counter', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): loading', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Events', () => {
    describe('(event): clear', () => {
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

    describe('(method): blur', () => {
      it.skip(' ', () => {
        //
      })
    })
  })
})
