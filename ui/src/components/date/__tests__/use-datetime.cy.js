import QDate from '../QDate'
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'
import { ref } from 'vue'
import { date } from 'quasar'

const { formatDate } = date

function mountQDate (options) {
  return cy.mount(QDate, options)
}

describe('use-datetime API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): landscape', () => {
        it('should display the component in landscape mode', () => {
          mountQDate({
            props: {
              landscape: true
            }
          })

          cy.get('.q-date--landscape')
            .should('exist')
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): mask', () => {
        it('should mask the date in the format specified', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              mask: 'YYYY/MMMM/DD',
              todayBtn: true
            }
          })

          const today = formatDate(new Date(), 'YYYY/MMMM/DD')
          cy.get('.q-date__header-today')
            .should('exist')
            .click()
          cy.get('.q-date').then(() => {
            expect(model.value).to.eq(today)
          })
        })
      })

      describe('(prop): locale', () => {
        it('should use a custom locale', () => {
          const model = ref('2018/11/03')

          mountQDate({
            props: {
              ...vModelAdapter(model)

            }
          })

          cy.get('.q-date__header-title-label')
            .should('not.contain', 'Beh, Hop 3')
            .should('contain', 'Sat, Nov 3')
          cy.get('.q-date__navigation')
            .should('contain', 'November')
            .should('not.contain', 'CustomMonth')
          cy.get('.q-date')
            .then(async () => {
              await Cypress.vueWrapper.setProps({
                locale: {
                  monthsShort: [ 'Rtn', 'Tuh', 'Sha', 'Dfk', 'Net', 'Tes', 'Ken', 'Frw', 'You', 'Bet', 'Hop', 'Nta' ],
                  daysShort: [ 'Moh', 'Mpi', 'Tad', 'Lek', 'Ntw', 'Lep', 'Beh' ],
                  months: [ '', '', '', '', '', '', '', '', '', '', 'CustomMonth', '' ]
                }
              })
            })
          cy.get('.q-date__header-title-label')
            .should('contain', 'Beh, Hop 3')
            .should('not.contain', 'Sat, Nov 3')
          cy.get('.q-date__navigation')
            .should('not.contain', 'November')
            .should('contain', 'CustomMonth')
        })
      })

      describe('(prop): calendar', () => {
        it('should set the calendar type to gregorian or persian', () => {
          const model = ref('2024/02/31')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              calendar: 'gregorian'
            }
          })

          cy.get('.q-date__calendar-item--in')
            .should('not.contain', '31')
          cy.get('.q-date__calendar-item > .bg-primary')
            .should('not.exist')

          cy.get('.q-date')
            .then(async () => {
              await Cypress.vueWrapper.setProps({ calendar: 'persian' })
            })
          cy.get('.q-date__calendar-item--in')
            .should('contain', '31')
          cy.get('.q-date__calendar-item > .bg-primary')
            .should('contain', '31')
        })
      })
    })

    describe('Category: state', () => {
      describe('(prop): readonly', () => {
        it('should set the component to readonly mode', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              readonly: true
            }
          })

          cy.get('.q-date--readonly')
            .should('exist')
        })
      })

      describe('(prop): disable', () => {
        it('should set the component to readonly mode', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              disable: true
            }
          })

          cy.get('.q-date.disabled')
            .should('exist')
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): color', () => {
        it('should set the custom color value', () => {
          mountQDate({
            props: {
              color: 'orange'
            }
          })

          cy.get('.q-date__header')
            .should('have.class', 'bg-orange')
          cy.get('.q-date__calendar-item')
            .get('.bg-primary')
            .should('not.exist')
            .get('.bg-orange')
            .should('exist')
        })
      })

      describe('(prop): text-color', () => {
        it('should use the custom text-color', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              textColor: 'red'
            }
          })

          cy.get('.q-date__header')
            .should('have.class', 'text-red')
          cy.get('.q-date__calendar-item')
            .get('.bg-primary.text-red')
            .should('exist')
        })
      })

      describe('(prop): dark', () => {
        it('should set the component to dark mode', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              dark: true
            }
          })

          cy.get('.q-date--dark.q-dark')
            .should('exist')
          cy.get('.q-date__calendar-item')
            .get('.bg-primary.text-white')
            .should('exist')
        })
      })
      const designs = [ 'square', 'flat', 'bordered' ]
      designs.forEach((design) => {
        describe(`(prop): ${ design }`, () => {
          it(`should use ${ design } design`, () => {
            mountQDate({
              props: {
                [ design ]: true
              }
            })

            cy.get(`.q-date.q-date--${ design }`)
              .should('exist')
          })
        })
      })
    })
  })
})
