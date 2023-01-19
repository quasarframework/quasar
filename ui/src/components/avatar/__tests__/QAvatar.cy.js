import QAvatar from '../QAvatar.js'

describe('Avatar API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): icon', () => {
        it('should render an icon', () => {
          const icon = 'bug_report'
          cy.mount(QAvatar, {
            props: {
              icon,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .get('.q-icon')
            .should('have.text', `${ icon }`)
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): font-size', () => {
        it('should set the font-size', () => {
          const size = '40px'
          // Doing em/rem units here does not work
          // Cypress looks at actual computed values in the browser
          const fontSize = '32px'
          cy.mount(QAvatar, {
            props: {
              size,
              fontSize,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.css', 'font-size', size)
            .get('.q-avatar__content')
            .should('have.css', 'font-size', fontSize)
        })
      })

      describe('(prop): color', () => {
        it('should set a background color', () => {
          const color = 'red'
          cy.mount(QAvatar, {
            props: {
              color
            }
          })

          cy.get('.q-avatar')
            .should('have.class', `bg-${ color }`)
        })
      })

      describe('(prop): text-color', () => {
        it('should set a text color', () => {
          const textColor = 'red'
          cy.mount(QAvatar, {
            props: {
              textColor
            }
          })

          cy.get('.q-avatar')
            .should('have.class', `text-${ textColor }`)
        })
      })

      describe('(prop): square', () => {
        it('should create a square avatar', () => {
          cy.mount(QAvatar, {
            props: {
              square: true,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.class', 'q-avatar--square')
            .should('have.css', 'border-radius', '0px')
        })
      })

      describe('(prop): rounded', () => {
        it('should create a rounded avatar', () => {
          cy.mount(QAvatar, {
            props: {
              rounded: true,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.class', 'rounded-borders')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('render the text in the default slot', () => {
        const text = 'QQ'
        cy.mount(QAvatar, {
          slots: {
            // Using only a string here results in an error, this is a workaround
            default: () => text
          }
        })

        cy.get('.q-avatar')
          .should('have.text', text)
      })
    })
  })
})
