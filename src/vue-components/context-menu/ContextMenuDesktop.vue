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
    __open (evt) {
      if (this.disable) {
        return
      }
      this.close()
      evt.preventDefault()
      evt.stopPropagation()
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(() => {
        this.$refs.popover.open(evt)
      }, 100)
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode
    this.target.addEventListener('contextmenu', this.__open)
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.__open)
  }
}
</script>
