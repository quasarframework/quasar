<template lang="pug">
  div.countdown.flex.justify-center
    span(v-if="hasEnded").heading.full-width.text-center
      span Quasar.Conf was a success!

    span(v-else).heading.full-width.text-center
      span Quasar.Conf launches in ...
      div.flex.justify-center
        div.countdown__timer.flex
          span.time {{days}}
          span.label Days
        div.countdown__timer
          span.time {{hours}}
          span.label Hours
        div.countdown__timer
          span.time {{minutes}}
          span.label Minutes

    q-btn.q-my-md(
      :color="color",
      :text-color="textColor",
      type="a",
      no-caps,
      :href="hasEnded ? 'https://www.youtube.com/watch?v=XfEx5teuY84&feature=youtu.be' : 'https://dev.to/quasar/introducing-quasar-conf-52gg'",
      :label="hasEnded ? 'View it on YouTube!' : 'Learn More!'",
      target="_blank"
      :icon="hasEnded ? mdiYoutube : void 0"
    )
</template>

<script>
import { mdiYoutube } from '@quasar/extras/mdi-v5'

const confDate = new Date('July 5, 2020 15:00:00').getTime()
const oneDay = 1000 * 60 * 60 * 24
const oneHour = 1000 * 60 * 60
const oneMin = 1000 * 60

export default {
  name: 'ConfCountdown',

  props: {
    color: {
      type: String,
      default: 'white'
    },
    textColor: {
      type: String,
      default: 'primary'
    }
  },

  data () {
    return {
      days: '*',
      hours: '*',
      minutes: '*',
      hasEnded: false
    }
  },

  mounted () {
    this.interval = setInterval(() => this.calcTimeRemaining, oneMin)
    this.calcTimeRemaining()
  },

  created () {
    this.mdiYoutube = mdiYoutube
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    calcTimeRemaining () {
      const now = new Date().getTime()
      const remaining = confDate - now
      this.hasEnded = remaining <= 0

      if (this.hasEnded === false) {
        this.days = Math.floor(remaining / oneDay)
        this.hours = Math.floor((remaining % oneDay) / oneHour)
        this.minutes = Math.floor((remaining % oneHour) / oneMin)
      }
    }
  }
}
</script>

<style lang="sass">
  .countdown
    flex-wrap: wrap
    .heading,
    .action
      font-size: 23px

    &__timer
      display: flex
      flex-wrap: wrap

      span
        width: 100%

      .time
        font-size: 42px
</style>
