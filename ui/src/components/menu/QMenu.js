import Vue from 'vue'

import AnchorMixin from '../../mixins/anchor.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin, { closePortalMenus } from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

import ClickOutside from './ClickOutside.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { create, stop, position, listenOpts, stopAndPrevent } from '../../utils/event.js'
import EscapeKey from '../../utils/escape-key.js'

import slot from '../../utils/slot.js'

import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/position-engine.js'

export default Vue.extend({
  name: 'QMenu',

  mixins: [ AnchorMixin, ModelToggleMixin, PortalMixin, TransitionMixin ],

  directives: {
    ClickOutside
  },

  props: {
    persistent: Boolean,
    autoClose: Boolean,
    separateClosePopup: Boolean,

    noRefocus: Boolean,
    noFocus: Boolean,

    fit: Boolean,
    cover: Boolean,

    square: Boolean,

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

    touchPosition: Boolean,

    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    }
  },

  computed: {
    horizSide () {
      return this.$q.lang.rtl ? 'right' : 'left'
    },

    anchorOrigin () {
      return parsePosition(
        this.anchor || (
          this.cover === true ? `center middle` : `bottom ${this.horizSide}`
        )
      )
    },

    selfOrigin () {
      return this.cover === true
        ? this.anchorOrigin
        : parsePosition(this.self || `top ${this.horizSide}`)
    },

    menuClass () {
      return this.square === true ? ' q-menu--square' : ''
    },

    hideOnRouteChange () {
      return this.persistent !== true
    }
  },

  methods: {
    focus () {
      let node = this.__portal.$refs !== void 0 ? this.__portal.$refs.inner : void 0

      if (node !== void 0 && node.contains(document.activeElement) !== true) {
        node = node.querySelector('[autofocus]') || node
        node.focus()
      }
    },

    __show (evt) {
      this.__refocusTarget = this.noRefocus === false
        ? document.activeElement
        : void 0

      EscapeKey.register(this, () => {
        if (this.persistent !== true) {
          this.$emit('escape-key')
          this.hide()
        }
      })

      this.__showPortal()
      this.__configureScrollTarget()

      const { top, left } = this.anchorEl.getBoundingClientRect()

      if (evt !== void 0 && (this.touchPosition || this.contextMenu)) {
        const pos = position(evt)
        this.absoluteOffset = { left: pos.left - left, top: pos.top - top }
      }
      else {
        this.absoluteOffset = void 0
      }

      if (this.unwatch === void 0) {
        this.unwatch = this.$watch('$q.screen.width', this.updatePosition)
      }

      this.$el.dispatchEvent(create('popup-show', { bubbles: true }))

      if (this.noFocus !== true) {
        document.activeElement.blur()
      }

      this.__nextTick(() => {
        this.updatePosition()
        this.noFocus !== true && this.focus()
      })

      this.__setTimeout(() => {
        this.$emit('show', evt)
      }, 300)
    },

    __hide (evt) {
      this.__anchorCleanup(true)

      // check null for IE
      if (this.__refocusTarget !== void 0 && this.__refocusTarget !== null) {
        this.__refocusTarget.focus()
      }

      this.$el.dispatchEvent(create('popup-hide', { bubbles: true }))

      this.__setTimeout(() => {
        this.__hidePortal()
        this.$emit('hide', evt)
      }, 300)
    },

    __anchorCleanup (hiding) {
      this.absoluteOffset = void 0

      if (this.unwatch !== void 0) {
        this.unwatch()
        this.unwatch = void 0
      }

      if (hiding === true || this.showing === true) {
        EscapeKey.pop(this)
        this.__unconfigureScrollTarget()
      }
    },

    __unconfigureScrollTarget () {
      if (this.scrollTarget !== void 0) {
        this.scrollTarget.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        if (this.scrollTarget !== window) {
          window.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        }
      }
    },

    __configureScrollTarget () {
      if (this.anchorEl !== void 0) {
        this.scrollTarget = getScrollTarget(this.anchorEl)
        this.scrollTarget.addEventListener('scroll', this.updatePosition, listenOpts.passive)
        if (this.scrollTarget !== window) {
          window.addEventListener('scroll', this.updatePosition, listenOpts.passive)
        }
      }
    },

    __onAutoClose (e) {
      closePortalMenus(this, e)
      this.$listeners.click !== void 0 && this.$emit('click', e)
    },

    updatePosition () {
      const el = this.__portal.$el

      if (el.nodeType === 8) { // IE replaces the comment with delay
        setTimeout(() => {
          this.__portal !== void 0 && this.__portal.showing === true && this.updatePosition()
        }, 25)
        return
      }

      setPosition({
        el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        absoluteOffset: this.absoluteOffset,
        fit: this.fit,
        cover: this.cover,
        maxHeight: this.maxHeight,
        maxWidth: this.maxWidth
      })
    },

    __onClickOutside (e) {
      if (this.persistent !== true && this.showing === true) {
        this.hide(e)
        stopAndPrevent(e)
        return true
      }
    },

    __render (h) {
      const on = {
        ...this.$listeners,
        input: stop
      }

      if (this.autoClose === true) {
        on.click = this.__onAutoClose
      }

      return h('transition', {
        props: { name: this.transition }
      }, [
        this.showing === true ? h('div', {
          ref: 'inner',
          staticClass: 'q-menu scroll' + this.menuClass,
          class: this.contentClass,
          style: this.contentStyle,
          attrs: {
            tabindex: -1,
            ...this.$attrs
          },
          on,
          directives: [{
            name: 'click-outside',
            value: this.__onClickOutside,
            arg: this.anchorEl
          }]
        }, slot(this, 'default')) : null
      ])
    }
  },

  mounted () {
    this.__processModelChange(this.value)
  },

  beforeDestroy () {
    // When the menu is destroyed while open we can only emit the event on anchorEl
    if (this.showing === true && this.anchorEl !== void 0) {
      this.anchorEl.dispatchEvent(
        create('popup-hide', { bubbles: true })
      )
    }
  }
})
