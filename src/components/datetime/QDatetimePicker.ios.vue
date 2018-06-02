<template>
  <div v-if="canRender" class="q-datetime" :class="classes">
    <slot/>
    <div class="q-datetime-content non-selectable">
      <div class="q-datetime-inner full-height flex justify-center" @touchstart.stop.prevent>
        <template v-if="typeHasDate">
          <div
            class="q-datetime-col q-datetime-col-month"
            v-touch-pan.vertical="__dragMonth"
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

      <div class="q-datetime-mask"/>
      <div class="q-datetime-highlight"/>
    </div>
  </div>
</template>

<script>
import { between, capitalize } from '../../utils/format'
import { position } from '../../utils/event'
import { css } from '../../utils/dom'
import { isSameDate, adjustDate } from '../../utils/date'
import DateMixin from './datetime-mixin'
import ParentFieldMixin from '../../mixins/parent-field'
import TouchPan from '../../directives/touch-pan'
import CanRenderMixin from '../../mixins/can-render'

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
    }
  },
  mounted () {
    this.$nextTick(this.__updateAllPositions)
  }
}
</script>
