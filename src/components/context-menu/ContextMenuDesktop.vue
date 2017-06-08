<template>
  <q-popover
    ref="popover"
    :anchor-click="false"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <slot></slot>
  </q-popover>
</template>

<script>
import { QPopover } from '../popover'

export default {
  name: 'q-context-menu',
  components: {
    QPopover
  },
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
