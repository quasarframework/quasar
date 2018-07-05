<template>
  <div v-if="canRender" class="q-datetime row" :class="classes">
    <div v-if="!minimal" class="q-datetime-header column col-xs-12 col-md-4 justify-center">
      <div v-if="typeHasDate">
        <div class="q-datetime-weekdaystring col-12">{{ weekDayString }}</div>
        <div class="q-datetime-datestring row flex-center">
          <span
            :class="{active: view === 'month'}"
            class="q-datetime-link small col-auto col-md-12"
            @keydown.down.left.prevent.stop="setMonth(month - 1, true)"
            @keydown.up.right.prevent.stop="setMonth(month + 1, true)"
            :tabindex="0"
          >
            <span @click="!disable && (view = 'month')" :tabindex="-1">
              {{ monthString }}
            </span>
          </span>
          <span
            :class="{active: view === 'day'}"
            class="q-datetime-link col-auto col-md-12"
            @keydown.left.prevent.stop="setDay(day - 1, true)"
            @keydown.right.prevent.stop="setDay(day + 1, true)"
            @keydown.down.prevent.stop="setDay(day + 7, true)"
            @keydown.up.prevent.stop="setDay(day - 7, true)"
            :tabindex="0"
          >
            <span @click="!disable && (view = 'day')" :tabindex="-1">
              {{ day }}
            </span>
          </span>
          <span
            :class="{active: view === 'year'}"
            class="q-datetime-link small col-auto col-md-12"
            @keydown.down.left.prevent.stop="setYear(year - 1, true)"
            @keydown.up.right.prevent.stop="setYear(year + 1, true)"
            :tabindex="0"
          >
            <span @click="!disable && (view = 'year')" :tabindex="-1">
              {{ year }}
            </span>
          </span>
        </div>
      </div>
      <div
        v-if="typeHasTime"
        class="q-datetime-time row flex-center"
      >
        <div class="q-datetime-clockstring col-auto col-md-12 row no-wrap flex-center">
          <span
            :class="{active: view === 'hour'}"
            class="q-datetime-link col-md text-right q-pr-sm"
            @keydown.down.left.prevent.stop="setHour(hour - 1, true)"
            @keydown.up.right.prevent.stop="setHour(hour + 1, true)"
            :tabindex="0"
          >
            <span @click="!disable && (view = 'hour')" :tabindex="-1">
              {{ hour }}
            </span>
          </span>
          <span style="opacity: 0.6">:</span>
          <span
            :class="{active: view === 'minute'}"
            class="q-datetime-link col-md text-left q-pl-sm"
            @keydown.down.left.prevent.stop="setMinute(minute - 1, true)"
            @keydown.up.right.prevent.stop="setMinute(minute + 1, true)"
            :tabindex="0"
          >
            <span @click="!disable && (view = 'minute')" :tabindex="-1">
              {{ __pad(minute) }}
            </span>
          </span>
        </div>
        <div v-if="!computedFormat24h" class="q-datetime-ampm column col-auto col-md-12 justify-around">
          <div
            :class="{active: am}"
            class="q-datetime-link"
            @keyup.13.32.prevent.stop="toggleAmPm()"
            :tabindex="0"
          >
            <span @click="toggleAmPm()" :tabindex="-1">
              AM
            </span>
          </div>
          <div
            :class="{active: !am}"
            class="q-datetime-link"
            @keyup.13.32.prevent.stop="toggleAmPm()"
            :tabindex="0"
          >
            <span @click="toggleAmPm()" :tabindex="-1">
              PM
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="q-datetime-content col-xs-12 column" :class="contentClasses">
      <div ref="selector" class="q-datetime-selector auto row flex-center">
        <div
          v-if="view === 'year'"
          class="q-datetime-view-year full-width full-height"
        >
          <q-btn
            v-for="n in yearInterval"
            :key="`yi${n}`"
            flat
            class="q-datetime-btn full-width"
            :class="{active: n + yearMin === year}"
            :disable="!editable"
            @click="setYear(n + yearMin)"
            :tabindex="-1"
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
            :key="`mi${index}`"
            flat
            class="q-datetime-btn full-width"
            :class="{active: month === index + monthMin}"
            :disable="!editable"
            @click="setMonth(index + monthMin, true)"
            :tabindex="-1"
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
              dense
              flat
              class="q-datetime-arrow"
              :icon="dateArrow[0]"
              :repeat-timeout="__repeatTimeout"
              :disable="beforeMinDays > 0 || disable || readonly"
              @click="setMonth(month - 1)"
              :tabindex="-1"
            />
            <div class="col q-datetime-month-stamp">
              {{ monthStamp }}
            </div>
            <q-btn
              round
              dense
              flat
              class="q-datetime-arrow"
              :icon="dateArrow[1]"
              :repeat-timeout="__repeatTimeout"
              :disable="afterMaxDays > 0 || disable || readonly"
              @click="setMonth(month + 1)"
              :tabindex="-1"
            />
          </div>
          <div class="q-datetime-weekdays row items-center justify-start">
            <div v-for="day in headerDayNames" :key="`dh${day}`">{{ day }}</div>
          </div>
          <div class="q-datetime-days row wrap items-center justify-start content-center">
            <div v-for="fillerDay in fillerDays" :key="`fd${fillerDay}`" class="q-datetime-fillerday"/>
            <template v-if="min">
              <div v-for="fillerDay in beforeMinDays" :key="`fb${fillerDay}`" class="row items-center content-center justify-center disabled">
                {{ fillerDay }}
              </div>
            </template>
            <div
              v-for="monthDay in daysInterval"
              :key="`md${monthDay}`"
              class="row items-center content-center justify-center cursor-pointer"
              :class="[color && monthDay === day ? `text-${color}` : null, {
                'q-datetime-day-active': isValid && monthDay === day,
                'q-datetime-day-today': monthDay === today,
                'disabled': !editable
              }]"
              @click="setDay(monthDay)"
            >
              <span>{{ monthDay }}</span>
            </div>
            <template v-if="max">
              <div v-for="fillerDay in afterMaxDays" :key="`fa${fillerDay}`" class="row items-center content-center justify-center disabled">
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
              <div class="q-datetime-clock-center"/>
              <div class="q-datetime-clock-pointer" :style="clockPointerStyle">
                <span/>
              </div>
              <div v-if="computedFormat24h">
                <div
                  v-for="n in 24"
                  :key="`hi${n}`"
                  class="q-datetime-clock-position fmt24"
                  :class="[`q-datetime-clock-pos-${n-1}`, (n - 1) === hour ? 'active' : '']"
                >
                  <span>{{ n - 1 }}</span>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="n in 12"
                  :key="`hi${n}`"
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
              <div class="q-datetime-clock-center"/>
              <div class="q-datetime-clock-pointer" :style="clockPointerStyle">
                <span/>
              </div>
              <div
                v-for="n in 12"
                :key="`mi${n}`"
                class="q-datetime-clock-position"
                :class="['q-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === minute ? 'active' : '']"
              >
                <span>{{ (n - 1) * 5 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <slot/>
    </div>
  </div>
</template>

<script>
import { height, width, offset, cssTransform } from '../../utils/dom.js'
import { position, stopAndPrevent } from '../../utils/event.js'
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
  components: {
    QBtn
  },
  directives: {
    Ripple
  },
  data () {
    return {
      view: this.__calcView(this.defaultView),
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
    daysInterval () {
      let after = this.pmax === null || this.afterMaxDays === false ? 0 : this.afterMaxDays
      if (this.beforeMinDays > 0 || after) {
        let min = this.beforeMinDays > 0 ? this.beforeMinDays + 1 : 1
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
        rows = this.view === 'year' ? this.year - this.yearMin : this.month - this.monthMin

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
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.__scrollView()
    })
  }
}
</script>
