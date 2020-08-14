import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import DateTimeMixin from '../../mixins/datetime.js'

import { slot } from '../../utils/slot.js'
import { formatDate, __splitDate } from '../../utils/date.js'
import { pad } from '../../utils/format.js'
import { jalaaliMonthLength, toGregorian } from '../../utils/date-persian.js'
import cache from '../../utils/cache.js'

const yearsInterval = 20
const viewIsValid = v => ['Calendar', 'Years', 'Months'].includes(v)
const yearMonthValidator = v => /^-?[\d]+\/[0-1]\d$/.test(v)
const lineStr = ' \u2014 '

export default Vue.extend({
  name: 'QDate',

  mixins: [ DateTimeMixin ],

  props: {
    multiple: Boolean,

    title: String,
    subtitle: String,

    // TODO reinstate
    emitImmediately: Boolean,

    mask: {
      // this mask is forced
      // when using persian calendar
      default: 'YYYY/MM/DD'
    },

    defaultYearMonth: {
      type: String,
      validator: yearMonthValidator
    },

    yearsInMonthView: Boolean,

    events: [Array, Function],
    eventColor: [String, Function],

    options: [Array, Function],

    navigationMinYearMonth: {
      type: String,
      validator: yearMonthValidator
    },

    navigationMaxYearMonth: {
      type: String,
      validator: yearMonthValidator
    },

    firstDayOfWeek: [String, Number],
    todayBtn: Boolean,
    minimal: Boolean,
    defaultView: {
      type: String,
      default: 'Calendar',
      validator: viewIsValid
    }
  },

  data () {
    const
      viewModel = this.__getViewModel(this.value),
      direction = this.$q.lang.rtl === true ? 'right' : 'left'

    return {
      view: this.defaultView,
      monthDirection: direction,
      yearDirection: direction,
      startYear: viewModel.year - viewModel.year % yearsInterval - (viewModel.year < 0 ? yearsInterval : 0),
      viewModel // model of current calendar
    }
  },

  watch: {
    value (v) {
      if (this.lastEmitValue === v) {
        this.lastEmitValue = 0
      }
      else {
        this.__updateViewModel(this.__getViewModel(v))
      }
    },

    view () {
      this.$refs.blurTarget !== void 0 && this.$refs.blurTarget.focus()
    },

    'viewModel.year' (year) {
      this.$emit('navigation', { year, month: this.viewModel.month })
    },

    'viewModel.month' (month) {
      this.$emit('navigation', { year: this.viewModel.year, month })
    }
  },

  computed: {
    model () {
      const model = Array.isArray(this.value) === true
        ? this.value
        : (this.value ? [ this.value ] : [])

      const mask = this.calendar === 'persian' ? 'YYYY/MM/DD' : this.mask
      const locale = this.computedLocale

      return model.map(date => this.__decodeString(date, mask, locale))
    },

    classes () {
      const type = this.landscape === true ? 'landscape' : 'portrait'
      return `q-date q-date--${type} q-date--${type}-${this.minimal === true ? 'minimal' : 'standard'}` +
        (this.isDark === true ? ' q-date--dark q-dark' : '') +
        (this.bordered === true ? ` q-date--bordered` : '') +
        (this.square === true ? ` q-date--square no-border-radius` : '') +
        (this.flat === true ? ` q-date--flat no-shadow` : '') +
        (this.disable === true ? ' disabled' : (this.readonly === true ? ' q-date--readonly' : ''))
    },

    headerTitle () {
      if (this.title !== void 0 && this.title !== null && this.title.length > 0) {
        return this.title
      }

      if (this.model.length === 0 || this.model[0].dateHash === null) {
        return lineStr
      }

      if (this.model.length > 1) {
        const days = this.model.length
        return `${days} ${this.computedLocale.pluralDay}`
      }

      const model = this.model[0]

      let date

      if (this.calendar !== 'persian') {
        date = new Date(model.year, model.month - 1, model.day)
      }
      else {
        const gDate = toGregorian(model.year, model.month, model.day)
        date = new Date(gDate.gy, gDate.gm - 1, gDate.gd)
      }

      if (isNaN(date.valueOf()) === true) {
        return lineStr
      }

      if (this.computedLocale.headerTitle !== void 0) {
        return this.computedLocale.headerTitle(date, model)
      }

      return this.computedLocale.daysShort[ date.getDay() ] + ', ' +
        this.computedLocale.monthsShort[ model.month - 1 ] + ' ' +
        model.day
    },

    headerSubtitle () {
      if (this.subtitle !== void 0 && this.subtitle !== null && this.subtitle.length > 0) {
        return this.subtitle
      }

      if (this.model.length === 0 || this.model[0].year === null) {
        return lineStr
      }

      if (this.model.length > 1) {
        const models = this.model.slice().sort((a, b) => a.year - b.year || a.month - b.month)
        const start = models[0]
        const end = models[models.length - 1]
        const month = this.computedLocale.monthsShort

        return month[start.month - 1] + (
          start.year !== end.year
            ? ' ' + start.year + lineStr + month[end.month - 1] + ' '
            : (
              start.month !== end.month
                ? lineStr + month[end.month - 1]
                : ''
            )
        ) + ' ' + end.year
      }

      return this.model[0].year
    },

    dateArrow () {
      const val = [ this.$q.iconSet.datetime.arrowLeft, this.$q.iconSet.datetime.arrowRight ]
      return this.$q.lang.rtl === true ? val.reverse() : val
    },

    computedFirstDayOfWeek () {
      return this.firstDayOfWeek !== void 0
        ? Number(this.firstDayOfWeek)
        : this.computedLocale.firstDayOfWeek
    },

    daysOfWeek () {
      const
        days = this.computedLocale.daysShort,
        first = this.computedFirstDayOfWeek

      return first > 0
        ? days.slice(first, 7).concat(days.slice(0, first))
        : days
    },

    daysInMonth () {
      return this.__getDaysInMonth(this.viewModel)
    },

    today () {
      return this.__getCurrentDate()
    },

    evtFn () {
      return typeof this.events === 'function'
        ? this.events
        : date => this.events.includes(date)
    },

    evtColor () {
      return typeof this.eventColor === 'function'
        ? this.eventColor
        : () => this.eventColor
    },

    minNav () {
      if (this.navigationMinYearMonth !== void 0) {
        const data = this.navigationMinYearMonth.split('/')
        return { year: parseInt(data[0], 10), month: parseInt(data[1], 10) }
      }
    },

    maxNav () {
      if (this.navigationMaxYearMonth !== void 0) {
        const data = this.navigationMaxYearMonth.split('/')
        return { year: parseInt(data[0], 10), month: parseInt(data[1], 10) }
      }
    },

    navBoundaries () {
      const data = {
        month: { prev: true, next: true },
        year: { prev: true, next: true }
      }

      if (this.minNav !== void 0 && this.minNav.year >= this.viewModel.year) {
        data.year.prev = false
        if (this.minNav.year === this.viewModel.year && this.minNav.month >= this.viewModel.month) {
          data.month.prev = false
        }
      }

      if (this.maxNav !== void 0 && this.maxNav.year <= this.viewModel.year) {
        data.year.next = false
        if (this.maxNav.year === this.viewModel.year && this.maxNav.month <= this.viewModel.month) {
          data.month.next = false
        }
      }

      return data
    },

    isInSelection () {
      return typeof this.options === 'function'
        ? this.options
        : date => this.options.includes(date)
    },

    viewDays () {
      let date, endDay

      if (this.calendar !== 'persian') {
        date = new Date(this.viewModel.year, this.viewModel.month - 1, 1)
        endDay = (new Date(this.viewModel.year, this.viewModel.month - 1, 0)).getDate()
      }
      else {
        const gDate = toGregorian(this.viewModel.year, this.viewModel.month, 1)
        date = new Date(gDate.gy, gDate.gm - 1, gDate.gd)
        let prevJM = this.viewModel.month - 1
        let prevJY = this.viewModel.year
        if (prevJM === 0) {
          prevJM = 12
          prevJY--
        }
        endDay = jalaaliMonthLength(prevJY, prevJM)
      }

      return {
        days: date.getDay() - this.computedFirstDayOfWeek - 1,
        endDay
      }
    },

    calendarMap () {
      const map = {}

      this.model.forEach(entry => {
        const hash = entry.year + '/' + pad(entry.month)
        if (map[hash] === void 0) {
          map[hash] = []
        }
        map[hash].push(entry.day)
      })

      return map
    },

    viewHash () {
      return this.__getCalendarHash(this.viewModel)
    },

    days () {
      const res = []
      const { days, endDay } = this.viewDays

      const len = days < 0 ? days + 7 : days
      if (len < 6) {
        for (let i = endDay - len; i <= endDay; i++) {
          res.push({ i, fill: true })
        }
      }

      const index = res.length

      for (let i = 1; i <= this.daysInMonth; i++) {
        const day = this.viewHash + '/' + pad(i)

        if (this.options !== void 0 && this.isInSelection(day) !== true) {
          res.push({ i })
        }
        else {
          const event = this.events !== void 0 && this.evtFn(day) === true
            ? this.evtColor(day)
            : false

          res.push({ i, in: true, flat: true, event })
        }
      }

      // if current view has selection
      if (this.calendarMap[this.viewHash] !== void 0) {
        this.calendarMap[this.viewHash].forEach(day => {
          const i = index + day - 1
          res[i] !== void 0 && Object.assign(res[i], {
            unelevated: true,
            flat: false,
            color: this.computedColor,
            textColor: this.computedTextColor
          })
        })
      }

      if (this.viewModel.year === this.today.year && this.viewModel.month === this.today.month) {
        res[index + this.today.day - 1].today = true
      }

      const left = res.length % 7
      if (left > 0) {
        const afterDays = 7 - left
        for (let i = 1; i <= afterDays; i++) {
          res.push({ i, fill: true })
        }
      }

      return res
    },

    attrs () {
      if (this.disable === true) {
        return { 'aria-disabled': 'true' }
      }
      if (this.readonly === true) {
        return { 'aria-readonly': 'true' }
      }
    }
  },

  methods: {
    setToday () {
      this.__toggleDate(this.today)
      this.view = 'Calendar'
      // TODO this.emitImmediately === true && this.__updateValue({}, 'today')
    },

    setView (view) {
      if (viewIsValid(view) === true) {
        this.view = view
      }
    },

    offsetCalendar (type, descending) {
      if (['month', 'year'].includes(type)) {
        this[`__goTo${type === 'month' ? 'Month' : 'Year'}`](
          descending === true ? -1 : 1
        )
      }
    },

    __encodeObject (date) {
      if (date.year === void 0) {
        date.year = this.viewModel.year
      }
      if (date.month === void 0) {
        date.month = this.viewModel.month
      }

      return this.calendar === 'persian'
        ? date.year + '/' + pad(date.month) + '/' + pad(date.day)
        : formatDate(
          new Date(
            date.year,
            date.month - 1,
            date.day,
            date.hour,
            date.minute,
            date.second,
            date.millisecond
          ),
          this.mask,
          this.computedLocale,
          date.year,
          date.timezoneOffset
        )
    },

    __decodeString (date, mask, locale) {
      return __splitDate(
        date,
        this.calendar === 'persian' ? 'YYYY/MM/DD' : mask || this.mask,
        locale || this.__getComputedLocale(),
        this.calendar
      )
    },

    __getViewModel (value) {
      const model = Array.isArray(value) === true
        ? value
        : (value ? [ value ] : [])

      return model.length === 0
        ? this.__getDefaultViewModel()
        : this.__decodeString(model[0])
    },

    __getDefaultViewModel () {
      let year, month

      if (this.defaultYearMonth !== void 0) {
        const d = this.defaultYearMonth.split('/')
        year = parseInt(d[0], 10)
        month = parseInt(d[1], 10)
      }
      else {
        // may come from data() where computed
        // props are not yet available
        const d = this.today !== void 0
          ? this.today
          : this.__getCurrentDate()

        year = d.year
        month = d.month
      }

      return {
        year,
        month,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        dateHash: year + '/' + pad(month) + '/01'
      }
    },

    __getHeader (h) {
      if (this.minimal === true) { return }

      return h('div', {
        staticClass: 'q-date__header',
        class: this.headerClass
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
              key: 'h-yr-' + this.headerSubtitle,
              staticClass: 'q-date__header-subtitle q-date__header-link',
              class: this.view === 'Years' ? 'q-date__header-link--active' : 'cursor-pointer',
              attrs: { tabindex: this.computedTabindex },
              on: cache(this, 'vY', {
                click: () => { this.view = 'Years' },
                keyup: e => { e.keyCode === 13 && (this.view = 'Years') }
              })
            }, [ this.headerSubtitle ])
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
                key: 'h-sub' + this.headerTitle,
                staticClass: 'q-date__header-title-label q-date__header-link',
                class: this.view === 'Calendar' ? 'q-date__header-link--active' : 'cursor-pointer',
                attrs: { tabindex: this.computedTabindex },
                on: cache(this, 'vC', {
                  click: () => { this.view = 'Calendar' },
                  keyup: e => { e.keyCode === 13 && (this.view = 'Calendar') }
                })
              }, [ this.headerTitle ])
            ])
          ]),

          this.todayBtn === true ? h(QBtn, {
            staticClass: 'q-date__header-today',
            props: {
              icon: this.$q.iconSet.datetime.today,
              flat: true,
              size: 'sm',
              round: true,
              tabindex: this.computedTabindex
            },
            on: cache(this, 'today', { click: this.setToday })
          }) : null
        ])
      ])
    },

    __getNavigation (h, { label, view, key, dir, goTo, boundaries, cls }) {
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
              tabindex: this.computedTabindex,
              disable: boundaries.prev === false
            },
            on: cache(this, 'go-#' + view, { click () { goTo(-1) } })
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
                on: cache(this, 'view#' + view, { click: () => { this.view = view } })
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
              tabindex: this.computedTabindex,
              disable: boundaries.next === false
            },
            on: cache(this, 'go+#' + view, { click () { goTo(1) } })
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
            label: this.computedLocale.months[ this.viewModel.month - 1 ],
            view: 'Months',
            key: this.viewModel.month,
            dir: this.monthDirection,
            goTo: this.__goToMonth,
            boundaries: this.navBoundaries.month,
            cls: ' col'
          }).concat(this.__getNavigation(h, {
            label: this.viewModel.year,
            view: 'Years',
            key: this.viewModel.year,
            dir: this.yearDirection,
            goTo: this.__goToYear,
            boundaries: this.navBoundaries.year,
            cls: ''
          }))),

          h('div', {
            staticClass: 'q-date__calendar-weekdays row items-center no-wrap'
          }, this.daysOfWeek.map(day => h('div', { staticClass: 'q-date__calendar-item' }, [ h('div', [ day ]) ]))),

          h('div', {
            staticClass: 'q-date__calendar-days-container relative-position overflow-hidden'
          }, [
            h('transition', {
              props: {
                name: 'q-transition--slide-' + this.monthDirection
              }
            }, [
              h('div', {
                key: this.viewModel.year + '/' + this.viewModel.month,
                staticClass: 'q-date__calendar-days fit'
              }, this.days.map(day => h('div', {
                staticClass: `q-date__calendar-item q-date__calendar-item--${day.fill === true ? 'fill' : (day.in === true ? 'in' : 'out')}`
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
                    on: cache(this, 'day#' + day.i, { click: () => { this.__toggleDay(day.i) } })
                  }, day.event !== false ? [
                    h('div', { staticClass: 'q-date__event bg-' + day.event })
                  ] : null)
                  : h('div', [ day.i ])
              ])))
            ])
          ])
        ])
      ]
    },

    __getMonthsView (h) {
      const currentYear = this.viewModel.year === this.today.year
      const isDisabled = month => {
        return (
          (this.minNav !== void 0 && this.viewModel.year === this.minNav.year && this.minNav.month > month) ||
          (this.maxNav !== void 0 && this.viewModel.year === this.maxNav.year && this.maxNav.month < month)
        )
      }

      const content = this.computedLocale.monthsShort.map((month, i) => {
        const active = this.viewModel.month === i + 1

        return h('div', {
          staticClass: 'q-date__months-item flex flex-center'
        }, [
          h(QBtn, {
            staticClass: currentYear === true && this.today.month === i + 1 ? 'q-date__today' : null,
            props: {
              flat: active !== true,
              label: month,
              unelevated: active,
              color: active === true ? this.computedColor : null,
              textColor: active === true ? this.computedTextColor : null,
              tabindex: this.computedTabindex,
              disable: isDisabled(i + 1)
            },
            on: cache(this, 'month#' + i, { click: () => { this.__setMonth(i + 1) } })
          })
        ])
      })

      this.yearsInMonthView === true && content.unshift(
        h('div', { staticClass: 'row no-wrap full-width' }, [
          this.__getNavigation(h, {
            label: this.viewModel.year,
            view: 'Years',
            key: this.viewModel.year,
            dir: this.yearDirection,
            goTo: this.__goToYear,
            boundaries: this.navBoundaries.year,
            cls: ' col'
          })
        ])
      )

      return h('div', {
        key: 'months-view',
        staticClass: 'q-date__view q-date__months flex flex-center'
      }, content)
    },

    __getYearsView (h) {
      const
        start = this.startYear,
        stop = start + yearsInterval,
        years = []

      const isDisabled = year => {
        return (
          (this.minNav !== void 0 && this.minNav.year > year) ||
          (this.maxNav !== void 0 && this.maxNav.year < year)
        )
      }

      for (let i = start; i <= stop; i++) {
        const active = this.viewModel.year === i

        years.push(
          h('div', {
            staticClass: 'q-date__years-item flex flex-center'
          }, [
            h(QBtn, {
              key: 'yr' + i,
              staticClass: this.today.year === i ? 'q-date__today' : null,
              props: {
                flat: !active,
                label: i,
                dense: true,
                unelevated: active,
                color: active ? this.computedColor : null,
                textColor: active ? this.computedTextColor : null,
                tabindex: this.computedTabindex,
                disable: isDisabled(i)
              },
              on: cache(this, 'yr#' + i, { click: () => { this.__setYear(i) } })
            })
          ])
        )
      }

      return h('div', {
        staticClass: 'q-date__view q-date__years flex flex-center'
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
              tabindex: this.computedTabindex,
              disable: isDisabled(start)
            },
            on: cache(this, 'y-', { click: () => { this.startYear -= yearsInterval } })
          })
        ]),

        h('div', {
          staticClass: 'q-date__years-content col self-stretch row items-center'
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
              tabindex: this.computedTabindex,
              disable: isDisabled(stop)
            },
            on: cache(this, 'y+', { click: () => { this.startYear += yearsInterval } })
          })
        ])
      ])
    },

    __getDaysInMonth (obj) {
      return this.calendar !== 'persian'
        ? (new Date(obj.year, obj.month, 0)).getDate()
        : jalaaliMonthLength(obj.year, obj.month)
    },

    __goToMonth (offset) {
      let year = this.viewModel.year
      let month = Number(this.viewModel.month) + offset

      if (month === 13) {
        month = 1
        year++
      }
      else if (month === 0) {
        month = 12
        year--
      }

      this.__updateViewModel({ ...this.viewModel, year, month })
      // TODO this.emitImmediately === true && this.__updateValue({}, 'month')
    },

    __goToYear (offset) {
      const year = Number(this.viewModel.year) + offset
      const month = this.__getNormalizedMonth(year, this.viewModel.month)
      this.__updateViewModel({ ...this.viewModel, year, month })
      // TODO this.emitImmediately === true && this.__updateValue({}, 'year')
    },

    __setYear (year) {
      const month = this.__getNormalizedMonth(year, this.viewModel.month)
      this.__updateViewModel({ ...this.viewModel, year, month })
      // TODO this.emitImmediately === true && this.__updateValue({ year }, 'year')
      this.view = this.defaultView === 'Years' ? 'Months' : 'Calendar'
    },

    __getNormalizedMonth (year, month) {
      if (this.minNav !== void 0 && year === this.minNav.year && month < this.minNav.month) {
        return this.minNav.month
      }
      if (this.maxNav !== void 0 && year === this.maxNav.year && month > this.maxNav.month) {
        return this.maxNav.month
      }
      return month
    },

    __setMonth (month) {
      this.__updateViewModel({ ...this.viewModel, month })
      // TODO this.emitImmediately === true && this.__updateValue({ month }, 'month')
      this.view = 'Calendar'
    },

    __getCalendarHash (date) {
      return date.year + '/' + pad(date.month)
    },

    __toggleDate (date, hash) {
      const month = this.calendarMap[hash || this.__getCalendarHash(date)]
      const fn = month !== void 0 && month.includes(date.day) === true
        ? this.__removeFromModel
        : this.__addToModel

      fn(date)
    },

    __toggleDay (day) {
      this.__toggleDate({ ...this.viewModel, day }, this.viewHash)
    },

    __updateViewModel (date) {
      const newHash = date.year + '/' + pad(date.month) + '/' + pad(date.day)

      if (newHash !== this.viewModel.dateHash) {
        this.monthDirection = (this.viewModel.dateHash < newHash) === (this.$q.lang.rtl !== true) ? 'left' : 'right'
        if (date.year !== this.viewModel.year) {
          this.yearDirection = this.monthDirection
        }

        this.$nextTick(() => {
          this.startYear = date.year - date.year % yearsInterval - (date.year < 0 ? yearsInterval : 0)
          Object.assign(this.viewModel, {
            year: date.year,
            month: date.month,
            day: date.day,
            dateHash: newHash
          })
        })
      }
    },

    __emitValue (val, date) {
      const value = val !== null && val.length === 1 && this.multiple === false
        ? val[0]
        : val

      this.$emit('input', value)

      if (val === null || date === void 0) {
        return
      }

      this.lastEmitValue = value
      this.__updateViewModel(date)
    },

    __addToModel (date) {
      const str = this.__encodeObject(date)

      if (this.multiple !== true) {
        this.__emitValue(str, date)
        return
      }

      const model = Array.isArray(this.value) === true
        ? this.value.slice()
        : (this.value ? [ this.value ] : [])

      model.push(str)
      this.__emitValue(model, date)
    },

    __removeFromModel (date) {
      if (Array.isArray(this.value) === true) {
        const str = this.__encodeObject(date)
        const model = this.value.filter(date => date !== str)
        this.__emitValue(model, date)
      }
      else {
        this.__emitValue(null, date)
      }
    },

    __updateValue (date, reason) {
      if (date.year === void 0) {
        date.year = this.viewModel.year
      }
      if (date.month === void 0) {
        date.month = this.viewModel.month
      }
      if (
        date.day === void 0 ||
        (this.emitImmediately === true && (reason === 'year' || reason === 'month'))
      ) {
        date.day = this.viewModel.day
        const maxDay = this.emitImmediately === true
          ? this.__getDaysInMonth(date)
          : this.daysInMonth

        date.day = Math.min(Math.max(1, date.day), maxDay)
      }

      const val = this.calendar === 'persian'
        ? date.year + '/' + pad(date.month) + '/' + pad(date.day)
        : formatDate(
          new Date(
            date.year,
            date.month - 1,
            date.day,
            this.extModel.hour,
            this.extModel.minute,
            this.extModel.second,
            this.extModel.millisecond
          ),
          this.mask,
          this.computedLocale,
          date.year,
          this.extModel.timezoneOffset
        )

      date.changed = val !== this.value
      this.$emit('input', val, reason, date)
    }
  },

  render (h) {
    const content = [
      h('div', {
        staticClass: 'q-date__content col relative-position'
      }, [
        h('transition', {
          props: { name: 'q-transition--fade' }
        }, [
          this[`__get${this.view}View`](h)
        ])
      ])
    ]

    const def = slot(this, 'default')
    def !== void 0 && content.push(
      h('div', { staticClass: 'q-date__actions' }, def)
    )

    if (this.name !== void 0 && this.disable !== true) {
      this.__injectFormInput(content, 'push')
    }

    return h('div', {
      class: this.classes,
      attrs: this.attrs,
      on: { ...this.qListeners }
    }, [
      this.__getHeader(h),

      h('div', {
        staticClass: 'q-date__main col column',
        attrs: { tabindex: -1 },
        ref: 'blurTarget'
      }, content)
    ])
  }
})
