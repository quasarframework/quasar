import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

addMatchImageSnapshotCommand({
  customSnapshotsDir: '../test/cypress/snapshots',
  // Cypress clips the screenshots taken a bit weird, add a bit of padding to center the image
  padding: [ 0, 2, 0, 0 ]
})

Cypress.Commands.add('dataCy', { prevSubject: 'optional' }, (subject, value) => {
  return cy.get(`[data-cy=${ value }]`, {
    withinSubject: subject
  })
})

Cypress.Commands.add('checkVerticalPosition', { prevSubject: true }, (self, anchor, anchorOrigin, selfOrigin) => {
  const selfRect = self[ 0 ].getBoundingClientRect()
  let selfCompare = null
  switch (selfOrigin) {
    case 'bottom':
      selfCompare = selfRect.bottom
      break

    case 'center':
      selfCompare = (selfRect.top + selfRect.bottom) / 2
      break

    default:
      // Use selfOrigin top as default
      selfCompare = selfRect.top
      break
  }

  let anchorRect = null

  cy.get(`[data-cy=${ anchor }]`)
    .then($el => {
      anchorRect = $el[ 0 ].getBoundingClientRect()

      switch (anchorOrigin) {
        case 'top':
          expect(selfCompare).to.equal(anchorRect.top)
          break

        case 'bottom':
          expect(selfCompare).to.equal(anchorRect.bottom)
          break

        case 'center':
          expect(selfCompare).to.equal((anchorRect.top + anchorRect.bottom) / 2)
          break

        default:
          break
      }

      return self
    })
})

Cypress.Commands.add('checkHorizontalPosition', { prevSubject: true }, (self, anchor, anchorOrigin, selfOrigin) => {
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

  let anchorRect = null

  cy.get(`[data-cy=${ anchor }]`)
    .then($el => {
      anchorRect = $el[ 0 ].getBoundingClientRect()

      switch (anchorOrigin) {
        case 'left':
          expect(selfCompare).to.equal(anchorRect.left)
          break

        case 'right':
          expect(selfCompare).to.equal(anchorRect.right)
          break

        case 'middle':
          expect(selfCompare).to.equal((anchorRect.left + anchorRect.right) / 2)
          break

        default:
          break
      }

      return self
    })
})
