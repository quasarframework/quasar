import Vue from 'vue'

import TransitionMixin from '../../mixins/transition.js'
import DarkMixin from '../../mixins/dark.js'
import QSpinner from '../spinner/QSpinner.js'

export default Vue.extend({
  name: 'QInnerLoading',

  mixins: [ DarkMixin, TransitionMixin ],

  props: {
    showing: Boolean,
    color: String,

    size: {
      type: [String, Number],
      default: 42
    }
  },

  render (h) {
    const child = this.showing === true
      ? [
        h('div',
          {
            staticClass: 'q-inner-loading absolute-full column flex-center',
            class: this.isDark === true ? 'q-inner-loading--dark' : null,
            on: this.$listeners
          },
          this.$scopedSlots.default !== void 0
            ? this.$scopedSlots.default()
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
