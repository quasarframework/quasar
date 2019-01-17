<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        size="25px"
        :show-value="true"
        :thickness="1"
        color="grey-8"
        center-color="white"
        track-color="orange"
        :angle="45"
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        size="50px"
        :show-value="true"
        :thickness="1"
        color="grey-8"
        center-color="blue"
        track-color="orange"
        :angle="90"
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        size="100px"
        :show-value="true"
        :thickness="1"
        color="grey-8"
        center-color="red"
        track-color="orange"
        :angle="270"
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
