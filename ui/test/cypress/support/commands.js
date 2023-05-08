// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// DO NOT REMOVE
// Imports Quasar Cypress AE predefined commands
import { registerCommands } from '@quasar/quasar-app-extension-testing-e2e-cypress'
registerCommands()

Cypress.Commands.add(
  'checkVerticalPosition',
  { prevSubject: true },
  (self, anchor, anchorOrigin, selfOrigin, offset = 0) => {
    const selfRect = self[ 0 ].getBoundingClientRect()
    let selfCompare = null
    switch (selfOrigin) {
      case 'bottom':
        selfCompare = selfRect.bottom
        break

      case 'center':
        selfCompare = ((selfRect.top + selfRect.bottom) / 2)
        break

      default:
        // Use selfOrigin top as default
        selfCompare = selfRect.top
        break
    }

    if (anchorOrigin === 'top') selfCompare += offset
    if (anchorOrigin === 'bottom') selfCompare -= offset

    let anchorRect = null

    cy.get(`[data-cy=${ anchor }]`).then(($el) => {
      anchorRect = $el[ 0 ].getBoundingClientRect()

      switch (anchorOrigin) {
        case 'top':
          expect(selfCompare).to.equal(anchorRect.top)
          break

        case 'bottom':
          expect(selfCompare).to.equal(anchorRect.bottom)
          break

        case 'center':
          expect(selfCompare).to.be.at.least(
            (anchorRect.top + anchorRect.bottom) / 2 - 0.1
          )
          expect(selfCompare).to.be.at.most(
            (anchorRect.top + anchorRect.bottom) / 2 + 0.1
          )
          break

        default:
          break
      }

      return self
    })
  }
)

Cypress.Commands.add(
  'checkHorizontalPosition',
  { prevSubject: true },
  (self, anchor, anchorOrigin, selfOrigin, offset = 0) => {
    const selfRect = self[ 0 ].getBoundingClientRect()
    let selfCompare = null
    switch (selfOrigin) {
      case 'right':
        selfCompare = selfRect.right
        break

      case 'middle':
        selfCompare = (selfRect.left + selfRect.right) / 2
        break

      default:
        // Use selfOrigin left as default
        selfCompare = selfRect.left
        break
    }

    if (anchorOrigin === 'left') selfCompare += offset
    if (anchorOrigin === 'right') selfCompare -= offset

    let anchorRect = null

    cy.get(`[data-cy=${ anchor }]`).then(($el) => {
      anchorRect = $el[ 0 ].getBoundingClientRect()

      switch (anchorOrigin) {
        case 'left':
          expect(selfCompare).to.equal(anchorRect.left)
          break

        case 'right':
          expect(selfCompare).to.equal(anchorRect.right)
          break

        case 'middle':
          // Due to subpixel calculations there seems to be some slight offset sometimes
          expect(selfCompare).to.be.at.least(
            (anchorRect.left + anchorRect.right) / 2 - 0.1
          )
          expect(selfCompare).to.be.at.most(
            (anchorRect.left + anchorRect.right) / 2 + 0.1
          )
          break

        default:
          break
      }

      return self
    })
  }
)

Cypress.Commands.add('isNotActionable', { prevSubject: true }, function (subject, done) {
  cy.once('fail', (err) => {
    expect(err.message).to.include('`cy.click()` failed because this element')
    expect(err.message).to.include('is being covered by another element')
    done()
  })
  cy.wrap(subject)
    .click({ timeout: 100 })
    .then(x => {
      done(new Error('Expected element NOT to be clickable, but click() succeeded'))
    })
  return subject
})
