import Vue from 'vue'

import AnchorMixin from '../../mixins/anchor.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

import ClickOutside from './ClickOutside.js'
import ClosePopup from '../../directives/ClosePopup.js'

import uid from '../../utils/uid.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { stop, position, listenOpts } from '../../utils/event.js'
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
    ClickOutside,
    ClosePopup
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

    useObserver: Boolean,

    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    },

    noFocus: Boolean,
    noRefocus: Boolean
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
    },

    directives () {
      const directives = []

      if (this.autoClose === true) {
        directives.push({
          name: 'close-popup'
        })
      }

      if (this.persistent !== true && this.anchorEl !== void 0) {
        directives.push({
          name: 'click-outside',
          arg: [this.anchorEl]
        })
      }

      return directives.length > 0 ? directives : void 0
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

      this.__refocusTarget = this.noRefocus === false
        ? document.activeElement
        : void 0

      if (this.useObserver === true) {
        this.touchTargetObserver = new MutationObserver(() => {
          this.updatePosition()
        })
        this.touchTargetObserver.observe(this.anchorEl, {
          childList: true,
          characterData: true,
          subtree: true
        })
      }

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

        this.$el.dispatchEvent(new Event('popup-show', { bubbles: true }))

        this.timer = setTimeout(() => {
          this.$emit('show', evt)

          this.noFocus !== true && this.__portal.$el !== void 0 && this.__portal.$el.focus !== void 0 && this.__portal.$el.focus()
        }, 300)
      }, 0)
    },

    __hide (evt) {
      this.__anchorCleanup(true)

      if (this.__refocusTarget !== void 0) {
        this.__refocusTarget.focus()
      }

      this.$el.dispatchEvent(new Event('popup-hide', { bubbles: true }))

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

        if (this.touchTargetObserver !== void 0) {
          this.touchTargetObserver.disconnect()
          this.touchTargetObserver = void 0
        }

        this.scrollTarget.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        if (this.scrollTarget !== window) {
          window.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        }
      }
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

      return h('transition', {
        props: { name: this.transition }
      }, [
        this.showing === true ? h('div', {
          staticClass: 'q-menu scroll',
          class: this.contentClass,
          style: this.contentStyle,
          attrs: {
            tabindex: -1,
            ...this.$attrs
          },
          on,
          directives: this.directives
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
