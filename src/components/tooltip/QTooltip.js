import { debounce } from '../../utils/debounce'
import { getScrollTarget } from '../../utils/scroll'
import {
  positionValidator,
  offsetValidator,
  parsePosition,
  getTransformProperties,
  setPosition
} from '../../utils/popup'
import ModelToggleMixin from '../../mixins/model-toggle'

export default {
  name: 'q-tooltip',
  mixins: [ModelToggleMixin],
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
  watch: {
    $route () {
      this.hide()
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
    __show () {
      clearTimeout(this.timer)

      document.body.appendChild(this.$el)
      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.hide)
      window.addEventListener('resize', this.__debouncedUpdatePosition)
      if (this.$q.platform.is.mobile) {
        document.body.addEventListener('click', this.hide, true)
      }

      this.__updatePosition()
      this.showPromise && this.showPromiseResolve()
    },
    __hide () {
      clearTimeout(this.timer)

      this.scrollTarget.removeEventListener('scroll', this.hide)
      window.removeEventListener('resize', this.__debouncedUpdatePosition)
      document.body.removeChild(this.$el)
      if (this.$q.platform.is.mobile) {
        document.body.removeEventListener('click', this.hide, true)
      }

      this.hidePromise && this.hidePromiseResolve()
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
    __delayShow () {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.show, this.delay)
    },
    __delayHide () {
      clearTimeout(this.timer)
      this.hide()
    }
  },
  render (h) {
    return h('span', {
      staticClass: 'q-tooltip animate-scale',
      style: this.transformCSS
    }, [ this.$slots.default ])
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
      if (this.$q.platform.is.mobile) {
        this.anchorEl.addEventListener('click', this.show)
      }
      else {
        this.anchorEl.addEventListener('mouseenter', this.__delayShow)
        this.anchorEl.addEventListener('focus', this.__delayShow)
        this.anchorEl.addEventListener('mouseleave', this.__delayHide)
        this.anchorEl.addEventListener('blur', this.__delayHide)
      }

      if (this.value) {
        this.show()
      }
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    if (!this.anchorEl) {
      return
    }
    if (this.$q.platform.is.mobile) {
      this.anchorEl.removeEventListener('click', this.show)
    }
    else {
      this.anchorEl.removeEventListener('mouseenter', this.__delayShow)
      this.anchorEl.removeEventListener('focus', this.__delayShow)
      this.anchorEl.removeEventListener('mouseleave', this.__delayHide)
      this.anchorEl.removeEventListener('blur', this.__delayHide)
    }
  }
}
