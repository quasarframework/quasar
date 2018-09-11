import debounce from '../../utils/debounce.js'
import { getScrollTarget } from '../../utils/scroll.js'
import {
  positionValidator,
  offsetValidator,
  parsePosition,
  setPosition
} from '../../utils/popup.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import { listenOpts } from '../../utils/event.js'
import CanRenderMixinMixin from '../../mixins/can-render.js'

export default {
  name: 'QTooltip',
  mixins: [ModelToggleMixin, CanRenderMixinMixin],
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
    }
  },
  methods: {
    __show () {
      clearTimeout(this.timer)

      document.body.appendChild(this.$el)
      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.hide, listenOpts.passive)
      window.addEventListener('resize', this.__debouncedUpdatePosition, listenOpts.passive)
      if (this.$q.platform.is.mobile) {
        document.body.addEventListener('click', this.hide, true)
      }

      this.__updatePosition()
      this.showPromise && this.showPromiseResolve()
    },
    __hide () {
      this.__cleanup()
      this.hidePromise && this.hidePromiseResolve()
    },
    __cleanup () {
      clearTimeout(this.timer)

      this.scrollTarget.removeEventListener('scroll', this.hide, listenOpts.passive)
      window.removeEventListener('resize', this.__debouncedUpdatePosition, listenOpts.passive)
      this.$el.remove()

      if (this.$q.platform.is.mobile) {
        document.body.removeEventListener('click', this.hide, true)
      }
    },
    __updatePosition () {
      setPosition({
        el: this.$el,
        animate: true,
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
    if (!this.canRender) { return }

    return h('div', { staticClass: 'q-tooltip animate-popup' }, [
      h('div', this.$slots.default)
    ])
  },
  beforeMount () {
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
      if (this.anchorEl.classList.contains('q-btn-inner') || this.anchorEl.classList.contains('q-if-inner') || this.anchorEl.classList.contains('no-pointer-events')) {
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
    this.showing && this.__cleanup()
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
