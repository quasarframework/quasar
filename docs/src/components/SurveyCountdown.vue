<template>
  <q-banner class="survey-countdown" v-if="!hasEnded">
    <div class="q-gutter-y-sm row" :class="[props.paddingClass, props.alignClass]">
      <div class="text-center text-bold">Quasar Conf 2022 - Get Ready!</div>
      <div class="q-gutter-x-sm row">
        <q-badge class="text-bold" v-if="days > 0" :color="props.color" :text-color="props.textColor">{{ days }} Days</q-badge>
        <q-badge class="text-bold" v-if="hours > 0" :color="props.color" :text-color="props.textColor">{{ hours }} Hours</q-badge>
        <q-badge class="text-bold" :color="props.color" :text-color="textColor">{{ minutes }} Minutes</q-badge>
      </div>
      <q-btn href="https://bit.ly/qconf2022" target="_blank" :color="props.color" :text-color="props.textColor" :icon="mdiFileDocumentEditOutline" label="Check announcement" no-caps />
    </div>
  </q-banner>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { mdiFileDocumentEditOutline } from '@quasar/extras/mdi-v6'

const confDate = new Date('2022-07-09T15:00:00.000Z').getTime()

const oneDay = 1000 * 60 * 60 * 24
const oneHour = 1000 * 60 * 60
const oneMin = 1000 * 60

const props = defineProps({
  color: String,
  textColor: String,
  alignClass: String,
  paddingClass: String
})

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
</script>
