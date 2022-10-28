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

  computed: {
    transitionProps () {
      const show = `q-transition--${this.transitionShow || this.defaultTransitionShow}`
      const hide = `q-transition--${this.transitionHide || this.defaultTransitionHide}`

      return {
        appear: true,

        enterClass: `${show}-enter`,
        enterActiveClass: `${show}-enter-active`,
        enterToClass: `${show}-enter-to`,

        leaveClass: `${hide}-leave`,
        leaveActiveClass: `${hide}-leave-active`,
        leaveToClass: `${hide}-leave-to`
      }
    }
  }
}
