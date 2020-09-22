import { h, defineComponent } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import TransitionMixin from '../../mixins/transition.js'
import DarkMixin from '../../mixins/dark.js'
import ListenersMixin from '../../mixins/listeners.js'

export default defineComponent({
  name: 'QInnerLoading',

  mixins: [ ListenersMixin, DarkMixin, TransitionMixin ],

  props: {
    showing: Boolean,
    color: String,

    size: {
      type: [String, Number],
      default: 42
    }
  },

  render () {
    const child = this.showing === true
      ? [
        h('div',
          {
            staticClass: 'q-inner-loading absolute-full column flex-center',
            class: this.isDark === true ? 'q-inner-loading--dark' : null,
            on: { ...this.qListeners }
          },
          this.$slots.default !== void 0
            ? this.$slots.default()
            : [
              h(QSpinner, {
                props: {
                  size: this.size,
                  color: this.color
                }
              })
            ]
        )
      ]
      : void 0

    return h('transition', {
      props: {
        name: this.transition,
        appear: true
      }
    }, child)
  }
})
