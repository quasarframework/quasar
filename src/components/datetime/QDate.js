import Vue from 'vue'

import QBtn from '../btn/QBtn.js'

import DateTimeMixin from './datetime-mixin.js'

const yearsInterval = 20

export default Vue.extend({
  name: 'QDate',

  mixins: [ DateTimeMixin ],

  props: {
    value: {
      validator: v => typeof v === 'string'
        ? /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v)
        : true
    },

    firstDayOfWeek: [String, Number],
    today: Boolean, // TODO
    minimal: Boolean // TODO
  },

  data () {
    return {
      view: 'Calendar',
      monthDirection: 'left',
      yearDirection: 'left',
      innerModel: this.__getInnerModel(this.value)
    }
  },

  watch: {
    value (v) {
      this.innerModel = this.__getInnerModel(v)
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

    extModel () {
      const date = this.value.split('/')
      return {
        year: date[0],
        month: date[1],
        day: date[2][0] === '0' ? date[2][1] : date[2],
        date: new Date(this.value)
      }
    },

    headerTitle () {
      return this.$q.i18n.date.daysShort[ this.extModel.date.getDay() ] + ', ' +
        this.$q.i18n.date.monthsShort[ this.extModel.month - 1 ] + ' ' +
        this.extModel.day
    },

    dateArrow () {
      const val = [ this.$q.icon.datetime.arrowLeft, this.$q.icon.datetime.arrowRight ]
      return this.$q.i18n.rtl ? val.reverse() : val
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
      return (new Date(this.innerModel.year, this.innerModel.month, 0)).getDate()
    },

    days () {
      const
        date = new Date(this.innerModel.year, this.innerModel.month - 1, 1),
        endDay = (new Date(this.innerModel.year, this.innerModel.month - 1, 0)).getDate(),
        days = (date.getDay() - this.computedFirstDayOfWeek),
        res = []

      const len = days < 0 ? days + 7 : days
      if (len < 6) {
        for (let i = endDay - len; i <= endDay; i++) {
          res.push({ i })
        }
      }

      for (let i = 1; i <= this.daysInMonth; i++) {
        res.push({ i, in: true })
      }

      const left = res.length % 7
      if (left > 0) {
        const afterDays = 7 - left
        for (let i = 1; i <= afterDays; i++) {
          res.push({ i })
        }
      }

      return res
    }
  },

  methods: {
    __getInnerModel (v) {
      const date = v.split('/'), year = Number(date[0])
      return {
        startYear: year - year % yearsInterval,
        year,
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10)
      }
    },

    __getHeader (h) {
      return h('div', {
        staticClass: 'q-date__header'
      }, [
        h('div', {
          staticClass: 'relative-position'
        }, [
          h('transition', {
            props: {
              name: 'q-transition--fade'
            }
          }, [
            h('div', {
              key: this.extModel.year,
              staticClass: 'q-date__header-subtitle q-date__header-link',
              'class': this.view === 'Years' ? 'q-date__header-link--active' : 'cursor-pointer',
              on: {
                click: () => { this.view = 'Years' }
              }
            }, [ this.extModel.year ])
          ])
        ]),

        h('div', {
          staticClass: 'q-date__header-title relative-position flex no-wrap'
        }, [
          h('div', {
            staticClass: 'relative-position col'
          }, [
            h('transition', {
              props: {
                name: 'q-transition--fade'
              }
            }, [
              h('div', {
                key: this.headerTitle,
                staticClass: 'q-date__header-title-label q-date__header-link',
                'class': this.view === 'Calendar' ? 'q-date__header-link--active' : 'cursor-pointer',
                on: {
                  click: () => { this.view = 'Calendar' }
                }
              }, [ this.headerTitle ])
            ])
          ]),

          h(QBtn, {
            staticClass: 'q-date__header-today',
            props: {
              icon: 'today',
              flat: true,
              size: 'sm',
              round: true
            },
            on: {
              click: this.__setToday
            }
          })
        ])
      ])
    },

    __getNavigation (h, { label, view, dir, goTo, classes }) {
      return [
        h('div', {
          staticClass: 'row flex-center'
        }, [
          h(QBtn, {
            props: {
              round: true,
              dense: true,
              size: 'sm',
              flat: true,
              icon: this.dateArrow[0]
            },
            on: {
              click () { goTo(-1) }
            }
          })
        ]),

        h('div', {
          staticClass: 'relative-position overflow-hidden flex flex-center' + classes
        }, [
          h('transition', {
            props: {
              name: 'q-transition--jump-' + dir
            }
          }, [
            h('div', {
              key: label
            }, [
              h(QBtn, {
                props: {
                  flat: true,
                  dense: true,
                  noCaps: true,
                  label
                },
                on: {
                  click: () => { this.view = view }
                }
              })
            ])
          ])
        ]),

        h('div', {
          staticClass: 'row flex-center'
        }, [
          h(QBtn, {
            props: {
              round: true,
              dense: true,
              size: 'sm',
              flat: true,
              icon: this.dateArrow[1]
            },
            on: {
              click () { goTo(1) }
            }
          })
        ])
      ]
    },

    __getCalendarView (h) {
      return [
        h('div', {
          key: 'calendar-view',
          staticClass: 'q-date__view q-date__calendar'
        }, [
          h('div', {
            staticClass: 'q-date__navigation row items-center no-wrap'
          }, this.__getNavigation(h, {
            label: this.$q.i18n.date.months[ this.innerModel.month - 1 ],
            view: 'Months',
            dir: this.monthDirection,
            goTo: this.__goToMonth,
            classes: ' col'
          }).concat(this.__getNavigation(h, {
            label: this.innerModel.year,
            view: 'Years',
            dir: this.yearDirection,
            goTo: this.__goToYear,
            classes: ''
          }))),

          h('div', {
            staticClass: 'relative-position'
          }, [
            h('transition', {
              props: {
                name: 'q-transition--slide-' + this.monthDirection
              }
            }, [
              h('div', {
                key: this.innerModel.year + '/' + this.innerModel.month,
                staticClass: 'q-date__calendar-content fit'
              }, [
                h('div', {
                  staticClass: 'q-date__calendar-weekdays row items-center no-wrap'
                }, this.daysOfWeek.map(day => h('div', [ day ]))),

                h('div', {
                  staticClass: 'q-date__calendar-days row'
                }, this.days.map(day => h('div', {
                  staticClass: `q-date__calendar-day col-1 row flex-center q-date__calendar-day--${day.in === true ? 'in' : 'out'}side`,
                  on: day.in === true ? {
                    click: () => { this.__setDay(day.i) }
                  } : null
                }, [ day.i ])))
              ])
            ])
          ])
        ])
      ]
    },

    __getMonthsView (h) {
      const content = this.$q.i18n.date.monthsShort.map((month, i) => h('div', {
        staticClass: 'col-4 flex flex-center'
      }, [
        h(QBtn, {
          props: {
            flat: true,
            label: month
          },
          on: {
            click: () => { this.__setMonth(i + 1) }
          }
        })
      ]))

      return h('div', {
        key: 'months-view',
        staticClass: 'q-date__view q-date__months column flex-center'
      }, [
        h('div', {
          staticClass: 'q-date__months-content row col-10'
        }, content)
      ])
    },

    __getYearsView (h) {
      const
        start = this.innerModel.startYear,
        stop = start + yearsInterval,
        years = []

      for (let i = start; i <= stop; i++) {
        years.push(
          h('div', {
            staticClass: 'col-4 flex flex-center'
          }, [
            h(QBtn, {
              props: {
                flat: true,
                label: '' + i
              },
              on: {
                click: () => { this.__setYear(i) }
              }
            })
          ])
        )
      }

      return h('div', {
        staticClass: 'q-date__view q-date__years flex flex-center full-height'
      }, [
        h('div', {
          staticClass: 'col-auto'
        }, [
          h(QBtn, {
            props: {
              round: true,
              dense: true,
              flat: true,
              icon: this.dateArrow[0]
            },
            on: {
              click: () => { this.innerModel.startYear -= yearsInterval }
            }
          })
        ]),

        h('div', {
          staticClass: 'q-date__years-content col full-height row items-center'
        }, years),

        h('div', {
          staticClass: 'col-auto'
        }, [
          h(QBtn, {
            props: {
              round: true,
              dense: true,
              flat: true,
              icon: this.dateArrow[1]
            },
            on: {
              click: () => { this.innerModel.startYear += yearsInterval }
            }
          })
        ])
      ])
    },

    __goToMonth (offset) {
      let month = Number(this.innerModel.month) + offset
      let yearDir = this.yearDirection

      if (month === 13) {
        month = 1
        this.innerModel.year++
        yearDir = 'left'
      }
      else if (month === 0) {
        month = 12
        this.innerModel.year--
        yearDir = 'right'
      }

      const dir = offset > 0 ? 'left' : 'right'
      if (this.monthDirection !== dir) {
        this.monthDirection = dir
      }

      if (this.yearDirection !== yearDir) {
        this.yearDirection = yearDir
      }

      this.innerModel.month = month
    },

    __goToYear (offset) {
      const dir = offset > 0 ? 'left' : 'right'
      if (this.monthDirection !== dir) {
        this.monthDirection = dir
      }
      if (this.yearDirection !== dir) {
        this.yearDirection = dir
      }
      this.innerModel.year = Number(this.innerModel.year) + offset
    },

    __setYear (year) {
      this.__updateValue({ year })
      this.view = 'Calendar'
    },

    __setMonth (month) {
      this.__updateValue({ month })
      this.view = 'Calendar'
    },

    __setDay (day) {
      this.__updateValue({ day })
    },

    __setToday () {
      const today = new Date()
      this.__updateValue({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      })
      this.view = 'Calendar'
    },

    __updateValue (date) {
      if (date.year === void 0) {
        date.year = this.innerModel.year
      }
      if (date.month === void 0) {
        date.month = this.innerModel.month
      }
      if (date.day === void 0) {
        date.day = Math.min(this.innerModel.day, this.daysInMonth)
      }

      const val = date.year + '/' +
        this.__pad(date.month) + '/' +
        this.__pad(date.day)

      if (val !== this.value) {
        this.$emit('input', val)
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-date',
      'class': this.classes
    }, [
      this.__getHeader(h),

      h('div', {
        staticClass: 'q-date__content relative-position overflow-hidden'
      }, [
        h('transition', {
          props: {
            name: 'q-transition--fade'
          }
        }, [
          this[`__get${this.view}View`](h)
        ])
      ])
    ])
  }
})
