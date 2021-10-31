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

Cypress.Commands.add('checkPosition', { prevSubject: true }, (subject, target, position) => {
  let subjectPos = null
  let targetPos = null

  switch (position) {
    case 'bottom':
      subjectPos = subject[ 0 ].offsetTop
      break

    default:
      break
  }

  cy.get(`[data-cy=${ target }]`)
    .then($el => {
      switch (position) {
        case 'bottom':
          targetPos = $el[ 0 ].offsetTop + $el[ 0 ].offsetHeight
          break

        default:
          break
      }

      expect(subjectPos).to.equal(targetPos)
      return subject
    })
})
