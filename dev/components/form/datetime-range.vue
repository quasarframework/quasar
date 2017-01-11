<template>
  <div>
    <div class="layout-padding">
      <h5>Date & Datetime</h5>
      <div class="group">
        <div class="label bg-secondary text-white">
          From <span class="right-detail"><em>{{first.range.from}}</em></span>
        </div>
        <div class="label bg-secondary text-white">
          To <span class="right-detail"><em>{{first.range.to}}</em></span>
        </div>
        <br>
        <div class="label bg-secondary text-white">
          Min <span class="right-detail"><em>{{first.min}}</em></span>
        </div>
        <div class="label bg-secondary text-white">
          Max <span class="right-detail"><em>{{first.max}}</em></span>
        </div>
      </div>
      <p class="caption">
        Date Range
      </p>
      <q-datetime-range type="date" v-model="first.range" :min="first.min" :max="first.max" />
      <p class="caption">
        Datetime Range
      </p>
      <q-datetime-range type="datetime" v-model="first.range" :min="first.min" :max="first.max" />

      <br>
      <h5>Time</h5>
      <div class="group">
        <div class="label bg-secondary text-white">
          From <span class="right-detail"><em>{{second.range.from}}</em></span>
        </div>
        <div class="label bg-secondary text-white">
          To <span class="right-detail"><em>{{second.range.to}}</em></span>
        </div>
        <br>
        <div class="label bg-secondary text-white">
          Min <span class="right-detail"><em>{{second.min}}</em></span>
        </div>
        <div class="label bg-secondary text-white">
          Max <span class="right-detail"><em>{{second.max}}</em></span>
        </div>
      </div>
      <p class="caption">
        Time Range
      </p>
      <q-datetime-range type="time" v-model="second.range" :min="second.min" :max="second.max" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      first: {
        min: moment('2016-10-24T10:40:14.674Z').subtract(5, 'days').format(),
        max: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').add(1, 'day').add(1, 'month').format(),
        range: {
          from: moment('2016-10-24T10:40:14.674Z').subtract(3, 'days').format(),
          to: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').add(1, 'month').format()
        }
      },
      second: {
        min: moment().hour(3).minute(15).format(),
        max: moment().hour(22).minute(32).format(),
        range: {
          from: '',
          to: ''
        }
      }
    }
  }
}
</script>
