import QBanner from '../QBanner.js'

describe('Banner API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): inline-actions', () => {
        it('should render the actions in the same row as the content', () => {
          cy.mount(QBanner, {
            slots: {
              default: 'Banner content',
              action: 'Banner action'
            },
            props: {
              inlineActions: true
            }
          })

          cy.get('.q-banner').get('.q-banner__actions')
            .should('have.class', 'col-auto')
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): dense', () => {
        it('should have a dense style when "dense" prop is true', () => {
          cy.mount(QBanner, {
            props: {
              dense: true
            }

          })
          cy.get('.q-banner')
            .should('have.class', 'q-banner--dense')
        })
      })

      describe('(prop): rounded', () => {
        it('should have a rounded style when "rounded" prop is true', () => {
          cy.mount(QBanner, {
            props: {
              rounded: true
            }
          })

          cy.get('.q-banner')
            .should('have.class', 'rounded-borders')
        })
      })

      describe('(prop): dark', () => {
        it('should have a dark style when "dark" prop is true', () => {
          cy.mount(QBanner, {
            props: {
              dark: true
            }
          })

          cy.get('.q-banner')
            .should('have.class', 'q-banner--dark')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should render the default content', () => {
        cy.mount(QBanner, {
          slots: {
            default: 'Banner content'
          }
        })

        cy.get('.q-banner').get('.q-banner__content')
          .should('contain', 'Banner content')
      })
    })

    describe('(slot): avatar', () => {
      it('should render the avatar content', () => {
        cy.mount(QBanner, {
          slots: {
            avatar: 'Banner avatar'
          }
        })

        cy.get('.q-banner').get('.q-banner__avatar')
          .should('contain', 'Banner avatar')
      })
    })

    describe('(slot): action', () => {
      it('should render the action content', () => {
        cy.mount(QBanner, {
          slots: {
            action: 'Banner action'
          }
        })

        cy.get('.q-banner').get('.q-banner__actions')
          .should('contain', 'Banner action')
      })
    })
  })
})
