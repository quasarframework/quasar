<template>
  <div class="q-datetime inline column gt-md-row" :class="{disabled: disable, readonly: readonly}">
    <div class="q-datetime-header column justify-center" v-if="!value">&nbsp;</div>
    <div class="q-datetime-header column justify-center" v-else>
      <div v-if="typeHasDate">
        <div class="q-datetime-weekdaystring">{{ weekDayString }}</div>
        <div class="q-datetime-datestring row gt-md-column items-center justify-center">
          <span
            :class="{active: view === 'month'}"
            class="q-datetime-link small"
            @click="view = 'month'"
          >
            {{ monthString }}
          </span>
          <span
            :class="{active: view === 'day'}"
            class="q-datetime-link"
            @click="view = 'day'"
          >
            {{ dayString }}
          </span>
          <span
            :class="{active: view === 'year'}"
            class="q-datetime-link small"
            @click="view = 'year'"
          >
            {{ year }}
          </span>
        </div>
      </div>
      <div
        v-if="typeHasTime"
        class="q-datetime-time row gt-md-column items-center justify-center"
      >
        <div class="q-datetime-clockstring">
          <span
            :class="{active: view === 'hour'}"
            class="q-datetime-link"
            @click="view = 'hour'"
          >
            {{ __pad(hour, '&nbsp;&nbsp;') }}
          </span>
          <span style="opacity: 0.6">:</span>
          <span
            :class="{active: view === 'minute'}"
            class="q-datetime-link"
            @click="view = 'minute'"
          >
            {{ __pad(minute) }}
          </span>
        </div>
        <div class="q-datetime-ampm column justify-around">
          <div
            :class="{active: am}"
            class="q-datetime-link"
            @click="toggleAmPm()"
          >AM</div>
          <div
            :class="{active: !am}"
            class="q-datetime-link"
            @click="toggleAmPm()"
          >PM</div>
        </div>
      </div>
    </div>
    <div class="q-datetime-content auto column">
      <div ref="selector" class="q-datetime-selector auto row items-center justify-center">
        <div
          v-if="view === 'year'"
          class="q-datetime-view-year full-width full-height"
        >
          <button
            v-for="n in yearInterval"
            class="primary clear full-width"
            :class="{active: n + yearMin === year}"
            @click="setYear(n + yearMin)"
          >
            {{ n + yearMin }}
          </button>
        </div>

        <div
          v-if="view === 'month'"
          class="q-datetime-view-month full-width full-height"
        >
          <button
            v-for="index in monthInterval"
            class="primary clear full-width"
            :class="{active: month === index + monthMin}"
            @click="setMonth(index + monthMin, true)"
          >
            {{ monthsList[index + monthMin - 1] }}
          </button>
        </div>

        <div
          v-if="view === 'day'"
          class="q-datetime-view-day q-datetime-animate"
        >
          <div class="row items-center content-center">
            <q-btn
              class="primary clear"
              @click="setMonth(month - 1, true)"
            >
              <q-icon name="keyboard_arrow_left"></q-icon>
            </q-btn>
            <div class="auto">
              {{ monthStamp }}
            </div>
            <q-btn
              class="primary clear"
              @click="setMonth(month + 1, true)"
            >
              <q-icon name="keyboard_arrow_right"></q-icon>
            </q-btn>
          </div>
          <div class="q-datetime-weekdays row items-center justify-start">
            <div v-for="day in daysList">{{day}}</div>
          </div>
          <div class="q-datetime-days row wrap items-center justify-start content-center">
            <div v-for="fillerDay in fillerDays" class="q-datetime-fillerday"></div>
            <div v-if="min" v-for="fillerDay in beforeMinDays" class="flex items-center content-center justify-center disabled">
              {{ fillerDay }}
            </div>
            <div
              v-for="monthDay in daysInterval"
              class="flex items-center content-center justify-center cursor-pointer"
              :class="{active: value && monthDay === day}"
              @click="setDay(monthDay)"
            >
              {{ monthDay }}
            </div>
            <div v-if="max" v-for="fillerDay in aferMaxDays" class="flex items-center content-center justify-center disabled">
              {{ fillerDay + maxDay }}
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
            class="q-datetime-clock cursor-pointer"
            @mousedown="__dragStart"
            @mousemove="__dragMove"
            @mouseup="__dragStop"
            @touchstart="__dragStart"
            @touchmove="__dragMove"
            @touchend="__dragStop"
          >
            <div class="q-datetime-clock-circle full-width full-height">
              <div class="q-datetime-clock-center"></div>
              <div class="q-datetime-clock-pointer" :style="clockPointerStyle" :class="{hidden: !value}">
                <span></span>
              </div>
              <div
                v-for="n in 12"
                class="q-datetime-clock-position"
                :class="['q-datetime-clock-pos-' + n, value && n === hour ? 'active' : '']"
              >
                {{ n }}
              </div>
            </div>
          </div>

          <div
            v-if="view === 'minute'"
            class="q-datetime-clock cursor-pointer"
            @mousedown="__dragStart"
            @mousemove="__dragMove"
            @mouseup="__dragStop"
            @touchstart="__dragStart"
            @touchmove="__dragMove"
            @touchend="__dragStop"
          >
            <div class="q-datetime-clock-circle full-width full-height">
              <div class="q-datetime-clock-center"></div>
              <div class="q-datetime-clock-pointer" :style="clockPointerStyle">
                <span></span>
              </div>
              <div
                v-for="n in 12"
                class="q-datetime-clock-position"
                :class="['q-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === minute ? 'active' : '']"
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
import { moment } from '../../deps'
import { inline as props } from './datetime-props'
import { height, width, offset } from '../../utils/dom'
import { between } from '../../utils/format'
import { position } from '../../utils/event'
import { QIcon } from '../icon'
import { QBtn } from '../btn'

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

