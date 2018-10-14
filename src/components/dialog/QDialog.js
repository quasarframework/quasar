import Vue from 'vue'

import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

import preventScroll from '../../utils/prevent-scroll.js'
import EscapeKey from '../../utils/escape-key.js'

let modalsOpened = 0

export default Vue.extend({
  name: 'QDialog',

  mixins: [ ModelToggleMixin, PortalMixin, TransitionMixin ],

  modelToggle: {
    history: true
  },

  props: {
    persistent: Boolean,
    maximized: Boolean,
    noEscKey: Boolean,

    transitionShow: {
      default: 'scale'
    },
    transitionHide: {
      default: 'scale'
    }
  },

  watch: {
    $route () {
      this.persistent !== true && this.hide()
    }
  },

  methods: {
    __show (evt) {
      clearTimeout(this.timer)

      this.__register(true)
      preventScroll(true)
      this.__showPortal()

      EscapeKey.register(() => {
        if (this.persistent || this.noEscKey === true) {
          this.maximized !== true && this.__shake()
        }
        else {
          this.$emit('escape-key')
          this.hide()
        }
      })

      if (this.$q.platform.is.ios) {
        // workaround the iOS hover/touch issue
        this.__portal.$refs.inner.click()
      }

      this.timer = setTimeout(() => {
        this.$emit('show', evt)
      }, 600)
    },

    __hide (evt) {
      this.__cleanup(true)

      this.timer = setTimeout(() => {
        this.__hidePortal(evt)
        this.$emit('hide', evt)
      }, 600)
    },

    __cleanup (hiding) {
      clearTimeout(this.timer)
      clearTimeout(this.shakeTimeout)

      if (hiding === true || this.showing === true) {
        EscapeKey.pop()
        preventScroll(false)
        this.__register(false)
      }
    },

    __register (opening) {
      let state = opening
        ? { action: 'add', step: 1 }
        : { action: 'remove', step: -1 }

      modalsOpened += state.step

      if (opening !== true && modalsOpened > 0) {
        return
      }

      document.body.classList[state.action]('q-body--dialog')
    },

    __shake () {
      const node = this.__portal.$refs.inner

      node.classList.remove('q-animate-shake')
      node.classList.add('q-animate-shake')
      clearTimeout(this.shakeTimeout)
      this.shakeTimeout = setTimeout(() => {
        node.classList.remove('q-animate-shake')
      }, 170)
    },

    __render (h) {
      return h('div', {
        staticClass: 'q-dialog fullscreen'
      }, [
        h('transition', {
          props: { name: 'q-transition--fade' }
        }, this.showing ? [
          h('div', {
            staticClass: 'q-dialog__backdrop fixed-full',
            on: {
              click: this.persistent === false ? this.hide : this.__shake
            }
          })
        ] : null),

        h('transition', {
          props: { name: this.transition }
        }, [
          this.showing ? h('div', {
            ref: 'inner',
            staticClass: 'q-dialog__inner fullscreen flex flex-center no-pointer-events',
            'class': `q-dialog__inner--${this.maximized ? 'maximized' : 'minimized'}`
          }, this.$slots.default) : null
        ])
      ])
    }
  },

  mounted () {
    this.value === true && this.show()
  },

  beforeDestroy () {
    this.__cleanup()
  }
})
