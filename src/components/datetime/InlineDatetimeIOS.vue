<template>
  <div class="q-datetime" :class="['type-' + type, disable ? 'disabled' : '', readonly ? 'readonly' : '']">
    <slot></slot>
    <div class="q-datetime-content non-selectable">
      <div class="q-datetime-inner full-height flex justify-center">
        <template v-if="typeHasDate">
          <div
            class="q-datetime-col q-datetime-col-month"
            @touchstart="__dragStart($event, 'month')"
            @touchmove="__dragMove($event, 'month')"
            @touchend="__dragStop($event, 'month')"
          >
            <div ref="month" class="q-datetime-col-wrapper" :style="__monthStyle">
              <div
                v-for="index in monthInterval"
                class="q-datetime-item"
                @click="setMonth(index + monthMin)"
              >
                {{ monthsList[index + monthMin - 1] }}
              </div>
            </div>
          </div>

          <div
            class="q-datetime-col q-datetime-col-day"
            @touchstart="__dragStart($event, 'date')"
            @touchmove="__dragMove($event, 'date')"
            @touchend="__dragStop($event, 'date')"
          >
            <div ref="date" class="q-datetime-col-wrapper" :style="__dayStyle">
              <div
                v-for="index in daysInterval"
                class="q-datetime-item"
                @click="setDay(index + dayMin - 1)"
              >
                {{ index + dayMin - 1 }}
              </div>
            </div>
          </div>

          <div
            class="q-datetime-col q-datetime-col-year"
            @touchstart="__dragStart($event, 'year')"
            @touchmove="__dragMove($event, 'year')"
            @touchend="__dragStop($event, 'year')"
          >
            <div ref="year" class="q-datetime-col-wrapper" :style="__yearStyle">
              <div
                v-for="n in yearInterval"
                class="q-datetime-item"
                @click="setYear(n + yearMin)"
              >
                {{ n + yearMin }}
              </div>
            </div>
          </div>
        </template>

        <template v-if="typeHasTime">
          <div
            class="q-datetime-col q-datetime-col-hour"
            @touchstart="__dragStart($event, 'hour')"
            @touchmove="__dragMove($event, 'hour')"
            @touchend="__dragStop($event, 'hour')"
          >
            <div ref="hour" class="q-datetime-col-wrapper" :style="__hourStyle">
              <div
                v-for="n in hourInterval"
                class="q-datetime-item"
                @click="setHour(n + hourMin - 1)"
              >
                {{ n + hourMin - 1 }}
              </div>
            </div>
          </div>

          <div class="q-datetime-col-divider">
            <div class="q-datetime-col-wrapper full-height row items-center justify-center">
              <div>:</div>
            </div>
          </div>

          <div
            class="q-datetime-col q-datetime-col-minute"
            @touchstart="__dragStart($event, 'minute')"
            @touchmove="__dragMove($event, 'minute')"
            @touchend="__dragStop($event, 'minute')"
          >
            <div ref="minute" class="q-datetime-col-wrapper" :style="__minuteStyle">
              <div
                v-for="n in minuteInterval"
                class="q-datetime-item"
                @click="setMinute(n + minuteMin - 1)"
              >
                {{ __pad(n + minuteMin - 1) }}
              </div>
            </div>
          </div>
        </template>

        <div
          class="q-datetime-highlight row items-center justify-center"
          :class="{'q-datetime-no-selection': !value}"
        >
          <template v-if="!value && typeHasDate">
            <div class="q-datetime-col-month">-----</div>
            <div class="q-datetime-col-day">--</div>
            <div class="q-datetime-col-year">----</div>
          </template>
          <template v-if="!value && typeHasTime">
            <div class="q-datetime-col-hour">--</div>
            <div class="q-datetime-col-minute">--</div>
          </template>
        </div>
      </div>

      <div class="q-datetime-mask"></div>
    </div>
  </div>
</template>

<script>
import { moment } from '../../deps'
import { inline as props } from './datetime-props'
import { between } from '../../utils/format'
import { position } from '../../utils/event'
import { css } from '../../utils/dom'

