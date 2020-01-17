<template>
  <div class="q-layout-padding">
    <div class="q-gutter-y-md">
      <q-input v-model="start" label="Start" />
      <q-input v-model="stop" label="Stop" />
      <pre>{{ diff }}</pre>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { date } from 'quasar'

const { getDateDiff } = date

export default {
  data () {
    const start = '2025-05-15T15:35:45.500Z'
    const stop = '2025-05-15T15:35:45.400Z'

    return {
      start,
      stop
    }
  },

  computed: {
    startVal () {
      return new Date(this.start)
    },
    stopVal () {
      return new Date(this.stop)
    },
    diff () {
      return {
        years: getDateDiff(this.stopVal, this.startVal, 'years'),
        months: getDateDiff(this.stopVal, this.startVal, 'months'),
        days: getDateDiff(this.stopVal, this.startVal, 'days'),
        hours: getDateDiff(this.stopVal, this.startVal, 'hours'),
        minutes: getDateDiff(this.stopVal, this.startVal, 'minutes'),
        seconds: getDateDiff(this.stopVal, this.startVal, 'seconds')
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
