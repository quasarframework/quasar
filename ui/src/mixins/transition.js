export default {
  props: {
    transitionShow: {
      type: String,
      default: 'fade'
    },

    transitionHide: {
      type: String,
      default: 'fade'
    }
  },

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
