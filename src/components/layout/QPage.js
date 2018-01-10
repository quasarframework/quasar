export default {
  name: 'q-page',
  inject: {
    pageContainer: {
      default () {
        console.error('QPage needs to be child of QPageContainer')
      }
    },
    layout: {}
  },
  props: {
    padding: Boolean
  },
  computed: {
    computedClass () {
      if (this.padding) {
        return 'layout-padding'
      }
    }
  },
  render (h) {
    // Use a flexbox to fill the center space within the padding of the parent
    // Eventually, the whole layout should be flexbox
    return h('div', {
      staticClass: 'q-layout-page col self-stretch',
      'class': this.computedClass
    }, [
      this.$slots.default
    ])
  }
}
