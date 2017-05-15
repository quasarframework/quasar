<template>
  <div class="q-datetime inline column gt-md-row" :class="{disabled: disable, readonly: readonly}">
    <div class="q-datetime-header column justify-center">
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
        <div v-if="!format24h" class="q-datetime-ampm column justify-around">
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
          <q-btn
            v-for="n in yearInterval"
            :key="n"
            flat
            color="black"
            class="q-datetime-btn full-width"
            :class="{active: n + yearMin === year}"
            @click="setYear(n + yearMin)"
          >
            {{ n + yearMin }}
          </q-btn>
        </div>

        <div
          v-if="view === 'month'"
          class="q-datetime-view-month full-width full-height"
        >
          <q-btn
            v-for="index in monthInterval"
            :key="index"
            flat
            color="black"
            class="q-datetime-btn full-width"
            :class="{active: month === index + monthMin}"
            @click="setMonth(index + monthMin, true)"
          >
            {{ monthNames[index + monthMin - 1] }}
          </q-btn>
        </div>

        <div
          v-if="view === 'day'"
          class="q-datetime-view-day q-datetime-animate"
        >
          <div class="row items-center content-center">
            <q-btn
              round
              small
              flat
              color="primary"
              @click="setMonth(month - 1, true)"
            >
              <q-icon name="keyboard_arrow_left"></q-icon>
            </q-btn>
            <div class="auto">
              {{ monthStamp }}
            </div>
            <q-btn
              round
              small
              flat
              color="primary"
              @click="setMonth(month + 1, true)"
            >
              <q-icon name="keyboard_arrow_right"></q-icon>
            </q-btn>
          </div>
          <div class="q-datetime-weekdays row items-center justify-start">
            <div v-for="day in headerDayNames">{{day}}</div>
          </div>
          <div class="q-datetime-days row wrap items-center justify-start content-center">
            <div v-for="fillerDay in fillerDays" class="q-datetime-fillerday"></div>
            <div v-if="min" v-for="fillerDay in beforeMinDays" class="flex items-center content-center justify-center disabled">
              {{ fillerDay }}
            </div>
            <div
              v-for="monthDay in daysInterval"
              class="flex items-center content-center justify-center cursor-pointer"
              :class="{active: monthDay === day}"
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
              <div class="q-datetime-clock-pointer" :style="clockPointerStyle">
                <span></span>
              </div>
              <div v-if="format24h">
                <div
                  v-for="n in 24"
                  class="q-datetime-clock-position fmt24"
                  :class="[`q-datetime-clock-pos-${n-1}`, (n - 1) === hour ? 'active' : '']"
                >
                  {{ n - 1 }}
                </div>
              </div>
              <div v-else>
                <div
                  v-for="n in 12"
                  class="q-datetime-clock-position"
                  :class="['q-datetime-clock-pos-' + n, n === hour ? 'active' : '']"
                >
                  {{ n }}
                </div>
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
import { height, width, offset, cssTransform } from '../../utils/dom'
import { position } from '../../utils/event'
import { QIcon } from '../icon'
import { QBtn } from '../btn'
import { formatDate, isSameDate } from '../../utils/date'
import mixin from './datetime-mixin'
import Ripple from '../../directives/ripple'

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

export default {
  name: 'q-inline-datetime',
  mixins: [mixin],
  props: {
    defaultSelection: [String, Number, Date]
  },
  components: {
    QIcon,
    QBtn
  },
  directives: {
    Ripple
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
      dragging: false,
      centerClockPos: 0
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.view = ['date', 'datetime'].includes(this.type) ? 'day' : 'hour'
      }
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
    firstDayOfWeek () {
      return this.mondayFirst ? 1 : 0
    },
    headerDayNames () {
      const days = this.dayNames.map(day => day.slice(0, 3))
      return this.mondayFirst
        ? days.slice(1, 7).concat(days[0])
        : days
    },

    dayString () {
      return formatDate(this.model, 'D')
    },
    monthString () {
      return formatDate(this.model, 'MMM')
    },
    monthStamp () {
      return formatDate(this.model, 'MMMM YYYY')
    },
    weekDayString () {
      return formatDate(this.model, 'dddd')
    },

    fillerDays () {
      return Math.max(0, (new Date(this.model.getFullYear(), this.model.getMonth(), 1).getDay() - this.firstDayOfWeek))
    },
    beforeMinDays () {
      if (this.pmin === null || !isSameDate(this.pmin, this.model, 'month')) {
        return false
      }
      return this.pmin.getDate() - 1
    },
    aferMaxDays () {
      if (this.pmax === null || !isSameDate(this.pmax, this.model, 'month')) {
        return false
      }
      return this.daysInMonth - this.maxDay
    },
    maxDay () {
      return this.pmax !== null ? this.pmax.getDate() : this.daysInMonth
    },
    daysInterval () {
      let after = this.pmax === null || this.afterMaxDays === false ? 0 : this.aferMaxDays
      if (this.beforeMinDays || after) {
        let min = this.beforeMinDays ? this.beforeMinDays + 1 : 1
        return Array.apply(null, {length: this.daysInMonth - min - after + 1}).map((day, index) => {
          return index + min
        })
      }
      return this.daysInMonth
    },

    hour () {
      const h = this.model.getHours()
      return this.format24h
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
        divider = this.view === 'minute' ? 60 : (this.format24h ? 24 : 12),
        degrees = Math.round((this.view === 'minute' ? this.minute : this.hour) * (360 / divider)) - 180

      return cssTransform(`rotate(${degrees}deg)`)
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (this.editable) {
        this.view = 'day'
        this.model = new Date(this.model.setFullYear(this.__parseTypeValue('year', value)))
      }
    },
    setMonth (value, force) {
      if (this.editable) {
        this.view = 'day'
        this.model = new Date(this.model.setMonth((force ? value : this.__parseTypeValue('month', value)) - 1))
      }
    },
    setDay (value) {
      if (this.editable) {
        this.model = new Date(this.model.setDate(this.__parseTypeValue('date', value)))
      }
    },

    setHour (value) {
      if (!this.editable) {
        return
      }

      value = this.__parseTypeValue('hour', value)

      if (!this.format24h && value < 12 && !this.am) {
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
      this.view = 'minute'
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
        this.setHour(Math.round(angle / (this.format24h ? 15 : 30)))
      }
      else {
        this.setMinute(Math.round(angle / 6))
      }
    }
  }
}
</script>
