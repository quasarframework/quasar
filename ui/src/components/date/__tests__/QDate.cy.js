import QDate from '../QDate'
import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'
import { ref } from 'vue'
import { date } from 'quasar'

const { formatDate, addToDate } = date

function mountQDate (options) {
  return cy.mount(QDate, options)
}

describe('Date API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): years-in-month-view', () => {
        it('should show the years selector in months view', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              defaultView: 'Months',
              yearsInMonthView: true
            }
          })

          cy.get('.q-date__months .bg-primary')
            .should('contain', 'Jun')
          cy.get('.q-date__months')
            .should('contain', '2018')
            .then(async () => {
              await Cypress.vueWrapper.setProps({ yearsInMonthView: false })
            })

          cy.get('.q-date__months')
            .should('not.contain', '2018')
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): title', () => {
        it('should override the default title header', () => {
          const title = 'Birthday'

          mountQDate({
            props: {
              title
            }
          })

          cy.get('.q-date__header-title')
            .should('contain', title)
        })
      })

      describe('(prop): subtitle', () => {
        it('should override the default subtitle', () => {
          const subtitle = 'Birthday'

          mountQDate({
            props: {
              subtitle
            }
          })

          cy.get('.q-date__header-subtitle')
            .should('contain', subtitle)
        })
      })

      describe('(prop): today-btn', () => {
        it('should display a button that selects the current day', () => {
          const format = 'YYYY/MM/DD'
          const currentDate = new Date()
          const futureDate = addToDate(currentDate, { days: 5 })
          const fiveDaysFromToday = ref(formatDate(futureDate, format))

          const today = formatDate(currentDate, format)

          mountQDate({
            props: {
              ...vModelAdapter(fiveDaysFromToday),
              todayBtn: true
            }
          })

          cy.get('.q-date__header-today')
            .should('exist')

          cy.get('.q-date').then(() => {
            expect(fiveDaysFromToday.value).not.to.eq(today)
          })

          cy.get('.q-date__calendar-item > .bg-primary')
            .should('contain', futureDate.getDate())
            .should('not.contain', currentDate.getDate())

          cy.get('.q-date__header-today')
            .click()

          cy.get('.q-date').then(() => {
            expect(fiveDaysFromToday.value).to.eq(today)
          })

          cy.log('Visually check that the right date is selected')
          cy.get('.q-date__calendar-item > .bg-primary')
            .should('not.contain', futureDate.getDate())
            .should('contain', currentDate.getDate())
        })
      })

      describe('(prop): minimal', () => {
        it('should hide the header', () => {
          mountQDate({
            props: {
              minimal: true
            }
          })

          cy.get('.q-date__header-title')
            .should('not.exist')
        })
      })
    })

    describe('Category: model', () => {
      describe('(prop): model-value', () => {
        it('should select the correct date based on the model value', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model)
            }
          })

          cy.get('.q-date__calendar-item > .bg-primary')
            .should('contain', '3')

          cy.get('.q-date')
            .then(async () => {
              await Cypress.vueWrapper.setProps({ modelValue: '2018/06/05' })
            })

          cy.get('.q-date__calendar-item > .bg-primary')
            .should('not.contain', '3')
            .should('contain', '5')
        })
      })

      describe('(prop): default-year-month', () => {
        it('should display the date picker with a default year and month', () => {
          mountQDate({
            props: {
              defaultYearMonth: '1986/01'
            }
          })

          const today = new Date()
          const thisYear = today.getFullYear()
          const thisMonth = today.toLocaleDateString('en-US', { month: 'long' })

          cy.get('.q-date__navigation .q-btn__content')
            .should('not.contain', thisYear)
            .should('not.contain', thisMonth)
            .should('contain', 'January')
            .should('contain', '1986')
        })
      })

      describe('(prop): default-view', () => {
        it('should display with a default years view', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              defaultView: 'Years'
            }
          })

          cy.get('.q-date__years .bg-primary')
            .should('contain', '2018')
          cy.get('.q-date__calendar')
            .should('not.exist')
          cy.get('.q-date__months')
            .should('not.exist')
        })

        it('should display with a default months view', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              defaultView: 'Months'
            }
          })

          cy.get('.q-date__months .bg-primary')
            .should('contain', 'Jun')
          cy.get('.q-date__calendar')
            .should('not.exist')
          cy.get('.q-date__years')
            .should('not.exist')
        })

        it('should display with a default calendar view', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              defaultView: 'Calendar'
            }
          })

          cy.get('.q-date__calendar')
            .should('contain', 'June')
            .should('contain', '2018')
          cy.get('.q-date__months')
            .should('not.exist')
          cy.get('.q-date__years')
            .should('not.exist')
        })
      })

      describe('(prop): events', () => {
        it('should highlight a single event on the calendar', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              events: '2018/06/12'
            }
          })

          cy.get('.q-date__calendar-item')
            .get('.q-date__event')
            .parent()
            .should('contain', '12')
        })

        it('should highlight multiple events on the calendar', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              events: [ '2018/06/12', '2018/06/17', '2018/06/20' ]
            }
          })

          cy.get('.q-date__calendar-item')
            .get('.q-date__event')
            .parent()
            .should('contain', '12')
            .should('contain', '17')
            .should('contain', '20')
        })

        it('should highlight an event on the calendar using a function', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              events: (date) => date > '2018/06/28'
            }
          })

          cy.get('.q-date__calendar-item')
            .get('.q-date__event')
            .parent()
            .should('contain', '29')
            .should('contain', '30')
        })
      })

      describe('(prop): options', () => {
        it('should set limited options for selection using an array', () => {
          const model = ref('2018/06/03')

          const options = [ 10, 13, 15, 17, 30 ]
          mountQDate({
            props: {
              ...vModelAdapter(model),
              options: options.map((day) => `2018/06/${ day }`)
            }
          })

          for (let day = 1; day <= 30; day++) {
            if (options.includes(day)) {
              cy.get('.q-date__calendar-item--in')
                .should('contain', day)
            }
            else {
              cy.get('.q-date__calendar-item--out')
                .should('contain', day)
            }
          }
        })

        it('should set a limited options for selection using a function', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              options: (date) => date > '2018/06/28'
            }
          })

          const validOptions = [ 29, 30 ]
          for (let day = 1; day <= 30; day++) {
            if (validOptions.includes(day)) {
              cy.get('.q-date__calendar-item--in')
                .should('contain', day)
            }
            else {
              cy.get('.q-date__calendar-item--out')
                .should('contain', day)
            }
          }
        })
      })

      describe('(prop): first-day-of-week', () => {
        it('should set the first day of the week', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              firstDayOfWeek: '2'
            }
          })

          const newWeekdaysFormat = [ 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon' ]

          cy.log('Check that first and third days are no longer the defaults')
          cy.get('.q-date__calendar-weekdays')
            .children()
            .first()
            .should('not.contain', 'Sun')
          cy.get('.q-date__calendar-weekdays')
            .children()
            .eq(2)
            .should('not.contain', 'Tue')

          cy.get('.q-date__calendar-weekdays')
            .children()
            .each((child, index) => {
              cy.wrap(child).should('contain', newWeekdaysFormat[ index ])
            })
        })
      })

      describe('(prop): emit-immediately', () => {
        it('should emit event to change the model when the user browses years and months', () => {
          const model = ref('2018/06/03')

          const fn = cy.stub()
          mountQDate({
            props: {
              ...vModelAdapter(model),
              'onUpdate:modelValue': fn,
              emitImmediately: true
            }
          })

          cy.get('.q-date__navigation')
            .contains('June')
            .click()

          cy.get('.q-date__months')
            .contains('Dec')
            .click()

          cy.get('.q-date__navigation')
            .should('contain', 'December')
            .then(() => expect(fn).to.be.calledWith('2018/12/03'))
        })
      })
    })

    describe('Category: model|selection', () => {
      describe('(prop): multiple', () => {
        it('should not select multiple days by default', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model)
            }
          })

          cy.get('.q-date__calendar-item--in')
            .contains('28')
            .click()
          cy.get('.q-date__calendar-item--in')
            .contains('29')
            .click()

          cy.get('.q-date__calendar-item > .bg-primary')
            .should('not.contain', '28')
            .should('contain', '29')
        })

        it('should select multiple days', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              multiple: true
            }
          })

          cy.get('.q-date__calendar-item--in')
            .contains('28')
            .click()
          cy.get('.q-date__calendar-item--in')
            .contains('29')
            .click()

          cy.get('.q-date__calendar-item > .bg-primary')
            .should('contain', '28')
            .should('contain', '29')
        })
      })

      describe('(prop): range', () => {
        it('should select a date range', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              range: true
            }
          })

          cy.get('.q-date__calendar-item--in')
            .contains('2')
            .click()
          cy.get('.q-date__calendar-item--in')
            .contains('5')
            .click()

          cy.get('.q-date__calendar-item--in > .bg-primary')
            .get('.q-date__range-from')
            .should('contain', '2')
          cy.get('.q-date__calendar-item--in > .bg-primary')
            .get('.q-date__range-to')
            .should('contain', '5')
          cy.get('.q-date__range')
            .should('not.contain', '1')
            .should('contain', '3')
            .should('contain', '4')
            .should('not.contain', '6')

          cy.get('.q-date__range')
            .then(() => {
              expect(model.value.from).to.equal('2018/06/02')
              expect(model.value.to).to.equal('2018/06/05')
            })
        })
      })
    })

    describe('Category: selection', () => {
      describe('(prop): navigation-min-year-month', () => {
        it('should prevent user from navigating below a specific year+month', () => {
          const model = ref('2018/05/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              navigationMinYearMonth: '2018/03'
            }
          })

          cy.get('.q-date__navigation')
            .contains('May')
            .click()
          cy.get('.q-date__months')
            .contains('Jan')
            .should('be.disabled')
          cy.get('.q-date__months')
            .contains('Feb')
            .should('be.disabled')
          cy.get('.q-date__months')
            .contains('Mar')
            .should('be.enabled')
          cy.get('.q-date__months')
            .contains('Jun')
            .should('be.enabled')
            .click()

          cy.get('.q-date__navigation')
            .contains('2018')
            .click()
          cy.get('.q-date__years-content')
            .contains('2017')
            .should('be.disabled')
          cy.get('.q-date__years-content')
            .contains('2019')
            .should('be.enabled')
        })
      })

      describe('(prop): navigation-max-year-month', () => {
        it('should prevent a user from navigating above a specific year+month', () => {
          const model = ref('2018/05/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              navigationMaxYearMonth: '2018/07'
            }
          })

          cy.get('.q-date__navigation')
            .contains('May')
            .click()
          cy.get('.q-date__months')
            .contains('Aug')
            .should('be.disabled')
          cy.get('.q-date__months')
            .contains('Sep')
            .should('be.disabled')
          cy.get('.q-date__months')
            .contains('Mar')
            .should('be.enabled')
          cy.get('.q-date__months')
            .contains('Apr')
            .should('be.enabled')
            .click()

          cy.get('.q-date__navigation')
            .contains('2018')
            .click()
          cy.get('.q-date__years-content')
            .contains('2017')
            .should('be.enabled')
          cy.get('.q-date__years-content')
            .contains('2019')
            .should('be.disabled')
        })
      })

      describe('(prop): no-unset', () => {
        it('should prevent deselecting a day after it has been selected', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              multiple: true
            }
          })

          cy.get('.q-date__calendar-item--in')
            .contains('28')
            .click()
          cy.get('.q-date__calendar-item--in')
            .contains('29')
            .click()
          cy.get('.q-date__calendar-item--in')
            .contains('28')
            .click()

          cy.get('.q-date__calendar-item > .bg-primary')
            .should('not.contain', '28')
            .should('contain', '29')
            .then(async () => await Cypress.vueWrapper.setProps({ noUnset: true }))

          cy.log('Unselect a date and check that it is still selected')
          cy.get('.q-date__calendar-item--in')
            .contains('28')
            .click()
          cy.get('.q-date__calendar-item > .bg-primary')
            .should('contain', '28')
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): event-color', () => {
        it('should mark an event on the calendar using a custom color', () => {
          const model = ref('2018/06/03')

          mountQDate({
            props: {
              ...vModelAdapter(model),
              events: [ '2018/06/12' ],
              eventColor: 'orange'
            }
          })

          cy.get('.q-date__calendar-item')
            .get('.q-date__event')
            .should('not.have.class', 'bg-primary')
            .should('have.class', 'bg-orange')
            .parent()
            .should('contain', '12')
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): default', () => {
      it('should render a default slot', () => {
        mountQDate({
          slots: {
            default: () => 'Default'
          }
        })

        cy.get('.q-date__actions')
          .should('contain', 'Default')
      })
    })
  })

  describe('Events', () => {
    describe('(event): update:model-value', () => {
      it('should emit update:model-value event when selecting new date', () => {
        const model = ref('2018/06/03')

        const fn = cy.stub()
        mountQDate({
          props: {
            ...vModelAdapter(model),
            todayBtn: true,
            'onUpdate:modelValue': fn
          }
        })

        cy.get('.q-date')
          .then(() => expect(fn).to.not.be.called)
        cy.get('.q-date__header-today')
          .click()

        const today = formatDate(new Date(), 'YYYY/MM/DD')
        cy.get('.q-date__calendar-item')
          .then(() => expect(fn).to.be.calledWith(today))
      })
    })

    describe('(event): navigation', () => {
      it('should emit the navigation() event when navigating', () => {
        const model = ref('2018/06/03')

        const fn = cy.stub()
        mountQDate({
          props: {
            ...vModelAdapter(model),
            onNavigation: fn
          }
        })

        cy.get('.q-date__calendar-item')
          .then(() => expect(fn).not.to.be.calledOnce)

        cy.get('.q-date__navigation')
          .contains('June')
          .click()

        cy.get('.q-date__months')
          .contains('Dec')
          .click()

        cy.get('.q-date__calendar-item')
          .then(() => expect(fn).to.be.calledOnce)
      })
    })

    describe('(event): range-start', () => {
      it('should emit the range-start() event when selecting range start', () => {
        const model = ref('2018/06/03')

        const fn = cy.stub()
        mountQDate({
          props: {
            ...vModelAdapter(model),
            range: true,
            onRangeStart: fn
          }
        })

        cy.get('.q-date__calendar-item > .bg-primary')
          .then(() => expect(fn).not.to.be.called)

        cy.get('.q-date__calendar-item--in')
          .contains('2')
          .click()
        cy.get('.q-date__calendar-item > .bg-primary')
          .then(() => expect(fn).to.be.called)
      })
    })

    describe('(event): range-end', () => {
      it('should emit the range-end() event when ending range selection', () => {
        const model = ref('2018/06/03')

        const fn = cy.stub()
        mountQDate({
          props: {
            ...vModelAdapter(model),
            range: true,
            onRangeEnd: fn
          }
        })

        cy.get('.q-date__calendar-item > .bg-primary')
          .then(() => expect(fn).not.to.be.called)

        cy.get('.q-date__calendar-item--in')
          .contains('2')
          .click()
        cy.get('.q-date__calendar-item--in')
          .contains('5')
          .click()
        cy.get('.q-date__calendar-item > .bg-primary')
          .then(() => expect(fn).to.be.called)
      })
    })
  })

  describe('Methods', () => {
    describe('(method): setToday', () => {
      it('should set the selected date to today using the setToday method', () => {
        const model = ref('2018/06/03')

        mountQDate({
          props: {
            ...vModelAdapter(model)
          }
        })

        const today = new Date()

        cy.get('.q-date__calendar-item > .bg-primary')
          .should('contain', '3')
          .should('not.contain', today.getDate())
        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.setToday()
        })

        cy.get('.q-date__calendar-item > .bg-primary')
          .should('contain', today.getDate())
      })
    })

    describe('(method): setView', () => {
      it('should use the setView method to set the view', () => {
        const model = ref('2018/06/03')

        mountQDate({
          props: {
            ...vModelAdapter(model)
          }
        })

        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.setView('Months')
        })

        cy.get('.q-date__months .bg-primary')
          .should('contain', 'Jun')
        cy.get('.q-date__calendar')
          .should('not.exist')
        cy.get('.q-date__years')
          .should('not.exist')
      })
    })

    describe('(method): offsetCalendar', () => {
      it('should decrement or increment the month or year calendar', () => {
        const model = ref('2018/06/03')

        mountQDate({
          props: {
            ...vModelAdapter(model)
          }
        })

        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.offsetCalendar('month')
        })
        cy.get('.q-date__navigation')
          .should('not.contain', 'June')
          .should('contain', 'July')
        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.offsetCalendar('month', true)
        })
        cy.get('.q-date__navigation')
          .should('not.contain', 'July')
          .should('contain', 'June')

        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.offsetCalendar('year')
        })
        cy.get('.q-date__navigation')
          .should('not.contain', '2018')
          .should('contain', '2019')
        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.offsetCalendar('year', true)
        })
        cy.get('.q-date__navigation')
          .should('not.contain', '2019')
          .should('contain', '2018')
      })
    })

    describe('(method): setCalendarTo', () => {
      it('should set the current month and year using the setCalendar method', () => {
        const model = ref('2018/06/03')

        mountQDate({
          props: {
            ...vModelAdapter(model)
          }
        })

        cy.get('.q-date__navigation')
          .should('not.contain', '2090')
          .should('not.contain', 'January')

        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.setCalendarTo(2090, 1)
        })

        cy.get('.q-date__navigation')
          .should('contain', '2090')
          .should('contain', 'January')
      })
    })

    describe('(method): setEditingRange', () => {
      it('should set the editing range using the setEditingRange method', () => {
        const model = ref('2018/06/03')

        mountQDate({
          props: {
            ...vModelAdapter(model),
            range: true
          }
        })

        cy.get('.q-date').then(async () => {
          await Cypress.vueWrapper.vm.setEditingRange({ year: 2018, month: 6, day: 7 }, { year: 2018, month: 6, day: 10 })
        })

        cy.get('.q-date__edit-range-from')
          .should('contain', '7')
        cy.get('.q-date__edit-range')
          .should('contain', '8')
          .should('contain', '9')
        cy.get('.q-date__edit-range-to')
          .should('contain', '10')
      })
    })
  })
})
