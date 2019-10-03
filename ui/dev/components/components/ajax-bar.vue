<template>
  <div>
    <div class="q-layout-padding" style="max-width: 600px;">
      <p class="caption">
        Ajax Bar component captures Ajax calls automatically. This page here triggers events manually for demonstrating purposes only.
      </p>

      <q-card style="margin-top: 25px">
        <q-card-section class="bg-primary text-center row q-gutter-sm">
          <q-btn push color="orange" @click="trigger()">
            Trigger Event
          </q-btn>

          <q-btn push color="green" @click="manualStart()" :disable="manualStarted">
            Start manual
          </q-btn>

          <q-btn push color="blue" @click="manualIncrement()" :disable="manualStarted !== true">
            Random manual increment
          </q-btn>

          <q-btn push color="red" @click="manualStop()" :disable="manualStarted !== true">
            Stop manual
          </q-btn>
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
    <q-ajax-bar ref="bar" :position="position" :reverse="reverse" :size="computedSize" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      position: 'top',
      reverse: false,
      size: 20,

      manualStarted: false,

      timeouts: []
    }
  },
  computed: {
    computedSize () {
      return this.size + 'px'
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

    manualStart () {
      this.$refs.bar.start(0)
      this.manualStarted = true
    },

    manualIncrement () {
      this.$refs.bar.increment(Math.random() * 20)
    },

    manualStop () {
      this.$refs.bar.stop()
      this.manualStarted = false
    }
  }
}
</script>
