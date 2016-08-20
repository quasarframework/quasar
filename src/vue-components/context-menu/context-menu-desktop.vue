<template>
  <quasar-popover v-ref:popover touch-position>
    <slot></slot>
  </quasar-popover>
</template>

<script>
import Utils from '../../utils'

export default {
  methods: {
    close () {
      this.$refs.popover.close()
    }
  },
  ready () {
    this.target = this.$el.parentNode
    this.popover = this.$refs.popover

    this.handler = event => {
      event.preventDefault()
      if (Utils.dom.childOf(Utils.event.targetElement(event), this.target)) {
        this.$refs.popover[this.popover.active ? 'close' : 'open'](event)
      }
    }

    this.target.addEventListener('contextmenu', this.handler)
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.handler)
  }
}
</script>
