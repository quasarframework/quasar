<template>
  <q-popover ref="popover" :anchor-click="false">
    <slot></slot>
  </q-popover>
</template>

<script>
export default {
  props: {
    disable: Boolean
  },
  methods: {
    close () {
      this.$refs.popover.close()
    },
    __open (event) {
      if (!this.disable) {
        this.$refs.popover.open(event)
      }
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode
    this.target.addEventListener('contextmenu', this.__open)
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.handler)
  }
}
</script>
