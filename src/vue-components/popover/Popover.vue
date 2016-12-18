<template>
  <div
    class="q-popover animate-scale"
    @click.stop
    :style="transformCSS"
  >
    <slot></slot>
  </div>
</template>

<script>
import Utils from '../../utils'
import EscapeKey from '../../features/escape-key'

export default {
  props: {
    anchor: {
      type: String,
      default: 'bottom left',
      validator: Utils.popup.positionValidator
    },
    self: {
      type: String,
      default: 'top left',
      validator: Utils.popup.positionValidator
    },
    maxHeight: String,
    touchPosition: Boolean,
    anchorClick: {
      /*
        for handling anchor outside of Popover
        example: context menu component
      */
      type: Boolean,
      default: true
    },
    offset: {
      type: Array,
      validator: Utils.popup.offsetValidator
    },
    disable: Boolean
  },
  data () {
    return {
      opened: false,
      progress: false
    }
  },
  computed: {
    transformCSS () {
      return Utils.popup.getTransformProperties({selfOrigin: this.selfOrigin})
    },
    anchorOrigin () {
      return Utils.popup.parsePosition(this.anchor)
    },
    selfOrigin () {
      return Utils.popup.parsePosition(this.self)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode
      this.anchorEl.removeChild(this.$el)
      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer')
        this.anchorEl.addEventListener('click', this.toggle)
      }
    })
  },
  beforeDestroy () {
    if (this.anchorClick) {
      this.anchorEl.removeEventListener('click', this.toggle)
    }
    this.close()
  },
  methods: {
    toggle (event) {
      if (this.opened) {
        this.close()
      }
      else {
        this.open(event)
      }
    },
    open (event) {
      if (this.disable || this.opened) {
        return
      }
      if (event) {
        event.stopPropagation()
        event.preventDefault()
      }

      this.opened = true
      document.body.click() // close other Popovers
      document.body.appendChild(this.$el)
      EscapeKey.register(() => { this.close() })
      this.scrollTarget = Utils.dom.getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.close)
      document.addEventListener('click', this.close)
      this.$nextTick(() => {
        this.__updatePosition(event)
        this.$emit('open')
      })
    },
    close (fn) {
      if (!this.opened || this.progress) {
        return
      }
      document.removeEventListener('click', this.close)
      this.scrollTarget.removeEventListener('scroll', this.close)
      EscapeKey.pop()
      this.progress = true

      /*
        Using setTimeout to allow
        v-models to take effect
      */
      setTimeout(() => {
        this.opened = false
        this.progress = false
        document.body.removeChild(this.$el)
        this.$emit('close')
        if (typeof fn === 'function') {
          fn()
        }
      }, 1)
    },
    __updatePosition (event) {
      Utils.popup.setPosition({
        event,
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight,
        anchorClick: this.anchorClick,
        touchPosition: this.touchPosition
      })
    }
  }
}
</script>
