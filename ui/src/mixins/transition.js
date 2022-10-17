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
      const show = `q-transition--${this.transitionShow}`
      const hide = `q-transition--${this.transitionHide}`
      return {
        enterClass: `${show}-enter`,
        leaveClass: `${hide}-leave`,
        appearClass: `${show}-appear`,
        enterToClass: `${show}-enter-to`,
        leaveToClass: `${hide}-leave-to`,
        appearToClass: `${show}-appear-to`,
        enterActiveClass: `${show}-enter-active`,
        leaveActiveClass: `${hide}-leave-active`,
        appearActiveClass: `${show}-appear-active`
      }
    }
  }
}
