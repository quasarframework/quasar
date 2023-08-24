import QBadge from '../QBadge.js'

const defaultOptions = {
  label: 'simple badge'
}

const alignValues = [ 'top', 'middle', 'bottom' ]

function mountQBadge (options = {}) {
  options.props = {
    ...defaultOptions,
    ...options.props
  }

  return cy.mount(QBadge, options)
}

describe('Badge API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): floating', () => {
        it('should render a floating badge', () => {
          mountQBadge({
            props: { floating: true }
          })

          cy.get('.q-badge')
            .should('have.class', 'q-badge--floating')
        })
      })

      describe('(prop): multi-line', () => {
        it('should render a content with multiple lines', () => {
          mountQBadge({
            props: { multiLine: true }
          })

          cy.get('.q-badge')
            .should('have.class', 'q-badge--multi-line')
        })
      })

      describe('(prop): label', () => {
        it('should render a label inside the badge', () => {
          const label = 'Badge label'

          mountQBadge({
            props: { label }
          })

          cy.get('.q-badge')
            .should('contain', label)
        })
      })

      describe('(prop): align', () => {
        it(`should render a badge aligned based on defined values: ${ alignValues.join(', ') }`, () => {
          mountQBadge()

          // loop over alignValues
          for (const align of alignValues) {
            cy.get('.q-badge')
              .then(() => Cypress.vueWrapper.setProps({ align }))
              .should('have.css', 'vertical-align', align)
          }
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): color', () => {
        it('should change color based on Quasar Color Palette', () => {
          mountQBadge({
            props: { color: 'red' }
          })

          cy.get('.q-badge')
            .should('have.class', 'bg-red')
        })
      })

      describe('(prop): text-color', () => {
        it('should change text color based on Quasar Color Palette', () => {
          mountQBadge({
            props: { textColor: 'red' }
          })

          cy.get('.q-badge')
            .should('have.class', 'text-red')
        })
      })

      describe('(prop): transparent', () => {
        it('should have opacity style when "transparent" prop is true', () => {
          mountQBadge({
            props: { transparent: true }
          })

          cy.get('.q-badge')
            .should('have.class', 'q-badge--transparent')
        })
      })

      describe('(prop): outline', () => {
        it('should have a outline style when "outline" prop is true', () => {
          mountQBadge({
            props: { outline: true }
          })

          cy.get('.q-badge')
            .should('have.class', 'q-badge--outline')
        })
      })

      describe('(prop): rounded', () => {
        it('should have a rounded style when "rounded" prop is true', () => {
          mountQBadge({
            props: { rounded: true }
          })

          cy.get('.q-badge')
            .should('have.class', 'q-badge--rounded')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should display the default slot content', () => {
        const label = 'Badge label'

        mountQBadge({
          props: {
            label: undefined
          },

          slots: {
            default: label
          }
        })

        cy.get('.q-badge')
          .should('have.text', label)
      })
    })
  })
})
