<template lang="pug">
  q-banner(v-if="!hasEnded" inline-actions).survey-countdown
    template(v-slot:action)
      q-btn(
        type="a"
        href="https://forms.gle/AGTQqkjCEAuDA8oCA"
        target="_blank"
        :color="color"
        :text-color="textColor"
        :icon="mdiFileDocumentEditOutline"
        label="Open survey"
        no-caps
      )

    .q-gutter-xs(:class="paddingClass")
      .row.items-center(:class="alignClass")
        | Quasar Community Survey closes in...
      q-badge.text-bold(v-if="days > 0" :color="color" :text-color="textColor") {{ days }} Days
      q-badge.text-bold(v-if="hours > 0" :color="color" :text-color="textColor") {{ hours }} Hours
      q-badge.text-bold(:color="color" :text-color="textColor") {{ minutes }} Minutes
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { mdiFileDocumentEditOutline } from '@quasar/extras/mdi-v5'

const confDate = new Date('2020-11-16').getTime()

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

  setup () {
    const days = ref('*')
    const hours = ref('*')
    const minutes = ref('*')
    const hasEnded = ref(false)

    let interval

    function calcTimeRemaining () {
      const now = new Date().getTime()
      const remaining = confDate - now
      hasEnded.value = remaining <= 0

      if (hasEnded.value === false) {
        days.value = Math.floor(remaining / oneDay)
        hours.value = Math.floor((remaining % oneDay) / oneHour)
        minutes.value = Math.floor((remaining % oneHour) / oneMin)
      }
      else {
        clearInterval(interval)
      }
    }

    onMounted(() => {
      interval = setInterval(() => calcTimeRemaining, oneMin)
      calcTimeRemaining()
    })

    onBeforeUnmount(() => {
      clearInterval(interval)
    })

    return {
      days,
      hours,
      minutes,
      hasEnded,

      mdiFileDocumentEditOutline
    }
  }
}
</script>
