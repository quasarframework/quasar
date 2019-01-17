<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        :show-value="true"
        size="25px"
        color="orange"
        center-color="grey-8"
        :no-motion="noMotion"
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        :show-value="true"
        size="50px"
        color="orange"
        center-color="grey-8"
        :no-motion="noMotion"
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        :show-value="true"
        size="100px"
        color="orange"
        center-color="grey-8"
        :no-motion="noMotion"
      />
    </div>

    <div class="q-px-sm">
      <q-btn :label="noMotion ? 'Start' : 'Stop'" @click="noMotion = !noMotion" />
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      count: 0,
      interval: null,
      noMotion: true
    }
  },

  mounted () {
    this.interval = setInterval(() => {
      this.count += 1
      if (this.count > 100) {
        this.count = 0
      }
    }, 100)
  },

  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>
