import Vue from 'vue'

import QSpinner from '../spinner/QSpinner.js'

export default Vue.extend({
  name: 'QInnerLoading',

  props: {
    visible: Boolean,
    color: String,

    size: {
      type: [String, Number],
      default: 42
    },

    transitionShow: {
      type: String,
      default: 'fade'
    },
    transitionHide: {
      type: String,
      default: 'fade'
    },

    dark: Boolean
  },

  data () {
    return {
      transitionState: this.visible
    }
  },

  watch: {
    visible (val) {
      this.transitionShow !== this.transitionHide && this.$nextTick(() => {
        this.transitionState = val
      })
    }
  },

  computed: {
    transition () {
      return 'q-transition--' + (this.transitionState === true ? this.transitionHide : this.transitionShow)
    }
  },

  render (h) {
    const content = this.$slots.default || [
      h(QSpinner, {
        props: {
          size: this.size,
          color: this.color
        }
      })
    ]

    return h('transition', {
      props: { name: this.transition }
    }, [
      this.visible ? h('div', {
        staticClass: 'q-inner-loading absolute-full column flex-center',
        'class': this.dark ? 'q-inner-loading--dark' : null
      }, content) : null
    ])
  }
})
