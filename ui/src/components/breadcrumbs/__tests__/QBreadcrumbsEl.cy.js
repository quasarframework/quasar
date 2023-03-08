import QBreadcrumbsEl from '../QBreadcrumbsEl.js'

describe('BreadcrumbsEl API', () => {
  describe('Props', () => {
    describe('Category: content', () => {
      describe('(prop): label', () => {
        it('should render a label inside the breadcrumb element', () => {
          const label = 'Breadcrumb label'

          cy.mount(QBreadcrumbsEl, {
            props: { label }
          })

          cy.get('.q-breadcrumbs__el')
            .should('contain', label)
        })
      })

      describe('(prop): icon', () => {
        it('should render on the left of the breadcrumb element', () => {
          const icon = 'home'

          cy.mount(QBreadcrumbsEl, {
            props: { icon }
          })

          cy.get('.q-breadcrumbs__el')
            .should('contain', icon)
        })
      })

      describe('(prop): tag', () => {
        it('should render a custom tag', () => {
          const tag = 'a'

          cy.mount(QBreadcrumbsEl, {
            props: { tag }
          })

          cy.get('.q-breadcrumbs__el')
            .should('have.prop', 'tagName', tag.toUpperCase())
        })
      })
    })

    describe('Category: style', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should render the default slot', () => {
        const label = 'Breadcrumb label'

        cy.mount(QBreadcrumbsEl, {
          slots: { default: label }
        })

        cy.get('.q-breadcrumbs__el')
          .should('contain', label)
      })
    })
  })

  describe('Events', () => {
    describe('(event): click', () => {
      it('should emit "click" event when clicked', () => {
        const fn = cy.stub()

        cy.mount(QBreadcrumbsEl, {
          props: {
            label: 'clicked breadcrumb',
            onClick: fn
          }
        })

        cy.get('.q-breadcrumbs__el')
          .click()
          .then(() => expect(fn).to.be.calledOnce)
      })
    })
  })
})
