import { mount } from '@cypress/vue'
import { useSizeDefaults } from '../../../composables/private/use-size'
import QAvatar from '../QAvatar'

const snapshotOptions = { customSnapshotsDir: '../src/components/avatar/__tests__' }

describe('QAvatar', () => {
  it('should set a background color', () => {
    const color = 'red'
    mount(QAvatar, {
      props: {
        color
      }
    })

    cy.get('.q-avatar')
      .should('have.class', `bg-${ color }`)
      .matchImageSnapshot(snapshotOptions)
  })

  it('should set a text color', () => {
    const textColor = 'red'
    mount(QAvatar, {
      props: {
        textColor
      },
      slots: {
        // Using only a string here results in an error, this is a workaround
        default: () => 'Q'
      }
    })

    cy.get('.q-avatar')
      .should('have.class', `text-${ textColor }`)
      .matchImageSnapshot(snapshotOptions)
  })

  it('should render an icon', () => {
    const icon = 'bug_report'
    mount(QAvatar, {
      props: {
        icon,
        color: 'grey'
      }
    })

    cy.get('.q-avatar')
      .get('.q-icon')
      .should('have.text', `${ icon }`)

    // Doing this one seperately because it can be flaky with the import of the material-icons css file in support.js if done to early
    cy.get('.q-avatar')
      .matchImageSnapshot(snapshotOptions)
  })

  it('should set the size', () => {
    const size = '24px'
    mount(QAvatar, {
      props: {
        size,
        color: 'grey'
      }
    })

    cy.get('.q-avatar')
      .should('have.css', 'font-size', size)
      .matchImageSnapshot(snapshotOptions)
  })

  it('should set the size with standard size names', () => {
    const size = 'sm'
    mount(QAvatar, {
      props: {
        size,
        color: 'grey'
      }
    })

    cy.get('.q-avatar')
      .should('have.css', 'font-size', `${ useSizeDefaults.sm }px`)
      .matchImageSnapshot(snapshotOptions)
  })

  it('should set the font-size', () => {
    const size = '40px'
    // Doing em/rem units here does not work
    // Cypress looks at actual computed values in the browser
    const fontSize = '32px'
    mount(QAvatar, {
      props: {
        size,
        fontSize,
        color: 'grey'
      }
    })

    cy.get('.q-avatar')
      .should('have.css', 'font-size', size)
      // Match image snapshot cannot be chained directly before a .should
      .matchImageSnapshot(snapshotOptions)
      .get('.q-avatar__content')
      .should('have.css', 'font-size', fontSize)
  })

  it('should create a square avatar', () => {
    mount(QAvatar, {
      props: {
        square: true,
        color: 'grey'
      },
      slots: {
        default: () => 'Q'
      }
    })

    cy.get('.q-avatar')
      .should('have.class', 'q-avatar--square')
      .matchImageSnapshot(snapshotOptions)
  })

  it('should create a rounded avatar', () => {
    mount(QAvatar, {
      props: {
        rounded: true,
        color: 'grey'
      },
      slots: {
        default: () => 'Q'
      }
    })

    cy.get('.q-avatar')
      .should('have.class', 'rounded-borders')
      .matchImageSnapshot(snapshotOptions)
  })
})
