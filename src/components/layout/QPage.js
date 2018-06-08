export default {
  name: 'QPage',
  inject: {
    pageContainer: {
      default () {
        console.error('QPage needs to be child of QPageContainer')
      }
    },
    layout: {}
  },
  props: {
    padding: Boolean,
    noMinHeight: Boolean
  },
  computed: {
    computedStyle () {
      if (this.noMinHeight) { return }

      const offset =
        (this.layout.header.space ? this.layout.header.size : 0) +
        (this.layout.footer.space ? this.layout.footer.size : 0)

      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
    computedClass () {
      if (this.padding) {
        return 'layout-padding'
      }
    }
  },
  render (h) {
    return h('main', {
      staticClass: 'q-layout-page',
      style: this.computedStyle,
      'class': this.computedClass
    }, [
      this.$slots.default
    ])
  }
}
