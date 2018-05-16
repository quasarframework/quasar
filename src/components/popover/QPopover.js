import {
  positionValidator,
  offsetValidator,
  parsePosition,
  setPosition
} from '../../utils/popup'
import { frameDebounce } from '../../utils/debounce'
import { getScrollTarget } from '../../utils/scroll'
import { width } from '../../utils/dom'
import EscapeKey from '../../utils/escape-key'
import ModelToggleMixin from '../../mixins/model-toggle'
import { listenOpts } from '../../utils/event'

export default {
  name: 'QPopover',
  mixins: [ModelToggleMixin],
  props: {
    anchor: {
      type: String,
      validator: positionValidator
    },
    self: {
      type: String,
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
    anchorOrigin () {
      return parsePosition(this.anchor || `bottom ${this.$q.i18n.rtl ? 'right' : 'left'}`)
    },
    selfOrigin () {
      return parsePosition(this.self || `top ${this.$q.i18n.rtl ? 'right' : 'left'}`)
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-popover scroll',
      on: {
        click (e) { e.stopPropagation() }
      }
    }, [
      this.$slots.default
    ])
  },
  created () {
    this.__updatePosition = frameDebounce((_, event, animate) => this.reposition(event, animate))
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode
      this.anchorEl.removeChild(this.$el)
      if (this.anchorEl.classList.contains('q-btn-inner') || this.anchorEl.classList.contains('q-if-inner')) {
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
      this.scrollTarget.addEventListener('scroll', this.__updatePosition, listenOpts.passive)
      window.addEventListener('resize', this.__updatePosition, listenOpts.passive)
      this.__updatePosition(0, evt, true)

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
    __hide () {
      clearTimeout(this.timer)

      document.body.removeEventListener('click', this.__bodyHide, true)
      document.body.removeEventListener('touchstart', this.__bodyHide, true)
      this.scrollTarget.removeEventListener('scroll', this.__updatePosition, listenOpts.passive)
      window.removeEventListener('resize', this.__updatePosition, listenOpts.passive)
      EscapeKey.pop()

      document.body.removeChild(this.$el)
      this.hidePromise && this.hidePromiseResolve()
    },
    reposition (event, animate) {
      if (this.fit) {
        this.$el.style.minWidth = width(this.anchorEl) + 'px'
      }
      const { top, bottom } = this.anchorEl.getBoundingClientRect()

      if (bottom < 0 || top > window.innerHeight) {
        return this.hide()
      }

      setPosition({
        event,
        animate,
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
