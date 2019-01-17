<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-circular-progress
        class="q-ma-sm"
        :value="count"
      />

      <q-circular-progress
        class="q-ma-sm"
        :value="count"
      />

      <q-circular-progress
        class="q-ma-sm"
        :value="count"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      count: 0,
      interval: null
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
