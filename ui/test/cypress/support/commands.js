import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'
import { registerCommands } from '@quasar/quasar-app-extension-testing-e2e-cypress'

registerCommands()

addMatchImageSnapshotCommand({
  customSnapshotsDir: '../test/cypress/snapshots',
  // Cypress clips the screenshots taken a bit weird, add a bit of padding to center the image
  padding: [ 0, 2, 0, 0 ]
})

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
