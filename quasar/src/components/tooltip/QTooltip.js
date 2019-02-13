import Vue from 'vue'

import AnchorMixin from '../../mixins/anchor.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

import { getScrollTarget } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import slot from '../../utils/slot.js'
import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/position-engine.js'

export default Vue.extend({
  name: 'QTooltip',

  mixins: [ AnchorMixin, ModelToggleMixin, PortalMixin, TransitionMixin ],

  props: {
    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object],
    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    },

    transitionShow: {
      default: 'jump-down'
    },
    transitionHide: {
      default: 'jump-up'
    },

    anchor: {
      type: String,
      default: 'bottom middle',
      validator: validatePosition
    },
    self: {
      type: String,
      default: 'top middle',
      validator: validatePosition
    },
    offset: {
      type: Array,
      default: () => [14, 14],
      validator: validateOffset
    },

    target: {
      type: [Boolean, String],
      default: true
    },

    delay: {
      type: Number,
      default: 0
    }
  },

  watch: {
    $route () {
      this.hide()
    },

    target (val) {
      if (this.anchorEl !== void 0) {
        this.__unconfigureAnchorEl()
      }

      this.__pickAnchorEl()
    }
  },

  computed: {
    anchorOrigin () {
      return parsePosition(this.anchor)
    },

    selfOrigin () {
      return parsePosition(this.self)
    }
  },

  methods: {
    __showCondition (evt) {
      // abort with no parent configured or on multi-touch
      return !(this.anchorEl === void 0 || (evt !== void 0 && evt.touches !== void 0 && evt.touches.length > 1))
    },

    __show (evt) {
      clearTimeout(this.timer)

      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.hide, listenOpts.passive)
      if (this.scrollTarget !== window) {
        window.addEventListener('scroll', this.updatePosition, listenOpts.passive)
      }

      this.__showPortal()

      this.timer = setTimeout(() => {
        this.updatePosition()

        this.timer = setTimeout(() => {
          this.$emit('show', evt)
        }, 600)
      }, 0)
    },

    __hide (evt) {
      this.__cleanup()

      this.timer = setTimeout(() => {
        this.__hidePortal()
        this.$emit('hide', evt)
      }, 600)
    },

    __cleanup () {
      clearTimeout(this.timer)

      if (this.scrollTarget) {
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
        selfOrigin: this.selfOrigin
      })
    },

    __delayShow (evt) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.show(evt)
      }, this.delay)
    },

    __delayHide (evt) {
      clearTimeout(this.timer)
      this.hide(evt)
    },

    __unconfigureAnchorEl () {
      if (this.$q.platform.is.mobile) {
        this.anchorEl.removeEventListener('touchstart', this.__delayShow)
        this.anchorEl.removeEventListener('touchmove', this.__delayHide)
        this.anchorEl.removeEventListener('touchend', this.__delayHide)
      }

      this.anchorEl.removeEventListener('mouseenter', this.__delayShow)
      this.anchorEl.removeEventListener('mouseleave', this.__delayHide)
    },

    __configureAnchorEl () {
      if (this.$q.platform.is.mobile) {
        this.anchorEl.addEventListener('touchstart', this.__delayShow)
        this.anchorEl.addEventListener('touchmove', this.__delayHide)
        this.anchorEl.addEventListener('touchend', this.__delayHide)
      }

      this.anchorEl.addEventListener('mouseenter', this.__delayShow)
      this.anchorEl.addEventListener('mouseleave', this.__delayHide)
    },

    __setAnchorEl (el) {
      this.anchorEl = el
      while (this.anchorEl.classList.contains('q-anchor--skip')) {
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
          console.error(`QTooltip: target "${this.target}" not found`, this)
        }
      }
      else if (this.target !== false) {
        this.__setAnchorEl(this.parentEl)
      }
    },

    __render (h) {
      return h('transition', {
        props: { name: this.transition }
      }, [
        this.showing === true ? h('div', {
          staticClass: 'q-tooltip no-pointer-events',
          class: this.contentClass,
          style: this.contentStyle
        }, slot(this, 'default')) : null
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
    this.__cleanup()

    if (this.anchorEl !== void 0) {
      this.__unconfigureAnchorEl()
    }
  }
})
