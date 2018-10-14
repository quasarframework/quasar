import Vue from 'vue'

import ModelToggleMixin from '../../mixins/model-toggle.js'
import PortalMixin from '../../mixins/portal.js'
import TransitionMixin from '../../mixins/transition.js'

export default Vue.extend({
  name: 'QDialog',

  mixins: [ ModelToggleMixin, PortalMixin, TransitionMixin ],

  modelToggle: {
    history: true
  },

  props: {
    persistent: Boolean,
    maximized: Boolean,

    transitionShow: {
      default: 'scale'
    },
    transitionHide: {
      default: 'scale'
    }
  },

  methods: {
    __show (evt) {
      clearTimeout(this.timer)

      this.__showPortal()

      this.timer = setTimeout(() => {
        this.$emit('show', evt)
      }, 600)
    },

    __hide (evt) {
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.__hidePortal(evt)
        this.$emit('hide', evt)
      }, 600)
    },

    __shake () {
      const node = this.__portal.$refs.inner

      node.classList.remove('q-animate-shake')
      node.classList.add('q-animate-shake')
      clearTimeout(this.shakeTimeout)
      this.shakeTimeout = setTimeout(() => {
        node.classList.remove('q-animate-shake')
      }, 150)
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
    clearTimeout(this.timer)
    clearTimeout(this.shakeTimeout)
  }
})
