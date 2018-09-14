import { height, width, offset } from '../../utils/dom.js'
import { position, stopAndPrevent, getEventKey } from '../../utils/event.js'
import QBtn from '../btn/QBtn.js'
import { isSameDate, isValid, adjustDate } from '../../utils/date.js'
import DateMixin from './datetime-mixin.js'
import CanRenderMixin from '../../mixins/can-render.js'
import ParentFieldMixin from '../../mixins/parent-field.js'
import Ripple from '../../directives/ripple.js'

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

export default {
  name: 'QDatetimePicker',
  mixins: [DateMixin, ParentFieldMixin, CanRenderMixin],
  props: {
    defaultValue: [String, Number, Date],
    disable: Boolean,
    readonly: Boolean
  },
  directives: {
    Ripple
  },
  data () {
    return {
      view: this.__calcView(this.defaultView),
      dragging: false,
      centerClockPos: 0,
      fakeValue: {
        year: null,
        month: null
      }
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.view = ['date', 'datetime'].includes(this.type) ? 'day' : 'hour'
      }
    },
    view () {
      this.__scrollView(true)
    },
    model () {
      if (this.fakeValue.month !== this.month) {
        this.fakeValue.month = this.month
        this.__scrollView()
      }
      if (this.fakeValue.year !== this.year) {
        this.fakeValue.year = this.year
        this.__scrollView()
      }
    }
  },
  computed: {
    classes () {
      const cls = []
      this.disable && cls.push('disabled')
      this.readonly && cls.push('readonly')
      this.dark && cls.push('q-datetime-dark')
      this.minimal && cls.push('q-datetime-minimal')
      this.color && cls.push(`text-${this.color}`)
      return cls
    },
    dateArrow () {
      const val = [ this.$q.icon.datetime.arrowLeft, this.$q.icon.datetime.arrowRight ]
      return this.$q.i18n.rtl ? val.reverse() : val
    },
    computedFormat24h () {
      return this.format24h !== 0
        ? this.format24h
        : this.$q.i18n.date.format24h
    },
    computedFirstDayOfWeek () {
      return this.firstDayOfWeek !== void 0
        ? this.firstDayOfWeek
        : this.$q.i18n.date.firstDayOfWeek
    },
    headerDayNames () {
      const
        days = this.$q.i18n.date.daysShort,
        first = this.computedFirstDayOfWeek

      return first > 0
        ? days.slice(first, 7).concat(days.slice(0, first))
        : days
    },

    fakeModel () {
      return new Date(this.fakeYear, this.fakeMonth - 1, 1)
    },
    fakeYear () {
      return this.fakeValue.year || this.year
    },
    fakeMonth () {
      return this.fakeValue.month || this.month
    },
    daysInMonth () {
      return (new Date(this.fakeYear, this.fakeMonth, 0)).getDate()
    },

    monthString () {
      return `${this.$q.i18n.date.monthsShort[this.month - 1]}`
    },
    monthStamp () {
      return `${this.$q.i18n.date.months[this.fakeMonth - 1]} ${this.fakeYear}`
    },
    weekDayString () {
      return this.headerLabel || this.$q.i18n.date.days[this.model.getDay()]
    },

    fillerDays () {
      let days = (this.fakeModel.getDay() - this.computedFirstDayOfWeek)
      if (days < 0) {
        days += 7
      }
      return days
    },
    beforeMinDays () {
      if (this.pmin === null) {
        return false
      }
      const
        pminYear = this.pmin.getFullYear(),
        pminMonth = this.pmin.getMonth() + 1

      if (pminYear === this.fakeYear && pminMonth === this.fakeMonth) {
        return this.pmin.getDate() - 1
      }
      if (pminYear > this.fakeYear || (pminYear === this.fakeYear && pminMonth > this.fakeMonth)) {
        return this.daysInMonth
      }
      return false
    },
    afterMaxDays () {
      if (this.pmax === null) {
        return false
      }
      const
        pmaxYear = this.pmax.getFullYear(),
        pmaxMonth = this.pmax.getMonth() + 1

      if (pmaxYear === this.fakeYear && pmaxMonth === this.fakeMonth) {
        return this.daysInMonth - this.maxDay
      }
      if (pmaxYear < this.fakeYear || (pmaxYear === this.fakeYear && pmaxMonth < this.fakeMonth)) {
        return this.daysInMonth
      }
      return false
    },
    maxDay () {
      return this.pmax !== null ? this.pmax.getDate() : this.daysInMonth
    },
    dateInterval () {
      let after = this.pmax === null || this.afterMaxDays === false ? 0 : this.afterMaxDays
      if (this.beforeMinDays > 0 || after) {
        let min = this.beforeMinDays > 0 ? this.beforeMinDays + 1 : 1
        return { min, max: this.daysInMonth - after }
      }
      return { min: 1, max: this.daysInMonth }
    },

    hour () {
      const h = this.model.getHours()
      return this.computedFormat24h
        ? h
        : convertToAmPm(h)
    },
    minute () {
      return this.model.getMinutes()
    },
    am () {
      return this.model.getHours() <= 11
    },
    clockPointerStyle () {
      let
        forMinute = this.view === 'minute',
        divider = forMinute ? 60 : 12,
        degrees = Math.round((forMinute ? this.minute : this.hour) * (360 / divider)) - 180,
        transforms = [`rotate(${degrees}deg)`]

      if (!forMinute && this.computedFormat24h && !(this.hour > 0 && this.hour < 13)) {
        transforms.push('scale(.7, .7)')
      }
      return { transform: transforms.join(' ') }
    },
    isValid () {
      return isValid(this.value)
    },
    today () {
      const today = new Date()
      return isSameDate(today, this.fakeModel, 'month')
        ? today.getDate()
        : -1
    }
  },
  methods: {
    /* date */
    setYear (value, skipView) {
      if (this.editable) {
        if (!skipView) {
          this.view = 'month'
        }
        this.model = new Date(new Date(this.model).setFullYear(this.__parseTypeValue('year', value)))
      }
    },
    setMonth (value, skipView) {
      if (this.editable) {
        if (!skipView) {
          this.view = 'day'
        }
        this.model = adjustDate(this.model, { month: value })
      }
    },
    moveFakeMonth (direction) {
      let
        month = this.fakeMonth + (direction > 0 ? 1 : -1),
        year = this.fakeYear
      if (month < 1) {
        month = 12
        year -= 1
      }
      else if (month > 12) {
        month = 1
        year += 1
      }
      if (this.pmin !== null && direction > 0) {
        const
          pminYear = this.pmin.getFullYear(),
          pminMonth = this.pmin.getMonth() + 1
        if (year < pminYear) {
          year = pminYear
          month = pminMonth
        }
        else if (year === pminYear && month < pminMonth) {
          month = pminMonth
        }
      }
      if (this.pmax !== null && direction < 0) {
        const
          pmaxYear = this.pmax.getFullYear(),
          pmaxMonth = this.pmax.getMonth() + 1
        if (year > pmaxYear) {
          year = pmaxYear
          month = pmaxMonth
        }
        else if (year === pmaxYear && month > pmaxMonth) {
          month = pmaxMonth
        }
      }
      this.fakeValue.year = year
      this.fakeValue.month = month
    },
    setDay (value, skipView, year, month) {
      if (this.editable) {
        if (year && month) {
          const fake = adjustDate(this.model, { month })
          fake.setFullYear(this.__parseTypeValue('year', year))
          fake.setDate(this.__parseTypeValue('date', value))
          this.model = fake
        }
        else {
          this.model = new Date(new Date(this.model).setDate(this.__parseTypeValue('date', value)))
        }
        if (!skipView && this.type === 'date') {
          this.$emit('canClose')
          if (this.minimal) {
            this.setView(this.defaultView)
          }
        }
        else if (!skipView) {
          this.view = 'hour'
        }
      }
    },

    setHour (value) {
      if (!this.editable) {
        return
      }

      value = this.__parseTypeValue('hour', value)

      if (!this.computedFormat24h && value < 12 && !this.am) {
        value += 12
      }

      this.model = new Date(new Date(this.model).setHours(value))
    },
    setMinute (value) {
      if (!this.editable) {
        return
      }

      this.model = new Date(new Date(this.model).setMinutes(this.__parseTypeValue('minute', value)))
    },

    setView (view) {
      const newView = this.__calcView(view)
      if (this.view !== newView) {
        this.view = newView
      }
    },

    /* helpers */
    __calcView (view) {
      switch (this.type) {
        case 'time':
          return ['hour', 'minute'].includes(view) ? view : 'hour'
        case 'date':
          return ['year', 'month', 'day'].includes(view) ? view : 'day'
        default:
          return ['year', 'month', 'day', 'hour', 'minute'].includes(view) ? view : 'day'
      }
    },
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __scrollView (delayed) {
      if (this.view !== 'year' && this.view !== 'month') {
        return
      }

      if (delayed) {
        setTimeout(() => { this.__scrollView() }, 200) // wait to settle and recenter
      }

      const
        el = this.$refs.selector,
        itemInactive = el.querySelector('.q-btn:not(.active)'),
        itemActive = el.querySelector('.q-btn.active'),
        viewHeight = el ? el.offsetHeight : 0

      this.$nextTick(() => {
        const rowsAbove = this.view === 'year' ? this.year - this.yearInterval.min : this.month - this.monthMin - 1

        if (viewHeight && itemActive) {
          el.scrollTop = rowsAbove * (itemInactive ? itemInactive.offsetHeight : 0) + (itemActive.offsetHeight - viewHeight) / 2
        }
      })
    },
    __dragStart (ev, value) {
      stopAndPrevent(ev)

      const
        clock = this.$refs.clock,
        clockOffset = offset(clock)

      this.centerClockPos = {
        top: clockOffset.top + height(clock) / 2,
        left: clockOffset.left + width(clock) / 2
      }

      this.dragging = true
      this.__updateClock(ev, value)
    },
    __dragMove (ev) {
      if (!this.dragging) {
        return
      }
      stopAndPrevent(ev)
      this.__updateClock(ev)
    },
    __dragStop (ev, value) {
      stopAndPrevent(ev)
      this.dragging = false
      if (ev !== void 0) {
        this.__updateClock(ev, value)
      }
      if (this.view === 'minute') {
        this.$emit('canClose')
        if (this.minimal) {
          this.setView(this.defaultView)
        }
      }
      else {
        this.view = 'minute'
      }
    },
    __updateClock (ev, value) {
      if (value !== void 0) {
        return this[this.view === 'hour' ? 'setHour' : 'setMinute'](value)
      }
      let
        pos = position(ev),
        height = Math.abs(pos.top - this.centerClockPos.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - this.centerClockPos.top), 2) +
          Math.pow(Math.abs(pos.left - this.centerClockPos.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < this.centerClockPos.top) {
        angle = this.centerClockPos.left < pos.left ? 90 - angle : 270 + angle
      }
      else {
        angle = this.centerClockPos.left < pos.left ? angle + 90 : 270 - angle
      }

      if (this.view === 'hour') {
        let hour = Math.round(angle / 30)
        if (this.computedFormat24h) {
          if (!hour) {
            hour = distance < 85 ? 0 : 12
          }
          else if (distance < 85) {
            hour += 12
          }
        }
        this.setHour(hour)
      }
      else {
        this.setMinute(Math.round(angle / 6))
      }
    },
    __repeatTimeout (count) {
      return Math.max(100, 300 - count * count * 10)
    },

    __getTopSection (h) {
      const child = [
        this.typeHasDate
          ? h('div', { staticClass: 'q-datetime-weekdaystring' }, [this.weekDayString])
          : void 0,
        h('div', { staticClass: 'col' })
      ]

      if (this.typeHasDate) {
        const content = [
          h('div', { staticClass: 'q-datetime-datestring row justify-center items-end' }, [
            h('span', {
              staticClass: 'q-datetime-link small col-auto col-md-12',
              'class': {active: this.view === 'month'},
              attrs: { tabindex: 0 },
              on: {
                keydown: e => {
                  const key = getEventKey(e)
                  if (key === 38 || key === 39) { // up, right
                    stopAndPrevent(e)
                    this.setMonth(this.month - 1, true)
                  }
                  else if (key === 40 || key === 37) { // down, left
                    stopAndPrevent(e)
                    this.setMonth(this.month + 1, true)
                  }
                  else if (key === 13 || key === 20) { // enter, space
                    this.view = 'month'
                  }
                }
              }
            }, [
              h('span', {
                attrs: { tabindex: -1 },
                on: this.disable ? {} : {
                  click: () => { this.view = 'month' }
                }
              }, [ this.monthString ])
            ]),

            h('span', {
              staticClass: 'q-datetime-link col-auto col-md-12',
              'class': {active: this.view === 'day'},
              attrs: { tabindex: 0 },
              on: {
                keydown: e => {
                  const key = getEventKey(e)
                  if (key === 37 || key === 38) { // left, up
                    stopAndPrevent(e)
                    this.setDay(this.day - (key === 37 ? 1 : 7), true)
                  }
                  else if (key === 39 || key === 40) { // right, down
                    stopAndPrevent(e)
                    this.setDay(this.day + (key === 39 ? 1 : 7), true)
                  }
                  else if (key === 13 || key === 20) { // enter, space
                    this.view = 'day'
                  }
                }
              }
            }, [
              h('span', {
                attrs: { tabindex: -1 },
                on: this.disable ? {} : {
                  click: () => { this.view = 'day' }
                }
              }, [ this.day ])
            ]),

            h('span', {
              staticClass: 'q-datetime-link small col-auto col-md-12',
              'class': {active: this.view === 'year'},
              attrs: { tabindex: 0 },
              on: {
                keydown: e => {
                  const key = getEventKey(e)
                  if (key === 38 || key === 39) { // up, right
                    stopAndPrevent(e)
                    this.setYear(this.year - 1, true)
                  }
                  else if (key === 40 || key === 37) { // down, left
                    stopAndPrevent(e)
                    this.setYear(this.year + 1, true)
                  }
                  else if (key === 13 || key === 20) { // enter, space
                    this.view = 'year'
                  }
                }
              }
            }, [
              h('span', {
                attrs: { tabindex: -1 },
                on: this.disable ? {} : {
                  click: () => { this.view = 'year' }
                }
              }, [ this.year ])
            ])
          ])
        ]

        child.push(h('div', content))
      }

      if (this.typeHasTime) {
        const ampm = (!this.computedFormat24h && h('span', {
          staticClass: 'q-datetime-ampm column',
          attrs: { tabindex: 0 },
          on: this.__amPmEvents
        }, [
          h('span', {
            staticClass: 'q-datetime-link',
            'class': { active: this.am }
          }, [
            h('span', {
              attrs: { tabindex: -1 },
              on: { click: this.toggleAmPm }
            }, [ 'AM' ])
          ]),

          h('span', {
            staticClass: 'q-datetime-link',
            'class': { active: !this.am }
          }, [
            h('span', {
              attrs: { tabindex: -1 },
              on: { click: this.toggleAmPm }
            }, [ 'PM' ])
          ])
        ]))
        const content = [
          h('span', {
            staticClass: 'col',
            style: { textAlign: 'right' }
          }, [
            h('span', {
              staticClass: 'q-datetime-link',
              style: { textAlign: 'right' },
              'class': {active: this.view === 'hour'},
              attrs: { tabindex: 0 },
              on: {
                keydown: e => {
                  const key = getEventKey(e)
                  if (key === 40 || key === 37) { // down, left
                    stopAndPrevent(e)
                    this.setHour(this.hour - 1, true)
                  }
                  else if (key === 38 || key === 39) { // up, right
                    stopAndPrevent(e)
                    this.setHour(this.hour + 1, true)
                  }
                  else if (key === 13 || key === 20) { // enter, space
                    this.view = 'hour'
                  }
                }
              }
            }, [
              h('span', {
                attrs: { tabindex: -1 },
                on: this.disable ? {} : {
                  click: () => { this.view = 'hour' }
                }
              }, [ this.computedFormat24h ? this.__pad(this.hour) : this.hour ])
            ])
          ]),

          h('span', { style: 'opacity:0.6;' }, [ ':' ]),

          h('span', {
            staticClass: 'col row no-wrap items-center',
            style: { textAlign: 'left' }
          }, [
            h('span', {
              staticClass: 'q-datetime-link',
              style: { textAlign: 'left' },
              'class': {active: this.view === 'minute'},
              attrs: { tabindex: 0 },
              on: {
                keydown: e => {
                  const key = getEventKey(e)
                  if (key === 40 || key === 37) { // down, left
                    stopAndPrevent(e)
                    this.setMinute(this.minute - 1, true)
                  }
                  else if (key === 38 || key === 39) { // up, right
                    stopAndPrevent(e)
                    this.setMinute(this.minute + 1, true)
                  }
                  else if (key === 13 || key === 20) { // enter, space
                    this.view = 'minute'
                  }
                }
              }
            }, [
              h('span', {
                attrs: { tabindex: -1 },
                on: this.disable ? {} : {
                  click: () => { this.view = 'minute' }
                }
              }, [ this.__pad(this.minute) ])
            ]),
            ampm
          ])
        ]

        child.push(h('div', {
          staticClass: 'q-datetime-time row scroll flex-center'
        }, [
          h('div', {
            staticClass: 'q-datetime-clockstring col row justify-center items-start'
          }, content)
        ]))
      }

      child.push(h('div', { staticClass: 'col' }))

      return h('div', {
        staticClass: 'q-datetime-header column no-wrap items-center'
      }, child)
    },

    __getYearView (h) {
      const content = [h('div', { staticClass: 'col-grow' })] // vertical align when there are limits

      for (let i = this.yearInterval.min; i <= this.yearInterval.max; i++) {
        content.push(h(QBtn, {
          staticClass: 'q-datetime-btn no-border-radius',
          'class': {active: i === this.year},
          attrs: { tabindex: -1 },
          props: {
            flat: true,
            disable: !this.editable
          },
          on: {
            click: () => {
              this.setYear(i)
            }
          }
        }, [ i ]))
      }
      content.push(h('div', { staticClass: 'col-grow' })) // vertical align when there are limits

      return h('div', {
        staticClass: `q-datetime-view-year fit column no-wrap`
      }, content)
    },

    __getMonthView (h) {
      const content = [h('div', { staticClass: 'col-grow' })] // vertical align when there are limits

      for (let i = this.monthInterval.min; i <= this.monthInterval.max; i++) {
        content.push(h(QBtn, {
          staticClass: 'q-datetime-btn no-border-radius',
          'class': {active: i + 1 === this.month},
          attrs: { tabindex: -1 },
          props: {
            flat: true,
            disable: !this.editable
          },
          on: {
            click: () => {
              this.setMonth(i + 1)
            }
          }
        }, [ this.$q.i18n.date.months[i] ]))
      }
      content.push(h('div', { staticClass: 'col-grow' })) // vertical align when there are limits

      return h('div', {
        staticClass: `q-datetime-view-month fit column no-wrap`
      }, content)
    },

    __getDayView (h) {
      const
        days = [],
        day = this.fakeMonth === this.month && this.fakeYear === this.year ? this.day : -1

      for (let i = 1; i <= this.fillerDays; i++) {
        days.push(h('div', {
          staticClass: 'q-datetime-fillerday'
        }))
      }

      if (this.min) {
        for (let i = 1; i <= this.beforeMinDays; i++) {
          days.push(h('div', {
            staticClass: 'row items-center content-center justify-center disabled',
            'class': {
              'q-datetime-day-active': this.isValid && i === day
            }
          }, [
            h('span', [i])
          ]))
        }
      }

      const { min, max } = this.dateInterval
      for (let i = min; i <= max; i++) {
        days.push(h('div', {
          staticClass: 'row items-center content-center justify-center cursor-pointer',
          'class': [this.color && i === day ? `text-${this.color}` : null, {
            'q-datetime-day-active': this.isValid && i === day,
            'q-datetime-day-today': i === this.today,
            'disabled': !this.editable
          }],
          on: {
            click: () => { this.setDay(i, false, this.fakeYear, this.fakeMonth) }
          }
        }, [
          h('span', [ i ])
        ]))
      }

      if (this.max) {
        for (let i = 1; i <= this.afterMaxDays; i++) {
          days.push(h('div', {
            staticClass: 'row items-center content-center justify-center disabled',
            'class': {
              'q-datetime-day-active': this.isValid && i + this.maxDay === day
            }
          }, [
            h('span', [(i + this.maxDay)])
          ]))
        }
      }

      return h('div', { staticClass: 'q-datetime-view-day' }, [
        h('div', { staticClass: 'row items-center content-center' }, [
          h(QBtn, {
            staticClass: 'q-datetime-arrow',
            attrs: { tabindex: -1 },
            props: {
              round: true,
              dense: true,
              flat: true,
              icon: this.dateArrow[0],
              repeatTimeout: this.__repeatTimeout,
              disable: this.beforeMinDays > 0 || this.disable || this.readonly
            },
            on: {
              click: () => { this.moveFakeMonth(-1) }
            }
          }),

          h('div', { staticClass: 'col q-datetime-month-stamp' }, [
            this.monthStamp
          ]),

          h(QBtn, {
            staticClass: 'q-datetime-arrow',
            attrs: { tabindex: -1 },
            props: {
              round: true,
              dense: true,
              flat: true,
              icon: this.dateArrow[1],
              repeatTimeout: this.__repeatTimeout,
              disable: this.afterMaxDays > 0 || this.disable || this.readonly
            },
            on: {
              click: () => { this.moveFakeMonth(1) }
            }
          })
        ]),

        h('div', {
          staticClass: 'q-datetime-weekdays row no-wrap items-center justify-start'
        }, this.headerDayNames.map(day => h('div', [ day ]))),

        h('div', {
          staticClass: 'q-datetime-days row wrap items-center justify-start content-center'
        }, days)
      ])
    },

    __getClockView (h) {
      let content = []

      if (this.view === 'hour') {
        let init, max, cls = ''
        if (this.computedFormat24h) {
          init = 0
          max = 24
          cls = ' fmt24'
        }
        else {
          init = 1
          max = 13
        }
        for (let i = init; i < max; i++) {
          content.push(h('div', {
            staticClass: `q-datetime-clock-position${cls}`,
            'class': [`q-datetime-clock-pos-${i}`, i === this.hour ? 'active' : ''],
            on: {
              '!mousedown': ev => this.__dragStart(ev, i),
              '!mouseup': ev => this.__dragStop(ev, i)
            }
          }, [ h('span', [ i || '00' ]) ]))
        }
      }
      else {
        for (let i = 0; i < 12; i++) {
          const five = i * 5
          content.push(h('div', {
            staticClass: 'q-datetime-clock-position',
            'class': [`q-datetime-clock-pos-${i}`, five === this.minute ? 'active' : '']
          }, [
            h('span', [ five ])
          ]))
        }
      }

      return h('div', {
        ref: 'clock',
        key: 'clock' + this.view,
        staticClass: 'column items-center content-center justify-center'
      }, [
        h('div', {
          staticClass: 'q-datetime-clock cursor-pointer',
          on: {
            mousedown: this.__dragStart,
            mousemove: this.__dragMove,
            mouseup: this.__dragStop,
            touchstart: this.__dragStart,
            touchmove: this.__dragMove,
            touchend: this.__dragStop
          }
        }, [
          h('div', { staticClass: 'q-datetime-clock-circle full-width full-height' }, [
            h('div', { staticClass: 'q-datetime-clock-center' }),
            h('div', {
              staticClass: 'q-datetime-clock-pointer',
              style: this.clockPointerStyle
            }, [ h('span') ]),
            content
          ])
        ])
      ])
    },

    __getViewSection (h) {
      switch (this.view) {
        case 'year':
          return this.__getYearView(h)
        case 'month':
          return this.__getMonthView(h)
        case 'day':
          return this.__getDayView(h)
        case 'hour':
        case 'minute':
          return this.__getClockView(h)
      }
    }
  },
  created () {
    this.__amPmEvents = {
      keydown: e => {
        const key = getEventKey(e)
        if ([13, 32, 37, 38, 39, 40].includes(key)) { // enter, space, arrows
          stopAndPrevent(e)
          this.toggleAmPm()
        }
      }
    }
  },
  mounted () {
    this.__scrollView(true)
  },

  render (h) {
    if (!this.canRender) { return }

    return h('div', {
      staticClass: 'q-datetime row',
      'class': this.classes
    }, [
      (!this.minimal && this.__getTopSection(h)) || void 0,

      h('div', {
        staticClass: 'q-datetime-content scroll'
      }, [
        h('div', {
          ref: 'selector',
          staticClass: 'q-datetime-selector row items-center'
        }, [
          h('div', { 'class': 'col' }),
          this.__getViewSection(h),
          h('div', { 'class': 'col' })
        ])
      ].concat(this.$slots.default))
    ])
  }
}
