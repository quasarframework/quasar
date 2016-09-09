<template>
  <div class="quasar-datetime" :class="['type-' + type]">
    <slot></slot>

    <div class="quasar-datetime-content">
      <div class="quasar-datetime-inner full-height flex justify-center">
        <div
          class="quasar-datetime-col quasar-datetime-col-month"
          v-if="type === 'date' || type === 'datetime'"
        >
          <div v-el:month class="quasar-datetime-col-wrapper" :style="__monthStyle">
            <div
              v-for="monthName in monthsList"
              :class="{active: month === $index}"
              class="quasar-datetime-item"
              @click="setMonth($index)"
            >
              {{ monthName }}
            </div>
          </div>
        </div>

        <div
          class="quasar-datetime-col quasar-datetime-col-day"
          v-if="type === 'date' || type === 'datetime'"
        >
          <div v-el:date class="quasar-datetime-col-wrapper" :style="__dayStyle">
            <div
              v-for="monthDay in daysInMonth"
              class="quasar-datetime-item"
              :class="{active: monthDay + 1 === day}"
              @click="setDay(monthDay + 1)"
            >
              {{ monthDay + 1 }}
            </div>
          </div>
        </div>

        <div
          class="quasar-datetime-col quasar-datetime-col-year"
          v-if="type === 'date' || type === 'datetime'"
        >
          <div v-el:year class="quasar-datetime-col-wrapper" :style="__yearStyle">
            <div
              v-for="n in 200"
              :class="{active: n + 1900 === year}"
              class="quasar-datetime-item"
              @click="setYear(n + 1900)"
            >
              {{ n + 1900 }}
            </div>
          </div>
        </div>

        <div
          v-el
          class="quasar-datetime-col quasar-datetime-col-hour"
          v-if="type === 'time' || type === 'datetime'"
        >
          <div v-el:hour class="quasar-datetime-col-wrapper" :style="__hourStyle">
            <div
              v-for="n in 24"
              :class="{active: n === hour}"
              class="quasar-datetime-item"
              @click="setHour(n)"
            >
              {{ n }}
            </div>
          </div>
        </div>

        <div
          class="quasar-datetime-col-divider"
          v-if="type === 'time' || type === 'datetime'"
        >
          <div class="quasar-datetime-col-wrapper full-height row items-center justify-center">
            <div>:</div>
          </div>
        </div>

        <div
          class="quasar-datetime-col quasar-datetime-col-minute"
          v-if="type === 'time' || type === 'datetime'"
        >
          <div v-el:minute class="quasar-datetime-col-wrapper" :style="__minuteStyle">
            <div
              v-for="n in 60"
              :class="{active: n === minute}"
              class="quasar-datetime-item"
              @click="setMinute(n)"
            >
              {{ __pad(n) }}
            </div>
          </div>
        </div>

        <div class="quasar-datetime-highlight"></div>
      </div>

      <div class="quasar-datetime-mask"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Utils from '../../utils'

export default {
  props: {
    model: {
      type: String,
      twoWay: true,
      required: true
    },
    type: {
      type: String,
      default: 'date',
      validator (value) {
        return ['date', 'time', 'datetime'].includes(value)
      }
    }
  },
  data () {
    return {
      date: moment(this.model),
      monthsList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  watch: {
    model (value) {
      this.date = moment(value)
    }
  },
  computed: {
    year () {
      let value = this.date.year()
      this.__updatePositions('year', value - 1900)
      return value
    },
    month () {
      let value = this.date.month()
      this.__updatePositions('month', value)
      return value
    },
    day () {
      let value = this.date.date()
      this.__updatePositions('date', value - 1)
      return value
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },
    hour () {
      let value = this.date.hour()
      this.__updatePositions('hour', value)
      return value
    },
    minute () {
      let value = this.date.minute()
      this.__updatePositions('minute', value)
      return value
    },

    __monthStyle () {
      return this.__colStyle(82 - this.month * 36)
    },
    __dayStyle () {
      return this.__colStyle(82 - (this.day - 1) * 36)
    },
    __yearStyle () {
      return this.__colStyle(82 - (this.year - 1900) * 36)
    },
    __hourStyle () {
      return this.__colStyle(82 - this.hour * 36)
    },
    __minuteStyle () {
      return this.__colStyle(82 - this.minute * 36)
    }
  },
  methods: {
    /* date */
    setYear (year) {
      this.date.year(year)
      this.__updateModel()
    },
    setMonth (month) {
      this.date.month(month)
      this.__updateModel()
    },
    setDay (dayOfMonth) {
      this.date.date(dayOfMonth)
      this.__updateModel()
    },

    /* time */
    setHour (hour) {
      this.date.hour(Math.min(23, hour))
      this.__updateModel()
    },
    setMinute (minute) {
      this.date.minute(Math.min(59, minute))
      this.__updateModel()
    },

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __updatePositions (type, value) {
      let root = this.$els[type]

      if (!root) {
        return
      }

      let delta = -value

      ;[].slice.call(root.children).forEach(item => {
        Utils.dom.css(item, this.__itemStyle(value * 36, Math.max(-180, Math.min(180, delta * -18))))
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
    __updateModel () {
      this.model = this.date.toISOString()
    }
  },
  compiled () {
    if (this.type === 'date' || this.type === 'datetime') {
      this.__updatePositions('month', this.date.month())
      this.__updatePositions('date', this.date.date() - 1)
      this.__updatePositions('year', this.date.year() - 1900)
    }
    if (this.type === 'time' || this.type === 'datetime') {
      this.__updatePositions('hour', this.date.hour())
      this.__updatePositions('minute', this.date.minute())
    }
  }
}
</script>
