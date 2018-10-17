import Vue from 'vue'

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
import { position, listenOpts } from '../../utils/event.js'
import CanRenderMixinMixin from '../../mixins/can-render.js'

export default Vue.extend({
  name: 'QPopover',

  mixins: [ ModelToggleMixin, CanRenderMixinMixin ],

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
    keepOnScreen: Boolean,
    maxHeight: String,
    maxWidth: String,
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
      staticClass: 'q-popover generic-border-radius scroll',
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

      if (
        this.anchorEl.classList.contains('q-btn__content') ||
        this.anchorEl.classList.contains('q-if-inner') ||
        this.anchorEl.classList.contains('no-pointer-events')
      ) {
        this.anchorEl = this.anchorEl.parentNode
      }

      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer')
        this.anchorEl.addEventListener('click', this.toggle)
        this.anchorEl.addEventListener('keyup', this.__toggleKey)
      }
    })

    this.value && this.show()
  },

  beforeDestroy () {
    this.showing && this.__cleanup()
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
      EscapeKey.register(() => {
        this.$emit('escape-key')
        this.hide()
      })
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
        document.body.addEventListener('mousedown', this.__bodyHide, true)
        document.body.addEventListener('touchstart', this.__bodyHide, true)
        this.$emit('show')
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
      this.__cleanup()
      this.$emit('hide')
      if (!this.noRefocus && this.__refocusTarget) {
        this.__refocusTarget.focus()
        !this.__refocusTarget.classList.contains('q-if') && this.__refocusTarget.blur()
      }
    },

    __cleanup () {
      clearTimeout(this.timer)

      document.body.removeEventListener('mousedown', this.__bodyHide, true)
      document.body.removeEventListener('touchstart', this.__bodyHide, true)
      this.scrollTarget.removeEventListener('scroll', this.__updatePosition, listenOpts.passive)
      if (this.scrollTarget !== window) {
        window.removeEventListener('scroll', this.__updatePosition, listenOpts.passive)
      }
      window.removeEventListener('resize', this.__updatePosition, listenOpts.passive)
      EscapeKey.pop()

      this.$el.remove()
    },

    reposition (evt, animate) {
      const { top, bottom, left, right } = this.anchorEl.getBoundingClientRect()

      if (
        !this.keepOnScreen &&
        (bottom < 0 || top > window.innerHeight || right < 0 || left > window.innerWidth)
      ) {
        return this.hide()
      }

      if (this.fit || this.cover) {
        const style = window.getComputedStyle(this.anchorEl)
        this.$el.style.minWidth = style.getPropertyValue('width')
        if (this.cover) {
          this.$el.style.minHeight = style.getPropertyValue('height')
        }
      }

      if (animate) {
        if (this.touchPosition) {
          const pos = position(evt)
          this.touchOffset = { left: pos.left - left, top: pos.top - top }
        }
        else {
          delete this.touchOffset
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
        maxWidth: this.maxWidth,
        anchorClick: this.anchorClick,
        touchPosition: this.touchPosition,
        touchOffset: this.touchOffset,
        cover: this.cover
      })
    }
  }
})
