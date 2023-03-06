import QBar from '../QBar.js'

describe('Bar API', () => {
  describe('Props', () => {
    describe('Category: style', () => {
      describe('(prop): dense', () => {
        it('should have a dense style when "dense" prop is true', () => {
          cy.mount(QBar, {
            propsData: {
              dense: true
            }
          })
          cy.get('.q-bar')
            .should('have.class', 'q-bar--dense')
        })
      })

      describe('(prop): dark', () => {
        it('should have a dark style when "dark" prop is true', () => {
          cy.mount(QBar, {
            propsData: {
              dark: true
            }
          })
          cy.get('.q-bar')
            .should('have.class', 'q-bar--dark')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should render the default slot', () => {
        cy.mount(QBar, {
          slots: {
            default: 'default bar slot'
          }
        })
        cy.get('.q-bar')
          .should('contain', 'default bar slot')
      })
    })
  })
})
