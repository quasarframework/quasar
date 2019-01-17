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
        reverse
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        :show-value="true"
        size="50px"
        color="orange"
        center-color="grey-8"
        reverse
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        :value="count"
        :show-value="true"
        size="100px"
        color="orange"
        center-color="grey-8"
        reverse
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
