<template>
  <span class="quasar-tooltip animate-scale" :style="transformCSS">
    <slot></slot>
  </span>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    anchorOrigin: {
      type: Object,
      default () {
        return {vertical: 'top', horizontal: 'middle'}
      }
    },
    targetOrigin: {
      type: Object,
      default () {
        return {vertical: 'bottom', horizontal: 'middle'}
      }
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
    transformCSS () {
      return Utils.popup.getTransformProperties({
        targetOrigin: this.targetOrigin
      })
    }
  },
  methods: {
    open () {
      if (this.disable) {
        return
      }
      this.opened = true
      document.body.appendChild(this.$el)
      Utils.popup.setPosition({
        el: this.$el,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        targetOrigin: this.targetOrigin,
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
