<template>
  <div class="q-pa-md">
    <q-linear-progress :value="progress" :buffer="buffer" />

    <q-linear-progress :value="progress" :buffer="buffer" color="warning" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="secondary" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="accent" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="purple" track-color="orange" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="negative" class="q-mt-sm" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 0.01,
      buffer: 0.01
    }
  },

  mounted () {
    this.interval = setInterval(() => {
      if (this.progress >= 1) {
        this.progress = 0.01
        this.buffer = 0.01
        return
      }

      this.progress = Math.min(1, this.buffer, this.progress + 0.1)
    }, 700 + Math.random() * 1000)

    this.bufferInterval = setInterval(() => {
      if (this.buffer < 1) {
        this.buffer = Math.min(1, this.buffer + Math.random() * 0.2)
      }
    }, 700)
  },

  beforeDestroy () {
    clearInterval(this.interval)
    clearInterval(this.bufferInterval)
  }
}
</script>
