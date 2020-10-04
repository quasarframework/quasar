import { h, defineComponent, Transition } from 'vue'

import AnchorMixin from '../../mixins/anchor.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import DarkMixin from '../../mixins/dark.js'
import PortalMixin, { closePortalMenus } from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

import { getScrollTarget } from '../../utils/scroll.js'
import { position, stopAndPrevent } from '../../utils/event.js'
import { slot } from '../../utils/render.js'
import { addEscapeKey, removeEscapeKey } from '../../utils/escape-key.js'
import { addFocusout, removeFocusout } from '../../utils/focusout.js'
import { childHasFocus } from '../../utils/dom.js'
import { addClickOutside, removeClickOutside } from '../../utils/click-outside.js'

import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/position-engine.js'

export default defineComponent({
  name: 'QMenu',

  inheritAttrs: false,

  mixins: [
    DarkMixin,
    AnchorMixin,
    ModelToggleMixin,
    PortalMixin,
    TransitionMixin
  ],

  props: {
    persistent: Boolean,
    autoClose: Boolean,
    separateClosePopup: Boolean,

    noRouteDismiss: Boolean,
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

    scrollTarget: {
      default: void 0
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

  emits: [ 'click', 'escape-key' ],

  watch: {
    handlesFocus (val) {
      if (val === true) {
        addEscapeKey(this.__onEscapeKey)
        addClickOutside(this.__getClickOutsideVm)
      }
      else {
        removeEscapeKey(this.__onEscapeKey)
        removeClickOutside(this.__getClickOutsideVm)
      }
    }
  },

  computed: {
    horizSide () {
      return this.$q.lang.rtl === true ? 'right' : 'left'
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
      return (this.square === true ? ' q-menu--square' : '') +
        (this.isDark === true ? ' q-menu--dark q-dark' : '')
    },

    hideOnRouteChange () {
      return this.persistent !== true &&
        this.noRouteDismiss !== true
    },

    onEvents () {
      return this.autoClose === true
        ? { onClick: this.__onAutoClose }
        : {}
    },

    handlesFocus () {
      return this.showing === true && this.persistent !== true
    }
  },

  methods: {
    focus () {
      let node = this.$refs.inner

      if (node !== void 0 && node.contains(document.activeElement) !== true) {
        node = node.querySelector('[autofocus], [data-autofocus]') || node
        node.focus()
      }
    },

    __show (evt) {
      // IE can have null document.activeElement
      this.__refocusTarget = this.noRefocus === false && document.activeElement !== null
        ? document.activeElement
        : void 0

      addFocusout(this.__onFocusout)

      this.__showPortal()
      this.__configureScrollTarget()

      this.absoluteOffset = void 0

      if (evt !== void 0 && (this.touchPosition || this.contextMenu)) {
        const pos = position(evt)

        if (pos.left !== void 0) {
          const { top, left } = this.anchorEl.getBoundingClientRect()
          this.absoluteOffset = { left: pos.left - left, top: pos.top - top }
        }
      }

      if (this.unwatch === void 0) {
        this.unwatch = this.$watch(
          () => this.$q.screen.width + '|' + this.$q.screen.height + '|' + this.self + '|' + this.anchor,
          this.updatePosition
        )
      }

      // IE can have null document.activeElement
      if (this.noFocus !== true && document.activeElement !== null) {
        document.activeElement.blur()
      }

      this.__nextTick(() => {
        this.updatePosition()
        this.noFocus !== true && this.focus()
      })

      this.__setTimeout(() => {
        // required in order to avoid the "double-tap needed" issue
        if (this.$q.platform.is.ios === true) {
          // if auto-close, then this click should
          // not close the menu
          this.__avoidAutoClose = this.autoClose
          this.$refs.inner.click()
        }

        this.updatePosition()
        this.$emit('show', evt)
      }, 300)
    },

    __hide (evt) {
      this.__anchorCleanup(true)

      // check null for IE
      if (
        this.__refocusTarget !== void 0 &&
        this.__refocusTarget !== null &&
        (
          // menu was hidden from code or ESC plugin
          evt === void 0 ||
          // menu was not closed from a mouse or touch clickOutside
          evt.qClickOutside !== true
        )
      ) {
        this.__refocusTarget.focus()
      }

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
        removeFocusout(this.__onFocusout)
        this.__unconfigureScrollTarget()
        if (this.persistent !== true) {
          removeClickOutside(this.__getClickOutsideVm)
          removeEscapeKey(this.__onEscapeKey)
        }
      }
    },

    __unconfigureScrollTarget () {
      if (this.__scrollTarget !== void 0) {
        this.__changeScrollEvent(this.__scrollTarget)
        this.__scrollTarget = void 0
      }
    },

    __configureScrollTarget () {
      if (this.anchorEl !== void 0 || this.scrollTarget !== void 0) {
        this.__scrollTarget = getScrollTarget(this.anchorEl, this.scrollTarget)
        this.__changeScrollEvent(this.__scrollTarget, this.updatePosition)
      }
    },

    __onAutoClose (e) {
      // if auto-close, then the ios double-tap fix which
      // issues a click should not close the menu
      if (this.__avoidAutoClose !== true) {
        closePortalMenus(this, e)
        this.$emit('click', e)
      }
      else {
        this.__avoidAutoClose = false
      }
    },

    __onFocusout (evt) {
      // the focus is not in a vue child component
      if (
        this.handlesFocus === true &&
        childHasFocus(this.$refs.inner, evt.target) !== true
      ) {
        this.focus()
      }
    },

    __onEscapeKey (evt) {
      this.$emit('escape-key')
      this.hide(evt)
    },

    updatePosition () {
      const el = this.$refs.inner

      if (this.anchorEl === void 0 || !el) {
        return
      }

      if (el.nodeType === 8) { // IE replaces the comment with delay
        setTimeout(this.updatePosition, 25)
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
        const targetClassList = e.target.classList

        this.hide(e)
        if (
          // always prevent touch event
          e.type === 'touchstart' ||
          // prevent click if it's on a dialog backdrop
          targetClassList.contains('q-dialog__backdrop')
        ) {
          stopAndPrevent(e)
        }
        return true
      }
    },

    // we use a reference that won't change between
    // re-renders for the click-outside management
    __getClickOutsideVm () {
      return this
    },

    __renderPortal () {
      return h(
        Transition,
        { name: this.transition, appear: true },
        () => this.showing === true
          ? h('div', {
            ref: 'inner',
            tabindex: -1,
            ...this.$attrs,
            class: [
              'q-menu q-position-engine scroll' + this.menuClass,
              this.contentClass
            ],
            style: this.contentStyle,
            ...this.onEvents
          }, slot(this, 'default'))
          : null
      )
    }
  },

  mounted () {
    this.__processModelChange(this.modelValue)
  }
})
