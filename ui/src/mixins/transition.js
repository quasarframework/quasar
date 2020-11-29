// this file will eventually be removed
// and superseeded by use-transition.js
// after all components use composition api

import { useTransitionProps } from '../composables/use-transition.js'

export default {
  props: useTransitionProps,

  data () {
    return {
      transitionState: this.showing
    }
  },

  watch: {
    showing (val) {
      this.transitionShow !== this.transitionHide && this.$nextTick(() => {
        this.transitionState = val
      })
    }
  },

  computed: {
    transition () {
      return 'q-transition--' + (this.transitionState === true ? this.transitionHide : this.transitionShow)
    }
  }
}
