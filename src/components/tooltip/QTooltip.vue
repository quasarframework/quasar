<template>
  <span class="q-tooltip animate-scale" :style="transformCSS">
    <slot></slot>
  </span>
</template>

<script>
import { debounce } from '../../utils/debounce'
import { getScrollTarget } from '../../utils/scroll'
import {
  positionValidator,
  offsetValidator,
  parsePosition,
  getTransformProperties,
  setPosition
} from '../../utils/popup'
import Platform from '../../features/platform'

export default {
  name: 'q-tooltip',
  props: {
    anchor: {
      type: String,
      default: 'top middle',
      validator: positionValidator
    },
    self: {
      type: String,
      default: 'bottom middle',
      validator: positionValidator
    },
    offset: {
      type: Array,
      validator: offsetValidator
    },
    delay: {
      type: Number,
      default: 0
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
      return parsePosition(this.anchor)
    },
    selfOrigin () {
      return parsePosition(this.self)
    },
    transformCSS () {
      return getTransformProperties({
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
      clearTimeout(this.timer)
      this.opened = true
      document.body.appendChild(this.$el)
      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.close)
      window.addEventListener('resize', this.__debouncedUpdatePosition)
      if (Platform.is.mobile) {
        document.body.addEventListener('click', this.close, true)
      }
      this.__updatePosition()
    },
    close () {
      clearTimeout(this.timer)
      if (this.opened) {
        this.opened = false
        this.scrollTarget.removeEventListener('scroll', this.close)
        window.removeEventListener('resize', this.__debouncedUpdatePosition)
        document.body.removeChild(this.$el)
        if (Platform.is.mobile) {
          document.body.removeEventListener('click', this.close, true)
        }
      }
    },
    __updatePosition () {
      setPosition({
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight
      })
    },
    __delayOpen () {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.open, this.delay)
    }
  },
  created () {
    this.__debouncedUpdatePosition = debounce(() => {
      this.__updatePosition()
    }, 70)
  },
  mounted () {
    this.$nextTick(() => {
      /*
        The following is intentional.
        Fixes a bug in Chrome regarding offsetHeight by requiring browser
        to calculate this before removing from DOM and using it for first time.
      */
      this.$el.offsetHeight // eslint-disable-line

      this.anchorEl = this.$el.parentNode
      this.anchorEl.removeChild(this.$el)
      if (this.anchorEl.classList.contains('q-btn-inner')) {
        this.anchorEl = this.anchorEl.parentNode
      }
      if (Platform.is.mobile) {
        this.anchorEl.addEventListener('click', this.open)
      }
      else {
        this.anchorEl.addEventListener('mouseenter', this.__delayOpen)
        this.anchorEl.addEventListener('focus', this.__delayOpen)
        this.anchorEl.addEventListener('mouseleave', this.close)
        this.anchorEl.addEventListener('blur', this.close)
      }
    })
  },
  beforeDestroy () {
    if (Platform.is.mobile) {
      this.anchorEl.removeEventListener('click', this.open)
    }
    else {
      this.anchorEl.removeEventListener('mouseenter', this.__delayOpen)
      this.anchorEl.removeEventListener('focus', this.__delayOpen)
      this.anchorEl.removeEventListener('mouseleave', this.close)
      this.anchorEl.removeEventListener('blur', this.close)
    }
    this.close()
  }
}
</script>
