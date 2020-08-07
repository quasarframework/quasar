import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import DateTimeMixin from '../../mixins/datetime.js'

import {
  formatDate,
  __splitDate,
  extractDate,
  addToDate,
  getMinDate,
  getMaxDate,
  isSameDate,
  isBetweenDates,
  getDateDiff
} from '../../utils/date.js'
import { slot } from '../../utils/slot.js'
import { pad } from '../../utils/format.js'
import { jalaaliMonthLength, toGregorian } from '../../utils/date-persian.js'
import cache from '../../utils/cache.js'

const yearsInterval = 20
const viewIsValid = v => ['Calendar', 'Years', 'Months'].includes(v)
const yearMonthValidator = v => /^-?[\d]+\/[0-1]\d$/.test(v)

export default Vue.extend({
  name: 'QDate',

  mixins: [ DateTimeMixin ],

  props: {
    value: {
      type: [ String, Array ]
    },

    multiple: Boolean,
    range: Boolean,
    editRange: {
      type: String,
      default: null,
      validator: val => ['start', 'end'].includes(val)
    },
    defaultRangeView: {
      type: String,
      default: 'start',
      validator: val => ['start', 'end'].includes(val)
    },

    title: String,
    subtitle: String,

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
      locale = this.__getComputedLocale(),
      { inner, external } = this.__getModels(
        this.defaultRangeView === 'start'
          ? this.__getFirstSelectedDate(this.value)
          : this.__getLastSelectedDate(this.value),
        this.mask,
        locale
      ),
      dates = this.__getDates(this.value, this.mask, locale),
      direction = this.$q.lang.rtl === true ? 'right' : 'left'

    return {
      view: this.defaultView,
      monthDirection: direction,
      yearDirection: direction,
      dates: dates,
      mockRangeEnd: null,
      startYear: inner.year - inner.year % yearsInterval - (inner.year < 0 ? yearsInterval : 0),
      innerModel: inner,
      extModel: external
    }
  },

  watch: {
    value (v) {
      const
        locale = this.__getComputedLocale(),
        { inner, external } = this.__getModels(
          this.defaultRangeView === 'start'
            ? this.__getFirstSelectedDate(v)
            : this.__getLastSelectedDate(v),
          this.mask,
          locale
        ),
        dates = this.__getDates(v, this.mask, locale)

      this.dates = dates

      if (
        this.extModel.dateHash !== external.dateHash ||
        this.extModel.timeHash !== external.timeHash
      ) {
        this.extModel = external
      }

      if (inner.dateHash !== this.innerModel.dateHash) {
        this.monthDirection = (this.innerModel.dateHash < inner.dateHash) === (this.$q.lang.rtl !== true) ? 'left' : 'right'
        if (inner.year !== this.innerModel.year) {
          this.yearDirection = this.monthDirection
        }

        this.$nextTick(() => {
          this.startYear = inner.year - inner.year % yearsInterval - (inner.year < 0 ? yearsInterval : 0)
          this.innerModel = inner
        })
      }
    },

    view () {
      this.$refs.blurTarget !== void 0 && this.$refs.blurTarget.focus()
    },

    'innerModel.year' (year) {
      this.$emit('navigation', { year, month: this.innerModel.month })
    },

    'innerModel.month' (month) {
      this.$emit('navigation', { year: this.innerModel.year, month })
    }
  },

  computed: {
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

      const model = this.extModel
      if (model.dateHash === null) { return ' --- ' }

      if (this.multiple === true) {
        return this.totalSelectedDates + ' ' +
          (this.totalSelectedDates === 1 ? this.computedLocale.singleDay : this.computedLocale.pluralDay)
      }

      let date

      if (this.range === true && Array.isArray(this.dates) === true && Array.isArray(this.dates[0]) === true) {
        date = this.dates[0]
        return this.computedLocale.monthsShort[ date[0].getMonth() ] + ' ' +
          date[0].getDate() + '\u2014' + (date.length === 2 ? this.computedLocale.monthsShort[ date[1].getMonth() ] + ' ' +
          date[1].getDate() : ' --- ')
      }

      if (this.calendar !== 'persian') {
        date = new Date(model.year, model.month - 1, model.day)
      }
      else {
        const gDate = toGregorian(model.year, model.month, model.day)
        date = new Date(gDate.gy, gDate.gm - 1, gDate.gd)
      }

      if (isNaN(date.valueOf()) === true) { return ' --- ' }

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

      if (this.multiple === true && this.minSelectedDate !== null && this.maxSelectedDate !== null) {
        return this.computedLocale.monthsShort[this.minSelectedDate.getMonth()] + (
          this.minSelectedDate.getFullYear() !== this.maxSelectedDate.getFullYear()
            ? ' ' + this.minSelectedDate.getFullYear() + '\u2014' + this.computedLocale.monthsShort[this.maxSelectedDate.getMonth()] + ' '
            : (
              this.minSelectedDate.getMonth() !== this.maxSelectedDate.getMonth()
                ? '\u2014' + this.computedLocale.monthsShort[this.maxSelectedDate.getMonth()]
                : ''
            )
        ) + ' ' + this.maxSelectedDate.getFullYear()
      }

      if (this.range === true && Array.isArray(this.dates) === true && Array.isArray(this.dates[0]) === true) {
        return this.dates[0][0].getFullYear() + (
          this.dates[0].length > 1 && this.dates[0][0].getFullYear() !== this.dates[0][1].getFullYear()
            ? '\u2014' + this.dates[0][1].getFullYear()
            : ''
        )
      }

      return this.extModel.year !== null ? this.extModel.year : ' --- '
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
      return this.__getDaysInMonth(this.innerModel)
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

      if (this.minNav !== void 0 && this.minNav.year >= this.innerModel.year) {
        data.year.prev = false
        if (this.minNav.year === this.innerModel.year && this.minNav.month >= this.innerModel.month) {
          data.month.prev = false
        }
      }

      if (this.maxNav !== void 0 && this.maxNav.year <= this.innerModel.year) {
        data.year.next = false
        if (this.maxNav.year === this.innerModel.year && this.maxNav.month <= this.innerModel.month) {
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

    isInDates () {
      return date => Array.isArray(this.dates)
        ? this.dates.filter(value => Array.isArray(value) === false && isSameDate(value, date) === true).length > 0 ||
          this.isInRange(date) ||
          this.isRangeStart(date) ||
          this.isRangeEnd(date)
        : isSameDate(this.dates, date)
    },

    isInRange () {
      return date => Array.isArray(this.dates) === true &&
        this.dates.filter(value => {
          return Array.isArray(value) &&
            value.length === 2 &&
            isBetweenDates(date, getMinDate(...value), getMaxDate(...value), { inclusiveFrom: true, inclusiveTo: true })
        }).length > 0
    },

    isRangeStart () {
      return date => Array.isArray(this.dates) === true &&
        this.dates.filter(value => Array.isArray(value) && value.length === 2 && isSameDate(date, getMinDate(...value))).length > 0
    },

    isRangeEnd () {
      return date => Array.isArray(this.dates) === true &&
        this.dates.filter(value => Array.isArray(value) && value.length === 2 && isSameDate(date, getMaxDate(...value))).length > 0
    },

    needsRangeEnd () {
      return this.__needsRangeEnd(this.dates)
    },

    isInMockRange () {
      return date => this.mockRangeEnd !== null &&
        isBetweenDates(
          date,
          getMinDate(this.__getRangeStart(this.dates), this.mockRangeEnd),
          getMaxDate(this.__getRangeStart(this.dates), this.mockRangeEnd),
          { inclusiveFrom: true, inclusiveTo: true }
        )
    },

    isMockRangeStart () {
      return date => this.mockRangeEnd !== null &&
        isSameDate(getMinDate(this.__getRangeStart(this.dates), this.mockRangeEnd), date)
    },

    isMockRangeEnd () {
      return date => this.mockRangeEnd !== null &&
        isSameDate(getMaxDate(this.__getRangeStart(this.dates), this.mockRangeEnd), date)
    },

    minSelectedDate () {
      if (Array.isArray(this.dates) === true) {
        let min = Array.isArray(this.dates[0]) ? getMinDate(...this.dates[0]) : this.dates[0]
        this.dates.forEach(value => {
          min = Array.isArray(value) ? getMinDate(...value, min) : getMinDate(value, min)
        })

        return new Date(min)
      }

      return this.dates
    },

    maxSelectedDate () {
      if (Array.isArray(this.dates) === true) {
        let max = Array.isArray(this.dates[0]) ? getMaxDate(...this.dates[0]) : this.dates[0]
        this.dates.forEach(value => {
          max = Array.isArray(value) ? getMaxDate(...value, max) : getMaxDate(value, max)
        })

        return new Date(max)
      }

      return this.dates
    },

    totalSelectedDates () {
      if (Array.isArray(this.dates) === true) {
        let total = 0

        this.dates.forEach(value => {
          if (Array.isArray(value) === true) {
            total += getDateDiff(getMaxDate(...value), getMinDate(...value)) + 1
          }
          else {
            total += 1
          }
        })

        return total
      }

      return this.value !== '' ? 1 : 0
    },

    days () {
      let date, endDay

      const res = []

      if (this.calendar !== 'persian') {
        date = new Date(this.innerModel.year, this.innerModel.month - 1, 1)
        endDay = (new Date(this.innerModel.year, this.innerModel.month - 1, 0)).getDate()
      }
      else {
        const gDate = toGregorian(this.innerModel.year, this.innerModel.month, 1)
        date = new Date(gDate.gy, gDate.gm - 1, gDate.gd)
        let prevJM = this.innerModel.month - 1
        let prevJY = this.innerModel.year
        if (prevJM === 0) {
          prevJM = 12
          prevJY--
        }
        endDay = jalaaliMonthLength(prevJY, prevJM)
      }

      const days = (date.getDay() - this.computedFirstDayOfWeek - 1)

      const len = days < 0 ? days + 7 : days
      if (len < 6) {
        for (let i = endDay - len; i <= endDay; i++) {
          res.push({ i, fill: true })
        }
      }

      const
        index = res.length,
        prefix = this.innerModel.year + '/' + pad(this.innerModel.month) + '/'

      for (let i = 1; i <= this.daysInMonth; i++) {
        const day = prefix + pad(i)
        const dateAdded = addToDate(date, { days: i - 1 })
        const item = { i }

        if (this.isInDates(dateAdded) === true) {
          item.range = this.isInRange(dateAdded)
          item.rangeStart = this.isRangeStart(dateAdded)
          item.rangeEnd = this.isRangeEnd(dateAdded)
          if (item.rangeStart || item.rangeEnd || item.range === false) {
            item.flat = false
          }
          item.unelevated = true
          item.color = this.computedColor
          item.textColor = this.computedTextColor
        }

        if (this.options === void 0 || this.isInSelection(day) === true) {
          const event = this.events !== void 0 && this.evtFn(day) === true
            ? this.evtColor(day)
            : false
          item.in = true
          item.event = event
          item.flat = item.flat !== false
        }

        if (this.isInMockRange(dateAdded) === true) {
          item.mockRange = true
          item.mockRangeStart = this.isMockRangeStart(dateAdded)
          item.mockRangeEnd = this.isMockRangeEnd(dateAdded)
          item.color = this.computedColor
        }

        res.push(item)
      }

      if (this.innerModel.year === this.extModel.year && this.innerModel.month === this.extModel.month) {
        const i = index + this.innerModel.day - 1
        res[i] !== void 0 && Object.assign(res[i], {
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
      this.__updateValue({ ...this.today }, 'today')
      this.view = 'Calendar'
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

    setMockRangeEnd (rangeEnd) {
      this.mockRangeEnd = rangeEnd
        ? new Date(rangeEnd.year, rangeEnd.month - 1, rangeEnd.day)
        : null
    },

    __getFirstSelectedDate (val) {
      if (Array.isArray(val) === true) {
        const first = val.slice().shift()
        return Array.isArray(first) === true ? first[0] : first
      }

      return val
    },

    __getLastSelectedDate (val) {
      if (Array.isArray(val) === true) {
        const last = val.slice().pop()
        return Array.isArray(last) === true ? last[last.length - 1] : last
      }

      return val
    },

    __needsRangeEnd (val) {
      return Array.isArray(val) === true &&
        Array.isArray(val[val.length - 1]) === true &&
        val[val.length - 1].length === 1
    },

    __getRangeStart (val) {
      if (Array.isArray(val) === false || val.length === 0 || Array.isArray(val[val.length - 1]) === false) {
        return null
      }

      let index

      if (this.needsRangeEnd !== true && this.mockRangeEnd !== null) {
        let fn

        if (isBetweenDates(this.mockRangeEnd, getMinDate(...this.dates[this.dates.length - 1]), getMaxDate(...this.dates[this.dates.length - 1]), { inclusiveFrom: true, inclusiveTo: true })) {
          fn = this.editRange === 'start' ? getMaxDate : getMinDate
        }
        else if (isSameDate(this.mockRangeEnd, getMinDate(...this.dates[this.dates.length - 1], this.mockRangeEnd))) {
          fn = getMaxDate
        }
        else {
          fn = getMinDate
        }

        index = isSameDate(
          this.dates[this.dates.length - 1][0],
          fn(...this.dates[this.dates.length - 1])
        ) ? 0 : 1
      }
      else {
        index = 0
      }

      return val[val.length - 1][index]
    },

    __getDates (val, mask, locale) {
      if (Array.isArray(val)) {
        let array = []

        val.forEach((value, index) => {
          if (Array.isArray(value) === true) {
            array[index] = []
            value.forEach((value2, index2) => {
              array[index][index2] = extractDate(value2, mask, locale)
            })
          }
          else if (val !== null) {
            array[index] = extractDate(value, mask, locale)
          }
          else {
            array = val
          }
        })

        return array
      }
      else if (val !== null) {
        return extractDate(val, mask, locale)
      }
      else return val
    },

    __getModels (val, mask, locale) {
      const external = __splitDate(
        val,
        this.calendar === 'persian' ? 'YYYY/MM/DD' : mask,
        locale,
        this.calendar
      )

      return {
        external,
        inner: external.dateHash === null
          ? this.__getDefaultModel()
          : { ...external }
      }
    },

    __getDefaultModel () {
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
            label: this.computedLocale.months[ this.innerModel.month - 1 ],
            view: 'Months',
            key: this.innerModel.month,
            dir: this.monthDirection,
            goTo: this.__goToMonth,
            boundaries: this.navBoundaries.month,
            cls: ' col'
          }).concat(this.__getNavigation(h, {
            label: this.innerModel.year,
            view: 'Years',
            key: this.innerModel.year,
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
                key: this.innerModel.year + '/' + this.innerModel.month,
                staticClass: 'q-date__calendar-days fit'
              }, this.days.map(day => h('div', {
                staticClass:
                  `q-date__calendar-item q-date__calendar-item--selected q-date__calendar-item--${
                    day.fill === true
                      ? 'fill'
                      : (day.in === true ? 'in' : 'out')
                  } ${
                    day.range === true
                      ? 'q-date__calendar-item--range' + (day.rangeEnd ? '-end' : (day.rangeStart ? '-start' : '')) + ' text-' + day.color
                      : ''
                  } ${
                    day.mockRange === true
                      ? 'q-date__calendar-item--mock-range' + (day.mockRangeEnd ? '-end' : '') + (day.mockRangeStart ? '-start' : '') + ' text-' + day.color
                      : ''
                  }`
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
                    on: cache(this, 'day#' + day.i, {
                      click: () => {
                        if (this.range) {
                          if (this.needsRangeEnd) {
                            this.__setRangeEndDay(day.i)
                          }
                          else if (this.multiple) {
                            this.__addRangeStartDay(day.i)
                          }
                          else if (this.editRange !== null && this.__getRangeStart(this.dates) !== null) {
                            this.__editRange(day.i)
                          }
                          else {
                            this.__setRangeStartDay(day.i)
                          }
                        }
                        else if (this.multiple) {
                          this.__addRemoveDay(day.i)
                        }
                        else {
                          this.__setDay(day.i)
                        }
                      },
                      mouseover: () => {
                        if (this.needsRangeEnd || (!this.multiple && this.editRange !== null)) {
                          this.__setMockRangeEndDay(day.i)
                        }
                      },
                      mouseleave: () => {
                        if (this.needsRangeEnd || (!this.multiple && this.editRange !== null)) {
                          this.__deleteMockRangeEnd(day.i)
                        }
                      }
                    })
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
      const currentYear = this.innerModel.year === this.today.year
      const isDisabled = month => {
        return (
          (this.minNav !== void 0 && this.innerModel.year === this.minNav.year && this.minNav.month > month) ||
          (this.maxNav !== void 0 && this.innerModel.year === this.maxNav.year && this.maxNav.month < month)
        )
      }

      const content = this.computedLocale.monthsShort.map((month, i) => {
        const active = this.innerModel.month === i + 1

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
            label: this.innerModel.year,
            view: 'Years',
            key: this.innerModel.year,
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
        const active = this.innerModel.year === i

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
      let
        month = Number(this.innerModel.month) + offset,
        yearDir = this.yearDirection

      if (month === 13) {
        month = 1
        this.innerModel.year++
        yearDir = (this.$q.lang.rtl !== true) ? 'left' : 'right'
      }
      else if (month === 0) {
        month = 12
        this.innerModel.year--
        yearDir = (this.$q.lang.rtl !== true) ? 'right' : 'left'
      }

      this.monthDirection = (offset > 0) === (this.$q.lang.rtl !== true) ? 'left' : 'right'
      this.yearDirection = yearDir
      this.innerModel.month = month
      this.emitImmediately === true && this.__updateValue({}, 'month')
    },

    __goToYear (offset) {
      const year = this.innerModel.year = Number(this.innerModel.year) + offset

      this.__normalizeInnerMonth(year)

      this.monthDirection = this.yearDirection = (offset > 0) === (this.$q.lang.rtl !== true) ? 'left' : 'right'
      this.emitImmediately === true && this.__updateValue({}, 'year')
    },

    __setYear (year) {
      this.innerModel.year = year

      this.__normalizeInnerMonth(year)

      this.emitImmediately === true && this.__updateValue({ year }, 'year')
      this.view = this.extModel.month === null || this.defaultView === 'Years' ? 'Months' : 'Calendar'
    },

    __normalizeInnerMonth (year) {
      if (this.minNav !== void 0 && year === this.minNav.year && this.innerModel.month < this.minNav.month) {
        this.innerModel.month = this.minNav.month
      }
      else if (this.maxNav !== void 0 && year === this.maxNav.year && this.innerModel.month > this.maxNav.month) {
        this.innerModel.month = this.maxNav.month
      }
    },

    __setMonth (month) {
      this.innerModel.month = month
      this.emitImmediately === true && this.__updateValue({ month }, 'month')
      this.view = 'Calendar'
    },

    __setDay (day) {
      this.__updateValue({ day }, 'day')
    },

    __setRangeStartDay (day) {
      this.__updateValue({ day }, 'set-range-start-day')
    },

    __addRangeStartDay (day) {
      this.__updateValue({ day }, 'add-range-start-day')
    },

    __setMockRangeEndDay (day) {
      if (this.__getRangeStart(this.dates) !== null) {
        this.mockRangeEnd = new Date(
          this.innerModel.year,
          this.innerModel.month - 1,
          day
        )
        this.$emit('mock-range-end', {
          year: this.innerModel.year,
          month: this.innerModel.month,
          day
        })
      }
    },

    __deleteMockRangeEnd () {
      this.mockRangeEnd = null
      this.$emit('mock-range-end', null)
    },

    __setRangeEndDay (day) {
      this.__updateValue({ day }, 'set-range-end-day')
      this.__deleteMockRangeEnd(day)
    },

    __editRange (day) {
      this.__updateValue({ day }, 'edit-range')
      this.__deleteMockRangeEnd(day)
    },

    __addRemoveDay (day) {
      this.__updateValue({ day }, 'add-remove-day')
    },

    __updateValue (date, reason) {
      if (date.year === void 0) {
        date.year = this.innerModel.year
      }
      if (date.month === void 0) {
        date.month = this.innerModel.month
      }
      if (
        date.day === void 0 ||
        (this.emitImmediately === true && (reason === 'year' || reason === 'month'))
      ) {
        date.day = this.innerModel.day
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

      if (['add-range-start-day', 'set-range-start-day', 'set-range-end-day', 'add-remove-day', 'edit-range'].includes(reason) === true) {
        const day = extractDate(val, this.mask, this.__getComputedLocale())
        let dates, valArray

        if (this.value === null) {
          dates = valArray = []
        }
        else if (Array.isArray(this.dates) === false) {
          dates = [ this.dates ]
          valArray = [ this.value ]
        }
        else {
          dates = this.dates.slice()
          valArray = this.value.slice()
        }

        if (reason === 'set-range-start-day' || reason === 'add-range-start-day') {
          if (reason === 'set-range-start-day') {
            dates = [[day]]
            valArray = [[val]]
          }
          else if (this.isInRange(day) === false) {
            if (this.isInDates(day) === true) {
              this.__updateValue(date, 'add-remove-day')
              return
            }
            else {
              const range = [day], valRange = [val]
              if (dates.length > 0) {
                dates.push(range)
              }
              valArray.push(valRange)
            }
          }
          else {
            if (this.isRangeStart(day) || this.isRangeEnd(day)) {
              reason = 'edit-range'
              this.dates.some((value, index) => {
                if (Array.isArray(value) === true && (isSameDate(value[0], day) || isSameDate(value[1], day)) === true) {
                  const val = valArray.splice(index, 1)[0][isSameDate(value[0], day) ? 1 : 0]
                  valArray.push([val])
                  this.mockRangeEnd = day
                  return true
                }
              })
            }
            else {
              this.__updateValue(date, 'add-remove-day')
              return
            }
          }
        }
        else if (reason === 'set-range-end-day' || reason === 'edit-range') {
          const range = [this.__getRangeStart(dates), day]
          const valRange = [this.__getRangeStart(valArray), val]

          if (isSameDate(range[0], range[1]) === true) {
            reason = 'add-day'
            valArray.splice(-1, 1, val)
          }
          else {
            if (isSameDate(range[1], getMinDate(...range)) === true) {
              range.reverse()
              valRange.reverse()
            }

            valArray.splice(-1, 1, valRange)
            dates.splice(-1, 1, range)
            dates.forEach((value, index) => {
              if (Array.isArray(value)) {
                if (value === range) {
                  return
                }
                if (isBetweenDates(day, getMinDate(...value), getMaxDate(...value), { inclusiveTo: true, inclusiveFrom: true })) {
                  valRange[1] = isSameDate(range[0], getMinDate(...value, range[0]))
                    ? valArray[index][isSameDate(value[0], getMaxDate(...value)) ? 0 : 1]
                    : valArray[index][isSameDate(value[0], getMinDate(...value)) ? 0 : 1]
                  valArray[index] = undefined
                }
                else if (getMinDate(...range) <= getMinDate(...value) && getMaxDate(...range) >= getMaxDate(...value)) {
                  valArray[index] = undefined
                }
              }
              else if (isBetweenDates(value, getMinDate(...range), getMaxDate(...range), { inclusiveTo: true, inclusiveFrom: true })) {
                valArray[index] = undefined
              }
            })

            valArray = valArray.filter(a => a !== undefined)
          }
        }
        else {
          if (this.isInDates(day)) {
            reason = 'remove-day'
            const
              dayPrev = addToDate(day, { days: -1 }),
              dayNext = addToDate(day, { days: 1 }),
              valPrev = this.calendar === 'persian'
                ? dayPrev.getFullYear() + '/' + pad(dayPrev.getMonth() + 1) + '/' + pad(dayPrev.getDate())
                : formatDate(
                  dayPrev,
                  this.mask,
                  this.computedLocale,
                  dayPrev.getFullYear(),
                  this.extModel.timezoneOffset
                ),
              valNext = this.calendar === 'persian'
                ? dayNext.getFullYear() + '/' + pad(dayNext.getMonth() + 1) + '/' + pad(dayNext.getDate())
                : formatDate(
                  dayNext,
                  this.mask,
                  this.computedLocale,
                  dayNext.getFullYear(),
                  this.extModel.timezoneOffset
                )

            dates.some((value, index) => {
              if (Array.isArray(value) === true) {
                if (isBetweenDates(day, getMinDate(...value), getMaxDate(...value), { inclusiveTo: true, inclusiveFrom: true })) {
                  if (isSameDate(value[0], day)) {
                    valArray[index][0] = isSameDate(getMinDate(...value), value[0]) ? valNext : valPrev
                  }
                  else if (isSameDate(value[1], day)) {
                    valArray[index][1] = isSameDate(getMinDate(...value), value[0]) ? valPrev : valNext
                  }
                  else {
                    valArray.splice(
                      index,
                      1,
                      [valArray[index][0], isSameDate(getMinDate(...value), value[0]) ? valPrev : valNext],
                      [isSameDate(getMinDate(...value), value[0]) ? valNext : valPrev, valArray[index][1]]
                    )
                    if (isSameDate(valArray[index + 1][0], valArray[index + 1][1])) {
                      valArray.splice(index + 1, 1, valArray[index + 1][0])
                    }
                  }
                  if (isSameDate(valArray[index][0], valArray[index][1])) {
                    valArray.splice(index, 1, valArray[index][0])
                  }
                  return true
                }
              }
              else if (isSameDate(value, day)) {
                valArray.splice(index, 1)
                return true
              }
            })
          }
          else {
            reason = 'add-day'
            valArray.push(val)
          }
        }

        if (valArray.length === 1 && Array.isArray(valArray[0]) === false) {
          valArray = valArray[0]
        }
        else if (valArray.length === 0) {
          valArray = null
        }

        date.changed = true
        this.$emit('input', valArray, reason, date)
      }
      else {
        date.changed = val !== this.value
        this.$emit('input', val, reason, date)
      }

      if (val === this.value && reason === 'today') {
        const newHash = date.year + '/' + pad(date.month) + '/' + pad(date.day)
        const curHash = this.innerModel.year + '/' + pad(this.innerModel.month) + '/' + pad(this.innerModel.day)

        if (newHash !== curHash) {
          this.monthDirection = (curHash < newHash) === (this.$q.lang.rtl !== true) ? 'left' : 'right'
          if (date.year !== this.innerModel.year) {
            this.yearDirection = this.monthDirection
          }

          this.$nextTick(() => {
            this.startYear = date.year - date.year % yearsInterval - (date.year < 0 ? yearsInterval : 0)
            Object.assign(this.innerModel, {
              year: date.year,
              month: date.month,
              day: date.day,
              dateHash: newHash
            })
          })
        }
      }
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
