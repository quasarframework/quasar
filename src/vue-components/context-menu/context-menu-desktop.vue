<template>
  <div>
    <quasar-popover v-ref:popover touch-position>
      <slot></slot>
    </quasar-popover>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  methods: {
    open () {
      this.$refs.popover.open()
    },
    close () {
      this.$refs.popover.close()
    },
    toggle () {
      this.$refs.popover.toggle()
    }
  },
  ready () {
    this.target = this.$el.parentNode

    this.handler = event => {
      if (this.disabled) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (Utils.dom.childOf(Utils.event.targetElement(event), this.target)) {
        this.$refs.popover.toggle(event)
      }
    }

    this.target.addEventListener('contextmenu', this.handler)
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.handler)
  }
}
</script>
