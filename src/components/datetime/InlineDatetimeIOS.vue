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
                {{ monthNames[index + monthMin - 1] }}
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

      </div>

      <div class="q-datetime-highlight"></div>
      <div class="q-datetime-mask"></div>
    </div>
  </div>
</template>

<script>
import { between } from '../../utils/format'
import { position } from '../../utils/event'
import { css } from '../../utils/dom'
import { isSameDate } from '../../utils/date'
import mixin from './datetime-mixin'

export default {
  name: 'q-inline-datetime',
  mixins: [mixin],
  props: {
    defaultSelection: [String, Number, Date],
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
        this.model = new Date(this.model.setMonth(this.__parseTypeValue('month', value) - 1))
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

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
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
    }
  },
  mounted () {
    this.$nextTick(this.__updateAllPositions)
  },
  beforeDestroy () {
    this.__dragCleanup()
  }
}
</script>
