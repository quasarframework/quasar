import QBtn from '../QBtn.js'

const defaultOptions = {
  label: 'simple Btn'
}

function mountQBtn (options = {}) {
  options.props = {
    ...defaultOptions,
    ...options.props
  }

  return cy.mount(QBtn, options)
}

describe('Btn API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): percentage', () => {
        it('should render a button with a percentage when "loading" prop is set to true', () => {
          const percentage = 50

          mountQBtn({
            props: {
              percentage,
              loading: true
            }
          })

          cy.get('.q-btn').should('have.attr', 'aria-valuenow', percentage)
        })
      })

      describe('(prop): dark-percentage', () => {
        it('should render a button with a dark percentage when "loading" prop is set to true', () => {
          const percentage = 50

          mountQBtn({
            props: {
              percentage,
              loading: true,
              darkPercentage: true
            }
          })

          cy.get('.q-btn').should('have.attr', 'aria-valuenow', percentage)
            .get('.q-btn__progress').should('have.class', 'q-btn__progress--dark')
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): round', () => {
        it('should render a circle shaped button when "round" prop is set to true', () => {
          mountQBtn({
            props: {
              round: true
            }
          })

          cy.get('.q-btn').should('have.class', 'q-btn--round')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should render a button with a label', () => {
        mountQBtn()

        cy.get('.q-btn').should('contain', defaultOptions.label)
      })
    })

    describe('(slot): loading', () => {
      it('should render a button with a loading slot', () => {
        const loadingSlot = 'loading slot'

        mountQBtn({
          props: {
            loading: true
          },
          slots: {
            loading: loadingSlot
          }
        })

        cy.get('.q-btn').should('contain', loadingSlot).contains(defaultOptions.label).should('not.be.visible')
      })
    })
  })

  describe('Events', () => {
    describe('(event): click', () => {
      it('should emit a click event when the button is clicked', () => {
        const fn = cy.stub()

        mountQBtn({
          props: {
            onClick: fn
          }
        })

        cy.get('.q-btn').click()
        cy.get('.q-btn')
          .then(() => expect(fn).to.be.calledOnce)
      })
    })
  })

  describe('Methods', () => {
    describe('(method): click', () => {
      it('should click the button', () => {
        const fn = cy.stub()

        mountQBtn({
          props: {
            onClick: fn
          }
        }).then(({ wrapper }) => {
          wrapper.vm.click()
          return expect(fn).to.be.calledOnce
        })
      })
    })
  })
})
