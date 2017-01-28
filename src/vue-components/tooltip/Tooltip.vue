<template>
  <span class="q-tooltip animate-scale" :style="transformCSS">
    <slot></slot>
  </span>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    anchor: {
      type: String,
      default: 'top middle',
      validator: Utils.popup.positionValidator
    },
    self: {
      type: String,
      default: 'bottom middle',
      validator: Utils.popup.positionValidator
    },
    offset: {
      type: Array,
      validator: Utils.popup.offsetValidator
    },
    maxHeight: String,
    disable: Boolean
  },
  data () {
    return {
      opened: false
    }
  },
  computed: {
    anchorOrigin () {
      return Utils.popup.parsePosition(this.anchor)
    },
    selfOrigin () {
      return Utils.popup.parsePosition(this.self)
    },
    transformCSS () {
      return Utils.popup.getTransformProperties({
        selfOrigin: this.selfOrigin
      })
    }
  },
  methods: {
    toggle () {
      if (this.opened) {
        this.close()
      }
      else {
        this.open()
      }
    },
    open () {
      if (this.disable) {
        return
      }
      this.opened = true
      document.body.appendChild(this.$el)
      Utils.popup.setPosition({
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight
      })
    },
    close () {
      if (this.opened) {
        this.opened = false
        document.body.removeChild(this.$el)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      /*
        The following is intentional.
        Fixes a bug in Chrome regarding offsetHeight by requiring browser
        to calculate this before removing from DOM and using it for first time.
      */
      this.$el.offsetHeight

      this.anchorEl = this.$el.parentNode
      this.anchorEl.removeChild(this.$el)
      this.anchorEl.addEventListener('mouseenter', this.open)
      this.anchorEl.addEventListener('focus', this.open)
      this.anchorEl.addEventListener('mouseleave', this.close)
      this.anchorEl.addEventListener('blur', this.close)
    })
  },
  beforeDestroy () {
    this.anchorEl.removeEventListener('mouseenter', this.open)
    this.anchorEl.removeEventListener('focus', this.open)
    this.anchorEl.removeEventListener('mouseleave', this.close)
    this.anchorEl.removeEventListener('blur', this.close)
    this.close()
  }
}
</script>
