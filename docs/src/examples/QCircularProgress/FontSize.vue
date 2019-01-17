<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-circular-progress
        class="q-ma-sm"
        :value="count"
        :show-value="true"
        size="25px"
        font-size=".25em"
      />

      <q-circular-progress
        class="q-ma-sm"
        :value="count"
        :show-value="true"
        size="50px"
        font-size=".25em"
      />

      <q-circular-progress
        class="q-ma-sm"
        :value="count"
        :show-value="true"
        size="100px"
        font-size=".6em"
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
