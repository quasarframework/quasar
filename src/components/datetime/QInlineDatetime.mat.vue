<template>
  <div class="q-datetime inline row" :class="classes">
    <div class="q-datetime-header column col-xs-12 col-md-4 justify-center">
      <div v-if="typeHasDate">
        <div class="q-datetime-weekdaystring col-12">{{ weekDayString }}</div>
        <div class="q-datetime-datestring row flex-center">
          <span
            :class="{active: view === 'month'}"
            class="q-datetime-link small col-auto col-md-12"
            @click="view = 'month'"
          >
            {{ monthString }}
          </span>
          <span
            :class="{active: view === 'day'}"
            class="q-datetime-link col-auto col-md-12"
            @click="view = 'day'"
          >
            {{ day }}
          </span>
          <span
            :class="{active: view === 'year'}"
            class="q-datetime-link small col-auto col-md-12"
            @click="view = 'year'"
          >
            {{ year }}
          </span>
        </div>
      </div>
      <div
        v-if="typeHasTime"
        class="q-datetime-time row flex-center"
      >
        <div class="q-datetime-clockstring col-auto col-md-12">
          <span
            :class="{active: view === 'hour'}"
            class="q-datetime-link col-auto col-md-12"
            @click="view = 'hour'"
          >
            {{ __pad(hour, '&nbsp;&nbsp;') }}
          </span>
          <span style="opacity: 0.6">:</span>
          <span
            :class="{active: view === 'minute'}"
            class="q-datetime-link col-auto col-md-12"
            @click="view = 'minute'"
          >
            {{ __pad(minute) }}
          </span>
        </div>
        <div v-if="!computedFormat24h" class="q-datetime-ampm column col-auto col-md-12 justify-around">
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
    <div class="q-datetime-content col-xs-12 col-md-8 column">
      <div ref="selector" class="q-datetime-selector auto row flex-center">
        <div
          v-if="view === 'year'"
          class="q-datetime-view-year full-width full-height"
        >
          <q-btn
            v-for="n in yearInterval"
            :key="n"
            flat
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
            class="q-datetime-btn full-width"
            :class="{active: month === index + monthMin}"
            @click="setMonth(index + monthMin, true)"
          >
            {{ $q.i18n.date.months[index + monthMin - 1] }}
          </q-btn>
        </div>

        <div
          v-if="view === 'day'"
          class="q-datetime-view-day"
        >
          <div class="row items-center content-center">
            <q-btn
              round
              size='sm'
              flat
              :color="color"
              @click="setMonth(month - 1)"
              :disabled="beforeMinDays"
              :icon="$q.icon.datetime.arrowLeft"
              :repeatTimeout="__getRepeatEasing()"
            ></q-btn>
            <div class="col q-datetime-dark">
              {{ monthStamp }}
            </div>
            <q-btn
              round
              size='sm'
              flat
              :color="color"
              @click="setMonth(month + 1)"
              :disabled="afterMaxDays"
              :icon="$q.icon.datetime.arrowRight"
              :repeatTimeout="__getRepeatEasing()"
            ></q-btn>
          </div>
          <div class="q-datetime-weekdays row items-center justify-start">
            <div v-for="day in headerDayNames" :key="day">{{day}}</div>
          </div>
          <div class="q-datetime-days row wrap items-center justify-start content-center">
            <div v-for="fillerDay in fillerDays" :key="fillerDay" class="q-datetime-fillerday"></div>
            <template v-if="min">
              <div v-for="fillerDay in beforeMinDays" :key="fillerDay" class="row items-center content-center justify-center disabled">
                {{ fillerDay }}
              </div>
            </template>
            <div
              v-for="monthDay in daysInterval"
              :key="monthDay"
              class="row items-center content-center justify-center cursor-pointer"
              :class="{
                'q-datetime-day-active': monthDay === day,
                'q-datetime-day-today': monthDay === today
              }"
              @click="setDay(monthDay)"
            >
              <span>{{ monthDay }}</span>
            </div>
            <template v-if="max">
              <div v-for="fillerDay in afterMaxDays" :key="fillerDay" class="row items-center content-center justify-center disabled">
                {{ fillerDay + maxDay }}
              </div>
            </template>
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
              <div v-if="computedFormat24h">
                <div
                  v-for="n in 24"
                  :key="n"
                  class="q-datetime-clock-position fmt24"
                  :class="[`q-datetime-clock-pos-${n-1}`, (n - 1) === hour ? 'active' : '']"
                >
                  <span>{{ n - 1 }}</span>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="n in 12"
                  :key="n"
                  class="q-datetime-clock-position"
                  :class="['q-datetime-clock-pos-' + n, n === hour ? 'active' : '']"
                >
                  <span>{{ n }}</span>
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
                :key="n"
                class="q-datetime-clock-position"
                :class="['q-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === minute ? 'active' : '']"
              >
                <span>{{ (n - 1) * 5 }}</span>
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
import { QBtn } from '../btn'
import { isSameDate, adjustDate } from '../../utils/date'
import DateMixin from './datetime-mixin'
import Ripple from '../../directives/ripple'

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

export default {
  name: 'q-inline-datetime',
  mixins: [DateMixin],
  props: {
    defaultSelection: [String, Number, Date],
    disable: Boolean,
    readonly: Boolean
  },
  components: {
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
    classes () {
      const cls = []
      if (this.disable) {
        cls.push('disabled')
      }
      if (this.readonly) {
        cls.push('readonly')
      }
      if (this.color) {
        cls.push(`text-${this.color}`)
      }
      return cls
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
    daysInterval () {
      let after = this.pmax === null || this.afterMaxDays === false ? 0 : this.afterMaxDays
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
    today () {
      const today = new Date()
      return isSameDate(today, this.model, 'month')
        ? today.getDate()
        : -1
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
    setMonth (value) {
      if (this.editable) {
        this.view = 'day'
        this.model = adjustDate(this.model, {month: value})
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
        this.setHour(Math.round(angle / (this.computedFormat24h ? 15 : 30)))
      }
      else {
        this.setMinute(Math.round(angle / 6))
      }
    },
    __getRepeatEasing (from = 300, step = 10, to = 100) {
      return cnt => cnt ? Math.max(to, from - cnt * cnt * step) : 100
    }
  }
}
</script>
