import Vue from 'vue'

import AnchorMixin from '../../mixins/anchor.js'
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

  mixins: [ AnchorMixin, ModelToggleMixin, PortalMixin, MenuTreeMixin, TransitionMixin ],

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
    noParentEvent: Boolean,

    touchPosition: Boolean,
    persistent: Boolean,
    autoClose: Boolean,

    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object]
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
    noParentEvent (val) {
      if (this.anchorEl !== void 0) {
        if (val === true) {
          this.__unconfigureAnchorEl()
        }
        else {
          this.__configureAnchorEl()
        }
      }
    }
  },

  methods: {
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
        const { top, left } = this.anchorEl.getBoundingClientRect()

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

    __onAutoClose (e) {
      closeRootMenu(this.portalId)
      this.$listeners.click !== void 0 && this.$emit('click', e)
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
          class: this.contentClass,
          style: this.contentStyle,
          attrs: this.$attrs,
          on: this.autoClose === true ? {
            click: this.__onAutoClose,
            ...this.$listeners
          } : this.$listeners,
          directives: this.persistent !== true ? [{
            name: 'click-outside',
            value: this.hide,
            arg: [ this.anchorEl ]
          }] : null
        }, this.$slots.default) : null
      ])
    }
  }
})
