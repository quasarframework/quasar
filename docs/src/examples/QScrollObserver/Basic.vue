<template>
  <div class="q-pa-md">
    <pre class="q-ma-none container">{{ scrollInfo }}</pre>
    <q-scroll-observer @scroll="onScroll" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      scrollInfo: {}
    }
  },

  methods: {
    onScroll (info) {
      this.scrollInfo = info
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  font-size: 12px
</style>
