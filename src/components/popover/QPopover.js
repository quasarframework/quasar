import {
  positionValidator,
  offsetValidator,
  getTransformProperties,
  parsePosition,
  setPosition
} from '../../utils/popup'
import { frameDebounce } from '../../utils/debounce'
import { getScrollTarget } from '../../utils/scroll'
import { width, viewport } from '../../utils/dom'
import EscapeKey from '../../utils/escape-key'
import ModelToggleMixin from '../../mixins/model-toggle'

export default {
  name: 'q-popover',
  mixins: [ModelToggleMixin],
  props: {
    anchor: {
      type: String,
      default: 'bottom left',
      validator: positionValidator
    },
    self: {
      type: String,
      default: 'top left',
      validator: positionValidator
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
      validator: offsetValidator
    },
    disable: Boolean
  },
  watch: {
    $route () {
      this.hide()
    }
  },
  computed: {
    transformCSS () {
      return getTransformProperties({selfOrigin: this.selfOrigin})
    },
    anchorOrigin () {
      return parsePosition(this.anchor)
    },
    selfOrigin () {
      return parsePosition(this.self)
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-popover animate-scale',
      style: this.transformCSS,
      on: {
        click (e) { e.stopPropagation() }
      }
    }, this.$slots.default)
  },
  created () {
    this.__updatePosition = frameDebounce(() => { this.reposition() })
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode
      this.anchorEl.removeChild(this.$el)
      if (this.anchorEl.classList.contains('q-btn-inner')) {
        this.anchorEl = this.anchorEl.parentNode
      }
      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer')
        this.anchorEl.addEventListener('click', this.toggle)
      }
    })
    if (this.value) {
      this.show()
    }
  },
  beforeDestroy () {
    if (this.anchorClick && this.anchorEl) {
      this.anchorEl.removeEventListener('click', this.toggle)
    }
  },
  methods: {
    __show (evt) {
      document.body.appendChild(this.$el)
      EscapeKey.register(() => { this.hide() })
      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.__updatePosition)
      window.addEventListener('resize', this.__updatePosition)
      this.reposition(evt)

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        document.body.addEventListener('click', this.__bodyHide, true)
        document.body.addEventListener('touchstart', this.__bodyHide, true)
        this.showPromise && this.showPromiseResolve()
      }, 0)
    },
    __bodyHide (evt) {
      if (
        evt && evt.target &&
        (this.$el.contains(evt.target) || this.anchorEl.contains(evt.target))
      ) {
        return
      }

      this.hide(evt)
    },
    __hide (evt) {
      clearTimeout(this.timer)

      document.body.removeEventListener('click', this.__bodyHide, true)
      document.body.removeEventListener('touchstart', this.__bodyHide, true)
      this.scrollTarget.removeEventListener('scroll', this.__updatePosition)
      window.removeEventListener('resize', this.__updatePosition)
      EscapeKey.pop()

      document.body.removeChild(this.$el)
      this.hidePromise && this.hidePromiseResolve()
    },
    reposition (event) {
      this.$nextTick(() => {
        if (this.fit) {
          this.$el.style.minWidth = width(this.anchorEl) + 'px'
        }
        const { top } = this.anchorEl.getBoundingClientRect()
        const { height } = viewport()
        if (top < 0 || top > height) {
          return this.hide()
        }
        setPosition({
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
