<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn label="To First" color="primary" @click="toFirst" />
      <q-btn label="To Last" color="primary" @click="toLast" />
      <q-btn label="To Far Away" color="warning" @click="toFarAway" />
      <q-btn
        label="To first and navigate away"
        color="primary"
        @click="changeTabAndNavigateAway"
      />
      <q-btn
        label="Navigate away in 1.5s"
        color="primary"
        @click="navigateAwayWithDelay"
      />
    </div>

    <div v-if="isFarAway" class="q-ma-md">Far Far Away, outside of Q-Tabs</div>
    <div v-else class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs v-model="tab" mobile-arrows>
        <q-tab name="first" icon="mail" label="First" />
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
        <q-tab name="alarms-2" icon="alarm" label="Long Long Long Alarms 2" />
        <q-tab name="alarms-3" icon="alarm" label="Long Long Long Alarms 3" />
        <q-tab name="alarms-4" icon="alarm" label="Long Long Long Alarms 4" />
        <q-tab name="alarms-5" icon="alarm" label="Long Long Long Alarms 5" />
        <q-tab name="alarms-6" icon="alarm" label="Long Long Long Alarms 6" />
        <q-tab name="alarms-7" icon="alarm" label="Long Long Long Alarms 7" />
        <q-tab name="alarms-8" icon="alarm" label="Long Long Long Alarms 8" />
        <q-tab name="alarms-9" icon="alarm" label="Long Long Long Alarms 9" />
        <q-tab name="last" icon="mail" label="Last" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tab = ref('last')
const isFarAway = ref(false)

function toFirst() {
  isFarAway.value = false
  tab.value = 'first'
}

function toLast() {
  isFarAway.value = false
  tab.value = 'last'
}

// navigate to some other component, outside of q-tabs
function toFarAway() {
  isFarAway.value = true
}

function changeTabAndNavigateAway() {
  toFirst()
  nextTick(() => {
    router.push('/')
  })
}

function navigateAwayWithDelay() {
  setTimeout(() => {
    router.push('/')
  }, 1500)
}
</script>
