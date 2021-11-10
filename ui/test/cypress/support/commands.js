import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

addMatchImageSnapshotCommand({
  customSnapshotsDir: '../test/cypress/snapshots',
  // Cypress clips the screenshots taken a bit weird, add a bit of padding to center the image
  padding: [ 0, 2, 0, 0 ]
})

Cypress.Commands.add(
  'dataCy',
  { prevSubject: 'optional' },
  (subject, value, options) => {
    return cy.get(
      `[data-cy=${ value }]`,
      Object.assign(
        {
          withinSubject: subject
        },
        options
      )
    )
  }
)

Cypress.Commands.add(
  'checkVerticalPosition',
  { prevSubject: true },
  (self, anchor, anchorOrigin, selfOrigin) => {
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
  (self, anchor, anchorOrigin, selfOrigin) => {
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

const compareColor = (color, property) => (targetElement) => {
  const tempElement = document.createElement('div')
  tempElement.style.color = color
  tempElement.style.display = 'none' // make sure it doesn't actually render
  document.body.appendChild(tempElement) // append so that `getComputedStyle` actually works

  const tempColor = getComputedStyle(tempElement).color
  const targetColor = getComputedStyle(targetElement[ 0 ])[ property ]

  document.body.removeChild(tempElement) // remove it because we're done with it

  expect(tempColor).to.equal(targetColor)
}

// By default the `have.css` matcher will compare the computedColor, which is always a rgb() value.
// This creates a custom matcher that you can pass any color and it will compute a rgb() value from it.
Cypress.Commands.overwrite(
  'should',
  (originalFn, subject, expectation, ...args) => {
    const customMatchers = {
      'have.backgroundColor': compareColor(args[ 0 ], 'backgroundColor'),
      'have.color': compareColor(args[ 0 ], 'color')
    }

    // See if the expectation is a string and if it is a member of Jest's expect
    if (typeof expectation === 'string' && customMatchers[ expectation ]) {
      return originalFn(subject, customMatchers[ expectation ])
    }
    return originalFn(subject, expectation, ...args)
  }
)
