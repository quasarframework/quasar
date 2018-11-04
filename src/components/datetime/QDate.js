import Vue from 'vue'

import QBtn from '../btn/QBtn.js'

import DateTimeMixin from './datetime-mixin.js'

export default Vue.extend({
  name: 'QDate',

  mixins: [ DateTimeMixin ],

  props: {
    value: {
      validator: v => typeof v === 'string'
        ? /^[\d]{4}\/[0-1][\d]\/[0-3][\d]{1}$/.test(v)
        : true
    },

    firstDayOfWeek: [String, Number]
  },

  data () {
    return {
      view: 'Calendar'
    }
  },

  computed: {
    classes () {
      return {
        'q-date--dark': this.dark,
        'disable': this.disable,
        [`q-date--${this.orientation}`]: true
      }
    },

    stringModel () {
      const date = this.value.split('/')
      return {
        year: date[0],
        month: date[1],
        day: date[2]
      }
    },

    dateModel () {
      return new Date(this.value)
    },

    headerLabel () {
      return this.$q.i18n.date.daysShort[ this.dateModel.getDay() ] + ', ' +
        this.$q.i18n.date.monthsShort[ this.stringModel.month - 1 ] + ' ' +
        this.stringModel.day
    },

    dateArrow () {
      const val = [ this.$q.icon.datetime.arrowLeft, this.$q.icon.datetime.arrowRight ]
      return this.$q.i18n.rtl ? val.reverse() : val
    },

    dayViewTitle () {
      return this.$q.i18n.date.months[ this.stringModel.month - 1 ] + ' ' +
        this.stringModel.year
    },

    computedFirstDayOfWeek () {
      return this.firstDayOfWeek !== void 0
        ? Number(this.firstDayOfWeek)
        : this.$q.i18n.date.firstDayOfWeek
    },

    daysOfWeek () {
      const
        days = this.$q.i18n.date.daysShort,
        first = this.computedFirstDayOfWeek

      return first > 0
        ? days.slice(first, 7).concat(days.slice(0, first))
        : days
    },

    daysInMonth () {
      return (new Date(this.stringModel.year, this.stringModel.month - 1, 0)).getDate()
    },

    fillerDays () {
      let days = (this.dateModel.getDay() - this.computedFirstDayOfWeek)
      return days < 0
        ? days + 7
        : days
    }
  },

  methods: {
    __getHeader (h) {
      return h('div', {
        staticClass: 'q-date__header'
      }, [
        h('div', {
          staticClass: 'q-date__header-title'
        }, [ this.stringModel.year ]),

        h('div', {
          staticClass: 'q-date__header-label'
        }, [ this.headerLabel ])
      ])
    },

    __getDays (h) {
      const days = []

      for (let i = 1; i <= this.fillerDays; i++) {
        days.push(h('div', {
          staticClass: 'q-date__calendar-day col-1'
        }))
      }

      for (let i = 1; i <= this.daysInMonth; i++) {
        days.push(h('div', {
          staticClass: 'q-date__calendar-day col-1 row flex-center'
        }, [ i ]))
      }

      return days
    },

    __getCalendarView (h) {
      return [
        h('div', {
          staticClass: 'q-date__calendar'
        }, [
          h('div', {
            staticClass: 'q-date__calendar-navigation row items-center no-wrap'
          }, [
            h('div', {
              staticClass: 'q-date__calendar-navigation-btn row flex-center'
            }, [
              h(QBtn, {
                props: {
                  round: true,
                  dense: true,
                  flat: true,
                  icon: this.dateArrow[0]
                }
              })
            ]),

            h('div', {
              staticClass: 'q-date__calendar-title col text-center'
            }, [ this.dayViewTitle ]),

            h('div', {
              staticClass: 'q-date__calendar-navigation-btn row flex-center'
            }, [
              h(QBtn, {
                props: {
                  round: true,
                  dense: true,
                  flat: true,
                  icon: this.dateArrow[1]
                }
              })
            ])
          ]),

          h('div', {
            staticClass: 'q-date__calendar-weekdays row items-center no-wrap'
          }, this.daysOfWeek.map(day => h('div', [ day ]))),

          h('div', {
            staticClass: 'q-date__calendar-days row'
          }, this.__getDays(h))
        ])
      ]
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-date',
      'class': this.classes
    }, [
      this.__getHeader(h),
      this[`__get${this.view}View`](h)
    ])
  }
})
