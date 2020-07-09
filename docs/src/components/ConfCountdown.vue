<template lang="pug">
  q-banner(inline-actions).conf-countdown
    template(v-if="!hasEnded" v-slot:action)
      q-btn(
        type="a"
        :href="btn.href"
        target="_blank"
        :color="color"
        :text-color="textColor"
        :icon="btn.icon"
        :label="btn.label"
        no-caps
      )
    q-btn(
      v-else
      type="a"
      :href="btn.href"
      target="_blank"
      :color="color"
      :text-color="textColor"
      :icon="btn.icon"
      :label="btn.label"
      no-caps
      no-wrap
    )

    .q-gutter-xs(v-if="!hasEnded" :class="paddingClass")
      .row.items-center(:class="alignClass")
        .text-bold Quasar.Conf
        .q-ml-xs launches in...
      q-badge.text-bold(v-if="days > 0" :color="color" :text-color="textColor") {{ days }} Days
      q-badge.text-bold(v-if="hours > 0" :color="color" :text-color="textColor") {{ hours }} Hours
      q-badge.text-bold(:color="color" :text-color="textColor") {{ minutes }} Minutes
</template>

<script>
import { mdiYoutube } from '@quasar/extras/mdi-v5'

// July 5, 2020 15:00:00 GMT
const confDate = 1593961200000

const oneDay = 1000 * 60 * 60 * 24
const oneHour = 1000 * 60 * 60
const oneMin = 1000 * 60

export default {
  name: 'ConfCountdown',

  props: {
    color: String,
    textColor: String,
    alignClass: String,
    paddingClass: String
  },

  data () {
    return {
      days: '*',
      hours: '*',
      minutes: '*',
      hasEnded: false
    }
  },

  computed: {
    btn () {
      return this.hasEnded === true
        ? {
          href: 'https://www.youtube.com/watch?v=6ZKBZ3k4Ebk&feature=youtu.be',
          label: 'View Quasar.Conf on YouTube!',
          icon: mdiYoutube
        }
        : {
          href: 'https://dev.to/quasar/introducing-quasar-conf-52gg',
          label: 'About'
        }
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
      else {
        clearInterval(this.interval)
      }
    }
  }
}
</script>
