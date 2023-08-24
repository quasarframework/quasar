<template>
  <div>
    <div class="q-layout-padding" style="max-width: 600px;">
      <p class="caption">
        Ajax Bar component captures Ajax calls automatically. This page here triggers events manually for demonstrating purposes only.
      </p>

      <q-card style="margin-top: 25px">
        <q-card-section class="bg-primary text-center">
          <q-btn push color="orange" @click="trigger()" class="full-width q-mb-md">
            Trigger Event
          </q-btn>

          <div class="q-gutter-sm">
            <q-btn push color="green" @click="start(0)">
              Start (speed 0)
            </q-btn>

            <q-btn push color="blue" @click="increment()">
              Random increment
            </q-btn>

            <q-btn push color="red" @click="stop()">
              Stop
            </q-btn>
          </div>
        </q-card-section>

        <p class="caption text-center">
          Try out some combinations for Ajax Bar.
        </p>
        <q-card-section>
          <div class="text-h6">
            Position
          </div>
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

          <div class="text-h6 q-mt-md">
            Reverse?
          </div>
          <q-checkbox v-model="reverse" label="Reverse Direction" />

          <div class="text-h6 q-mt-md">
            Size
          </div>
          <q-slider v-model="size" :min="2" :max="20" label-always :label-value="`${size}px`" />
        </q-card-section>
      </q-card>
    </div>

    <div class="q-ma-md row items-center q-gutter-md">
      <q-btn label="xhr /server (trigger)" color="primary" @click="triggerXhr1" no-caps />
      <q-btn label="xhr /second-server (NO trigger)" color="primary" @click="triggerXhr2" no-caps />
      <div>Loading bar status: {{ loadingState }}</div>
    </div>

    <q-ajax-bar ref="bar" :position="position" :reverse="reverse" :size="computedSize" skip-hijack />
  </div>
</template>

<script>
import { LoadingBar } from 'quasar'

function sendXhr (url) {
  const xhr = new XMLHttpRequest()

  xhr.open('GET', url, true)
  xhr.send(null)

  // setTimeout(() => {
  //   xhr.open('GET', '/mimi', true)
  //   xhr.send(null)
  // }, 500)
}

export default {
  created () {
    LoadingBar.setDefaults({
      hijackFilter (url) {
        const res = /\/server/.test(url) === true
          && /\/other-server/.test(url) === false

        console.log(url, res)
        return res
      }
    })
  },
  beforeUnmount () {
    LoadingBar.setDefaults({ hijackFilter: void 0 })
  },
  data () {
    return {
      position: 'top',
      reverse: false,
      size: 20,

      timeouts: []
    }
  },
  computed: {
    computedSize () {
      return this.size + 'px'
    },

    loadingState () {
      return LoadingBar.isActive === true ? 'active' : 'idle'
    }
  },
  methods: {
    trigger () {
      this.$refs.bar.start()

      setTimeout(() => {
        if (this.$refs.bar) {
          this.$refs.bar.stop()
        }
      }, Math.random() * 3000 + 1000)
    },

    start (speed) {
      this.$refs.bar.start(speed)
    },

    increment () {
      this.$refs.bar.increment(Math.random() * 20)
    },

    stop () {
      this.$refs.bar.stop()
    },

    triggerXhr1 () {
      sendXhr('https://deelay.me/5000/server')
    },

    triggerXhr2 () {
      sendXhr('https://deelay.me/2000/second-server')
    }
  }
}
</script>
