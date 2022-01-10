import QAvatar from './../../../components/avatar/QAvatar'
import { mount } from '@cypress/vue'
import { useSizeDefaults } from './../use-size'

describe('use-size API', () => {
  describe('Props', () => {
    describe('Category: style', () => {
      describe('(prop): size', () => {
        it('should set the size', () => {
          const size = '24px'
          mount(QAvatar, {
            props: {
              size,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.css', 'font-size', size)
        })

        it('should set the size with standard size names', () => {
          const size = 'sm'
          mount(QAvatar, {
            props: {
              size,
              color: 'grey'
            }
          })

          cy.get('.q-avatar')
            .should('have.css', 'font-size', `${ useSizeDefaults.sm }px`)
        })
      })
    })
  })
})
