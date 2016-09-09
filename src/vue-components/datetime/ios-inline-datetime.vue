<template>
  <div class="quasar-datetime" :class="['type-' + type]">
    <slot></slot>

    <div class="quasar-datetime-content">
      <div class="quasar-datetime-inner full-height row justify-center">
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
      this.__updatePositions('year')
      return this.date.year()
    },
    month () {
      this.__updatePositions('month')
      return this.date.month()
    },
    day () {
      this.__updatePositions('date')
      return this.date.date()
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },
    hour () {
      this.__updatePositions('hour')
      return this.date.hour()
    },
    minute () {
      this.__updatePositions('minute')
      return this.date.minute()
    },

    __orientation () {
      let orientation = {
        month: 1,
        date: 1,
        year: 1,
        hour: 1,
        minute: 1
      }

      return orientation
    },
    __monthStyle () {
      return this.__colStyle(118 - (this.month + 1) * 36)
    },
    __dayStyle () {
      return this.__colStyle(118 - this.day * 36)
    },
    __yearStyle () {
      return this.__colStyle(118 - (this.year - 1899) * 36)
    },
    __hourStyle () {
      return this.__colStyle(118 - (this.hour + 1) * 36)
    },
    __minuteStyle () {
      return this.__colStyle(118 - (this.minute + 1) * 36)
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
    __updatePositions (type) {
      let root = this.$els[type]

      if (!root) {
        return
      }

      let delta = -this.date[type]() + (type === 'year' ? 1900 : 0)

      ;[].slice.call(root.children).forEach(item => {
        Utils.dom.css(item, this.__itemStyle(this.__orientation[type] * Math.min(3, Math.abs(delta)) * 18 * (delta < 0 ? 1 : -1)))
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
    __itemStyle (value) {
      return {
        '-webkit-transform': 'translate3d(0, 36px, 0) rotateX(' + value + 'deg)',
        '-ms-transform': 'translate3d(0, 36px, 0) rotateX(' + value + 'deg)',
        'transform': 'translate3d(0, 36px, 0) rotateX(' + value + 'deg)'
      }
    },

    /* common */
    __updateModel () {
      this.model = this.date.toISOString()
    }
  },
  compiled () {
    if (this.type === 'date' || this.type === 'datetime') {
      this.__updatePositions('month')
      this.__updatePositions('date')
      this.__updatePositions('year')
    }
    if (this.type === 'time' || this.type === 'datetime') {
      this.__updatePositions('hour')
      this.__updatePositions('minute')
    }
  }
}
</script>
