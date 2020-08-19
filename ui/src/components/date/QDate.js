import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import DateTimeMixin from '../../mixins/datetime.js'

import { slot } from '../../utils/slot.js'
import { formatDate, __splitDate, getDateDiff } from '../../utils/date.js'
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
    range: Boolean,

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

    events: [ Array, Function ],
    eventColor: [ String, Function ],

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
      editRange: void 0,
      viewModel // model of current calendar
    }
  },

  watch: {
    value (v) {
      if (this.lastEmitValue === v) {
        this.lastEmitValue = 0
      }
      else if (this.normalizedModel.length <= 1) {
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
    classes () {
      const type = this.landscape === true ? 'landscape' : 'portrait'
      return `q-date q-date--${type} q-date--${type}-${this.minimal === true ? 'minimal' : 'standard'}` +
        (this.isDark === true ? ' q-date--dark q-dark' : '') +
        (this.bordered === true ? ` q-date--bordered` : '') +
        (this.square === true ? ` q-date--square no-border-radius` : '') +
        (this.flat === true ? ` q-date--flat no-shadow` : '') +
        (this.disable === true ? ' disabled' : (this.readonly === true ? ' q-date--readonly' : ''))
    },

    computedMask () {
      return this.calendar === 'persian' ? 'YYYY/MM/DD' : this.mask
    },

    normalizedModel () {
      return Array.isArray(this.value) === true
        ? this.value
        : (this.value ? [ this.value ] : [])
    },

    daysModel () {
      return this.normalizedModel
        .filter(date => typeof date === 'string')
        .map(date => this.__decodeString(date, this.computedMask, this.computedLocale))
    },

    rangeModel () {
      const fn = date => this.__decodeString(date, this.computedMask, this.computedLocale)
      return this.normalizedModel
        .filter(date => Object(date) === date && date.from !== void 0 && date.to !== void 0)
        .map(date => ({ from: fn(date.from), to: fn(date.to) }))
    },

    getNativeDateFn () {
      return this.calendar !== 'persian'
        ? model => new Date(model.year, model.month - 1, model.day)
        : model => {
          const gDate = toGregorian(model.year, model.month, model.day)
          return new Date(gDate.gy, gDate.gm - 1, gDate.gd)
        }
    },

    daysInModel () {
      return this.daysModel.length + this.rangeModel.reduce(
        (acc, range) => acc + 1 + getDateDiff(
          this.getNativeDateFn(range.to),
          this.getNativeDateFn(range.from)
        ),
        0
      )
    },

    headerTitle () {
      if (this.title !== void 0 && this.title !== null && this.title.length > 0) {
        return this.title
      }

      if (this.editRange !== void 0) {
        const model = this.editRange.init
        const date = this.getNativeDateFn(model)

        return this.computedLocale.daysShort[ date.getDay() ] + ', ' +
          this.computedLocale.monthsShort[ model.month - 1 ] + ' ' +
          model.day + lineStr + '?'
      }

      if (this.normalizedModel.length === 0 || this.daysInModel === 0) {
        // TODO: || this.daysModel[0].dateHash === null
        return lineStr
      }

      if (this.daysInModel > 1) {
        return `${this.daysInModel} ${this.computedLocale.pluralDay}`
      }

      const model = this.daysModel[0]
      const date = this.getNativeDateFn(model)

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

      if (this.daysInModel === 0 || this.daysInModel === 0) {
        // TODO:  || this.daysModel[0].year === null
        return lineStr
      }

      if (this.daysInModel > 1) {
        const from = this.minSelectedModel
        const to = this.maxSelectedModel
        const month = this.computedLocale.monthsShort

        return month[from.month - 1] + (
          from.year !== to.year
            ? ' ' + from.year + lineStr + month[to.month - 1] + ' '
            : (
              from.month !== to.month
                ? lineStr + month[to.month - 1]
                : ''
            )
        ) + ' ' + to.year
      }

      return this.daysModel[0].year
    },

    minSelectedModel () {
      const model = this.daysModel.concat(this.rangeModel.map(range => range.from))
        .sort((a, b) => a.year - b.year || a.month - b.month)

      return model[0]
    },

    maxSelectedModel () {
      const model = this.daysModel.concat(this.rangeModel.map(range => range.to))
        .sort((a, b) => b.year - a.year || b.month - a.month)

      return model[0]
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
      const date = this.viewModel
      return this.calendar !== 'persian'
        ? (new Date(date.year, date.month, 0)).getDate()
        : jalaaliMonthLength(date.year, date.month)
    },

    today () {
      return this.__getCurrentDate()
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

    daysMap () {
      const map = {}

      this.daysModel.forEach(entry => {
        const hash = this.__getMonthHash(entry)

        if (map[hash] === void 0) {
          map[hash] = []
        }

        map[hash].push(entry.day)
      })

      return map
    },

    rangeMap () {
      const map = {}

      this.rangeModel.forEach(entry => {
        const hashFrom = this.__getMonthHash(entry.from)
        const hashTo = this.__getMonthHash(entry.to)

        if (map[hashFrom] === void 0) {
          map[hashFrom] = []
        }

        map[hashFrom].push({
          from: entry.from.day,
          to: hashFrom === hashTo ? entry.to.day : void 0,
          range: entry
        })

        if (hashFrom < hashTo) {
          let hash
          const { year, month } = entry.from
          const cur = month < 12
            ? { year, month: month + 1 }
            : { year: year + 1, month: 1 }

          while ((hash = this.__getMonthHash(cur)) <= hashTo) {
            if (map[hash] === void 0) {
              map[hash] = []
            }

            map[hash].push({
              from: void 0,
              to: hash === hashTo ? entry.to.day : void 0,
              range: entry
            })

            cur.month++
            if (cur.month > 12) {
              cur.year++
              cur.month = 1
            }
          }
        }
      })

      return map
    },

    viewMonthHash () {
      return this.__getMonthHash(this.viewModel)
    },

    selectionDaysMap () {
      const map = {}

      if (this.options === void 0) {
        for (let i = 1; i <= this.daysInMonth; i++) {
          map[i] = true
        }

        return map
      }

      const fn = typeof this.options === 'function'
        ? this.options
        : date => this.options.includes(date)

      for (let i = 1; i <= this.daysInMonth; i++) {
        const dayHash = this.viewMonthHash + '/' + pad(i)
        map[i] = fn(dayHash)
      }

      return map
    },

    eventDaysMap () {
      const map = {}

      if (this.events === void 0) {
        for (let i = 1; i <= this.daysInMonth; i++) {
          map[i] = false
        }
      }
      else {
        const fn = typeof this.events === 'function'
          ? this.events
          : date => this.events.includes(date)

        for (let i = 1; i <= this.daysInMonth; i++) {
          const dayHash = this.viewMonthHash + '/' + pad(i)
          map[i] = fn(dayHash) === true && this.evtColor(dayHash)
        }
      }

      return map
    },

    viewDays () {
      let date, endDay
      const { year, month } = this.viewModel

      if (this.calendar !== 'persian') {
        date = new Date(year, month - 1, 1)
        endDay = (new Date(year, month - 1, 0)).getDate()
      }
      else {
        const gDate = toGregorian(year, month, 1)
        date = new Date(gDate.gy, gDate.gm - 1, gDate.gd)
        let prevJM = month - 1
        let prevJY = year
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
        const day = { i, event: this.eventDaysMap[i], classes: [] }

        if (this.selectionDaysMap[i] === true) {
          day.in = true
          day.flat = true
        }

        res.push(day)
      }

      // if current view has days in model
      if (this.daysMap[this.viewMonthHash] !== void 0) {
        this.daysMap[this.viewMonthHash].forEach(day => {
          const i = index + day - 1
          Object.assign(res[i], {
            selected: true,
            unelevated: true,
            flat: false,
            color: this.computedColor,
            textColor: this.computedTextColor
          })
        })
      }

      // if current view has ranges in model
      if (this.rangeMap[this.viewMonthHash] !== void 0) {
        this.rangeMap[this.viewMonthHash].forEach(entry => {
          if (entry.from !== void 0) {
            const from = index + entry.from - 1
            const to = index + (entry.to || this.daysInMonth) - 1

            for (let day = from; day <= to; day++) {
              Object.assign(res[day], {
                range: entry.range,
                unelevated: true,
                color: this.computedColor,
                textColor: this.computedTextColor
              })
            }

            Object.assign(res[from], {
              rangeFrom: true,
              flat: false
            })

            entry.to !== void 0 && Object.assign(res[to], {
              rangeTo: true,
              flat: false
            })
          }
          else if (entry.to !== void 0) {
            const to = index + entry.to - 1

            for (let day = index; day <= to; day++) {
              Object.assign(res[day], {
                range: entry.range,
                unelevated: true,
                color: this.computedColor,
                textColor: this.computedTextColor
              })
            }

            Object.assign(res[to], {
              flat: false,
              rangeTo: true
            })
          }
          else {
            const to = index + this.daysInMonth - 1
            for (let day = index; day <= to; day++) {
              Object.assign(res[day], {
                range: entry.range,
                unelevated: true,
                color: this.computedColor,
                textColor: this.computedTextColor
              })
            }
          }
        })
      }

      if (this.rangeView !== void 0) {
        const from = index + this.rangeView.from - 1
        const to = index + this.rangeView.to - 1

        for (let day = from; day <= to; day++) {
          res[day].color = this.computedColor
          res[day].editRange = true
        }

        if (this.rangeView.includeFrom === true) {
          res[from].editRangeFrom = true
        }
        if (this.rangeView.includeTo === true) {
          res[to].editRangeTo = true
        }
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

      res.forEach(day => {
        let cls = `q-date__calendar-item `

        if (day.fill === true) {
          cls += 'q-date__calendar-item--fill'
        }
        else {
          cls += `q-date__calendar-item--${day.in === true ? 'in' : 'out'}`

          if (day.range !== void 0) {
            cls += ` q-date__calendar-item--range${day.rangeTo === true ? '-to' : (day.rangeFrom === true ? '-from' : '')}`
          }

          if (day.editRange === true) {
            cls += ` q-date__calendar-item--edit-range${day.editRangeFrom === true ? '-from' : ''}${day.editRangeTo === true ? '-to' : ''}`
          }

          if (day.range !== void 0 || day.editRange === true) {
            cls += ` text-${day.color}`
          }
        }

        day.classes = cls
      })

      return res
    },

    rangeView () {
      if (this.editRange === void 0) {
        return
      }

      const { init, initHash, final, finalHash } = this.editRange

      const [ from, to ] = initHash <= finalHash
        ? [ init, final ]
        : [ final, init ]

      const fromHash = this.__getMonthHash(from)
      const toHash = this.__getMonthHash(to)

      if (fromHash !== this.viewMonthHash && toHash !== this.viewMonthHash) {
        return
      }

      const view = {}

      if (fromHash === this.viewMonthHash) {
        view.from = from.day
        view.includeFrom = true
      }
      else {
        view.from = 1
      }

      if (toHash === this.viewMonthHash) {
        view.to = to.day
        view.includeTo = true
      }
      else {
        view.to = this.daysInMonth
      }

      return view
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
      this.__updateViewModel(this.today)
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
        ? this.__getDayHash(date)
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
      const decoded = __splitDate(
        date,
        this.calendar === 'persian' ? 'YYYY/MM/DD' : mask || this.mask,
        locale || this.__getComputedLocale(),
        this.calendar
      )

      decoded.hour = decoded.hour || 0
      decoded.minute = decoded.minute || 0
      decoded.second = decoded.second || 0
      decoded.millisecond = decoded.millisecond || 0

      return decoded
    },

    __getViewModel (value) {
      const model = Array.isArray(value) === true
        ? value
        : (value ? [ value ] : [])

      return model.length === 0
        ? this.__getDefaultViewModel()
        : this.__decodeString(model[0].from !== void 0 ? model[0].from : model[0])
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
                key: this.viewMonthHash,
                staticClass: 'q-date__calendar-days fit'
              }, this.days.map(day => h('div', { staticClass: day.classes }, [
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
                      click: () => { this.__onDayClick(day.i) },
                      mouseover: () => { this.__onDayMouseover(day.i) }
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
                color: active === true ? this.computedColor : null,
                textColor: active === true ? this.computedTextColor : null,
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

    __getMonthHash (date) {
      return date.year + '/' + pad(date.month)
    },

    __getDayHash (date) {
      return date.year + '/' + pad(date.month) + '/' + pad(date.day)
    },

    __toggleDate (date, monthHash) {
      const month = this.daysMap[monthHash || this.__getMonthHash(date)]
      const fn = month !== void 0 && month.includes(date.day) === true
        ? this.__removeFromModel
        : this.__addToModel

      fn(date)
    },

    __onDayClick (dayIndex) {
      const day = { ...this.viewModel, day: dayIndex }

      if (this.range === false) {
        this.__toggleDate(day, this.viewMonthHash)
        return
      }

      if (this.editRange === void 0) {
        const dayProps = this.days.find(day => day.fill !== true && day.i === dayIndex)

        if (dayProps.range !== void 0) {
          this.__removeFromModel({ from: dayProps.range.from, to: dayProps.range.to })
          return
        }

        if (dayProps.selected === true) {
          this.__removeFromModel(day)
          return
        }

        const initHash = this.__getDayHash(day)

        this.editRange = {
          init: day,
          initHash,
          final: day,
          finalHash: initHash
        }
      }
      else {
        const finalHash = this.__getDayHash(day)
        const payload = this.editRange.initHash === finalHash
          ? day
          : (
            this.editRange.initHash <= finalHash
              ? { from: this.editRange.init, to: day }
              : { from: day, to: this.editRange.init }
          )

        this.editRange = void 0
        this.__addToModel(payload)
      }
    },

    __onDayMouseover (dayIndex) {
      if (this.editRange !== void 0) {
        const final = { ...this.viewModel, day: dayIndex }

        Object.assign(this.editRange, {
          final,
          finalHash: this.__getDayHash(final)
        })
      }
    },

    __updateViewModel (date) {
      const newHash = date.year + '/' + pad(date.month) + '/01'

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

    __emitValue (val) {
      const value = val !== null && val.length === 1 && this.multiple === false
        ? val[0]
        : val

      this.lastEmitValue = value
      this.$emit('input', value)
    },

    __encodeEntry (date) {
      return date.from !== void 0
        ? { from: this.__encodeObject(date.from), to: this.__encodeObject(date.to) }
        : this.__encodeObject(date)
    },

    __addToModel (date) {
      let value

      if (this.multiple === true) {
        if (date.from !== void 0) {
          // we also need to filter out intersections

          const fromHash = this.__getDayHash(date.from)
          const toHash = this.__getDayHash(date.to)

          const days = this.daysModel
            .filter(day => day.dateHash < fromHash || day.dateHash > toHash)

          const ranges = this.rangeModel
            .filter(({ from, to }) => to.dateHash < fromHash || from.dateHash > toHash)

          value = days.concat(ranges).concat(date).map(this.__encodeEntry)
        }
        else {
          const model = this.normalizedModel.slice()
          model.push(this.__encodeEntry(date))
          value = model
        }
      }
      else {
        value = this.__encodeEntry(date)
      }

      this.__emitValue(value)
    },

    __removeFromModel (date) {
      let model = null

      if (this.multiple === true && Array.isArray(this.value) === true) {
        if (date.from !== void 0) {
          const val = { from: this.__encodeObject(date.from), to: this.__encodeObject(date.to) }
          model = this.value.filter(
            date => date.from !== void 0
              ? (date.from !== val.from && date.to !== val.to)
              : true
          )
        }
        else {
          const str = this.__encodeObject(date)
          model = this.value.filter(date => date !== str)
        }

        if (model.length === 0) {
          model = null
        }
      }

      this.__emitValue(model)
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
