import { mount } from '@cypress/vue'
import QAvatar from '../QAvatar'

const snapshotOptions = { customSnapshotsDir: '../src/components/avatar/__tests__' }

describe('Avatar API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): icon', () => {
        it('should render an icon', () => {
          const icon = 'bug_report'
          mount(QAvatar, {
            props: {
              icon,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .get('.q-icon')
            .should('have.text', `${ icon }`)

          // Waiting because it can be flaky with the import of the material-icons css file in support.js if done to early
          cy.get('.q-avatar')
            .wait(500)
            .matchImageSnapshot(snapshotOptions)
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
          mount(QAvatar, {
            props: {
              size,
              fontSize,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.css', 'font-size', size)
            // Match image snapshot cannot be chained directly before a .should
            .matchImageSnapshot(snapshotOptions)
            .get('.q-avatar__content')
            .should('have.css', 'font-size', fontSize)
        })
      })

      describe('(prop): color', () => {
        it('should set a background color', () => {
          const color = 'red'
          mount(QAvatar, {
            props: {
              color
            }
          })

          cy.get('.q-avatar')
            .should('have.class', `bg-${ color }`)
            .matchImageSnapshot(snapshotOptions)
        })
      })

      describe('(prop): text-color', () => {
        it('should set a text color', () => {
          const textColor = 'red'
          mount(QAvatar, {
            props: {
              textColor
            }
          })

          cy.get('.q-avatar')
            .should('have.class', `text-${ textColor }`)
            .matchImageSnapshot(snapshotOptions)
        })
      })

      describe('(prop): square', () => {
        it('should create a square avatar', () => {
          mount(QAvatar, {
            props: {
              square: true,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.class', 'q-avatar--square')
            .matchImageSnapshot(snapshotOptions)
        })
      })

      describe('(prop): rounded', () => {
        it('should create a rounded avatar', () => {
          mount(QAvatar, {
            props: {
              rounded: true,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.class', 'rounded-borders')
            .matchImageSnapshot(snapshotOptions)
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('render the text in the default slot', () => {
        const text = 'QQ'
        mount(QAvatar, {
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
