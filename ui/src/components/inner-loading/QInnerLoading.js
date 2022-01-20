import Vue from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import TransitionMixin from '../../mixins/transition.js'
import DarkMixin from '../../mixins/dark.js'
import ListenersMixin from '../../mixins/listeners.js'

export default Vue.extend({
  name: 'QInnerLoading',

  mixins: [ ListenersMixin, DarkMixin, TransitionMixin ],

  props: {
    showing: Boolean,
    color: String,

    size: {
      type: [String, Number],
      default: 42
    },

    label: String,
    labelClass: String,
    labelStyle: [ String, Array, Object ]
  },

  computed: {
    classes () {
      return 'q-inner-loading absolute-full column flex-center' +
        (this.isDark === true ? ' q-inner-loading--dark' : '')
    },

    labelClasses () {
      return 'q-inner-loading__label' +
        (this.labelClass !== void 0 ? ` ${this.labelClass}` : '')
    }
  },

  methods: {
    __getInner (h) {
      const child = [
        h(QSpinner, {
          props: {
            size: this.size,
            color: this.color
          }
        })
      ]

      if (this.label !== void 0) {
        child.push(
          h('div', {
            class: this.labelClasses,
            style: this.labelStyle
          }, [ this.label ])
        )
      }

      return child
    },

    __getContent (h) {
      return this.showing === true
        ? [
          h('div',
            {
              staticClass: this.classes,
              on: { ...this.qListeners }
            },
            this.$scopedSlots.default !== void 0
              ? this.$scopedSlots.default()
              : this.__getInner(h)
          )
        ]
        : void 0
    }
  },

  render (h) {
    return h('transition', {
      props: {
        name: this.transition,
        appear: true
      }
    }, this.__getContent(h))
  }
})
