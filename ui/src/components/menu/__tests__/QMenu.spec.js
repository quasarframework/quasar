import { mount } from '@cypress/vue'
import MenuWrapperBtn from './MenuWrapperBtn.vue'

// const snapshotOptions = { customSnapshotsDir: '../src/components/menu/__tests__' }

describe('QMenu', () => {
  it('should show a menu at the bottom of the wrapper', () => {
    mount(MenuWrapperBtn, {})

    cy.dataCy('wrapper')
      .click()

    cy.dataCy('menu')
      .checkPosition('wrapper', 'bottom')
    // .matchImageSnapshot(snapshotOptions)
  })
})
