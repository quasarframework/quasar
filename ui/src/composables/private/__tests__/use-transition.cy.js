import WrapperOne from '../../../components/menu/__tests__/WrapperOne.vue'

describe('use-transition API', () => {
  describe('Props', () => {
    describe('Category: transition', () => {
      describe('(prop): transition-show', () => {
        it('should use the fade transition by default', () => {
          cy.mount(WrapperOne)
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu', { timeout: 0 }) // Disable retry
            .should('have.class', 'q-transition--fade-enter-active')
        })

        it('should use a different show transition if defined', () => {
          const transition = 'scale'
          cy.mount(WrapperOne, {
            props: {
              transitionShow: transition
            }
          })
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu', { timeout: 0 }) // Disable retry
            .should('have.class', `q-transition--${ transition }-enter-active`)
        })
      })

      describe('(prop): transition-hide', () => {
        it('should use the fade transition by default', () => {
          cy.mount(WrapperOne)
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
          cy.get('body')
            .type('{esc}')
          cy.dataCy('menu', { timeout: 0 }) // Disable retry
            .should('have.class', 'q-transition--fade-leave-active')
        })

        it('should use a different hide transition if defined', () => {
          const transition = 'scale'
          cy.mount(WrapperOne, {
            props: {
              transitionHide: transition
            }
          })
          cy.dataCy('wrapper')
            .click()
          cy.dataCy('menu')
            .should('exist')
          cy.get('body')
            .type('{esc}')
          cy.dataCy('menu', { timeout: 0 }) // Disable retry
            .should('have.class', `q-transition--${ transition }-leave-active`)
        })
      })

      describe('(prop): transition-duration', () => {
        it('should be done with transitioning after 300ms passed', () => {
          cy.mount(WrapperOne)
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.dataCy('wrapper')
            .click()
            .wait(300)
          cy.dataCy('menu', { timeout: 350 })
            .should('not.have.class', 'q-transition--fade-enter-active')
        })

        it('should not be done with transitioning before 300ms passed', () => {
          cy.mount(WrapperOne)
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.dataCy('wrapper')
            .click()
            .wait(200) // Commands take some time so a high value can fail, just take a decent margin
          cy.dataCy('menu', { timeout: 0 }) // Disable retry
            .should('have.class', 'q-transition--fade-enter-active')
        })

        it('should be done after a custom 1000ms passed', () => {
          cy.mount(WrapperOne, {
            props: {
              transitionDuration: 1000
            }
          })
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.dataCy('wrapper')
            .click()
            .wait(1000)
          cy.dataCy('menu', { timeout: 0 }) // Disable retry
            .should('not.have.class', 'q-transition--fade-enter-active')
        })

        it('should not be done before a custom 1000ms passed', () => {
          cy.mount(WrapperOne, {
            props: {
              transitionDuration: 1000
            }
          })
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.dataCy('wrapper')
            .click()
            .wait(900)
          cy.dataCy('menu', { timeout: 0 }) // Disable retry
            .should('have.class', 'q-transition--fade-enter-active')
        })
      })
    })
  })
})
