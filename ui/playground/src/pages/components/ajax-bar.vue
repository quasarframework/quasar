<template>
  <div>
    <div class="q-layout-padding" style="max-width: 600px">
      <p class="caption">
        Ajax Bar component captures Ajax calls automatically. This page here
        triggers events manually for demonstrating purposes only.
      </p>

      <q-card style="margin-top: 25px">
        <q-card-section class="bg-primary text-center">
          <q-btn
            push
            color="orange"
            @click="trigger()"
            class="full-width q-mb-md"
          >
            Trigger Event
          </q-btn>

          <div class="q-gutter-sm">
            <q-btn push color="green" @click="start(0)">
              Start (speed 0)
            </q-btn>

            <q-btn push color="blue" @click="increment()">
              Random increment
            </q-btn>

            <q-btn push color="red" @click="stop()"> Stop </q-btn>
          </div>
        </q-card-section>

        <p class="caption text-center"
          >Try out some combinations for Ajax Bar.</p
        >
        <q-card-section>
          <div class="text-h6">Position</div>
          <div class="flex" style="margin: -5px">
            <div class="column">
              <q-radio v-model="position" val="top" label="Top" />
              <q-radio v-model="position" val="bottom" label="Bottom" />
            </div>

            <div class="column">
              <q-radio v-model="position" val="right" label="Right" />
              <q-radio v-model="position" val="left" label="Left" />
            </div>
          </div>

          <div class="text-h6 q-mt-md">Reverse?</div>
          <q-checkbox v-model="reverse" label="Reverse Direction" />

          <div class="text-h6 q-mt-md">watchEffect</div>
          <div class="row items-center">
            <q-checkbox v-model="watchUrl" label="active" />
            <q-input class="q-ml-md col" v-model="url" prefix="URL:" dense />
          </div>

          <div class="text-h6 q-mt-md">Size</div>
          <q-slider
            v-model="size"
            :min="2"
            :max="20"
            label-always
            :label-value="`${size}px`"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="q-ma-md row items-center q-gutter-md">
      <q-btn
        label="xhr /server (trigger)"
        color="primary"
        @click="triggerXhr1"
        no-caps
      />
      <q-btn
        label="xhr /second-server (NO trigger)"
        color="primary"
        @click="triggerXhr2"
        no-caps
      />
      <div>Loading bar status: {{ loadingState }}</div>
    </div>

    <q-ajax-bar
      ref="bar"
      :position="position"
      :reverse="reverse"
      :size="computedSize"
      skip-hijack
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'
import { LoadingBar } from 'quasar'

function sendXhr(url) {
  const xhr = new XMLHttpRequest()

  xhr.open('GET', url, true)
  xhr.send(null)

  // setTimeout(() => {
  //   xhr.open('GET', '/mimi', true)
  //   xhr.send(null)
  // }, 500)
}

const position = ref('top')
const reverse = ref(false)
const size = ref(20)

const timeouts = ref([])

const watchUrl = ref(false)
const url = ref('https://deelay.me/2000/server')

const bar = ref(null)

LoadingBar.setDefaults({
  hijackFilter(hijackUrl) {
    const res = /\/server/.test(hijackUrl) && !/\/other-server/.test(hijackUrl)

    console.log(hijackUrl, res)
    return res
  }
})

watchEffect(() => {
  if (watchUrl.value) {
    sendXhr(url.value)
  }
})

onBeforeUnmount(() => {
  LoadingBar.setDefaults({ hijackFilter: void 0 })
})

const computedSize = computed(() => size.value + 'px')

const loadingState = computed(() => (LoadingBar.isActive ? 'active' : 'idle'))

function trigger() {
  bar.value.start()

  setTimeout(
    () => {
      if (bar.value) {
        bar.value.stop()
      }
    },
    Math.random() * 3000 + 1000
  )
}

function start(speed) {
  bar.value.start(speed)
}

function increment() {
  bar.value.increment(Math.random() * 20)
}

function stop() {
  bar.value.stop()
}

function triggerXhr1() {
  sendXhr('https://deelay.me/5000/server')
}

function triggerXhr2() {
  sendXhr('https://deelay.me/2000/second-server')
}
</script>
