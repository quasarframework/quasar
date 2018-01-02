<template>
  <div class="q-datetime" :class="['type-' + type, disable ? 'disabled' : '', readonly ? 'readonly' : '']">
    <slot></slot>
    <div class="q-datetime-content non-selectable">
      <div class="q-datetime-inner full-height flex justify-center" @touchstart.stop.prevent :style="__localeViewStyle.qDatetimeInner">
        <template v-if="typeHasDate">
          <div
            class="q-datetime-col q-datetime-col-month"
            v-touch-pan.vertical="__dragMonth"
            :style="__localeViewStyle.month"
          >
            <div ref="month" class="q-datetime-col-wrapper" :style="__monthStyle">
              <div
                v-for="index in monthInterval"
                :key="`mi${index}`"
                class="q-datetime-item"
              >
                {{ $q.i18n.date.months[index + monthMin - 1] }}
              </div>
            </div>
          </div>

          <div
            class="q-datetime-col q-datetime-col-day"
            v-touch-pan.vertical="__dragDate"
            :style="__localeViewStyle.date"
          >
            <div ref="date" class="q-datetime-col-wrapper" :style="__dayStyle">
              <div
                v-for="index in daysInterval"
                :key="`di${index}`"
                class="q-datetime-item"
              >
                {{ index + dayMin - 1 }}
              </div>
            </div>
          </div>

          <div
            class="q-datetime-col q-datetime-col-year"
            v-touch-pan.vertical="__dragYear"
            :style="__localeViewStyle.year"
          >
            <div ref="year" class="q-datetime-col-wrapper" :style="__yearStyle">
              <div
                v-for="n in yearInterval"
                :key="`yi${n}`"
                class="q-datetime-item"
              >
                {{ n + yearMin }}
              </div>
            </div>
          </div>
        </template>

        <template v-if="typeHasTime">
          <div
            class="q-datetime-col q-datetime-col-hour"
            v-touch-pan.vertical="__dragHour"
            :style="__localeViewStyle.hour"
          >
            <div ref="hour" class="q-datetime-col-wrapper" :style="__hourStyle">
              <div
                v-for="n in hourInterval"
                :key="`hi${n}`"
                class="q-datetime-item"
              >
                {{ n + hourMin - 1 }}
              </div>
            </div>
          </div>

          <div
            class="q-datetime-col q-datetime-col-minute"
            v-touch-pan.vertical="__dragMinute"
            :style="__localeViewStyle.minute"
          >
            <div ref="minute" class="q-datetime-col-wrapper" :style="__minuteStyle">
              <div
                v-for="n in minuteInterval"
                :key="`ni${n}`"
                class="q-datetime-item"
              >
                {{ __pad(n + minuteMin - 1) }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="q-datetime-mask"></div>
      <div class="q-datetime-highlight"></div>
    </div>
  </div>
</template>

<script>
import { between, capitalize } from '../../utils/format'
import { position, stopAndPrevent } from '../../utils/event'
import { css } from '../../utils/dom'
import { isSameDate, adjustDate, matchFormat } from '../../utils/date'
import DateMixin from './datetime-mixin'
import TouchPan from '../../directives/touch-pan'

export default {
  name: 'q-datetime-picker',
  mixins: [DateMixin],
  directives: {
    TouchPan
  },
  props: {
    defaultSelection: [String, Number, Date],
    disable: Boolean,
    readonly: Boolean,
    format: String
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
    dayMin () {
      return this.pmin !== null && isSameDate(this.pmin, this.model, 'month')
        ? this.pmin.getDate()
        : 1
    },
    dayMax () {
      return this.pmax !== null && isSameDate(this.pmax, this.model, 'month')
        ? this.pmax.getDate()
        : this.daysInMonth
    },
    daysInterval () {
      return this.dayMax - this.dayMin + 1
    },

    hour () {
      return this.model.getHours()
    },
    hourMin () {
      return this.pmin && isSameDate(this.pmin, this.model, 'day') ? this.pmin.getHours() : 0
    },
    hourInterval () {
      return (this.pmax && isSameDate(this.pmax, this.model, 'day') ? this.pmax.getHours() : 23) - this.hourMin + 1
    },

    minuteMin () {
      return this.pmin && isSameDate(this.pmin, this.model, 'hour') ? this.pmin.getMinutes() : 0
    },
    minuteInterval () {
      return (this.pmax && isSameDate(this.pmax, this.model, 'hour') ? this.pmax.getMinutes() : 59) - this.minuteMin + 1
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
    },
    __localeViewStyle () {
      let localeObj = {}
      let formatArray = matchFormat(this.format)
      return this.__itemOrder(formatArray, localeObj)
    }
  },
  methods: {
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

      let delta = -value
      if (type === 'year') {
        delta += this.yearMin + 1
      }
      else if (type === 'date') {
        delta += this.dayMin
      }
      else {
        delta += this[type + 'Min']
      }

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
    __itemOrder (formatArray, localeObj) {
      if (formatArray && formatArray.length > 0) {
        let yearOrder = 0, monthOrder = 0, dateOrder = 0, hourOrder = 0, minuteOrder = 0
        if (formatArray.indexOf('YYYY') !== -1) {
          yearOrder = formatArray.indexOf('YYYY')
        }
        else if (formatArray.indexOf('YY') !== -1) {
          yearOrder = formatArray.indexOf('YY')
        }
        if (formatArray.indexOf('MM') !== -1) {
          monthOrder = formatArray.indexOf('MM')
        }
        else if (formatArray.indexOf('M') !== -1) {
          monthOrder = formatArray.indexOf('M')
        }
        else if (formatArray.indexOf('MMM') !== -1) {
          monthOrder = formatArray.indexOf('YY')
        }
        else if (formatArray.indexOf('MMMM') !== -1) {
          monthOrder = formatArray.indexOf('MMMM')
        }
        if (formatArray.indexOf('DD') !== -1) {
          dateOrder = formatArray.indexOf('DD')
        }
        else if (formatArray.indexOf('D') !== -1) {
          dateOrder = formatArray.indexOf('YY')
        }
        else if (formatArray.indexOf('Do') !== -1) {
          dateOrder = formatArray.indexOf('Do')
        }
        if (formatArray.indexOf('HH') !== -1) {
          hourOrder = formatArray.indexOf('HH')
        }
        else if (formatArray.indexOf('H') !== -1) {
          hourOrder = formatArray.indexOf('H')
        }
        else if (formatArray.indexOf('h') !== -1) {
          hourOrder = formatArray.indexOf('h')
        }
        else if (formatArray.indexOf('hh') !== -1) {
          hourOrder = formatArray.indexOf('hh')
        }
        if (formatArray.indexOf('mm') !== -1) {
          minuteOrder = formatArray.indexOf('mm')
        }
        else if (formatArray.indexOf('m') !== -1) {
          minuteOrder = formatArray.indexOf('m')
        }
        localeObj = {
          qDatetimeInner: {
            'justify-content': 'space-around',
            'text-align': 'left'
          },
          year: {
            order: yearOrder
          },
          month: {
            order: monthOrder
          },
          date: {
            order: dateOrder
          },
          hour: {
            order: hourOrder
          },
          minute: {
            order: minuteOrder
          }
        }
      }
      return localeObj
    },

    /* common */
    __dragStart (ev, type) {
      if (!this.editable) {
        return
      }

      stopAndPrevent(ev)

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

      stopAndPrevent(ev)

      const offset = (this.__dragPosition - position(ev).top) / 36
      this[type + 'DragOffset'] = offset
      this.__updatePositions(type, this[this.__actualType] + offset + this.__typeOffset)
    },
    __dragStop (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      stopAndPrevent(ev)
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
    }
  },
  mounted () {
    this.$nextTick(this.__updateAllPositions)
  }
}
</script>
