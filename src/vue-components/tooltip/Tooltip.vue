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
      this.anchorEl.addEventListener('mouseover', this.open)
      this.anchorEl.addEventListener('mouseout', this.close)
    })
  },
  beforeDestroy () {
    this.anchorEl.removeEventListener('mouseover', this.open)
    this.anchorEl.removeEventListener('mouseout', this.close)
    this.close()
  }
}
</script>
