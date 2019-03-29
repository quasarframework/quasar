import Vue from 'vue'

import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import PreventScrollMixin from '../../mixins/prevent-scroll.js'

import ClickOutside from '../menu/ClickOutside.js'
import ClosePopup from '../../directives/ClosePopup.js'

import EscapeKey from '../../utils/escape-key.js'
import slot from '../../utils/slot.js'
import { stop } from '../../utils/event.js'

let maximizedModals = 0

const positionClass = {
  standard: 'flex-center',
  top: 'items-start justify-center',
  bottom: 'items-end justify-center',
  right: 'items-center justify-end',
  left: 'items-center justify-start'
}

const transitions = {
  top: ['down', 'up'],
  bottom: ['up', 'down'],
  right: ['left', 'right'],
  left: ['right', 'left']
}

export default Vue.extend({
  name: 'QDialog',

  mixins: [ ModelToggleMixin, PortalMixin, PreventScrollMixin ],

  directives: {
    ClickOutside,
    ClosePopup
  },

  modelToggle: {
    history: true
  },

  props: {
    persistent: Boolean,
    noEscDismiss: Boolean,
    noBackdropDismiss: Boolean,
    noRouteDismiss: Boolean,
    autoClose: Boolean,

    seamless: Boolean,

    maximized: Boolean,
    fullWidth: Boolean,
    fullHeight: Boolean,

    position: {
      type: String,
      default: 'standard',
      validator (val) {
        return val === 'standard' || ['top', 'bottom', 'left', 'right'].includes(val)
      }
    },

    transitionShow: {
      type: String,
      default: 'scale'
    },
    transitionHide: {
      type: String,
      default: 'scale'
    },

    noRefocus: Boolean
  },

  data () {
    return {
      transitionState: this.showing
    }
  },

  watch: {
    $route () {
      this.persistent !== true &&
        this.noRouteDismiss !== true &&
        this.seamless !== true &&
        this.hide()
    },

    showing (val) {
      if (this.position !== 'standard' || this.transitionShow !== this.transitionHide) {
        this.$nextTick(() => {
          this.transitionState = val
        })
      }
    },

    maximized (newV, oldV) {
      if (this.showing === true) {
        this.__updateState(false, oldV)
        this.__updateState(true, newV)
      }
    },

    seamless (v) {
      this.showing === true && this.__preventScroll(!v)
    }
  },

  computed: {
    classes () {
      return `q-dialog__inner--${this.maximized ? 'maximized' : 'minimized'} ` +
        `q-dialog__inner--${this.position} ${positionClass[this.position]}` +
        (this.fullWidth ? ' q-dialog__inner--fullwidth' : '') +
        (this.fullHeight ? ' q-dialog__inner--fullheight' : '')
    },

    transition () {
      return 'q-transition--' + (
        this.position === 'standard'
          ? (this.transitionState === true ? this.transitionHide : this.transitionShow)
          : 'slide-' + transitions[this.position][this.transitionState === true ? 1 : 0]
      )
    },

    showBackdrop () {
      return this.showing === true && this.seamless !== true
    },

    directives () {
      const directives = []

      if (this.autoClose === true) {
        directives.push({
          name: 'close-popup'
        })
      }

      if (this.showBackdrop === true) {
        directives.push({
          name: 'click-outside',
          arg: this.__portal !== void 0 ? this.__portal.$refs : void 0
        })
      }

      return directives.length > 0 ? directives : void 0
    }
  },

  methods: {
    shake () {
      const node = this.__portal.$refs.inner

      if (node.contains(document.activeElement) === false) {
        node.focus()
      }

      node.classList.remove('q-animate--scale')
      node.classList.add('q-animate--scale')
      clearTimeout(this.shakeTimeout)
      this.shakeTimeout = setTimeout(() => {
        node.classList.remove('q-animate--scale')
      }, 170)
    },

    __show (evt) {
      clearTimeout(this.timer)

      this.__refocusTarget = this.noRefocus === false
        ? document.activeElement
        : void 0

      if (this.__refocusTarget !== void 0) {
        this.__refocusTarget.blur()
      }

      this.$el.dispatchEvent(new Event('popup-show', { bubbles: true }))

      this.__updateState(true, this.maximized)

      EscapeKey.register(this, (e) => {
        if (this.seamless !== true) {
          const notClickOutside = e === void 0 || e.type !== 'click-outside'
          if (this.persistent === true || (this.noEscDismiss === true && notClickOutside === true)) {
            this.maximized !== true && this.shake()
          }
          else {
            notClickOutside === true && this.$emit('escape-key')
            this.hide()
          }
        }
      })

      this.__showPortal()

      this.$nextTick(() => {
        const node = this.__portal.$refs.inner

        if (this.$q.platform.is.ios) {
          // workaround the iOS hover/touch issue
          node.click()
        }

        node.focus()
      })

      this.timer = setTimeout(() => {
        this.$emit('show', evt)
      }, 300)
    },

    __hide (evt) {
      this.__cleanup(true)

      this.$nextTick(() => {
        if (this.__refocusTarget !== void 0) {
          this.__refocusTarget.focus()
        }
      })

      this.timer = setTimeout(() => {
        this.__hidePortal()

        this.$el.dispatchEvent(new Event('popup-hide', { bubbles: true }))

        this.$emit('hide', evt)
      }, 300)
    },

    __cleanup (hiding) {
      clearTimeout(this.timer)
      clearTimeout(this.shakeTimeout)

      if (hiding === true || this.showing === true) {
        EscapeKey.pop(this)
        this.__updateState(false, this.maximized)
      }
    },

    __updateState (opening, maximized) {
      if (this.seamless !== true) {
        this.__preventScroll(opening)
      }

      if (maximized === true) {
        if (opening) {
          maximizedModals < 1 && document.body.classList.add('q-body--dialog')
        }
        else if (maximizedModals < 2) {
          document.body.classList.remove('q-body--dialog')
        }
        maximizedModals += opening ? 1 : -1
      }
    },

    __render (h) {
      return h('div', {
        staticClass: 'q-dialog fullscreen no-pointer-events',
        class: this.contentClass,
        style: this.contentStyle,
        attrs: this.$attrs
      }, [
        h('transition', {
          props: { name: 'q-transition--fade' }
        }, this.showBackdrop === true ? [
          h('div', {
            staticClass: 'q-dialog__backdrop fixed-full'
          })
        ] : null),

        h('transition', {
          props: { name: this.transition }
        }, [
          this.showing === true ? h('div', {
            ref: 'inner',
            staticClass: 'q-dialog__inner fixed-full flex no-pointer-events',
            class: this.classes,
            attrs: { tabindex: -1 },
            directives: this.directives,
            on: {
              ...this.$listeners,
              input: stop
            }
          }, slot(this, 'default')) : null
        ])
      ])
    },

    __onPortalClose (evt) {
      this.hide(evt)
    }
  },

  mounted () {
    this.value === true && this.show()
  },

  beforeDestroy () {
    this.__cleanup()
  }
})
