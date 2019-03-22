import Vue from 'vue'

import AnchorMixin from '../../mixins/anchor.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

import ClickOutside from './ClickOutside.js'
import uid from '../../utils/uid.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { stop, prevent, position, listenOpts } from '../../utils/event.js'
import EscapeKey from '../../utils/escape-key.js'
import { MenuTreeMixin, closeRootMenu } from './menu-tree.js'

import slot from '../../utils/slot.js'

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

    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      menuId: uid()
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
      evt !== void 0 && prevent(evt)

      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.updatePosition, listenOpts.passive)
      if (this.scrollTarget !== window) {
        window.addEventListener('scroll', this.updatePosition, listenOpts.passive)
      }

      EscapeKey.register(this, () => {
        this.$emit('escape-key')
        this.hide()
      })

      this.__showPortal()
      this.__registerTree()

      this.timer = setTimeout(() => {
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

        this.timer = setTimeout(() => {
          this.$emit('show', evt)
        }, 300)
      }, 0)
    },

    __hide (evt) {
      this.__anchorCleanup(true)

      evt !== void 0 && prevent(evt)

      this.timer = setTimeout(() => {
        this.__hidePortal()
        this.$emit('hide', evt)
      }, 300)
    },

    __anchorCleanup (hiding) {
      clearTimeout(this.timer)
      this.absoluteOffset = void 0

      if (this.unwatch !== void 0) {
        this.unwatch()
        this.unwatch = void 0
      }

      if (hiding === true || this.showing === true) {
        EscapeKey.pop(this)
        this.__unregisterTree()

        this.scrollTarget.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        if (this.scrollTarget !== window) {
          window.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        }
      }
    },

    __onAutoClose (e) {
      closeRootMenu(this.menuId)
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

      el.style.maxHeight = this.maxHeight
      el.style.maxWidth = this.maxWidth

      setPosition({
        el,
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
          staticClass: 'q-menu scroll',
          class: this.contentClass,
          style: this.contentStyle,
          attrs: this.$attrs,
          on,
          directives: this.persistent !== true ? [{
            name: 'click-outside',
            value: this.hide,
            arg: [ this.anchorEl ]
          }] : null
        }, slot(this, 'default')) : null
      ])
    },

    __onPortalCreated (vm) {
      vm.menuParentId = this.menuId
    },

    __onPortalClose () {
      closeRootMenu(this.menuId)
    }
  }
})
