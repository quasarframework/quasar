import { height, width, offset, cssTransform } from '../../utils/dom.js'
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

      __amPmEvents: {
        keyup: e => {
          const key = getEventKey(e)
          if (key === 13 || key === 32) { // enter, space
            stopAndPrevent(e)
            this.toggleAmPm()
          }
        }
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
      this.__scrollView()
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
    contentClasses () {
      if (!this.minimal) {
        return 'col-md-8'
      }
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

    monthString () {
      return `${this.$q.i18n.date.monthsShort[this.month - 1]}`
    },
    monthStamp () {
      return `${this.$q.i18n.date.months[this.month - 1]} ${this.year}`
    },
    weekDayString () {
      return this.$q.i18n.date.days[this.model.getDay()]
    },

    fillerDays () {
      let days = (new Date(this.model.getFullYear(), this.model.getMonth(), 1).getDay() - this.computedFirstDayOfWeek)
      if (days < 0) {
        days += 7
      }
      return days
    },
    beforeMinDays () {
      if (this.pmin === null || !isSameDate(this.pmin, this.model, 'month')) {
        return false
      }
      return this.pmin.getDate() - 1
    },
    afterMaxDays () {
      if (this.pmax === null || !isSameDate(this.pmax, this.model, 'month')) {
        return false
      }
      return this.daysInMonth - this.maxDay
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
        divider = this.view === 'minute' ? 60 : (this.computedFormat24h ? 24 : 12),
        degrees = Math.round((this.view === 'minute' ? this.minute : this.hour) * (360 / divider)) - 180

      return cssTransform(`rotate(${degrees}deg)`)
    },
    isValid () {
      return isValid(this.value)
    },
    today () {
      const today = new Date()
      return isSameDate(today, this.model, 'month')
        ? today.getDate()
        : -1
    }
  },
  methods: {
    /* date */
    setYear (value, skipView) {
      if (this.editable) {
        if (!skipView) {
          this.view = 'day'
        }
        this.model = new Date(this.model.setFullYear(this.__parseTypeValue('year', value)))
      }
    },
    setMonth (value, skipView) {
      if (this.editable) {
        if (!skipView) {
          this.view = 'day'
        }
        this.model = adjustDate(this.model, {month: value})
      }
    },
    setDay (value, skipView) {
      if (this.editable) {
        this.model = new Date(this.model.setDate(this.__parseTypeValue('date', value)))
        if (!skipView && this.type === 'date') {
          this.$emit('canClose')
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

      this.model = new Date(this.model.setHours(value))
    },
    setMinute (value) {
      if (!this.editable) {
        return
      }

      this.model = new Date(this.model.setMinutes(this.__parseTypeValue('minute', value)))
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
          return view
            ? (['hour', 'minute'].includes(view) ? view : 'hour')
            : 'hour'
        case 'date':
          return view
            ? (['year', 'month', 'day'].includes(view) ? view : 'day')
            : 'day'
        default:
          return view
            ? (['year', 'month', 'day', 'hour', 'minute'].includes(view) ? view : 'day')
            : 'day'
      }
    },
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __scrollView () {
      if (this.view !== 'year' && this.view !== 'month') {
        return
      }

      const
        el = this.$refs.selector,
        rows = this.view === 'year' ? this.year - this.yearInterval.min + 1 : this.month - this.monthMin

      this.$nextTick(() => {
        if (el) {
          el.scrollTop = rows * height(el.children[0].children[0]) - height(el) / 2.5
        }
      })
    },
    __dragStart (ev) {
      stopAndPrevent(ev)

      const
        clock = this.$refs.clock,
        clockOffset = offset(clock)

      this.centerClockPos = {
        top: clockOffset.top + height(clock) / 2,
        left: clockOffset.left + width(clock) / 2
      }

      this.dragging = true
      this.__updateClock(ev)
    },
    __dragMove (ev) {
      if (!this.dragging) {
        return
      }
      stopAndPrevent(ev)
      this.__updateClock(ev)
    },
    __dragStop (ev) {
      stopAndPrevent(ev)
      this.dragging = false
      if (this.view === 'minute') {
        this.$emit('canClose')
      }
      else {
        this.view = 'minute'
      }
    },
    __updateClock (ev) {
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
        this.setHour(Math.round(angle / (this.computedFormat24h ? 15 : 30)))
      }
      else {
        this.setMinute(Math.round(angle / 6))
      }
    },
    __repeatTimeout (count) {
      return Math.max(100, 300 - count * count * 10)
    },

    __getTopSection (h) {
      const child = []

      if (this.typeHasDate) {
        const content = [
          h('div', { staticClass: 'q-datetime-weekdaystring col-12' }, [
            this.weekDayString
          ]),

          h('div', { staticClass: 'q-datetime-datestring row flex-center' }, [
            h('span', {
              staticClass: 'q-datetime-link small col-auto col-md-12',
              'class': {active: this.view === 'month'},
              attrs: { tabindex: 0 },
              on: {
                keydown: e => {
                  const key = getEventKey(e)
                  if (key === 40 || key === 37) { // down, left
                    stopAndPrevent(e)
                    this.setMonth(this.month - 1, true)
                  }
                  else if (key === 38 || key === 39) { // up, right
                    stopAndPrevent(e)
                    this.setMonth(this.month + 1, true)
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
                  if (key === 40 || key === 37) { // down, left
                    stopAndPrevent(e)
                    this.setYear(this.year - 1, true)
                  }
                  else if (key === 38 || key === 39) { // up, right
                    stopAndPrevent(e)
                    this.setYear(this.year + 1, true)
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
        const content = [
          h('span', {
            staticClass: 'q-datetime-link col-md text-right q-pr-sm',
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
              }
            }
          }, [
            h('span', {
              attrs: { tabindex: -1 },
              on: this.disable ? {} : {
                click: () => { this.view = 'hour' }
              }
            }, [ this.hour ])
          ]),

          h('span', { style: 'opacity:0.6;' }, [ ':' ]),

          h('span', {
            staticClass: 'q-datetime-link col-md text-left q-pl-sm',
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
                  this.setHour(this.minute + 1, true)
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
          ])
        ]

        child.push(h('div', {
          staticClass: 'q-datetime-time row flex-center'
        }, [
          h('div', {
            staticClass: 'q-datetime-clockstring col-auto col-md-12 row no-wrap flex-center'
          }, content),

          (!this.computedFormat24h && h('div', {
            staticClass: 'q-datetime-ampm column col-auto col-md-12 justify-around'
          }, [
            h('div', {
              staticClass: 'q-datetime-link',
              'class': { active: this.am },
              attrs: { tabindex: 0 },
              on: this.__amPmEvents
            }, [
              h('span', {
                attrs: { tabindex: -1 },
                on: { click: this.toggleAmPm }
              }, [ 'AM' ])
            ]),

            h('div', {
              staticClass: 'q-datetime-link',
              'class': { active: !this.am },
              attrs: { tabindex: 0 },
              on: this.__amPmEvents
            }, [
              h('span', {
                attrs: { tabindex: -1 },
                on: { click: this.toggleAmPm }
              }, [ 'PM' ])
            ])
          ]))
        ]))
      }

      return h('div', {
        staticClass: 'q-datetime-header column col-xs-12 col-md-4 justify-center'
      }, child)
    },

    __getYearView (h) {
      const content = []

      for (let i = this.yearInterval.min; i <= this.yearInterval.max; i++) {
        content.push(h(QBtn, {
          key: `yi${i}`,
          staticClass: 'q-datetime-btn full-width',
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

      return h('div', {
        staticClass: `q-datetime-view-year full-width full-height`
      }, content)
    },

    __getMonthView (h) {
      const content = []

      for (let i = this.monthInterval.min; i <= this.monthInterval.max; i++) {
        content.push(h(QBtn, {
          key: `mi${i}`,
          staticClass: 'q-datetime-btn full-width',
          'class': {active: i + 1 === this.month},
          attrs: { tabindex: -1 },
          props: {
            flat: true,
            disable: !this.editable
          },
          on: {
            click: () => {
              this.setMonth(i + 1, true)
            }
          }
        }, [ this.$q.i18n.date.months[i] ]))
      }

      return h('div', {
        staticClass: `q-datetime-view-month full-width full-height`
      }, content)
    },

    __getDayView (h) {
      const days = []

      for (let i = 1; i <= this.fillerDays; i++) {
        days.push(h('div', {
          key: `fd${i}`,
          staticClass: 'q-datetime-fillerday'
        }))
      }

      if (this.min) {
        for (let i = 1; i <= this.beforeMinDays; i++) {
          days.push(h('div', {
            key: `fb${i}`,
            staticClass: 'row items-center content-center justify-center disabled'
          }, [ i ]))
        }
      }

      const { min, max } = this.dateInterval
      for (let i = min; i <= max; i++) {
        days.push(h('div', {
          key: `md${i}`,
          staticClass: 'row items-center content-center justify-center cursor-pointer',
          'class': [this.color && i === this.day ? `text-${this.color}` : null, {
            'q-datetime-day-active': this.isValid && i === this.day,
            'q-datetime-day-today': i === this.today,
            'disabled': !this.editable
          }],
          on: {
            click: () => { this.setDay(i) }
          }
        }, [
          h('span', [ i ])
        ]))
      }

      if (this.max) {
        for (let i = 1; i <= this.afterMaxDays; i++) {
          days.push(h('div', {
            key: `fa${i}`,
            staticClass: 'row items-center content-center justify-center disabled'
          }, [ (i + this.maxDay) ]))
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
              click: () => { this.setMonth(this.month - 1) }
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
              click: () => { this.setMonth(this.month + 1) }
            }
          })
        ]),

        h('div', {
          staticClass: 'q-datetime-weekdays row items-center justify-start'
        }, this.headerDayNames.map(day => h('div', { key: `dh${day}` }, [ day ]))),

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
            key: `hi${i}`,
            staticClass: `q-datetime-clock-position${cls}`,
            'class': [`q-datetime-clock-pos-${i}`, i === this.hour ? 'active' : '']
          }, [ h('span', [ i ]) ]))
        }
      }
      else {
        for (let i = 0; i < 12; i++) {
          const five = i * 5
          content.push(h('div', {
            key: `mi${i}`,
            staticClass: 'q-datetime-clock-position',
            'class': ['q-datetime-clock-pos-' + i, five === this.minute ? 'active' : '']
          }, [
            h('span', [ five ])
          ]))
        }
      }

      return h('div', {
        ref: 'clock',
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
  mounted () {
    this.$nextTick(() => {
      this.__scrollView()
    })
  },

  render (h) {
    if (!this.canRender) { return }

    return h('div', {
      staticClass: 'q-datetime row',
      'class': this.classes
    }, [
      (!this.minimal && this.__getTopSection(h)) || void 0,

      h('div', {
        staticClass: 'q-datetime-content col-xs-12 column',
        'class': this.contentClasses
      }, [
        h('div', {
          ref: 'selector',
          staticClass: 'q-datetime-selector auto row flex-center'
        }, [
          this.__getViewSection(h)
        ])
      ].concat(this.$slots.default))
    ])
  }
}
