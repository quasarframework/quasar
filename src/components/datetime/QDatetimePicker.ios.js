import { between, capitalize } from '../../utils/format.js'
import { position, stopAndPrevent } from '../../utils/event.js'
import { css } from '../../utils/dom.js'
import { isSameDate, adjustDate } from '../../utils/date.js'
import DateMixin from './datetime-mixin.js'
import ParentFieldMixin from '../../mixins/parent-field.js'
import TouchPan from '../../directives/touch-pan.js'
import CanRenderMixin from '../../mixins/can-render.js'

export default {
  name: 'QDatetimePicker',
  mixins: [DateMixin, ParentFieldMixin, CanRenderMixin],
  directives: {
    TouchPan
  },
  props: {
    defaultValue: [String, Number, Date],
    disable: Boolean,
    readonly: Boolean
  },
  data () {
    return {
      monthDragOffset: 0,
      dateDragOffset: 0,
      yearDragOffset: 0,
      hourDragOffset: 0,
      minuteDragOffset: 0,
      dragging: false
    }
  },
  watch: {
    model () {
      this.$nextTick(this.__updateAllPositions)
    }
  },
  computed: {
    classes () {
      const cls = ['type-' + this.type]
      this.disable && cls.push('disabled')
      this.readonly && cls.push('readonly')
      this.dark && cls.push('q-datetime-dark')
      this.minimal && cls.push('q-datetime-minimal')
      return cls
    },
    dateInterval () {
      return {
        min: this.pmin !== null && isSameDate(this.pmin, this.model, 'month')
          ? this.pmin.getDate()
          : 1,
        max: this.pmax !== null && isSameDate(this.pmax, this.model, 'month')
          ? this.pmax.getDate()
          : this.daysInMonth
      }
    },

    hour () {
      return this.model.getHours()
    },
    hourInterval () {
      return {
        min: this.pmin && isSameDate(this.pmin, this.model, 'day') ? this.pmin.getHours() : 0,
        max: this.pmax && isSameDate(this.pmax, this.model, 'day') ? this.pmax.getHours() : 23
      }
    },

    minuteInterval () {
      return {
        min: this.pmin && isSameDate(this.pmin, this.model, 'hour') ? this.pmin.getMinutes() : 0,
        max: this.pmax && isSameDate(this.pmax, this.model, 'hour') ? this.pmax.getMinutes() : 59
      }
    },

    __monthStyle () {
      return this.__colStyle(82 - (this.month - 1 + this.monthDragOffset) * 36)
    },
    __dayStyle () {
      return this.__colStyle(82 - (this.day + this.dateDragOffset) * 36)
    },
    __yearStyle () {
      return this.__colStyle(82 - (this.year + this.yearDragOffset) * 36)
    },
    __hourStyle () {
      return this.__colStyle(82 - (this.hour + this.hourDragOffset) * 36)
    },
    __minuteStyle () {
      return this.__colStyle(82 - (this.minute + this.minuteDragOffset) * 36)
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (this.editable) {
        this.model = new Date(this.model.setFullYear(this.__parseTypeValue('year', value)))
      }
    },
    setMonth (value) {
      if (this.editable) {
        this.model = adjustDate(this.model, {month: value})
      }
    },
    setDay (value) {
      if (this.editable) {
        this.model = new Date(this.model.setDate(this.__parseTypeValue('date', value)))
      }
    },

    /* time */
    setHour (value) {
      if (this.editable) {
        this.model = new Date(this.model.setHours(this.__parseTypeValue('hour', value)))
      }
    },
    setMinute (value) {
      if (this.editable) {
        this.model = new Date(this.model.setMinutes(this.__parseTypeValue('minute', value)))
      }
    },

    setView () {},

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __scrollView () {},
    __updateAllPositions () {
      this.$nextTick(() => {
        if (this.typeHasDate) {
          this.__updatePositions('month', this.model.getMonth())
          this.__updatePositions('date', this.model.getDate())
          this.__updatePositions('year', this.model.getFullYear())
        }
        if (this.typeHasTime) {
          this.__updatePositions('hour', this.model.getHours())
          this.__updatePositions('minute', this.model.getMinutes())
        }
      })
    },
    __updatePositions (type, value) {
      let root = this.$refs[type]
      if (!root) {
        return
      }

      let delta = this[type + 'Interval'].min - value
      ;[].slice.call(root.children).forEach(item => {
        css(item, this.__itemStyle(value * 36, between(delta * -18, -180, 180)))
        delta++
      })
    },
    __colStyle (value) {
      return {
        '-webkit-transform': 'translate3d(0,' + value + 'px,0)',
        '-ms-transform': 'translate3d(0,' + value + 'px,0)',
        'transform': 'translate3d(0,' + value + 'px,0)'
      }
    },
    __itemStyle (translation, rotation) {
      return {
        '-webkit-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        '-ms-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        'transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)'
      }
    },

    /* common */
    __dragMonth (e) {
      this.__drag(e, 'month')
    },
    __dragDate (e) {
      this.__drag(e, 'date')
    },
    __dragYear (e) {
      this.__drag(e, 'year')
    },
    __dragHour (e) {
      this.__drag(e, 'hour')
    },
    __dragMinute (e) {
      this.__drag(e, 'minute')
    },
    __drag (e, type) {
      const method = e.isFirst
        ? '__dragStart' : (e.isFinal ? '__dragStop' : '__dragMove')

      this[method](e.evt, type)
    },
    __dragStart (ev, type) {
      if (!this.editable) {
        return
      }

      this[type + 'DragOffset'] = 0
      this.dragging = type
      this.__actualType = type === 'date' ? 'day' : type
      this.__typeOffset = type === 'month' ? -1 : 0
      this.__dragPosition = position(ev).top
    },
    __dragMove (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }

      const offset = (this.__dragPosition - position(ev).top) / 36
      this[type + 'DragOffset'] = offset
      this.__updatePositions(type, this[this.__actualType] + offset + this.__typeOffset)
    },
    __dragStop (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      this.dragging = false

      let
        offset = Math.round(this[type + 'DragOffset']),
        newValue = this.__parseTypeValue(type, this[this.__actualType] + offset)

      if (newValue !== this[this.__actualType]) {
        this[`set${capitalize(this.__actualType)}`](newValue)
      }
      else {
        this.__updatePositions(type, this[this.__actualType] + this.__typeOffset)
      }
      this.$nextTick(() => {
        this[type + 'DragOffset'] = 0
      })
    },

    __getInterval (h, { min, max }, fn) {
      const child = []
      for (let i = min; i <= max; i++) {
        child.push(fn(i))
      }
      return child
    },

    __getSection (h, name, ref, value, style, interval, iterator) {
      return h('div', {
        staticClass: `q-datetime-col q-datetime-col-${name}`,
        directives: [{
          name: 'touch-pan',
          modifiers: { vertical: true },
          value
        }]
      }, [
        h('div', {
          ref,
          staticClass: 'q-datetime-col-wrapper',
          style
        }, this.__getInterval(h, interval, iterator))
      ])
    },

    __getDateSection (h) {
      return [
        this.__getSection(
          h,
          'month',
          'month',
          this.__dragMonth,
          this.__monthStyle,
          this.monthInterval,
          i => {
            return h('div', {
              key: `mi${i}`,
              staticClass: 'q-datetime-item'
            }, [ this.$q.i18n.date.months[i] ])
          }
        ),
        this.__getSection(
          h,
          'day',
          'date',
          this.__dragDate,
          this.__dayStyle,
          this.dateInterval,
          i => {
            return h('div', {
              key: `di${i}`,
              staticClass: 'q-datetime-item'
            }, [ i ])
          }
        ),
        this.__getSection(
          h,
          'year',
          'year',
          this.__dragYear,
          this.__yearStyle,
          this.yearInterval,
          i => {
            return h('div', {
              key: `yi${i}`,
              staticClass: 'q-datetime-item'
            }, [ i ])
          }
        )
      ]
    },

    __getTimeSection (h) {
      return [
        this.__getSection(
          h,
          'hour',
          'hour',
          this.__dragHour,
          this.__hourStyle,
          this.hourInterval,
          i => {
            return h('div', {
              key: `hi${i}`,
              staticClass: 'q-datetime-item'
            }, [ i ])
          }
        ),
        this.__getSection(
          h,
          'minute',
          'minute',
          this.__dragMinute,
          this.__minuteStyle,
          this.minuteInterval,
          i => {
            return h('div', {
              key: `ni${i}`,
              staticClass: 'q-datetime-item'
            }, [ this.__pad(i) ])
          }
        )
      ]
    }
  },
  mounted () {
    this.$nextTick(this.__updateAllPositions)
  },

  render (h) {
    if (!this.canRender) { return }

    return h('div', {
      staticClass: 'q-datetime',
      'class': this.classes
    },
    [].concat(this.$slots.default).concat([
      h('div', { staticClass: 'q-datetime-content non-selectable' }, [
        h('div', {
          staticClass: 'q-datetime-inner full-height flex justify-center',
          on: { touchstart: stopAndPrevent }
        }, [
          (this.typeHasDate && this.__getDateSection(h)) || void 0,
          (this.typeHasTime && this.__getTimeSection(h)) || void 0
        ]),

        h('div', { staticClass: 'q-datetime-mask' }),
        h('div', { staticClass: 'q-datetime-highlight' })
      ])
    ]))
  }
}
