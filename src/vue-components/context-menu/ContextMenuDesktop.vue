<template>
  <quasar-popover ref="popover" @close="__cleanup()">
    <slot></slot>
  </quasar-popover>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    disable: Boolean
  },
  methods: {
    close () {
      this.$refs.popover.close()
    },
    __open (event) {
      if (this.disable) {
        return
      }
      this.$refs.popover.open(event)
      this.$nextTick(() => {
        this.scrollTarget = Utils.dom.getScrollTarget(this.target)
        this.scrollTarget.addEventListener('scroll', this.close)
      })
    },
    __cleanup () {
      this.scrollTarget.removeEventListener('scroll', this.close)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.target = this.$el.parentNode
      this.target.addEventListener('contextmenu', this.__open)
    })
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.handler)
  }
}
</script>
