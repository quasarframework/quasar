import {
  positionValidator,
  offsetValidator,
  parsePosition,
  setPosition
} from '../../utils/popup.js'
import frameDebounce from '../../utils/frame-debounce.js'
import { getScrollTarget } from '../../utils/scroll.js'
import EscapeKey from '../../utils/escape-key.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import { listenOpts } from '../../utils/event.js'
import CanRenderMixinMixin from '../../mixins/can-render.js'

export default {
  name: 'QPopover',
  mixins: [ModelToggleMixin, CanRenderMixinMixin],
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
    cover: Boolean,
    persistent: Boolean,
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
    noFocus: Boolean,
    noRefocus: Boolean,
    disable: Boolean
  },
  watch: {
    $route () {
      this.hide()
    }
  },
  computed: {
    horizSide () {
      return this.$q.i18n.rtl ? 'right' : 'left'
    },
    anchorOrigin () {
      return parsePosition(
        this.cover
          ? `top ${this.horizSide}`
          : this.anchor || `bottom ${this.horizSide}`
      )
    },
    selfOrigin () {
      return parsePosition(this.self || `top ${this.horizSide}`)
    }
  },
  render (h) {
    if (!this.canRender) { return }

    return h('div', {
      staticClass: 'q-popover scroll',
      ref: 'content',
      attrs: { tabindex: -1 },
      on: {
        click (e) { e.stopPropagation() }
      }
    }, this.$slots.default)
  },
  mounted () {
    this.__updatePosition = frameDebounce((_, event, animate) => this.reposition(event, animate))
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode
      this.anchorEl.removeChild(this.$el)
      if (this.anchorEl.classList.contains('q-btn-inner') || this.anchorEl.classList.contains('q-if-inner')) {
        this.anchorEl = this.anchorEl.parentNode
      }
      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer')
        this.anchorEl.addEventListener('click', this.toggle)
        this.anchorEl.addEventListener('keyup', this.__toggleKey)
      }
    })
    if (this.value) {
      this.show()
    }
  },
  beforeDestroy () {
    if (this.anchorClick && this.anchorEl) {
      this.anchorEl.removeEventListener('click', this.toggle)
      this.anchorEl.removeEventListener('keyup', this.__toggleKey)
    }
  },
  methods: {
    __show (evt) {
      if (!this.noRefocus) {
        this.__refocusTarget = (this.anchorClick && this.anchorEl) || document.activeElement
      }
      document.body.appendChild(this.$el)
      EscapeKey.register(() => { !this.persistent && this.hide() })
      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.__updatePosition, listenOpts.passive)
      if (this.scrollTarget !== window) {
        window.addEventListener('scroll', this.__updatePosition, listenOpts.passive)
      }
      window.addEventListener('resize', this.__updatePosition, listenOpts.passive)
      this.__updatePosition(0, evt, true)

      clearTimeout(this.timer)
      if (!this.noFocus && this.$refs.content) {
        this.$refs.content.focus()
      }
      this.timer = setTimeout(() => {
        document.body.addEventListener('click', this.__bodyHide, true)
        document.body.addEventListener('touchstart', this.__bodyHide, true)
        this.$emit('show', evt)
        this.showPromise && this.showPromiseResolve()
      }, 0)
    },
    __toggleKey (evt) {
      if (evt.keyCode === 13) {
        this.toggle(evt)
      }
    },
    __bodyHide (evt) {
      if (
        this.persistent || (
          evt && evt.target &&
          (this.$el.contains(evt.target) || this.anchorEl.contains(evt.target))
        )
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
      if (this.scrollTarget !== window) {
        window.removeEventListener('scroll', this.__updatePosition, listenOpts.passive)
      }
      window.removeEventListener('resize', this.__updatePosition, listenOpts.passive)
      EscapeKey.pop()

      this.$el.remove()
      this.hidePromise && this.hidePromiseResolve()
      if (!this.noRefocus && this.__refocusTarget) {
        this.__refocusTarget.focus()
      }
      this.$emit('hide')
    },
    reposition (event, animate) {
      const { top, bottom } = this.anchorEl.getBoundingClientRect()

      if (bottom < 0 || top > window.innerHeight) {
        return this.hide()
      }

      if (this.fit || this.cover) {
        const style = window.getComputedStyle(this.anchorEl)
        this.$el.style.minWidth = style.getPropertyValue('width')
        if (this.cover) {
          this.$el.style.minHeight = style.getPropertyValue('height')
        }
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
