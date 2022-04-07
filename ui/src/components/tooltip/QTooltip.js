import Vue from 'vue'

import AnchorMixin from '../../mixins/anchor.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

import { getScrollTarget } from '../../utils/scroll.js'
import { addEvt, cleanEvt } from '../../utils/event.js'
import { clearSelection } from '../../utils/selection.js'
import { slot } from '../../utils/slot.js'
import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/position-engine.js'

export default Vue.extend({
  name: 'QTooltip',

  mixins: [ AnchorMixin, ModelToggleMixin, PortalMixin, TransitionMixin ],

  props: {
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

    scrollTarget: {
      default: void 0
    },

    delay: {
      type: Number,
      default: 0
    },

    hideDelay: {
      type: Number,
      default: 0
    }
  },

  computed: {
    anchorOrigin () {
      return parsePosition(this.anchor, this.$q.lang.rtl)
    },

    selfOrigin () {
      return parsePosition(this.self, this.$q.lang.rtl)
    },

    hideOnRouteChange () {
      return this.persistent !== true
    }
  },

  methods: {
    __show (evt) {
      this.__showPortal()

      this.__nextTick(() => {
        this.observer = new MutationObserver(() => this.updatePosition())
        this.observer.observe(this.__portal.$el, { attributes: false, childList: true, characterData: true, subtree: true })
        this.updatePosition()
        this.__configureScrollTarget()
      })

      if (this.unwatch === void 0) {
        this.unwatch = this.$watch(
          () => this.$q.screen.width + '|' + this.$q.screen.height + '|' + this.self + '|' + this.anchor + '|' + this.$q.lang.rtl,
          this.updatePosition
        )
      }

      this.__setTimeout(() => {
        this.__showPortal(true)
        this.$emit('show', evt)
      }, 300)
    },

    __hide (evt) {
      this.__anchorCleanup()
      this.__hidePortal()

      this.__setTimeout(() => {
        this.__hidePortal(true) // done hiding, now destroy
        this.$emit('hide', evt)
      }, 300)
    },

    __anchorCleanup () {
      if (this.observer !== void 0) {
        this.observer.disconnect()
        this.observer = void 0
      }

      if (this.unwatch !== void 0) {
        this.unwatch()
        this.unwatch = void 0
      }

      this.__unconfigureScrollTarget()
      cleanEvt(this, 'tooltipTemp')
    },

    updatePosition () {
      if (this.anchorEl === void 0 || this.__portal === void 0) {
        return
      }

      const el = this.__portal.$el

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
        maxHeight: this.maxHeight,
        maxWidth: this.maxWidth
      })
    },

    __delayShow (evt) {
      if (this.$q.platform.is.mobile === true) {
        clearSelection()
        document.body.classList.add('non-selectable')

        const target = this.anchorEl
        const evts = ['touchmove', 'touchcancel', 'touchend', 'click']
          .map(e => ([ target, e, '__delayHide', 'passiveCapture' ]))

        addEvt(this, 'tooltipTemp', evts)
      }

      this.__setTimeout(() => {
        this.show(evt)
      }, this.delay)
    },

    __delayHide (evt) {
      this.__clearTimeout()

      if (this.$q.platform.is.mobile === true) {
        cleanEvt(this, 'tooltipTemp')
        clearSelection()
        // delay needed otherwise selection still occurs
        setTimeout(() => {
          document.body.classList.remove('non-selectable')
        }, 10)
      }

      this.__setTimeout(() => {
        this.hide(evt)
      }, this.hideDelay)
    },

    __configureAnchorEl () {
      if (this.noParentEvent === true || this.anchorEl === void 0) { return }

      const evts = this.$q.platform.is.mobile === true
        ? [
          [ this.anchorEl, 'touchstart', '__delayShow', 'passive' ]
        ]
        : [
          [ this.anchorEl, 'mouseenter', '__delayShow', 'passive' ],
          [ this.anchorEl, 'mouseleave', '__delayHide', 'passive' ]
        ]

      addEvt(this, 'anchor', evts)
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
        const fn = this.noParentEvent === true
          ? this.updatePosition
          : this.hide

        this.__changeScrollEvent(this.__scrollTarget, fn)
      }
    },

    __renderPortal (h) {
      return h('transition', {
        props: { name: this.transition }
      }, [
        this.showing === true ? h('div', {
          staticClass: 'q-tooltip q-tooltip--style q-position-engine no-pointer-events',
          class: this.contentClass,
          style: this.contentStyle,
          attrs: {
            role: 'complementary'
          }
        }, slot(this, 'default')) : null
      ])
    }
  },

  mounted () {
    this.__processModelChange(this.value)
  }
})
