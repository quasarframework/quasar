import Vue from 'vue'

import HistoryMixin from '../../mixins/history.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import PreventScrollMixin from '../../mixins/prevent-scroll.js'

import { childHasFocus } from '../../utils/dom.js'
import EscapeKey from '../../utils/escape-key.js'
import { slot } from '../../utils/slot.js'
import { create, stop } from '../../utils/event.js'
import { cache } from '../../utils/vm.js'

let maximizedModals = 0

const positionClass = {
  standard: 'fixed-full flex-center',
  top: 'fixed-top justify-center',
  bottom: 'fixed-bottom justify-center',
  right: 'fixed-right items-center',
  left: 'fixed-left items-center'
}

const transitions = {
  standard: ['scale', 'scale'],
  top: ['slide-down', 'slide-up'],
  bottom: ['slide-up', 'slide-down'],
  right: ['slide-left', 'slide-right'],
  left: ['slide-right', 'slide-left']
}

export default Vue.extend({
  name: 'QDialog',

  mixins: [ HistoryMixin, ModelToggleMixin, PortalMixin, PreventScrollMixin ],

  props: {
    persistent: Boolean,
    autoClose: Boolean,

    noEscDismiss: Boolean,
    noBackdropDismiss: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,

    seamless: Boolean,

    maximized: Boolean,
    fullWidth: Boolean,
    fullHeight: Boolean,

    square: Boolean,

    position: {
      type: String,
      default: 'standard',
      validator: val => val === 'standard' ||
        ['top', 'bottom', 'left', 'right'].includes(val)
    },

    transitionShow: String,
    transitionHide: String
  },

  data () {
    return {
      transitionState: this.showing
    }
  },

  watch: {
    showing (val) {
      if (this.transitionShowComputed !== this.transitionHideComputed) {
        this.$nextTick(() => {
          this.transitionState = val
        })
      }
    },

    maximized (state) {
      this.showing === true && this.__updateMaximized(state)
    },

    useBackdrop (v) {
      this.__preventScroll(v)
      this.__preventFocusout(v)
    }
  },

  computed: {
    classes () {
      return `q-dialog__inner--${this.maximized === true ? 'maximized' : 'minimized'} ` +
        `q-dialog__inner--${this.position} ${positionClass[this.position]}` +
        (this.fullWidth === true ? ' q-dialog__inner--fullwidth' : '') +
        (this.fullHeight === true ? ' q-dialog__inner--fullheight' : '') +
        (this.square === true ? ' q-dialog__inner--square' : '')
    },

    transitionShowComputed () {
      return 'q-transition--' + (this.transitionShow === void 0 ? transitions[this.position][0] : this.transitionShow)
    },

    transitionHideComputed () {
      return 'q-transition--' + (this.transitionHide === void 0 ? transitions[this.position][1] : this.transitionHide)
    },

    transition () {
      return this.transitionState === true
        ? this.transitionHideComputed
        : this.transitionShowComputed
    },

    useBackdrop () {
      return this.showing === true && this.seamless !== true
    },

    hideOnRouteChange () {
      return this.persistent !== true &&
        this.noRouteDismiss !== true &&
        this.seamless !== true
    }
  },

  methods: {
    focus () {
      let node = this.__getInnerNode()

      if (node === void 0 || node.contains(document.activeElement) === true) {
        return
      }

      node = node.querySelector('[autofocus], [data-autofocus]') || node
      node.focus()
    },

    shake () {
      this.focus()

      const node = this.__getInnerNode()

      if (node !== void 0) {
        node.classList.remove('q-animate--scale')
        node.classList.add('q-animate--scale')
        clearTimeout(this.shakeTimeout)
        this.shakeTimeout = setTimeout(() => {
          node.classList.remove('q-animate--scale')
        }, 170)
      }
    },

    __getInnerNode () {
      return this.__portal !== void 0 && this.__portal.$refs !== void 0
        ? this.__portal.$refs.inner
        : void 0
    },

    __show (evt) {
      this.__addHistory()

      // IE can have null document.activeElement
      this.__refocusTarget = this.noRefocus === false && document.activeElement !== null
        ? document.activeElement
        : void 0

      this.$el.dispatchEvent(create('popup-show', { bubbles: true }))
      this.__updateMaximized(this.maximized)

      EscapeKey.register(this, () => {
        if (this.seamless !== true) {
          if (this.persistent === true || this.noEscDismiss === true) {
            this.maximized !== true && this.shake()
          }
          else {
            this.$emit('escape-key')
            this.hide()
          }
        }
      })

      this.__showPortal()

      if (this.noFocus !== true) {
        // IE can have null document.activeElement
        document.activeElement !== null && document.activeElement.blur()
        this.__nextTick(this.focus)
      }

      this.__setTimeout(() => {
        if (this.$q.platform.is.ios === true && document.activeElement) {
          const
            { top, bottom } = document.activeElement.getBoundingClientRect(),
            { innerHeight } = window,
            height = window.visualViewport !== void 0
              ? window.visualViewport.height
              : innerHeight

          if (top > 0 && bottom > height / 2) {
            const scrollTop = Math.min(
              document.scrollingElement.scrollHeight - height,
              bottom >= innerHeight
                ? Infinity
                : Math.ceil(document.scrollingElement.scrollTop + bottom - height / 2)
            )

            const fn = () => {
              requestAnimationFrame(() => {
                document.scrollingElement.scrollTop += Math.ceil((scrollTop - document.scrollingElement.scrollTop) / 8)
                if (document.scrollingElement.scrollTop !== scrollTop) {
                  fn()
                }
              })
            }

            fn()
          }
          document.activeElement.scrollIntoView()
        }

        // required in order to avoid the "double-tap needed" issue
        this.$q.platform.is.ios === true && this.__portal.$el.click()

        this.$emit('show', evt)
      }, 300)
    },

    __hide (evt) {
      this.__removeHistory()
      this.__cleanup(true)

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

    __cleanup (hiding) {
      clearTimeout(this.shakeTimeout)

      if (hiding === true || this.showing === true) {
        EscapeKey.pop(this)
        this.__updateMaximized(false)

        if (this.seamless !== true) {
          this.__preventScroll(false)
          this.__preventFocusout(false)
        }
      }
    },

    __updateMaximized (active) {
      if (active === true) {
        if (this.isMaximized !== true) {
          maximizedModals < 1 && document.body.classList.add('q-body--dialog')
          maximizedModals++

          this.isMaximized = true
        }
      }
      else if (this.isMaximized === true) {
        if (maximizedModals < 2) {
          document.body.classList.remove('q-body--dialog')
        }

        maximizedModals--
        this.isMaximized = false
      }
    },

    __preventFocusout (state) {
      if (this.$q.platform.is.desktop === true) {
        const action = `${state === true ? 'add' : 'remove'}EventListener`
        document.body[action]('focusin', this.__onFocusChange)
      }
    },

    __onAutoClose (e) {
      this.hide(e)
      this.$listeners.click !== void 0 && this.$emit('click', e)
    },

    __onBackdropClick (e) {
      if (this.persistent !== true && this.noBackdropDismiss !== true) {
        this.hide(e)
      }
      else {
        this.shake()
      }
    },

    __onFocusChange (e) {
      // the focus is not in a vue child component
      if (
        this.showing === true &&
        this.__portal !== void 0 &&
        childHasFocus(this.__portal.$el, e.target) !== true
      ) {
        this.focus()
      }
    },

    __renderPortal (h) {
      const on = {
        ...this.$listeners,
        // stop propagating these events from children
        input: stop,
        'popup-show': stop,
        'popup-hide': stop
      }

      if (this.autoClose === true) {
        on.click = this.__onAutoClose
      }

      return h('div', {
        staticClass: 'q-dialog fullscreen no-pointer-events',
        class: this.contentClass,
        style: this.contentStyle,
        attrs: this.$attrs
      }, [
        h('transition', {
          props: { name: 'q-transition--fade' }
        }, this.useBackdrop === true ? [
          h('div', {
            staticClass: 'q-dialog__backdrop fixed-full',
            on: cache(this, 'bkdrop', {
              click: this.__onBackdropClick
            })
          })
        ] : null),

        h('transition', {
          props: { name: this.transition }
        }, [
          this.showing === true ? h('div', {
            ref: 'inner',
            staticClass: 'q-dialog__inner flex no-pointer-events',
            class: this.classes,
            attrs: { tabindex: -1 },
            on
          }, slot(this, 'default')) : null
        ])
      ])
    }
  },

  mounted () {
    this.__processModelChange(this.value)
  },

  beforeDestroy () {
    this.__cleanup()
  }
})
