import { mount } from '@cypress/vue'
import QBadge from './QBadge'

const snapshotOptions = {customSnapshotsDir: '../src/components/badge'}

describe('QBadge', () => {
  let label = 'Test'
  const color = 'primary'

  it('should render a QBadge with a label and color', () => {
    mount(QBadge, {
      props: {
        label,
        color
      }
    })

    cy.get('.q-badge').should('have.text', label).should('have.class', `bg-${color}`)
    cy.matchImageSnapshot(snapshotOptions)
  })
})
