<template>
  <div class="quasar-datetime inline column gt-md-row" :class="{disabled: disable, readonly: readonly}">
    <div class="quasar-datetime-header column justify-center">
      <div v-if="type === 'date' || type === 'datetime'">
        <div class="quasar-datetime-weekdaystring">{{ weekDayString }}</div>
        <div class="quasar-datetime-datestring row gt-md-column items-center justify-center">
          <span
            :class="{active: view === 'month'}"
            class="quasar-datetime-link small"
            @click="view = 'month'"
          >
            {{ monthString }}
          </span>
          <span
            :class="{active: view === 'day'}"
            class="quasar-datetime-link"
            @click="view = 'day'"
          >
            {{ dayString }}
          </span>
          <span
            :class="{active: view === 'year'}"
            class="quasar-datetime-link small"
            @click="view = 'year'"
          >
            {{ year }}
          </span>
        </div>
      </div>
      <div
        v-if="type === 'time' || type === 'datetime'"
        class="quasar-datetime-time row gt-md-column items-center justify-center"
      >
        <div class="quasar-datetime-clockstring">
          <span
            :class="{active: view === 'hour'}"
            class="quasar-datetime-link"
            @click="view = 'hour'"
          >
            {{ __pad(hour, '&nbsp;&nbsp;') }}
          </span>
          <span style="opacity: 0.6">:</span>
          <span
            :class="{active: view === 'minute'}"
            class="quasar-datetime-link"
            @click="view = 'minute'"
          >
            {{ __pad(minute) }}
          </span>
        </div>
        <div class="quasar-datetime-ampm column justify-around">
          <div
            :class="{active: am}"
            class="quasar-datetime-link"
            @click="toggleAmPm()"
          >AM</div>
          <div
            :class="{active: !am}"
            class="quasar-datetime-link"
            @click="toggleAmPm()"
          >PM</div>
        </div>
      </div>
    </div>
    <div class="quasar-datetime-content auto column">
      <div ref="selector" class="quasar-datetime-selector auto row items-center justify-center">
        <div
          v-if="view === 'year'"
          class="quasar-datetime-view-year full-width full-height"
        >
          <button
            v-for="n in 100"
            class="primary clear full-width"
            :class="{active: n + 1950 === year}"
            @click="setYear(n + 1950)"
          >
            {{ n + 1950 }}
          </button>
        </div>

        <div
          v-if="view === 'month'"
          class="quasar-datetime-view-month full-width full-height"
        >
          <button
            v-for="(monthName, index) in monthsList"
            class="primary clear full-width"
            :class="{active: month === index + 1}"
            @click="setMonth(index + 1, true)"
          >
            {{ monthName }}
          </button>
        </div>

        <div
          v-if="view === 'day'"
          class="quasar-datetime-view-day quasar-datetime-animate"
        >
          <div class="row items-center content-center">
            <button
              class="primary clear"
              @click="setMonth(month - 1, true)"
            >
              <i>keyboard_arrow_left</i>
            </button>
            <div class="auto">
              {{ monthStamp }}
            </div>
            <button
              class="primary clear"
              @click="setMonth(month + 1, true)"
            >
              <i>keyboard_arrow_right</i>
            </button>
          </div>
          <div class="quasar-datetime-weekdays row items-center justify-start">
            <div v-for="day in daysList">{{day}}</div>
          </div>
          <div class="quasar-datetime-days row wrap items-center justify-start content-center">
            <div v-for="fillerDay in fillerDays" class="quasar-datetime-fillerday"></div>
            <div
              v-for="monthDay in daysInMonth"
              class="flex items-center content-center justify-center cursor-pointer"
              :class="{active: monthDay === day}"
              @click="setDay(monthDay)"
            >
              {{ monthDay }}
            </div>
          </div>
        </div>

        <div
          v-if="view === 'hour' || view === 'minute'"
          ref="clock"
          class="column items-center content-center justify-center"
        >
          <div
            v-if="view === 'hour'"
            class="quasar-datetime-clock cursor-pointer"
            @mousedown="__dragStart"
            @mousemove="__dragMove"
            @mouseup="__dragStop"
            @touchstart="__dragStart"
            @touchmove="__dragMove"
            @touchend="__dragStop"
          >
            <div class="quasar-datetime-clock-circle full-width full-height">
              <div class="quasar-datetime-clock-center"></div>
              <div class="quasar-datetime-clock-pointer" :style="clockPointerStyle">
                <span></span>
              </div>
              <div
                v-for="n in 12"
                class="quasar-datetime-clock-position"
                :class="['quasar-datetime-clock-pos-' + n, n === hour ? 'active' : '']"
              >
                {{ n }}
              </div>
            </div>
          </div>

          <div
            v-if="view === 'minute'"
            class="quasar-datetime-clock cursor-pointer"
            @mousedown="__dragStart"
            @mousemove="__dragMove"
            @mouseup="__dragStop"
            @touchstart="__dragStart"
            @touchmove="__dragMove"
            @touchend="__dragStop"
          >
            <div class="quasar-datetime-clock-circle full-width full-height">
              <div class="quasar-datetime-clock-center"></div>
              <div class="quasar-datetime-clock-pointer" :style="clockPointerStyle">
                <span></span>
              </div>
              <div
                v-for="n in 12"
                class="quasar-datetime-clock-position"
                :class="['quasar-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === minute ? 'active' : '']"
              >
                {{ (n - 1) * 5 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Utils from '../../utils'

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'date',
      validator (value) {
        return ['date', 'time', 'datetime'].includes(value)
      }
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    let view

    switch (this.type) {
      case 'time':
        view = 'hour'
        break
      case 'date':
      default:
        view = 'day'
        break
    }

    return {
      view,
      date: moment(this.value || undefined),
      dragging: false,
      centerClockPosition: 0,
      firstDayOfWeek: moment.localeData().firstDayOfWeek(),
      daysList: moment.weekdaysShort(),
      monthsList: moment.months()
    }
  },
  watch: {
    model (value) {
      this.date = moment(value || undefined)
    },
    view (value) {
      if (value !== 'year' && value !== 'month') {
        return
      }

      let
        view = this.$refs.selector,
        rows = value === 'year' ? this.year - 1950 : this.month

      this.$nextTick(() => {
        view.scrollTop = rows * Utils.dom.height(view.children[0].children[0]) - Utils.dom.height(view) / 2.5
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
    year () {
      return this.date.year()
    },
    month () {
      return this.date.month() + 1
    },
    day () {
      return this.date.date()
    },
    dayString () {
      return this.date.format('Do')
    },
    monthString () {
      return this.date.format('MMM')
    },
    monthStamp () {
      return this.date.format('MMMM YYYY')
    },
    weekDayString () {
      return this.date.format('dddd')
    },
    fillerDays () {
      return Math.max(0, this.date.clone().date(1).day() - this.firstDayOfWeek)
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },
    hour () {
      let hour = this.date.hour()
      return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
    },
    minute () {
      return this.date.minute()
    },
    am () {
      return this.date.hour() <= 11
    },
    clockPointerStyle () {
      let
        divider = this.view === 'minute' ? 60 : 12,
        degrees = Math.round((this.view === 'minute' ? this.minute : this.hour) * (360 / divider)) - 180

      return {
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
      }
    },
    editable () {
      return !this.disabled && !this.readonly
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (!this.editable) {
        return
      }
      this.date.year(this.__parseTypeValue('year', value))
      this.__updateModel()
    },
    setMonth (value, force) {
      if (!this.editable) {
        return
      }
      this.date.month((force ? value : this.__parseTypeValue('month', value)) - 1)
      this.__updateModel()
    },
    setDay (value) {
      if (!this.editable) {
        return
      }
      this.date.date(this.__parseTypeValue('date', value))
      this.__updateModel()
    },

    /* time */
    toggleAmPm () {
      if (!this.editable) {
        return
      }
      let
        hour = this.date.hour(),
        offset = this.am ? 12 : -12

      this.date.hour(hour + offset)
      this.__updateModel()
    },
    setHour (value) {
      if (!this.editable) {
        return
      }
      value = this.__parseTypeValue('hour', value) % 12

      if (!this.am) {
        value += 12
      }

      this.date.hour(value)
      this.__updateModel()
    },
    setMinute (value) {
      if (!this.editable) {
        return
      }
      this.date.minute(this.__parseTypeValue('minute', value))
      this.__updateModel()
    },

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __dragStart (ev) {
      ev.stopPropagation()
      ev.preventDefault()

      let
        clock = this.$refs.clock,
        clockOffset = Utils.dom.offset(clock)

      this.centerClockPosition = {
        top: clockOffset.top + Utils.dom.height(clock) / 2,
        left: clockOffset.left + Utils.dom.width(clock) / 2
      }

      this.dragging = true
      this.__updateClock(ev)
    },
    __dragMove (ev) {
      if (!this.dragging) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.__updateClock(ev)
    },
    __dragStop (ev) {
      ev.stopPropagation()
      ev.preventDefault()
      this.dragging = false
    },
    __updateClock (ev) {
      let
        position = Utils.event.position(ev),
        height = Math.abs(position.top - this.centerClockPosition.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(position.top - this.centerClockPosition.top), 2) +
          Math.pow(Math.abs(position.left - this.centerClockPosition.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (position.top < this.centerClockPosition.top) {
        angle = this.centerClockPosition.left < position.left ? 90 - angle : 270 + angle
      }
      else {
        angle = this.centerClockPosition.left < position.left ? angle + 90 : 270 - angle
      }

      if (this.view === 'hour') {
        this.setHour(Math.round(angle / 30))
      }
      else {
        this.setMinute(Math.round(angle / 6))
      }
    },
    __parseTypeValue (type, value) {
      if (type === 'month') {
        return Math.max(1, Math.min(12, value))
      }
      if (type === 'date') {
        return Math.max(1, Math.min(this.daysInMonth, value))
      }
      if (type === 'year') {
        return Math.max(1950, Math.min(2050, value))
      }
      if (type === 'hour') {
        return Math.max(0, Math.min(23, value))
      }
      if (type === 'minute') {
        return Math.max(0, Math.min(59, value))
      }
    },

    /* common */
    __updateModel () {
      this.model = this.date.toISOString()
    }
  }
}
</script>