export default {
  name: 'q-inline-datetime',
  props,
  data () {
    this.$nextTick(() => {
      this.date = this.__normalizeValue(this.date)
    })
    return {
      date: moment(this.value || undefined),
      monthDragOffset: 0,
      dateDragOffset: 0,
      yearDragOffset: 0,
      hourDragOffset: 0,
      minuteDragOffset: 0,
      monthsList: moment.months(),
      dragging: false
    }
  },
  watch: {
    model (value) {
      this.date = this.__normalizeValue(moment(value || undefined))
      this.__updateAllPositions()
    },
    min (value) {
      this.$nextTick(() => {
        this.__updateModel()
        this.__updateAllPositions()
      })
    },
    max (value) {
      this.$nextTick(() => {
        this.__updateModel()
        this.__updateAllPositions()
      })
    }
  },
  computed: {
    model: {
      get () {
        return this.value || undefined
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    pmin () {
      return this.min ? moment(this.min) : false
    },
    pmax () {
      return this.max ? moment(this.max) : false
    },
    typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year () {
      return this.date.year()
    },
    yearInterval () {
      let
        min = this.pmin ? this.pmin.year() : 1950,
        max = this.pmax ? this.pmax.year() : 2050
      return Math.max(1, max - min + 1)
    },
    yearMin () {
      return this.pmin ? this.pmin.year() - 1 : 1949
    },

    month () {
      return this.date.month() + 1
    },
    monthInterval () {
      let
        min = this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0,
        max = this.pmax && this.pmax.isSame(this.date, 'year') ? this.pmax.month() : 11
      return Math.max(1, max - min + 1)
    },
    monthMin () {
      return this.pmin && this.pmin.year() === this.date.year() ? this.pmin.month() : 0
    },

    day () {
      return this.date.date()
    },
    dayMin () {
      return this.pmin && this.pmin.isSame(this.date, 'month') ? this.pmin.date() : 1
    },
    dayMax () {
      return this.pmax && this.pmax.isSame(this.date, 'month') ? this.pmax.date() : this.daysInMonth
    },
    daysInterval () {
      return this.dayMax - this.dayMin + 1
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },

    hour () {
      return this.date.hour()
    },
    hourMin () {
      return this.pmin && this.pmin.isSame(this.date, 'day') ? this.pmin.hour() : 0
    },
    hourInterval () {
      return (this.pmax && this.pmax.isSame(this.date, 'day') ? this.pmax.hour() : 23) - this.hourMin + 1
    },

    minute () {
      return this.date.minute()
    },
    minuteMin () {
      return this.pmin && this.pmin.isSame(this.date, 'hour') ? this.pmin.minute() : 0
    },
    minuteInterval () {
      return (this.pmax && this.pmax.isSame(this.date, 'hour') ? this.pmax.minute() : 59) - this.minuteMin + 1
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
    editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (this.editable) {
        this.date.year(this.__parseTypeValue('year', value))
        this.__updateModel()
      }
    },
    setMonth (value) {
      if (this.editable) {
        this.date.month(this.__parseTypeValue('month', value) - 1)
        this.__updateModel()
      }
    },
    setDay (value) {
      if (this.editable) {
        this.date.date(this.__parseTypeValue('date', value))
        this.__updateModel()
      }
    },

    /* time */
    setHour (value) {
      if (this.editable) {
        this.date.hour(this.__parseTypeValue('hour', value))
        this.__updateModel()
      }
    },
    setMinute (value) {
      if (this.editable) {
        this.date.minute(this.__parseTypeValue('minute', value))
        this.__updateModel()
      }
    },

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __parseTypeValue (type, value) {
      if (type === 'month') {
        return between(value, 1, 12)
      }
      if (type === 'date') {
        return between(value, 1, this.daysInMonth)
      }
      if (type === 'year') {
        let
          min = this.pmin ? this.pmin.year() : 1950,
          max = this.pmax ? this.pmax.year() : 2050
        return between(value, min, max)
      }
      if (type === 'hour') {
        return between(value, 0, 23)
      }
      if (type === 'minute') {
        return between(value, 0, 59)
      }
    },
    __updateAllPositions () {
      this.$nextTick(() => {
        if (this.typeHasDate) {
          this.__updatePositions('month', this.date.month())
          this.__updatePositions('date', this.date.date())
          this.__updatePositions('year', this.date.year())
        }
        if (this.typeHasTime) {
          this.__updatePositions('hour', this.date.hour())
          this.__updatePositions('minute', this.date.minute())
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

    /* common */
    __dragStart (ev, type) {
      if (!this.editable) {
        return
      }

      this.__dragCleanup()
      ;['month', 'date', 'year', 'hour', 'minute'].forEach(type => {
        this[type + 'DragOffset'] = 0
      })
      ev.stopPropagation()
      ev.preventDefault()

      if (!this.value) {
        this.__updateModel()
      }

      this.dragging = type
      this.__dragPosition = position(ev).top
    },
    __dragMove (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this[type + 'DragOffset'] = (this.__dragPosition - position(ev).top) / 36
      this.__updatePositions(type, this.date[type]() + this[type + 'DragOffset'])
    },
    __dragStop (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.dragging = false

      let
        offset = Math.round(this[type + 'DragOffset']),
        newValue = this.__parseTypeValue(type, this[type === 'date' ? 'day' : type] + offset),
        actualType = type === 'date' ? 'day' : type

      if (newValue !== this[actualType]) {
        this['set' + actualType.charAt(0).toUpperCase() + actualType.slice(1)](newValue)
        this[type + 'DragOffset'] = 0
      }
      else {
        this.__updatePositions(type, this.date[type]())
        this.timeout = setTimeout(() => {
          this[type + 'DragOffset'] = 0
        }, 150)
      }
    },
    __dragCleanup () {
      clearTimeout(this.timeout)
      this.timeout = null
    },
    __normalizeValue (value) {
      if (this.pmin) {
        value = moment.max(this.pmin.clone(), value)
      }
      if (this.pmax) {
        value = moment.min(this.pmax.clone(), value)
      }
      return value
    },
    __updateModel () {
      if (this.date) {
        this.date = this.__normalizeValue(this.date)
        this.model = this.date.toISOString()
      }
    }
  },
  mounted () {
    this.__updateAllPositions()
  },
  beforeDestroy () {
    this.__dragCleanup()
  }
}
</script>
