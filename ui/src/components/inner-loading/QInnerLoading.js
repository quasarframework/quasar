import { h, defineComponent, Transition } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import TransitionMixin from '../../mixins/transition.js'
import DarkMixin from '../../mixins/dark.js'

export default defineComponent({
  name: 'QInnerLoading',

  mixins: [ DarkMixin, TransitionMixin ],

  props: {
    showing: Boolean,
    color: String,

    size: {
      type: [ String, Number ],
      default: 42
    }
  },

  computed: {
    classes () {
      return 'q-inner-loading absolute-full column flex-center' +
        (this.isDark === true ? ' q-inner-loading--dark' : '')
    }
  },

  methods: {
    __getContent () {
      return this.showing === true
        ? h(
            'div',
            { class: this.classes },
            this.$slots.default !== void 0
              ? this.$slots.default()
              : [
                  h(QSpinner, {
                    size: this.size,
                    color: this.color
                  })
                ]
          )
        : null
    }
  },

  render () {
    return h(Transition, {
      name: this.transition,
      appear: true
    }, this.__getContent)
  }
})
