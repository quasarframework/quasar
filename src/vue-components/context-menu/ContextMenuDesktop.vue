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
  data () {
    return {
      opened: false
    }
  },
  methods: {
    __open (event) {
      if (this.disable) {
        return
      }
      if (this.opened) {
        // right clicked again on target so reopen to new position
        this.__close()
        this.$nextTick(() => {
          this.__open(event)
        })
        return
      }
      this.opened = true
      this.$refs.popover.open(event)
      this.$nextTick(() => {
        this.scrollTarget = Utils.dom.getScrollTarget(this.target)
        this.scrollTarget.addEventListener('scroll', this.__close)
      })
    },
    __close () {
      this.$refs.popover.close()
    },
    __cleanup () {
      this.opened = false
      this.scrollTarget.removeEventListener('scroll', this.__close)
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