export default {
  name: 'q-inline-datetime',
  components: {
    QIcon,
    QBtn
  },
  props,
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

    this.$nextTick(() => {
      this.date = this.__normalizeValue(this.date)
    })
    return {
      view,
      date: moment(this.value || undefined),
      dragging: false,
      centerClockPos: 0,
      firstDayOfWeek: moment.localeData().firstDayOfWeek(),
      daysList: moment.weekdaysShort(true),
      monthsList: moment.months()
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.view = ['date', 'datetime'].includes(this.type) ? 'day' : 'hour'
      }
    },
    model (value) {
      this.date = this.__normalizeValue(moment(value || undefined))
    },
    min () {
      this.$nextTick(() => {
        this.__updateModel()
      })
    },
    max () {
      this.$nextTick(() => {
        this.__updateModel()
      })
    },
    view (value) {
      if (value !== 'year' && value !== 'month') {
        return
      }

      let
        view = this.$refs.selector,
        rows = value === 'year' ? this.year - this.yearMin : this.month - this.monthMin

      this.$nextTick(() => {
        view.scrollTop = rows * height(view.children[0].children[0]) - height(view) / 2.5
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
      return this.min ? moment(this.min) : ''
    },
    pmax () {
      return this.max ? moment(this.max) : ''
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

    yearInterval () {
      let
        min = this.pmin ? this.pmin.year() : 1950,
        max = this.pmax ? this.pmax.year() : 2050
      return Math.max(1, max - min + 1)
    },
    yearMin () {
      return this.pmin ? this.pmin.year() - 1 : 1949
    },

    monthInterval () {
      let
        min = this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0,
        max = this.pmax && this.pmax.isSame(this.date, 'year') ? this.pmax.month() : 11
      return Math.max(1, max - min + 1)
    },
    monthMin () {
      return this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0
    },

    fillerDays () {
      return Math.max(0, this.date.clone().date(1).day() - this.firstDayOfWeek)
    },
    beforeMinDays () {
      if (!this.pmin || this.pmin.month() !== this.date.month() || this.pmin.year() !== this.date.year()) {
        return false
      }
      return this.pmin.date() - 1
    },
    aferMaxDays () {
      if (!this.pmax || this.pmax.month() !== this.date.month() || this.pmax.year() !== this.date.year()) {
        return false
      }
      return this.daysInMonth - this.maxDay
    },
    maxDay () {
      return this.pmax ? this.pmax.date() : this.daysInMonth
    },
    daysInterval () {
      let max = !this.pmax || this.pmax.month() !== this.date.month() || this.pmax.year() !== this.date.year() ? 0 : this.daysInMonth - this.pmax.date()
      if (this.beforeMinDays || max) {
        let min = this.beforeMinDays ? this.beforeMinDays + 1 : 1
        return Array.apply(null, {length: this.daysInMonth - min - max + 1}).map((day, index) => {
          return index + min
        })
      }
      return this.daysInMonth
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },

    hour () {
      return convertToAmPm(this.date.hour())
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
      return !this.disable && !this.readonly
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (!this.editable) {
        return
      }
      this.view = 'day'
      this.date.year(this.__parseTypeValue('year', value))
      this.__updateModel()
    },
    setMonth (value, force) {
      if (!this.editable) {
        return
      }
      this.view = 'day'
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
      this.view = 'minute'
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
        this.setHour(Math.round(angle / 30))
      }
      else {
        this.setMinute(Math.round(angle / 6))
      }
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

    /* common */
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
  }
}
</script>
