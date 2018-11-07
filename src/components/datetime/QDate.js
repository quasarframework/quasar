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
    todayButton: Boolean,
    minimal: Boolean
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
      const model = this.__getInnerModel(v)
      this.monthDirection = this.innerModel.string < v ? 'left' : 'right'
      if (model.year !== this.innerModel.year) {
        this.yearDirection = this.monthDirection
      }
      this.$nextTick(() => {
        this.innerModel = model
      })
    }
  },

  computed: {
    classes () {
      return {
        'q-date--dark': this.dark,
        'q-date--readonly': this.readonly,
        'disabled': this.disable,
        [`q-date--${this.orientation}`]: true
      }
    },

    extModel () {
      const date = this.value.split('/')
      return {
        value: this.value,
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10)
      }
    },

    headerTitle () {
      const date = new Date(this.extModel.value)
      return this.$q.i18n.date.daysShort[ date.getDay() ] + ', ' +
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

    today () {
      const d = new Date()
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
      }
    },

    days () {
      const
        date = new Date(this.innerModel.year, this.innerModel.month - 1, 1),
        endDay = (new Date(this.innerModel.year, this.innerModel.month - 1, 0)).getDate(),
        days = (date.getDay() - this.computedFirstDayOfWeek - 1),
        res = []

      const len = days < 0 ? days + 7 : days
      if (len < 6) {
        for (let i = endDay - len; i <= endDay; i++) {
          res.push({ i })
        }
      }

      const index = res.length

      for (let i = 1; i <= this.daysInMonth; i++) {
        res.push({ i, in: true, flat: true })
      }

      if (this.innerModel.year === this.extModel.year && this.innerModel.month === this.extModel.month) {
        const i = index + this.innerModel.day - 1
        Object.assign(res[i], {
          unelevated: true,
          flat: false,
          color: this.computedColor,
          textColor: this.computedTextColor
        })
      }

      if (this.innerModel.year === this.today.year && this.innerModel.month === this.today.month) {
        res[index + this.today.day - 1].today = true
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
        string: v,
        startYear: year - year % yearsInterval,
        year,
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10)
      }
    },

    __getHeader (h) {
      if (this.minimal === true) { return }

      return h('div', {
        staticClass: 'q-date__header',
        'class': this.headerClass
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
              attrs: { tabindex: this.computedTabindex },
              on: {
                click: () => { this.view = 'Years' },
                keyup: e => { e.keyCode === 13 && (this.view = 'Years') }
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
                key: this.value,
                staticClass: 'q-date__header-title-label q-date__header-link',
                'class': this.view === 'Calendar' ? 'q-date__header-link--active' : 'cursor-pointer',
                attrs: { tabindex: this.computedTabindex },
                on: {
                  click: () => { this.view = 'Calendar' },
                  keyup: e => { e.keyCode === 13 && (this.view = 'Calendar') }
                }
              }, [ this.headerTitle ])
            ])
          ]),

          this.todayButton === true ? h(QBtn, {
            staticClass: 'q-date__header-today',
            props: {
              icon: 'today',
              flat: true,
              size: 'sm',
              round: true,
              tabindex: this.computedTabindex
            },
            on: {
              click: this.__setToday
            }
          }) : null
        ])
      ])
    },

    __getNavigation (h, { label, view, key, dir, goTo, cls }) {
      return [
        h('div', {
          staticClass: 'row items-center q-date__arrow'
        }, [
          h(QBtn, {
            props: {
              round: true,
              dense: true,
              size: 'sm',
              flat: true,
              icon: this.dateArrow[0],
              tabindex: this.computedTabindex
            },
            on: {
              click () { goTo(-1) }
            }
          })
        ]),

        h('div', {
          staticClass: 'relative-position overflow-hidden flex flex-center' + cls
        }, [
          h('transition', {
            props: {
              name: 'q-transition--jump-' + dir
            }
          }, [
            h('div', { key }, [
              h(QBtn, {
                props: {
                  flat: true,
                  dense: true,
                  noCaps: true,
                  label,
                  tabindex: this.computedTabindex
                },
                on: {
                  click: () => { this.view = view }
                }
              })
            ])
          ])
        ]),

        h('div', {
          staticClass: 'row items-center q-date__arrow'
        }, [
          h(QBtn, {
            props: {
              round: true,
              dense: true,
              size: 'sm',
              flat: true,
              icon: this.dateArrow[1],
              tabindex: this.computedTabindex
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
          staticClass: 'q-date__view q-date__calendar column'
        }, [
          h('div', {
            staticClass: 'q-date__navigation row items-center no-wrap'
          }, this.__getNavigation(h, {
            label: this.$q.i18n.date.months[ this.innerModel.month - 1 ],
            view: 'Months',
            key: this.innerModel.month,
            dir: this.monthDirection,
            goTo: this.__goToMonth,
            cls: ' col'
          }).concat(this.__getNavigation(h, {
            label: this.innerModel.year,
            view: 'Years',
            key: this.innerModel.year,
            dir: this.yearDirection,
            goTo: this.__goToYear,
            cls: ''
          }))),

          h('div', {
            staticClass: 'q-date__calendar-weekdays row items-center no-wrap'
          }, this.daysOfWeek.map(day => h('div', { staticClass: 'q-date__calendar-item' }, [ h('div', [ day ]) ]))),

          h('div', {
            staticClass: 'col relative-position overflow-hidden'
          }, [
            h('transition', {
              props: {
                name: 'q-transition--slide-' + this.monthDirection
              }
            }, [
              h('div', {
                key: this.innerModel.year + '/' + this.innerModel.month,
                staticClass: 'q-date__calendar-days fit'
              }, this.days.map(day => h('div', {
                staticClass: `q-date__calendar-item q-date__calendar-item--${day.in === true ? 'in' : 'out'}`
              }, [
                day.in === true
                  ? h(QBtn, {
                    staticClass: day.today === true ? 'q-date__today' : null,
                    props: {
                      dense: true,
                      flat: day.flat,
                      unelevated: day.unelevated,
                      color: day.color,
                      textColor: day.textColor,
                      label: day.i,
                      tabindex: this.computedTabindex
                    },
                    on: {
                      click: () => { this.__setDay(day.i) }
                    }
                  })
                  : h('div', [ day.i ])
              ])))
            ])
          ])
        ])
      ]
    },

    __getMonthsView (h) {
      const currentYear = this.innerModel.year === this.today.year

      const content = this.$q.i18n.date.monthsShort.map((month, i) => {
        const active = this.innerModel.month === i + 1

        return h('div', {
          staticClass: 'col-4 flex flex-center'
        }, [
          h(QBtn, {
            staticClass: currentYear === true && this.today.month === i + 1 ? 'q-date__today' : null,
            props: {
              flat: !active,
              label: month,
              unelevated: active,
              color: active ? this.computedColor : null,
              textColor: active ? this.computedTextColor : null,
              tabindex: this.computedTabindex
            },
            on: {
              click: () => { this.__setMonth(i + 1) }
            }
          })
        ])
      })

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
        const active = this.innerModel.year === i

        years.push(
          h('div', {
            staticClass: 'col-4 flex flex-center'
          }, [
            h(QBtn, {
              staticClass: this.today.year === i ? 'q-date__today' : null,
              props: {
                flat: !active,
                label: i,
                unelevated: active,
                color: active ? this.computedColor : null,
                textColor: active ? this.computedTextColor : null,
                tabindex: this.computedTabindex
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
              icon: this.dateArrow[0],
              tabindex: this.computedTabindex
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
              icon: this.dateArrow[1],
              tabindex: this.computedTabindex
            },
            on: {
              click: () => { this.innerModel.startYear += yearsInterval }
            }
          })
        ])
      ])
    },

    __goToMonth (offset) {
      let
        month = Number(this.innerModel.month) + offset,
        yearDir = this.yearDirection

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

      this.monthDirection = offset > 0 ? 'left' : 'right'
      this.yearDirection = yearDir
      this.innerModel.month = month
    },

    __goToYear (offset) {
      this.monthDirection = this.yearDirection = offset > 0 ? 'left' : 'right'
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
      this.__updateValue({ ...this.today })
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
        staticClass: 'q-date__content col relative-position overflow-auto'
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
