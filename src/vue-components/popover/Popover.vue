<template>
  <div class="q-popover animate-scale" :style="transformCSS" @click.stop>
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
    fit: Boolean,
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
  created () {
    this.__debouncedPositionUpdate = Utils.debounce(() => {
      this.reposition()
    }, 70)
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
      if (this.disable) {
        return
      }
      if (this.opened) {
        this.reposition()
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
      window.addEventListener('resize', this.__debouncedPositionUpdate)
      if (this.fit) {
        this.$el.style.minWidth = Utils.dom.width(this.anchorEl) + 'px'
      }
      this.reposition(event)
      this.timer = setTimeout(() => {
        this.timer = null
        document.addEventListener('click', this.close, true)
        this.$emit('open')
      }, 1)
    },
    close (fn) {
      if (!this.opened || this.progress || (fn && fn.target && this.$el.contains(fn.target))) {
        return
      }

      clearTimeout(this.timer)
      document.removeEventListener('click', this.close, true)
      this.scrollTarget.removeEventListener('scroll', this.close)
      window.removeEventListener('resize', this.__debouncedPositionUpdate)
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
    reposition (event) {
      this.$nextTick(() => {
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
      })
    }
  }
}
</script>
