import Vue from 'vue'

import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'
import ClickOutside from '../../directives/click-outside.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { position, listenOpts } from '../../utils/event.js'
import EscapeKey from '../../utils/escape-key.js'
import { MenuTreeMixin, closeRootMenu } from './menu-tree.js'

import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/position-engine.js'

export default Vue.extend({
  name: 'QMenu',

  mixins: [ ModelToggleMixin, PortalMixin, MenuTreeMixin, TransitionMixin ],

  directives: {
    ClickOutside
  },

  props: {
    fit: Boolean,
    cover: Boolean,
    anchor: {
      type: String,
      validator: validatePosition
    },
    self: {
      type: String,
      validator: validatePosition
    },
    offset: {
      type: Array,
      validator: validateOffset
    },

    target: {
      type: [Boolean, String],
      default: true
    },
    contextMenu: Boolean,
    touchPosition: Boolean,
    persistent: Boolean,
    autoClose: Boolean
  },

  computed: {
    horizSide () {
      return this.$q.i18n.rtl ? 'right' : 'left'
    },

    anchorOrigin () {
      return parsePosition(
        this.anchor || (
          this.cover === true ? `top ${this.horizSide}` : `bottom ${this.horizSide}`
        )
      )
    },

    selfOrigin () {
      return this.cover === true
        ? this.anchorOrigin
        : parsePosition(this.self || `top ${this.horizSide}`)
    }
  },

  watch: {
    contextMenu (val) {
      if (this.anchorEl !== void 0) {
        this.__unconfigureAnchorEl(!val)
        this.__configureAnchorEl(val)
      }
    },

    target (val) {
      if (this.anchorEl !== void 0) {
        this.__unconfigureAnchorEl()
      }

      this.__pickAnchorEl()
    }
  },

  methods: {
    __showCondition (evt) {
      // abort with no parent configured or on multi-touch
      if (this.anchorEl === void 0 || (evt !== void 0 && evt.touches !== void 0 && evt.touches.length > 1)) {
        return false
      }
      return true
    },

    __show (evt) {
      clearTimeout(this.timer)
      evt !== void 0 && evt.preventDefault()

      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.updatePosition, listenOpts.passive)
      if (this.scrollTarget !== window) {
        window.addEventListener('scroll', this.updatePosition, listenOpts.passive)
      }

      EscapeKey.register(() => {
        this.$emit('escape-key')
        this.hide()
      })

      this.__showPortal()
      this.__registerTree()

      this.$nextTick(() => {
        const { width, height, top, left } = this.anchorEl.getBoundingClientRect()

        if (this.fit || this.cover) {
          this.__portal.$el.style.minWidth = width + 'px'
          if (this.cover) {
            this.__portal.$el.style.minHeight = height + 'px'
          }
        }

        if (this.touchPosition || this.contextMenu) {
          const pos = position(evt)
          this.absoluteOffset = { left: pos.left - left, top: pos.top - top }
        }
        else {
          this.absoluteOffset = void 0
        }

        this.updatePosition()

        if (this.unwatch === void 0) {
          this.unwatch = this.$watch('$q.screen.width', this.updatePosition)
        }
      })

      this.timer = setTimeout(() => {
        this.$emit('show', evt)
      }, 600)
    },

    __hide (evt) {
      this.__cleanup()

      evt !== void 0 && evt.preventDefault()

      this.timer = setTimeout(() => {
        this.__hidePortal()
        this.$emit('hide', evt)
      }, 600)
    },

    __cleanup () {
      clearTimeout(this.timer)
      this.absoluteOffset = void 0

      EscapeKey.pop()
      this.__unregisterTree()

      if (this.unwatch !== void 0) {
        this.unwatch()
        this.unwatch = void 0
      }

      if (this.scrollTarget) {
        this.scrollTarget.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        if (this.scrollTarget !== window) {
          window.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        }
      }
    },

    __onAutoClose () {
      closeRootMenu(this.portalId)
    },

    __toggleKey (evt) {
      if (evt.keyCode === 13) {
        this.toggle(evt)
      }
    },

    __contextClick (evt) {
      this.hide(evt)
      this.show(evt)
    },

    __mobileTouch (evt) {
      this.__mobileCleanup()
      if (evt && evt.touches && evt.touches.length > 1) {
        return
      }
      this.hide(evt)
      this.anchorEl.classList.add('non-selectable')
      this.touchTimer = setTimeout(() => {
        this.__mobileCleanup()
        this.touchTimer = setTimeout(() => {
          this.show(evt)
        }, 10)
      }, 600)
    },

    __mobileCleanup () {
      this.anchorEl.classList.remove('non-selectable')
      clearTimeout(this.touchTimer)
    },

    __unconfigureAnchorEl (context = this.contextMenu) {
      if (context === true) {
        if (this.$q.platform.is.mobile) {
          this.anchorEl.removeEventListener('touchstart', this.__mobileTouch)
          ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
            this.anchorEl.removeEventListener(evt, this.__mobileCleanup)
          })
        }
        else {
          this.anchorEl.removeEventListener('click', this.hide)
          this.anchorEl.removeEventListener('contextmenu', this.__contextClick)
        }
      }
      else {
        this.anchorEl.removeEventListener('click', this.toggle)
        this.anchorEl.removeEventListener('keyup', this.__toggleKey)
      }
    },

    __configureAnchorEl (context = this.contextMenu) {
      if (context === true) {
        if (this.$q.platform.is.mobile) {
          this.anchorEl.addEventListener('touchstart', this.__mobileTouch)
          ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
            this.anchorEl.addEventListener(evt, this.__mobileCleanup)
          })
        }
        else {
          this.anchorEl.addEventListener('click', this.hide)
          this.anchorEl.addEventListener('contextmenu', this.__contextClick)
        }
      }
      else {
        this.anchorEl.addEventListener('click', this.toggle)
        this.anchorEl.addEventListener('keyup', this.__toggleKey)
      }
    },

    __setAnchorEl (el) {
      this.anchorEl = el
      while (this.anchorEl.classList.contains('q-menu--skip')) {
        this.anchorEl = this.anchorEl.parentNode
      }
      this.__configureAnchorEl()
    },

    __pickAnchorEl () {
      if (this.target && typeof this.target === 'string') {
        const el = document.querySelector(this.target)
        if (el !== null) {
          this.__setAnchorEl(el)
        }
        else {
          console.error(`QMenu: target "${this.target}" not found`, this)
        }
      }
      else if (this.target !== false) {
        this.__setAnchorEl(this.parentEl)
      }
    },

    updatePosition () {
      setPosition({
        el: this.__portal.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        absoluteOffset: this.absoluteOffset,
        fit: this.fit,
        cover: this.cover
      })
    },

    __render (h) {
      return h('transition', {
        props: { name: this.transition }
      }, [
        this.showing ? h('div', {
          staticClass: 'q-menu scroll',
          on: this.autoClose === true ? {
            click: this.__onAutoClose
          } : null,
          directives: this.persistent !== true ? [{
            name: 'click-outside',
            value: this.hide,
            arg: [ this.anchorEl ]
          }] : null
        }, this.$slots.default) : null
      ])
    }
  },

  mounted () {
    this.parentEl = this.$el.parentNode

    this.$nextTick(() => {
      this.__pickAnchorEl()

      if (this.value === true) {
        if (this.anchorEl === void 0) {
          this.$emit('input', false)
        }
        else {
          this.show()
        }
      }
    })
  },

  beforeDestroy () {
    clearTimeout(this.touchTimer)
    this.__cleanup()

    if (this.anchorEl !== void 0) {
      this.__unconfigureAnchorEl()
    }
  }
})
